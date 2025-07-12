const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 720;
canvas.height = 1024;


ctx.fillStyle = 'grey';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const colors = ['red', 'blue', 'green', 'purple', 'cyan', 'yellow']
let bubbles = []

let row = 9;
let rowStart = 40;
let rowHeight = 40;
let newRow = 8;
let newRowStart = 80;

let newRowInterval;
let newBubbleToShoot;

// Crear un objeto Path y establecer un punto de pivote (centro de bubbleToShoot)
const pivotX = canvas.width / 2;
const pivotY = canvas.height - 40;

class Bubble {
  constructor(x, y, color = null, mainBubble = false) {
    this.x = x;
    this.y = y;
    this.radius = 40;
    this.color = color || colors[Math.floor(Math.random() * colors.length)]
    this.speedY = 0;
    this.speedX = 0;
    this.mainBubble = mainBubble
    this.eliminating = false
    this.isEliminated = false
    this.active = false
  }

  draw() {

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);    
    ctx.fillStyle = this.color;
    ctx.fill();
    // ctx.strokeStyle = 'black'
    // ctx.stroke()
  }

  update() {
    this.y += this.speedY
    this.x += this.speedX
    if(this.x + 40 > canvas.width || this.x - 40 < 0) this.speedX = -this.speedX

    if(this.y - 40 < canvas.height && !this.mainBubble) this.y = this.y + this.speedY
    if(this.eliminating) this.speedY += 0.35    
    if(this.y - 40 > canvas.height) this.isEliminated = true
    this.draw()
  }
}

class Path {
  constructor(x, y, color, pivotX, pivotY) {
    this.x = x;
    this.y = y;
    this.width = 3;
    this.height = -1000;
    this.color = color; 
    this.rotation = 0
    this.pivot = {
      x: pivotX,
      y: pivotY
    }
  }

  draw() {
    ctx.save()

    ctx.translate(this.pivot.x, this.pivot.y)
    ctx.rotate(this.rotation)

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.pivot.x, this.y - this.pivot.y, this.width, this.height)    

    ctx.restore()
  }

  rotate(angle) {
    this.rotation += angle
  }

  update() {
    this.draw()
  }
}

function getInitialBubblesRows() {
  for(let i = 0; i < row; i++) {
    bubbles.push(new Bubble(80 * i + rowStart, rowHeight))
  }
  if(row === 9){
    row = 8
    rowStart = 80
  } else {
    row = 9
    rowStart = 40
  }
  rowHeight+=70
}

for(let i = 0; i < 6; i++){
  getInitialBubblesRows()
}

function getNewBubblesRow() {
  for(let i = 0; i < newRow; i++) {
    bubbles.push(new Bubble(80 * i + newRowStart, 40))
  }
  if(newRow === 9){
    newRow = 8
    newRowStart = 80
  } else {
    newRow = 9
    newRowStart = 40
  }
}

function bubbleCollision(bubble1, bubble2) {  
  return Math.sqrt(Math.abs(bubble1.y - bubble2.y)**2 + Math.abs(bubble1.x - bubble2.x)**2) <= 81
}


function collectCluster(bubbles, startIdx) {
  const start = bubbles[startIdx];
  const cluster = [start];
  const stack = [start];
  const visited = new Set([start]);

  while (stack.length) {
    const current = stack.pop();
    bubbles.forEach(next => {
      if (
        !visited.has(next) &&
        next.color === start.color &&
        bubbleCollision(current, next)
      ) {
        visited.add(next);
        cluster.push(next);
        stack.push(next);
      }
    });
  }
  return cluster;
}

function markElimination(bubble) {
  bubble.eliminating = true;
  bubble.speedY = -5 + bubble.y / 100;
}

function handleCollisions(bubbles, addedIdx) {
  const cluster = collectCluster(bubbles, addedIdx);
  if (cluster.length >= 3) {
    cluster.forEach(markElimination);
  }
}

let bubbleToShoot = new Bubble(canvas.width / 2, canvas.height - 40, null, true)
bubbleToShoot.update()

const bubblePath = new Path((canvas.width / 2) - 1.5, canvas.height - 83, bubbleToShoot.color, pivotX, pivotY)
bubblePath.update()

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'grey';
  ctx.fillRect(0, 0, canvas.width, canvas.height);    
  bubblePath.update()
  bubbleToShoot.update()
  if(newBubbleToShoot) newBubbleToShoot.update()
  bubbles.forEach(bubble => {
    bubble.update()
    if(bubble.y > canvas.height) bubbles = bubbles.filter(bubble => !bubble.isEliminated)
  })   

  bubbles.filter(bubble => !bubble.eliminating).forEach(bubble => {
    if(bubbleCollision(bubbleToShoot, bubble)) {
      const bubbleCollisioned = bubble
      bubbleToShoot.speedX = 0
      bubbleToShoot.speedY = 0
      const addedBubble = new Bubble(bubbleToShoot.x, bubbleToShoot.y, bubbleToShoot.color)
      bubbles.push(addedBubble)
      bubbleToShoot = newBubbleToShoot
      const addedIdx = bubbles.length - 1;
      handleCollisions(bubbles, addedIdx);
    }
  })


  if(bubbleToShoot.y <= 40) {    
    const newBubble = new Bubble(bubbleToShoot.x, 40, bubbleToShoot.color)
    bubbles.push(newBubble)
    bubbleToShoot = newBubbleToShoot
  } 

  requestAnimationFrame(animate)
}

animate()

// newRowInterval = setInterval(() => {
//   ctx.fillStyle = 'grey';
//   ctx.fillRect(0, 0, canvas.width, canvas.height);  
//   bubbleToShoot.update()
//   bubbles.forEach(bubble => {
//     bubble.y += 70
//     bubble.update()
//   })  
//   getNewBubblesRow()
//   console.log(bubbles)
// }, 25000)


window.addEventListener('keyup', ({ key }) => {
  switch(key){
    case ' ': 
      bubbles.forEach(bubble => {
        if(bubble.color === bubbleToShoot.color) {
          bubble.eliminating = true
          bubble.speedY = - 5  +  bubble.y / 100
        }
      })
      break;
  }
})

window.addEventListener('keydown', ({ key }) => {
  const rotationSpeed = 0.02;
  if(key === 'ArrowLeft') {
    bubblePath.rotate(-rotationSpeed)
  } else if(key === 'ArrowRight') {
    bubblePath.rotate(rotationSpeed)
  }

  if(key === 'ArrowUp' && !bubbleToShoot.active) {
    bubbleToShoot.active = true
    bubbleToShoot.speedY = -Math.cos(bubblePath.rotation) * 10
    bubbleToShoot.speedX = Math.sin(bubblePath.rotation) * 10
    newBubbleToShoot = new Bubble(canvas.width / 2, canvas.height - 40, null, true)
    bubblePath.color = newBubbleToShoot.color
  }
})



