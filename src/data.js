export const PARTS = {
  cpu:{name:'CPU',tag:'The Brain',desc:'Thinks and follows instructions.',where:'the CPU socket',color:'#ff9f43'},
  ram:{name:'RAM',tag:'Short-Term Memory',desc:'Remembers things while you play.',where:'the RAM slots',color:'#2ecc71'},
  ssd:{name:'SSD',tag:'Storage',desc:'Keeps your games and files.',where:'the M.2 slot',color:'#3d8bff'},
  cooler:{name:'CPU Cooler',tag:'Keeps the CPU Cool',desc:'Blows heat away from the brain.',where:'on top of the CPU',color:'#26c6da'},
  mobo:{name:'Motherboard',tag:'The Main Board',desc:'Connects every part together.',where:'inside the cabinet',color:'#14b8a6'},
  psu:{name:'Power Supply',tag:'Gives Electricity',desc:'Sends power to all the parts.',where:'the bottom of the cabinet',color:'#8d99ae'},
  gpu:{name:'Graphics Card',tag:'Creates Graphics',desc:'Draws pictures for games.',where:'the long PCIe slot',color:'#9b5de5'},
  cabinet:{name:'Cabinet',tag:"The Computer's Home",desc:'Protects all the parts.',where:'the workbench',color:'#34495e'},
}
export const STEPS = [
  {part:'cpu',title:'Install the CPU',say:"Drag the CPU into the glowing socket. It's the brain of the computer!"},
  {part:'ram',title:'Install the RAM',say:'Great job! Now drag the RAM into the slots. RAM helps the computer remember while it runs.'},
  {part:'ssd',title:'Install the SSD',say:'Time for the SSD! It stores games, files and Windows.'},
  {part:'cooler',title:'Install the CPU Cooler',say:'The CPU gets hot! Put the cooler on top to keep it chilly.'},
  {part:'mobo',title:'Put the Motherboard in the Cabinet',say:'Drag the motherboard into the cabinet. It connects all the parts!'},
  {part:'psu',title:'Install the Power Supply',say:'Drag the power supply to the bottom of the cabinet. It gives electricity!'},
  {part:'gpu',title:'Install the Graphics Card',say:'Slide the graphics card into the long slot. It makes the pictures!'},
  {part:'cables',title:'Connect the Power Cables',say:'Almost there! Tap both glowing power plugs: the motherboard and the CPU one.'},
  {part:'power',title:'Turn On the PC',say:'Your computer is nearly ready. Press the power button!'},
]
export const BADGES = [
  {name:'CPU Master',part:'cpu',color:'#ff9f43'},{name:'Memory Master',part:'ram',color:'#2ecc71'},
  {name:'Storage Star',part:'ssd',color:'#3d8bff'},{name:'Cooling Champion',part:'cooler',color:'#26c6da'},
  {name:'Power Pro',part:'psu',color:'#f1c40f'},{name:'PC Building Hero',part:'power',color:'#ff5d8f'},
]
export const HELP = [
  ['CPU','The CPU is like the brain of your computer. It thinks and follows instructions.'],
  ['RAM',"RAM is like your computer's short-term memory. It remembers things while you are playing."],
  ['SSD','An SSD is a storage box for your games, pictures and Windows.'],
  ['Motherboard','The motherboard is the big board that connects every part so they can talk.'],
  ['GPU','The GPU is the artist. It draws the pictures and helps games look great.'],
  ['Power Supply','The power supply gives electricity to every part, like a tiny power station.'],
]
