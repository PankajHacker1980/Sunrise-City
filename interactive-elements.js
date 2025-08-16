// Interactive Elements and Creative Features
class InteractiveElements {
    constructor() {
        this.isInitialized = false;
        this.mouseTrail = [];
        this.touchSupported = 'ontouchstart' in window;
        this.deviceOrientation = { alpha: 0, beta: 0, gamma: 0 };
        
        this.init();
    }
    
    init() {
        this.createMouseTrail();
        this.setupDeviceOrientation();
        this.createInteractiveHotspots();
        this.setupKeyboardShortcuts();
        this.createFloatingUI();
        this.setupGestureControls();
        this.createDynamicWeather();
        this.isInitialized = true;
    }
    
    createMouseTrail() {
        const trailCanvas = document.createElement('canvas');
        trailCanvas.id = 'mouse-trail-canvas';
        trailCanvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 3;
        `;
        document.body.appendChild(trailCanvas);
        
        const ctx = trailCanvas.getContext('2d');
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            trailCanvas.width = window.innerWidth;
            trailCanvas.height = window.innerHeight;
        });
        
        document.addEventListener('mousemove', (e) => {
            this.mouseTrail.push({
                x: e.clientX,
                y: e.clientY,
                time: Date.now(),
                size: Math.random() * 3 + 1
            });
            
            if (this.mouseTrail.length > 20) {
                this.mouseTrail.shift();
            }
        });
        
        const animateTrail = () => {
            ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
            
            this.mouseTrail.forEach((point, index) => {
                const age = (Date.now() - point.time) / 1000;
                const opacity = Math.max(0, 1 - age);
                const size = point.size * opacity;
                
                ctx.save();
                ctx.globalAlpha = opacity * 0.6;
                ctx.fillStyle = `hsl(${45 + index * 5}, 80%, 60%)`;
                ctx.beginPath();
                ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
            
            // Remove old points
            this.mouseTrail = this.mouseTrail.filter(point => {
                return (Date.now() - point.time) < 2000;
            });
            
            requestAnimationFrame(animateTrail);
        };
        
        animateTrail();
    }
    
    setupDeviceOrientation() {
        if (this.touchSupported) {
            window.addEventListener('deviceorientation', (e) => {
                this.deviceOrientation = {
                    alpha: e.alpha || 0,
                    beta: e.beta || 0,
                    gamma: e.gamma || 0
                };
                
                this.updateParallaxFromOrientation();
            });
        }
    }
    
    updateParallaxFromOrientation() {
        const { gamma, beta } = this.deviceOrientation;
        const tiltX = gamma / 45; // -1 to 1
        const tiltY = beta / 90; // -1 to 1
        
        // Apply subtle parallax to various elements
        const clouds = document.querySelectorAll('.cloud');
        clouds.forEach((cloud, index) => {
            const intensity = 0.5 + index * 0.2;
            cloud.style.transform += ` translate(${tiltX * intensity * 10}px, ${tiltY * intensity * 5}px)`;
        });
        
        const celestialBody = document.getElementById('celestial-body');
        if (celestialBody) {
            celestialBody.style.transform += ` translate(${tiltX * 5}px, ${tiltY * 3}px)`;
        }
    }
    
    createInteractiveHotspots() {
        const hotspots = [
            { x: 20, y: 70, id: 'building-hotspot-1', building: '.modern-tower' },
            { x: 45, y: 65, id: 'building-hotspot-2', building: '.skyscraper' },
            { x: 75, y: 60, id: 'building-hotspot-3', building: '.flagship-tower' }
        ];
        
        hotspots.forEach((spot, index) => {
            const hotspot = document.createElement('div');
            hotspot.id = spot.id;
            hotspot.className = 'interactive-hotspot';
            hotspot.style.cssText = `
                position: fixed;
                left: ${spot.x}%;
                top: ${spot.y}%;
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255, 215, 0, 0.8);
                border-radius: 50%;
                background: rgba(255, 215, 0, 0.2);
                cursor: pointer;
                z-index: 100;
                animation: hotspot-pulse 2s ease-in-out infinite;
                backdrop-filter: blur(5px);
            `;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'hotspot-tooltip';
            tooltip.innerHTML = `Building ${index + 1}<br><small>Click to explore</small>`;
            tooltip.style.cssText = `
                position: absolute;
                bottom: 25px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 11px;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            `;
            
            hotspot.appendChild(tooltip);
            document.body.appendChild(hotspot);
            
            hotspot.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
            });
            
            hotspot.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });
            
            hotspot.addEventListener('click', () => {
                this.showBuildingDetails(index + 1, spot.building);
            });
        });
        
        // Add CSS for hotspot animation
        if (!document.getElementById('hotspot-styles')) {
            const style = document.createElement('style');
            style.id = 'hotspot-styles';
            style.textContent = `
                @keyframes hotspot-pulse {
                    0%, 100% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.2); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    showBuildingDetails(buildingNumber, selector) {
        const modal = document.createElement('div');
        modal.className = 'building-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            backdrop-filter: blur(10px);
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            color: white;
            text-align: center;
            backdrop-filter: blur(20px);
        `;
        
        const buildingInfo = {
            1: {
                name: "Aurora Tower",
                height: "245m",
                floors: 60,
                type: "Mixed Use",
                features: ["LED Facade", "Sky Garden", "Smart Glass"]
            },
            2: {
                name: "Nexus Skyscraper",
                height: "320m",
                floors: 85,
                type: "Corporate HQ",
                features: ["Helipad", "Observatory Deck", "Green Energy"]
            },
            3: {
                name: "Meridian Flagship",
                height: "380m",
                floors: 95,
                type: "Luxury Residential",
                features: ["Spire Restaurant", "Infinity Pool", "Private Elevators"]
            }
        };
        
        const info = buildingInfo[buildingNumber];
        
        content.innerHTML = `
            <h2 style="margin-bottom: 20px; color: #FFD700;">${info.name}</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div><strong>Height:</strong> ${info.height}</div>
                <div><strong>Floors:</strong> ${info.floors}</div>
                <div><strong>Type:</strong> ${info.type}</div>
                <div><strong>Status:</strong> Active</div>
            </div>
            <div style="margin-bottom: 20px;">
                <h4 style="color: #87CEEB; margin-bottom: 10px;">Features</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${info.features.map(feature => `<span style="background: rgba(255,215,0,0.2); padding: 4px 8px; border-radius: 12px; font-size: 12px;">${feature}</span>`).join('')}
                </div>
            </div>
            <button id="close-modal" style="background: linear-gradient(45deg, #FFD700, #FF6B6B); border: none; padding: 10px 20px; border-radius: 25px; color: white; cursor: pointer; font-weight: 600;">Close</button>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = content.querySelector('#close-modal');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Animate building highlight
        const building = document.querySelector(selector);
        if (building) {
            building.style.transition = 'all 0.3s ease';
            building.style.transform = 'scale(1.05)';
            building.style.filter = 'brightness(1.3) saturate(1.5)';
            
            setTimeout(() => {
                building.style.transform = '';
                building.style.filter = '';
            }, 3000);
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'r':
                    if (window.particleSystem) {
                        window.particleSystem.startEffect('rain', 30);
                        this.showNotification('🌧️ Rain activated');
                    }
                    break;
                case 's':
                    if (window.particleSystem) {
                        window.particleSystem.startEffect('snow', 25);
                        this.showNotification('❄️ Snow activated');
                    }
                    break;
                case 'l':
                    if (window.particleSystem) {
                        window.particleSystem.startEffect('leaves', 20);
                        this.showNotification('🍂 Autumn leaves activated');
                    }
                    break;
                case 'f':
                    if (window.particleSystem) {
                        window.particleSystem.startEffect('fireflies', 15);
                        this.showNotification('✨ Fireflies activated');
                    }
                    break;
                case 'c':
                    if (window.particleSystem) {
                        window.particleSystem.stopEffect('rain');
                        window.particleSystem.stopEffect('snow');
                        window.particleSystem.stopEffect('leaves');
                        window.particleSystem.stopEffect('fireflies');
                        this.showNotification('🧹 Effects cleared');
                    }
                    break;
                case 'h':
                    this.showHelpPanel();
                    break;
            }
        });
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-size: 16px;
            z-index: 3000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 215, 0, 0.3);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }
    
    showHelpPanel() {
        const helpPanel = document.createElement('div');
        helpPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 30px;
            border-radius: 20px;
            font-family: 'Inter', sans-serif;
            z-index: 3000;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 400px;
        `;
        
        helpPanel.innerHTML = `
            <h3 style="color: #FFD700; margin-bottom: 20px;">🎮 Interactive Controls</h3>
            <div style="display: grid; gap: 10px; font-size: 14px;">
                <div><kbd>R</kbd> - Toggle Rain Effect</div>
                <div><kbd>S</kbd> - Toggle Snow Effect</div>
                <div><kbd>L</kbd> - Toggle Autumn Leaves</div>
                <div><kbd>F</kbd> - Toggle Fireflies</div>
                <div><kbd>C</kbd> - Clear All Effects</div>
                <div><kbd>H</kbd> - Show This Help</div>
            </div>
            <div style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
                💡 Move your mouse for trail effects<br>
                🏢 Click building hotspots to explore<br>
                📱 Tilt device for parallax (mobile)
            </div>
            <button onclick="this.parentElement.remove()" style="
                background: linear-gradient(45deg, #FFD700, #FF6B6B);
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                color: white;
                cursor: pointer;
                margin-top: 15px;
                font-weight: 600;
            ">Close</button>
        `;
        
        document.body.appendChild(helpPanel);
    }
    
    createFloatingUI() {
        const floatingUI = document.createElement('div');
        floatingUI.id = 'floating-ui';
        floatingUI.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 15px;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            z-index: 1000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            min-width: 200px;
        `;
        
        floatingUI.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 10px;">🌅 City Status</div>
            <div id="scroll-progress">Scroll Progress: 0%</div>
            <div id="active-effects">Active Effects: None</div>
            <div id="time-of-day">Time: Night</div>
            <div style="margin-top: 10px; font-size: 10px; opacity: 0.7;">
                Press 'H' for help
            </div>
        `;
        
        document.body.appendChild(floatingUI);
    }
    
    setupGestureControls() {
        let touchStartY = 0;
        let touchStartX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        });
        
        document.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            const deltaY = touchStartY - touchY;
            const deltaX = touchStartX - touchX;
            
            // Swipe gestures
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe left - change weather
                    this.cycleWeatherEffect();
                } else {
                    // Swipe right - clear effects
                    if (window.particleSystem) {
                        window.particleSystem.stopEffect('rain');
                        window.particleSystem.stopEffect('snow');
                        window.particleSystem.stopEffect('leaves');
                    }
                }
                touchStartX = touchX;
            }
        });
    }
    
    cycleWeatherEffect() {
        const effects = ['rain', 'snow', 'leaves', 'fireflies'];
        const currentTime = Date.now();
        
        if (!this.lastWeatherCycle || currentTime - this.lastWeatherCycle > 3000) {
            this.currentWeatherIndex = (this.currentWeatherIndex || 0) + 1;
            if (this.currentWeatherIndex >= effects.length) {
                this.currentWeatherIndex = 0;
            }
            
            const effect = effects[this.currentWeatherIndex];
            
            if (window.particleSystem) {
                // Clear previous effects
                effects.forEach(e => window.particleSystem.stopEffect(e));
                // Start new effect
                window.particleSystem.startEffect(effect, 25);
            }
            
            this.showNotification(`🌈 ${effect.charAt(0).toUpperCase() + effect.slice(1)} activated`);
            this.lastWeatherCycle = currentTime;
        }
    }
    
    createDynamicWeather() {
        // Auto-cycle weather effects based on time
        setInterval(() => {
            const hour = new Date().getHours();
            
            if (window.particleSystem) {
                // Clear existing effects first
                ['rain', 'snow', 'leaves', 'fireflies'].forEach(effect => {
                    window.particleSystem.stopEffect(effect);
                });
                
                // Set weather based on time of day
                if (hour >= 6 && hour < 12) {
                    // Morning - light effects
                    if (Math.random() < 0.3) {
                        window.particleSystem.startEffect('dust', 10);
                    }
                } else if (hour >= 12 && hour < 18) {
                    // Afternoon - seasonal effects
                    if (Math.random() < 0.2) {
                        window.particleSystem.startEffect('leaves', 15);
                    }
                } else if (hour >= 18 && hour < 22) {
                    // Evening - fireflies
                    window.particleSystem.startEffect('fireflies', 12);
                } else {
                    // Night - minimal effects
                    if (Math.random() < 0.1) {
                        window.particleSystem.startEffect('fog', 8);
                    }
                }
            }
        }, 30000); // Every 30 seconds
    }
    
    updateUI(scrollProgress) {
        const progressElement = document.getElementById('scroll-progress');
        const timeElement = document.getElementById('time-of-day');
        const effectsElement = document.getElementById('active-effects');
        
        if (progressElement) {
            progressElement.textContent = `Scroll Progress: ${Math.round(scrollProgress * 100)}%`;
        }
        
        if (timeElement) {
            let timeOfDay = 'Night';
            if (scrollProgress > 0.7) timeOfDay = 'Morning';
            else if (scrollProgress > 0.3) timeOfDay = 'Dawn';
            
            timeElement.textContent = `Time: ${timeOfDay}`;
        }
        
        if (effectsElement && window.particleSystem) {
            const activeEffects = Object.keys(window.particleSystem.effects)
                .filter(key => window.particleSystem.effects[key]);
            
            effectsElement.textContent = `Active Effects: ${activeEffects.length > 0 ? activeEffects.join(', ') : 'None'}`;
        }
    }
}

window.InteractiveElements = InteractiveElements;