const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const particles = [];
const numParticles = 120;

const sketch = ({ context, width, height }) => {  

  particles.length = 0;
  
  for (let i = 0; i < numParticles; i++) {


      let x = random.range(width);
      let y = random.range(height);

      let type = Math.random() < 0.04 ? 'heavy' : 'normal';

      let particle = new Particle({ x, y, type, width, height });

      particles.push(particle);    
  }

  
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    interact(context);
    particles.forEach(particle => {
      particle.update();
      particle.draw(context);
    });

    connect(context);
  };
};

const connect = (context) => {
  for (let i = 0; i < numParticles; i++) {
    for (let j = i + 1; j < numParticles; j++) {
      let ax = particles[i].x;
      let ay = particles[i].y;
      let bx = particles[j].x;
      let by = particles[j].y;

      let dx = ax - bx;
      let dy = ay - by;
      let dd = Math.sqrt(dx * dx + dy * dy)
      let maxdd = 150;

      if(particles[j].color == '#ff0000' || particles[i].color == '#ff0000') continue;
      
      if (dd < maxdd) {
        context.save()
        context.strokeStyle = 'white';
        context.lineWidth = 2;

        context.beginPath();
        context.moveTo(ax, ay);
        context.lineTo(bx, by);
        context.stroke();
        context.restore();
      }
    }
  }
};

const interact = (context) => {
  for (let i = 0; i < numParticles; i++) {
    for (let j = i + 1; j < numParticles; j++) {
      
      if((particles[i].type === 'heavy' && particles[j].type === 'normal') || (particles[j].type === 'heavy' && particles[i].type === 'normal')) {
        
        let heavyParticle = particles[j].type === 'heavy' ? particles[j] : particles[i];
        let normalParticle = heavyParticle === particles[j] ? particles[i] : particles[j];

        let awayX = normalParticle.x - heavyParticle.x;
        let awayY = normalParticle.y - heavyParticle.y;

        let awayMag = Math.sqrt(awayX * awayX + awayY * awayY);

        if(awayMag < 100) {
          awayX = awayX / awayMag;
          awayY = awayY / awayMag;

          normalParticle.accx += awayX;
          normalParticle.accy += awayY;
        }

       
      }

    }
  }
};

canvasSketch(sketch, settings);

class Particle {
  constructor({ x, y, type = 'normal', width, height }) {
    this.x = x;
    this.y = y;
    this.type = type;

    this.radius = this.type === 'heavy' ? 15 : 8;
    this.color = this.type === 'heavy'? '#ff0000' : '#ffffff';

    this.width = width;
    this.height = height;

    this.vx = (Math.random() * 5) - 2.5;
    this.vy = (Math.random() * 5) - 2.5;

    this.forcevx = 0;
    this.forcevy = 0;

    this.accx = 0;
    this.accy = 0;
  }

  update() {
    this.forcevx += this.accx;
    this.forcevy += this.accy;

    this.x += this.vx;
    this.y += this.vy;

    this.x += this.forcevx;
    this.y += this.forcevy;

    if (this.type === 'heavy') {
      if (this.x < 0 || this.x > this.width) {
        this.vx *= -1;
      }

      if (this.y < 0 || this.y > this.height) {
        this.vy *= -1;
      }
    }

    this.forcevx *= 0.95;
    this.forcevy *= 0.95;

    this.accx = 0;
    this.accy = 0;

    if(this.type === 'normal') {
      if (this.x < 0 || this.x > this.width || this.y < 0 || this.y > this.height) {
        this.reset()
      }
    }
  }

  reset() {
    this.x = random.range(this.width);
    this.y = random.range(this.height);
    this.vx = (Math.random() * 5) - 2.5;
    this.vy = (Math.random() * 5) - 2.5;
    this.accx = 0;
    this.accy = 0;
    this.forcevx = 0;
    this.forcevy = 0;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.color;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}

