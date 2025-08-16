// Particle System for Enhanced Visual Effects
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.effects = {
            rain: false,
            snow: false,
            leaves: false,
            dust: false,
            fireflies: false,
            fog: false
        };
        
        this.init();
    }
    
    init() {
        // Create canvas for particles
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `;
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticle(type, x, y) {
        const particle = {
            x: x || Math.random() * this.canvas.width,
            y: y || Math.random() * this.canvas.height,
            type: type,
            life: 1,
            maxLife: 1,
            size: Math.random() * 3 + 1,
            velocity: { x: 0, y: 0 },
            color: '#ffffff',
            opacity: Math.random() * 0.8 + 0.2
        };
        
        switch (type) {
            case 'rain':
                particle.velocity = { x: -1, y: 8 + Math.random() * 4 };
                particle.color = 'rgba(173, 216, 230, 0.8)';
                particle.size = 1;
                break;
                
            case 'snow':
                particle.velocity = { x: Math.random() * 2 - 1, y: 2 + Math.random() * 2 };
                particle.color = 'rgba(255, 255, 255, 0.9)';
                particle.size = Math.random() * 4 + 2;
                break;
                
            case 'leaves':
                particle.velocity = { x: Math.random() * 3 - 1.5, y: 1 + Math.random() * 2 };
                particle.color = `hsl(${Math.random() * 60 + 10}, 70%, 50%)`;
                particle.size = Math.random() * 6 + 3;
                particle.rotation = Math.random() * Math.PI * 2;
                particle.rotationSpeed = Math.random() * 0.2 - 0.1;
                break;
                
            case 'dust':
                particle.velocity = { x: Math.random() * 1 - 0.5, y: Math.random() * 0.5 };
                particle.color = 'rgba(255, 215, 0, 0.3)';
                particle.size = Math.random() * 2 + 0.5;
                break;
                
            case 'fireflies':
                particle.velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
                particle.color = 'rgba(255, 255, 0, 0.8)';
                particle.size = Math.random() * 2 + 1;
                particle.glow = true;
                particle.flickerSpeed = Math.random() * 0.1 + 0.05;
                break;
                
            case 'fog':
                particle.velocity = { x: Math.random() * 1 - 0.5, y: -0.2 };
                particle.color = 'rgba(200, 200, 220, 0.1)';
                particle.size = Math.random() * 50 + 20;
                particle.maxLife = 5;
                particle.life = 5;
                break;
        }
        
        return particle;
    }
    
    startEffect(type, intensity = 50) {
        this.effects[type] = true;
        
        // Create initial particles
        for (let i = 0; i < intensity; i++) {
            this.particles.push(this.createParticle(type));
        }
    }
    
    stopEffect(type) {
        this.effects[type] = false;
        // Remove particles of this type
        this.particles = this.particles.filter(p => p.type !== type);
    }
    
    update(scrollProgress) {
        // Update existing particles
        this.particles.forEach((particle, index) => {
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            
            if (particle.type === 'leaves' && particle.rotation !== undefined) {
                particle.rotation += particle.rotationSpeed;
            }
            
            if (particle.type === 'fireflies') {
                // Flickering effect
                particle.opacity = 0.5 + 0.5 * Math.sin(Date.now() * particle.flickerSpeed);
            }
            
            if (particle.type === 'fog') {
                particle.life -= 0.01;
                particle.opacity = particle.life / particle.maxLife * 0.1;
            }
            
            // Remove particles that are off screen or dead
            if (particle.x < -50 || particle.x > this.canvas.width + 50 ||
                particle.y < -50 || particle.y > this.canvas.height + 50 ||
                particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
        
        // Add new particles for active effects
        Object.keys(this.effects).forEach(type => {
            if (this.effects[type] && Math.random() < 0.3) {
                let x, y;
                
                if (type === 'rain' || type === 'snow') {
                    x = Math.random() * (this.canvas.width + 100) - 50;
                    y = -50;
                } else if (type === 'fog') {
                    x = Math.random() * this.canvas.width;
                    y = this.canvas.height + 50;
                } else {
                    x = Math.random() * this.canvas.width;
                    y = Math.random() * this.canvas.height;
                }
                
                this.particles.push(this.createParticle(type, x, y));
            }
        });
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            
            if (particle.glow) {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = particle.color;
            }
            
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            
            if (particle.type === 'leaves') {
                this.ctx.translate(particle.x, particle.y);
                this.ctx.rotate(particle.rotation);
                this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
            } else if (particle.type === 'rain') {
                this.ctx.fillRect(particle.x, particle.y, 1, particle.size * 3);
            } else if (particle.type === 'fog') {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        });
    }
    
    animate() {
        this.render();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.canvas.remove();
        }
    }
}

// Export for use in main script
window.ParticleSystem = ParticleSystem;