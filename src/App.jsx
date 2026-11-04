import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, RotateCcw, HelpCircle, Pause, Play, Eye, EyeOff, Lock, Check, Star, Power, X } from 'lucide-react'
import { PARTS, STEPS, BADGES, HELP } from './data.js'
import { ILLUS, Robot } from './graphics.jsx'

const TOTAL = 300
const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
let ctx
const tone = (on, f, d=.12, seq) => { if(!on) return; try{ ctx ||= new (window.AudioContext||window.webkitAudioContext)()
  ;(seq||[f]).forEach((fr,i)=>{ const o=ctx.createOscillator(), g=ctx.createGain(); o.frequency.value=fr; o.type='triangle'
  g.gain.setValueAtTime(.12,ctx.currentTime+i*d); g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+i*d+d)
  o.connect(g).connect(ctx.destination); o.start(ctx.currentTime+i*d); o.stop(ctx.currentTime+i*d+d) }) }catch{} }

function Login({ onLogin }) {
  const [u,setU]=useState(''), [p,setP]=useState(''), [show,setShow]=useState(false), [err,setErr]=useState(false), [go,setGo]=useState(false)
  const submit=e=>{ e.preventDefault()
    if(u.trim()==='kid123'&&p==='buildpc123'){ setErr(false); setGo(true); setTimeout(onLogin,900) } else setErr(true) }
  return <div className="login"><motion.form className="card login-card" onSubmit={submit} animate={go?{scale:.9,opacity:0}:{scale:1,opacity:1}}>
    <motion.div animate={{y:[0,-8,0]}} transition={{repeat:Infinity,duration:2}}><Robot big/></motion.div>
    <h1 className="logo">PC Builder <span>Kids</span></h1>
    <p className="sub">Learn to Build Your Own Computer!</p>
    <p>Hi Builder! Log in to start building.</p>
    <label>Username<input value={u} onChange={e=>setU(e.target.value)} autoComplete="off"/></label>
    <label>Password<div className="pw"><input type={show?'text':'password'} value={p} onChange={e=>setP(e.target.value)}/>
      <button type="button" aria-label="Show or hide password" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></div></label>
    {err&&<p className="err">Oops! Incorrect username or password. Try again!</p>}
    <button className="btn" type="submit">Log in</button>
    <div className="demo">Demo login: <b>kid123</b> / <b>buildpc123</b><small>Demonstration only. This is not secure sign-in.</small></div>
  </motion.form></div>
}

function Zone({ id, style, active, shake, done, onDrop, onTap, children, label }) {
  return <div className={`zone ${active?'hot':''} ${shake?'shake':''} ${done?'done':''}`} style={style}
    onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault(); onDrop(e.dataTransfer.getData('text/plain'), id)}} onClick={()=>onTap(id)}>
    {done ? <motion.div className="fill" initial={{scale:.3,y:-30}} animate={{scale:1,y:0}} transition={{type:'spring',stiffness:300}}>{children}</motion.div> : <span className="zl">{label}</span>}
  </div>
}

