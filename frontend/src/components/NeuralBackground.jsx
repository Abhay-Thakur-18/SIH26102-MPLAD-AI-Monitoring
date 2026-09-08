import { useEffect, useRef } from 'react';

const NeuralBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationFrameId;

    // Canvas size ko window ke size ke barabar set karna
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Mouse ki position track karne ke liye
    let mouse = {
      x: null,
      y: null,
      radius: 150 // Kitni door se nodes mouse se connect honge
    };

    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    const handleMouseOut = () => {
      mouse.x = undefined;
      mouse.y = undefined;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    // Responsive Canvas
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init(); // Window resize par particles wapas banenge
    });

    // Particle (Neuron Node) Class
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      // Har frame mein particle ko draw karna
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      // Particle ki movement aur screen boundaries check karna
      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Particle move karo
        this.x += this.directionX;
        this.y += this.directionY;
        
        this.draw();
      }
    }

    // Initialize Network
    function init() {
      particlesArray = [];
      // Kitne nodes chahiye (Screen size ke hisaab se adjust hoga)
      let numberOfParticles = (canvas.height * canvas.width) / 10000;
      
      // Maximum 100 nodes taaki performance ekdum smooth rahe
      if(numberOfParticles > 100) numberOfParticles = 100;

      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        
        // Movement speed
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        
        // Node color (Cyan ya Blue)
        let color = Math.random() > 0.5 ? '#06B6D4' : '#2563EB';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    // Nodes ke beech line draw karna (Synapses)
    function connect() {
      // Har dot ko baki sabhi dots ke sath compare karna
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
          
          // Agar 2 nodes paas hain, toh connect karo
          if (distance < (canvas.width / 10) * (canvas.height / 10)) {
            let opacityValue = 1 - (distance / 20000);
            ctx.strokeStyle = `rgba(37, 99, 235, ${opacityValue * 0.3})`; // Light Blue connection lines
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
        
        // Mouse ke paas aane par usse connect karna
        if (mouse.x && mouse.y) {
          let dx = mouse.x - particlesArray[a].x;
          let dy = mouse.y - particlesArray[a].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            let opacityValue = 1 - (distance / mouse.radius);
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacityValue * 0.8})`; // Bright Cyan connection near mouse
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    // Animation Loop
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, innerWidth, innerHeight); // Clear previous frame
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    }

    // Start everything
    init();
    animate();

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* pointer-events-auto zaroori hai canvas ke liye 
        taaki wo mouse events catch kar sake 
      */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full pointer-events-auto"
      />
    </div>
  );
};

export default NeuralBackground;