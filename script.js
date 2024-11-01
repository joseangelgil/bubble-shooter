const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 720;
canvas.height = 1024;


ctx.fillStyle = 'grey';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const colors = ['red', 'blue', 'green', 'purple', 'cyan', 'yellow']
let bubbles = []

class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 40;
    this.color = colors[Math.floor(Math.random() * colors.length)]
  }

  draw() {

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);    
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = 'black'
    ctx.stroke()
  }

  update() {
    this.draw()
  }
}

// Get row of 9
for(let i = 0; i < 9; i++) {
  bubbles.push(new Bubble(80 * i + 40, 40))
}

// Get row of 8
for(let i = 0; i < 8; i++) {
  bubbles.push(new Bubble(80 * i + 80, 110)) // +70 en eje y
}
// Get row of 9
for(let i = 0; i < 9; i++) {
  bubbles.push(new Bubble(80 * i + 40, 180))
}

// Get row of 8
for(let i = 0; i < 8; i++) {
  bubbles.push(new Bubble(80 * i + 80, 250))
}
// Get row of 9
for(let i = 0; i < 9; i++) {
  bubbles.push(new Bubble(80 * i + 40, 320))
}

// Get row of 8
for(let i = 0; i < 8; i++) {
  bubbles.push(new Bubble(80 * i + 80, 390))
}

bubbles.forEach(bubble => bubble.update())

const bubbleToShoot = new Bubble(canvas.width / 2, canvas.height - 40)
bubbleToShoot.update()