function Game({ onExit }) {
  const [phase,setPhase]=useState('ready') // ready playing paused won timeup
  const [left,setLeft]=useState(TOTAL), [done,setDone]=useState([]), [cables,setCables]=useState([])
  const [score,setScore]=useState(0), [mistakes,setMistakes]=useState(0), [msg,setMsg]=useState("Hi Builder! Let's build a computer together!")
  const [drag,setDrag]=useState(null), [sel,setSel]=useState(null), [shake,setShake]=useState(null), [floats,setFloats]=useState([])
  const [sound,setSound]=useState(true), [help,setHelp]=useState(false), [toast,setToast]=useState(null), [stats,setStats]=useState(null)
  const step = done.filter(d=>d!=='cabinet').length + (cables.length===2&&!done.includes('cables')?0:0)
  const cur = STEPS[Math.min(done.length, STEPS.length-1)]
  const idx = done.length
  const playing = phase==='playing'
  useEffect(()=>{ if(!playing) return; const t=setInterval(()=>setLeft(l=>l-1),1000); return ()=>clearInterval(t) },[playing])
  useEffect(()=>{ if(left<=0&&playing){ setPhase('timeup'); setStats({time:TOTAL}) } },[left,playing])
  const snd=(f,d,s)=>tone(sound,f,d,s)

  const complete = part => {
    const nd=[...done,part]; setDone(nd); setScore(s=>s+100); setSel(null)
    const id=Date.now()+Math.random(); setFloats(f=>[...f,id]); setTimeout(()=>setFloats(f=>f.filter(x=>x!==id)),1000)
    const nm = PARTS[part]?.name || (part==='cables'?'power cables':'PC')
    const b = BADGES.find(b=>b.part===part)
    if(b){ setToast(b); snd(0,.1,[660,880,1100]); setTimeout(()=>setToast(null),2200) } else snd(0,.1,[520,700])
    if(nd.length===STEPS.length){ snd(0,.15,[400,500,600,800,1000]); setPhase('won'); setStats({time:TOTAL-left}) }
    else setMsg(part==='cables'?'Awesome! The cables are connected!':`Awesome! You installed the ${nm} correctly!`)
  }
  const tryPlace = (part, zone) => {
    if(!part) return
    if(!playing){ setMsg('Press Start Game first!'); return }
    if(done.includes(part)){ setMsg('That part is already installed!'); return }
    if(part!==zone){ setMistakes(m=>m+1); setShake(zone); setTimeout(()=>setShake(null),500); snd(200,.2)
      setMsg(`Not quite! The ${PARTS[part].name} belongs in ${PARTS[part].where}. Try again!`); return }
    if(part!==cur.part){ setMistakes(m=>m+1); snd(260,.2); setMsg(`Good spot, but first: ${cur.title}!`); return }
    complete(part)
  }
  const tapCable = id => { if(!playing||cur.part!=='cables'||cables.includes(id)) return
    const nc=[...cables,id]; setCables(nc); snd(600,.08); if(nc.length===2) complete('cables'); else setMsg('One more plug to go!') }
  const power = () => { if(playing&&cur.part==='power') complete('power') }
  const start = () => { setPhase('playing'); snd(500,.1); setMsg(cur.say) }
  const reset = () => { setPhase('ready'); setLeft(TOTAL); setDone([]); setCables([]); setScore(0); setMistakes(0); setStats(null); setSel(null); setMsg("Hi Builder! Let's build a computer together!") }
  useEffect(()=>{ if(playing && idx>0 && idx<STEPS.length) setTimeout(()=>setMsg(m=>m.startsWith('Awesome')?m+' '+cur.say:m),600) },[idx])

  const zs = id => ({ id, active: drag===id||sel===id, shake: shake===id, onDrop: tryPlace, onTap: z=>tryPlace(sel,z) })
  const inCab = done.includes('mobo')
  const stars = mistakes<=3?3:mistakes<=8?2:1
  const progress = Math.round(done.length/STEPS.length*100)

  return <div className="game">
    <header className="top">
      <div className="brand"><span className="dot"/>PC Builder Kids</div>
      <div className="hud"><div className="pill">TIME <b className={left<30?'low':''}>{fmt(Math.max(left,0))}</b></div><div className="pill"><Star size={18} fill="#ffc933" stroke="#ffc933"/> SCORE <b>{score}</b></div></div>
      <div className="ctl">
        <button aria-label="Sound" onClick={()=>setSound(!sound)}>{sound?<Volume2/>:<VolumeX/>}</button>
        {(playing||phase==='paused')&&<button aria-label="Pause" onClick={()=>setPhase(playing?'paused':'playing')}>{playing?<Pause/>:<Play/>}</button>}
        <button aria-label="Restart" onClick={reset}><RotateCcw/></button>
        <button aria-label="Help" onClick={()=>setHelp(true)}><HelpCircle/></button>
      </div>
    </header>
    <div className="bar"><motion.i animate={{width:`${progress}%`}}/><span>{progress}% built</span></div>
    <div className="goal card"><b>{phase==='won'?'All done!':cur.title}</b></div>
    <main className="layout">
      <aside className="card side"><h3 className="tab">PARTS TO BUILD</h3>
        {Object.entries(PARTS).map(([k,p])=>{ const Ic=ILLUS[k], ok=done.includes(k)||k==='cabinet'
          return <div key={k} draggable={playing&&!ok} className={`part ${ok?'ok':''} ${sel===k?'sel':''}`}
            onDragStart={e=>{e.dataTransfer.setData('text/plain',k); setDrag(k)}} onDragEnd={()=>setDrag(null)}
            onClick={()=>playing&&!ok&&setSel(sel===k?null:k)}>
            <div className="pic" style={{background:p.color+'22'}}><Ic/></div>
            <div><b>{p.name}</b><small>{p.tag}. {p.desc}</small></div>
            {ok&&<Check className="chk" size={22}/>}</div> })}
      </aside>
      <section className="center">
        <div className="stage">
          <div className="cab"><ILLUS.cabinet/></div>
          <motion.div className="board" initial={false} animate={inCab?{x:402,y:34,scale:.62}:{x:10,y:30,scale:1}} style={{transformOrigin:'0 0'}}>
            <ILLUS.mobo/>
            <Zone {...zs('cpu')} style={{left:120,top:90,width:90,height:90}} done={done.includes('cpu')} label="CPU"><ILLUS.cpu/></Zone>
            {done.includes('cpu')&&<Zone {...zs('cooler')} style={{left:105,top:75,width:120,height:120}} done={done.includes('cooler')} label=""><ILLUS.cooler/></Zone>}
            <Zone {...zs('ram')} style={{left:246,top:55,width:62,height:160}} done={done.includes('ram')} label="RAM"><div className="rams"><ILLUS.ram/><ILLUS.ram/></div></Zone>
            <Zone {...zs('ssd')} style={{left:36,top:244,width:140,height:38}} done={done.includes('ssd')} label="M.2 SSD"><ILLUS.ssd/></Zone>
            <Zone {...zs('gpu')} style={{left:30,top:300,width:300,height:58}} done={done.includes('gpu')} label="GPU slot"><ILLUS.gpu/></Zone>
            {done.includes('psu')&&!done.includes('cables')||cables.length>0||cur.part==='cables'?<>
              <button className={`plug ${cables.includes('atx')?'on':'glow'}`} style={{left:318,top:212,width:38,height:76}} onClick={()=>tapCable('atx')} aria-label="Motherboard power plug"/>
              <button className={`plug ${cables.includes('cpu4')?'on':'glow'}`} style={{left:112,top:6,width:92,height:30}} onClick={()=>tapCable('cpu4')} aria-label="CPU power plug"/></>:null}
          </motion.div>
          <Zone {...zs('mobo')} style={{left:390,top:20,width:240,height:310,display:inCab?'none':'block'}} done={false} label="Cabinet: drop motherboard here"/>
          <Zone {...zs('psu')} style={{left:402,top:346,width:216,height:46}} done={done.includes('psu')} label="PSU bay"><ILLUS.psu/></Zone>
          {!playing&&phase==='ready'&&<div className="veil"><button className="btn big" onClick={start}>Start Game</button></div>}
          {phase==='paused'&&<div className="veil"><button className="btn big" onClick={()=>setPhase('playing')}>Resume</button></div>}
          {playing&&cur.part==='power'&&<motion.button className="powerbtn" animate={{scale:[1,1.1,1]}} transition={{repeat:Infinity,duration:1}} onClick={power}><Power size={40}/><span>Your PC is Ready! Press power</span></motion.button>}
          <AnimatePresence>{floats.map(id=><motion.div key={id} className="float" initial={{opacity:1,y:0}} animate={{opacity:0,y:-80}} exit={{}} transition={{duration:1}}>+100</motion.div>)}</AnimatePresence>
        </div>
        <div className="robot"><motion.div animate={{y:[0,-5,0]}} transition={{repeat:Infinity,duration:2}}><Robot/></motion.div><div className="bubble">{msg}</div></div>
      </section>
      <aside className="card side rew"><h3 className="tab orange">MY REWARDS</h3>
        <div className="badges">{BADGES.map(b=>{ const got=done.includes(b.part)
          return <motion.div key={b.name} className={`badge ${got?'got':''}`} animate={got?{rotate:[0,-12,12,0],scale:[1,1.2,1]}:{}}>
            <div className="medal" style={got?{background:b.color}:{}}>{got?<Star fill="#fff" stroke="#fff"/>:<Lock size={20}/>}</div><small>{got?b.name:'Locked'}</small></motion.div>})}</div>
        <p className="note">Mistakes: {mistakes}. No points lost, keep trying!</p>
      </aside>
    </main>
    <AnimatePresence>{toast&&<motion.div className="toast" initial={{y:-60,opacity:0}} animate={{y:0,opacity:1}} exit={{opacity:0}}>Congratulations! You earned a new badge: {toast.name}!</motion.div>}</AnimatePresence>
    {help&&<div className="modal"><div className="card box"><button className="x" onClick={()=>setHelp(false)} aria-label="Close"><X/></button><h2>Learn About PC Parts</h2>
      {HELP.map(([t,d])=><p key={t}><b>What is {t==='Motherboard'?'a':t==='SSD'||t==='RAM'?'':'a'} {t}?</b><br/>{d}</p>)}</div></div>}
    {(phase==='won'||phase==='timeup')&&<div className="modal"><motion.div className="card box end" initial={{scale:.6}} animate={{scale:1}}>
      {phase==='won'?<><div className="monitor"><div className="screen"><span>Windows-style desktop</span><div className="icons"><i/><i/><i/></div><Robot/></div></div>
        <h2>YOU DID IT! YOU BUILT YOUR OWN COMPUTER!</h2>
        <div className="stars">{[1,2,3].map(n=><Star key={n} size={40} fill={n<=stars?'#ffc933':'none'} stroke="#ffc933"/>)}</div></>
        :<><Robot big/><h2>Time's up!</h2><p>Good try, Builder! You can play again.</p></>}
      <ul className="stats"><li>Final score <b>{score}</b></li><li>Time taken <b>{fmt(stats?.time||0)}</b></li><li>Correct steps <b>{done.length}/{STEPS.length}</b></li><li>Badges <b>{BADGES.filter(b=>done.includes(b.part)).length}/6</b></li></ul>
      <div className="row"><button className="btn" onClick={reset}>Play Again</button><button className="btn ghost" onClick={()=>setHelp(true)}>Learn About PC Parts</button><button className="btn ghost" onClick={()=>{reset();}}>Back to Dashboard</button></div>
    </motion.div></div>}
  </div>
}
export default function App(){ const [in_,setIn]=useState(false); return in_?<Game/>:<Login onLogin={()=>setIn(true)}/> }
