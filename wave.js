const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = ({ context, width, height }) => {

  const particles = [];
  const numParticles = 20;
    
  
  for (let i = 0; i < numParticles; i++) {


      let x = random.range(width);
      let y = random.range(height);

      let particle = new Particle({ x, y, width, height });

      particles.push(particle);    
  }

  
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    particles.forEach(particle => {
      particle.update();
      particle.draw(context);
    });
  };
};

canvasSketch(sketch, settings);

class Particle {
  constructor({ x, y, width, height }) {
    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;

    this.vx = (Math.random() * 5) - 2.5;
    this.vy = (Math.random() * 5) - 2.5;
  }

  update() {

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > this.width) {
      this.vx *= -1;
    }

    if (this.y < 0 || this.y > this.height) {
      this.vy *= -1;
    }

  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = 'white';

    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
