// City Awakening - Interactive Sunrise Experience
// Main JavaScript functionality

class CityAwakening {
    constructor() {
        this.scrollProgress = 0;
        this.isLoaded = false;
        this.weatherData = null;
        this.airQualityData = null;
        
        // DOM elements
        this.skyBackground = document.getElementById('sky-background');
        this.starsLayer = document.getElementById('stars-layer');
        this.celestialBody = document.getElementById('celestial-body');
        this.moon = document.getElementById('moon');
        this.sun = document.getElementById('sun');
        this.cloudsLayer = document.getElementById('clouds-layer');
        this.birdsContainer = document.getElementById('birds-container');
        this.streetlights = document.getElementById('streetlights');
        this.buildings = document.querySelectorAll('.building');
        this.windows = document.querySelectorAll('.window');
        this.loadingScreen = document.getElementById('loading-screen');
        
        // Data display elements
        this.currentTimeEl = document.getElementById('current-time');
        this.weatherInfoEl = document.getElementById('weather-info');
        this.airQualityEl = document.getElementById('air-quality');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startTimeUpdater();
        this.fetchWeatherData();
        this.fetchAirQualityData();
        this.createInteractiveElements();
        this.hideLoadingScreen();
    }
    
    setupEventListeners() {
        // Scroll event with throttling for performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = requestAnimationFrame(() => {
                this.handleScroll();
            });
        });
        
        // Mouse movement for interactive effects
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
        
        // Resize event
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Touch events for mobile
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        });
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        this.scrollProgress = Math.min(scrollTop / documentHeight, 1);
        
        this.updateSkyTransition();
        this.updateCelestialBodies();
        this.updateStars();
        this.updateStreetlights();
        this.updateBuildings();
        this.updateClouds();
        this.updateBirds();
        this.updateParallax();
    }
    
    updateSkyTransition() {
        const progress = this.scrollProgress;
        
        if (progress < 0.3) {
            // Night to dawn transition
            const nightToDawn = progress / 0.3;
            this.skyBackground.style.background = `linear-gradient(to bottom, 
                ${this.interpolateColor('#0a0a1a', '#2c1810', nightToDawn)},
                ${this.interpolateColor('#1a1a2e', '#4a2c1a', nightToDawn)},
                ${this.interpolateColor('#16213e', '#6b4423', nightToDawn)})`;
        } else if (progress < 0.7) {
            // Dawn to morning transition
            const dawnToMorning = (progress - 0.3) / 0.4;
            this.skyBackground.style.background = `linear-gradient(to bottom, 
                ${this.interpolateColor('#2c1810', '#87ceeb', dawnToMorning)},
                ${this.interpolateColor('#4a2c1a', '#ffa500', dawnToMorning)},
                ${this.interpolateColor('#6b4423', '#ff6b6b', dawnToMorning)})`;
        } else {
            // Morning to day transition
            const morningToDay = (progress - 0.7) / 0.3;
            this.skyBackground.style.background = `linear-gradient(to bottom, 
                ${this.interpolateColor('#87ceeb', '#87ceeb', morningToDay)},
                ${this.interpolateColor('#ffa500', '#b0e0e6', morningToDay)},
                ${this.interpolateColor('#ff6b6b', '#ffd700', morningToDay)})`;
        }
    }
    
    updateCelestialBodies() {
        const progress = this.scrollProgress;
        const celestialTop = 80 - (progress * 60); // Move from 80% to 20%
        const celestialRight = 15 + (progress * 20); // Move from 15% to 35%
        
        this.celestialBody.style.top = `${celestialTop}%`;
        this.celestialBody.style.right = `${celestialRight}%`;
        
        // Transition from moon to sun
        if (progress < 0.4) {
            this.moon.style.opacity = 1 - (progress / 0.4);
            this.sun.style.opacity = progress / 0.4;
        } else {
            this.moon.style.opacity = 0;
            this.sun.style.opacity = 1;
        }
    }
    
    updateStars() {
        const opacity = Math.max(0, 1 - (this.scrollProgress * 2.5));
        this.starsLayer.style.opacity = opacity;
    }
    
    updateStreetlights() {
        const progress = this.scrollProgress;
        const streetLights = document.querySelectorAll('.streetlight');
        
        streetLights.forEach((light, index) => {
            const lightBulb = light.querySelector('.light-bulb');
            const lightGlow = light.querySelector('.light-glow');
            const delay = index * 0.1;
            const fadeProgress = Math.max(0, Math.min(1, (progress - delay) * 3));
            
            if (progress > 0.3 + delay) {
                // Start turning off lights as dawn approaches
                const opacity = Math.max(0, 1 - fadeProgress);
                lightBulb.style.opacity = opacity;
                lightGlow.style.opacity = opacity * 0.6;
                
                // Add flickering effect before turning off
                if (opacity > 0.1 && opacity < 0.9) {
                    const flicker = Math.random() > 0.8 ? 0.3 : 1;
                    lightBulb.style.opacity = opacity * flicker;
                    lightGlow.style.opacity = opacity * flicker * 0.6;
                }
            }
        });
    }
    
    updateBuildings() {
        this.buildings.forEach((building, index) => {
            const layer = building.closest('.building-layer');
            const isBackground = layer.classList.contains('background-buildings');
            const isMidground = layer.classList.contains('midground-buildings');
            
            // Parallax effect
            let parallaxOffset = 0;
            if (isBackground) {
                parallaxOffset = this.scrollProgress * -20;
            } else if (isMidground) {
                parallaxOffset = this.scrollProgress * -10;
            } else {
                parallaxOffset = this.scrollProgress * -5;
            }
            
            building.style.transform = `translateY(${parallaxOffset}px)`;
            
            // Building color transition as dawn approaches
            const progress = this.scrollProgress;
            if (progress > 0.2) {
                const colorProgress = Math.min(1, (progress - 0.2) / 0.6);
                const currentFilter = building.style.filter || '';
                building.style.filter = `${currentFilter} hue-rotate(${colorProgress * 30}deg) brightness(${1 + colorProgress * 0.3})`;
            }
        });
        
        // Update window lights
        this.updateWindowLights();
    }
    
    updateWindowLights() {
        const progress = this.scrollProgress;
        this.windows.forEach((window, index) => {
            const baseDelay = index * 0.02;
            const lightProgress = Math.max(0, Math.min(1, (progress - baseDelay) * 2));
            
            if (progress < 0.5) {
                // Night time - more windows lit
                window.style.opacity = 0.8 + Math.random() * 0.2;
                window.style.background = `rgba(255, 255, ${100 + Math.random() * 155}, 0.8)`;
            } else {
                // Morning - fewer windows lit
                const morningOpacity = Math.max(0.1, 0.8 - lightProgress);
                window.style.opacity = morningOpacity;
                window.style.background = `rgba(255, ${200 + Math.random() * 55}, ${150 + Math.random() * 105}, ${morningOpacity})`;
            }
        });
    }
    
    updateClouds() {
        const clouds = document.querySelectorAll('.cloud');
        clouds.forEach((cloud, index) => {
            const parallaxOffset = this.scrollProgress * (5 + index * 2);
            const opacity = 0.3 + (this.scrollProgress * 0.4);
            
            cloud.style.transform = `translateX(${parallaxOffset}px) translateY(${Math.sin(Date.now() * 0.001 + index) * 2}px)`;
            cloud.style.opacity = Math.min(0.8, opacity);
            
            // Change cloud color as dawn approaches
            if (this.scrollProgress > 0.3) {
                const colorProgress = (this.scrollProgress - 0.3) / 0.4;
                const r = Math.round(255 + colorProgress * 0);
                const g = Math.round(255 - colorProgress * 50);
                const b = Math.round(255 - colorProgress * 100);
                cloud.style.background = `rgba(${r}, ${g}, ${b}, ${opacity * 0.4})`;
            }
        });
    }
    
    updateBirds() {
        const birds = document.querySelectorAll('.bird');
        const progress = this.scrollProgress;
        
        // Birds become more active as morning approaches
        if (progress > 0.4) {
            const activityLevel = (progress - 0.4) / 0.6;
            birds.forEach((bird, index) => {
                bird.style.opacity = Math.min(1, activityLevel * 2);
                bird.style.color = `rgba(${50 + activityLevel * 50}, ${50 + activityLevel * 50}, ${50 + activityLevel * 50}, ${activityLevel})`;
            });
        } else {
            birds.forEach(bird => {
                bird.style.opacity = 0.3;
            });
        }
    }
    
    updateParallax() {
        // Additional parallax effects for various elements
        const progress = this.scrollProgress;
        
        // Clouds layer parallax
        this.cloudsLayer.style.transform = `translateY(${progress * 20}px)`;
        
        // Birds container parallax
        this.birdsContainer.style.transform = `translateY(${progress * -15}px)`;
    }
    
    handleMouseMove(e) {
        const { clientX, clientY } = e;
        const xPercent = (clientX / window.innerWidth) * 100;
        const yPercent = (clientY / window.innerHeight) * 100;
        
        // Interactive cloud movement
        const clouds = document.querySelectorAll('.cloud');
        clouds.forEach((cloud, index) => {
            const moveX = ((xPercent - 50) * 0.1) + (index * 2);
            const moveY = ((yPercent - 50) * 0.05) + (index * 1);
            cloud.style.transform += ` translate(${moveX}px, ${moveY}px)`;
        });
        
        // Interactive bird movement
        const birds = document.querySelectorAll('.bird');
        birds.forEach((bird, index) => {
            const moveX = ((xPercent - 50) * 0.05) - (index * 1);
            const moveY = ((yPercent - 50) * 0.03) - (index * 0.5);
            bird.style.transform += ` translate(${moveX}px, ${moveY}px)`;
        });
        
        // Interactive window glow
        this.windows.forEach((window, index) => {
            const rect = window.getBoundingClientRect();
            const distance = Math.sqrt(
                Math.pow(clientX - (rect.left + rect.width / 2), 2) +
                Math.pow(clientY - (rect.top + rect.height / 2), 2)
            );
            
            if (distance < 100) {
                const intensity = 1 - (distance / 100);
                window.style.boxShadow = `0 0 ${intensity * 10}px rgba(255, 255, 100, ${intensity * 0.8})`;
            } else {
                window.style.boxShadow = 'none';
            }
        });
    }
    
    handleResize() {
        // Recalculate positions and sizes on resize
        this.handleScroll();
    }
    
    createInteractiveElements() {
        // Add more stars dynamically
        for (let i = 0; i < 20; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 50}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            this.starsLayer.appendChild(star);
        }
        
        // Add more birds
        for (let i = 0; i < 5; i++) {
            const bird = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            bird.classList.add('bird');
            bird.setAttribute('viewBox', '0 0 100 100');
            bird.style.left = `${Math.random() * 80 + 10}%`;
            bird.style.top = `${Math.random() * 30 + 20}%`;
            bird.style.animationDelay = `${Math.random() * 15}s`;
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M20,50 Q30,40 50,50 Q70,40 80,50 Q70,60 50,50 Q30,60 20,50');
            path.setAttribute('fill', 'currentColor');
            
            bird.appendChild(path);
            this.birdsContainer.appendChild(bird);
        }
    }
    
    startTimeUpdater() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            this.currentTimeEl.textContent = timeString;
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }
    
    async fetchWeatherData() {
        try {
            // Using a free weather API (OpenWeatherMap requires API key)
            // For demo purposes, we'll simulate weather data
            await this.simulateAPICall(1000);
            
            const mockWeatherData = {
                temperature: Math.round(15 + Math.random() * 15),
                condition: ['Clear', 'Partly Cloudy', 'Overcast', 'Light Rain'][Math.floor(Math.random() * 4)],
                humidity: Math.round(40 + Math.random() * 40)
            };
            
            this.weatherData = mockWeatherData;
            this.weatherInfoEl.innerHTML = `
                <div>${mockWeatherData.temperature}°C</div>
                <div style="font-size: 0.9rem; margin-top: 0.5rem;">${mockWeatherData.condition}</div>
            `;
            
            // Adjust scene based on weather
            this.adjustSceneForWeather(mockWeatherData);
            
        } catch (error) {
            console.log('Weather data unavailable');
            this.weatherInfoEl.textContent = 'Weather unavailable';
        }
    }
    
    async fetchAirQualityData() {
        try {
            // Simulate air quality API call
            await this.simulateAPICall(1500);
            
            const mockAQI = Math.round(20 + Math.random() * 80);
            let quality = 'Good';
            
            if (mockAQI > 100) quality = 'Poor';
            else if (mockAQI > 50) quality = 'Moderate';
            
            this.airQualityData = { aqi: mockAQI, quality };
            this.airQualityEl.innerHTML = `
                <div>${mockAQI} AQI</div>
                <div style="font-size: 0.9rem; margin-top: 0.5rem;">${quality}</div>
            `;
            
            // Adjust scene based on air quality
            this.adjustSceneForAirQuality({ aqi: mockAQI, quality });
            
        } catch (error) {
            console.log('Air quality data unavailable');
            this.airQualityEl.textContent = 'AQI unavailable';
        }
    }
    
    adjustSceneForWeather(weatherData) {
        const { condition, temperature } = weatherData;
        
        // Adjust cloud opacity and movement based on weather
        const clouds = document.querySelectorAll('.cloud');
        
        switch (condition) {
            case 'Clear':
                clouds.forEach(cloud => {
                    cloud.style.opacity = '0.3';
                });
                break;
            case 'Partly Cloudy':
                clouds.forEach(cloud => {
                    cloud.style.opacity = '0.6';
                });
                break;
            case 'Overcast':
                clouds.forEach((cloud, index) => {
                    cloud.style.opacity = '0.8';
                    // Add more clouds
                    if (index === 0) {
                        for (let i = 0; i < 3; i++) {
                            const newCloud = cloud.cloneNode(true);
                            newCloud.style.left = `${Math.random() * 100}%`;
                            newCloud.style.top = `${Math.random() * 40 + 10}%`;
                            this.cloudsLayer.appendChild(newCloud);
                        }
                    }
                });
                break;
            case 'Light Rain':
                this.addRainEffect();
                break;
        }
        
        // Adjust sun/moon intensity based on temperature
        if (temperature > 25) {
            this.sun.style.boxShadow = '0 0 60px rgba(255, 215, 0, 0.8)';
        } else if (temperature < 5) {
            this.sun.style.filter = 'brightness(0.8)';
        }
    }
    
    adjustSceneForAirQuality(aqData) {
        const { aqi } = aqData;
        
        // Add haze effect based on air quality
        const hazeOpacity = Math.min(0.4, aqi / 200);
        
        if (hazeOpacity > 0.1) {
            const haze = document.createElement('div');
            haze.id = 'air-quality-haze';
            haze.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(200, 180, 160, ${hazeOpacity});
                pointer-events: none;
                z-index: -1;
                transition: opacity 2s ease-out;
            `;
            document.body.appendChild(haze);
        }
    }
    
    addRainEffect() {
        const rainContainer = document.createElement('div');
        rainContainer.id = 'rain-effect';
        rainContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        
        for (let i = 0; i < 50; i++) {
            const raindrop = document.createElement('div');
            raindrop.style.cssText = `
                position: absolute;
                width: 1px;
                height: 20px;
                background: rgba(255, 255, 255, 0.6);
                left: ${Math.random() * 100}%;
                top: -20px;
                animation: rain-fall ${2 + Math.random() * 2}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            rainContainer.appendChild(raindrop);
        }
        
        // Add rain animation CSS
        if (!document.getElementById('rain-styles')) {
            const rainStyles = document.createElement('style');
            rainStyles.id = 'rain-styles';
            rainStyles.textContent = `
                @keyframes rain-fall {
                    to {
                        transform: translateY(100vh);
                    }
                }
            `;
            document.head.appendChild(rainStyles);
        }
        
        document.body.appendChild(rainContainer);
    }
    
    simulateAPICall(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    
    interpolateColor(color1, color2, factor) {
        // Simple color interpolation
        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);
        
        if (!c1 || !c2) return color1;
        
        const r = Math.round(c1.r + factor * (c2.r - c1.r));
        const g = Math.round(c1.g + factor * (c2.g - c1.g));
        const b = Math.round(c1.b + factor * (c2.b - c1.b));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            this.loadingScreen.classList.add('hidden');
            this.isLoaded = true;
            
            // Initial scroll to set up the scene
            this.handleScroll();
        }, 2000);
    }
}

// Initialize the experience when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CityAwakening();
});

// Add some global utility functions for additional interactivity
window.addEventListener('load', () => {
    // Add subtle mouse parallax to the entire scene
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (clientX - centerX) * 0.01;
        const moveY = (clientY - centerY) * 0.01;
        
        document.documentElement.style.setProperty('--mouse-x', `${moveX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${moveY}px`);
    });
    
    // Add keyboard interactions
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                window.scrollBy(0, -100);
                break;
            case 'ArrowDown':
                window.scrollBy(0, 100);
                break;
            case ' ':
                e.preventDefault();
                window.scrollBy(0, window.innerHeight * 0.8);
                break;
        }
    });
});

// Performance optimization: Reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    document.documentElement.style.setProperty('--reduced-motion', '1');
}

// Add intersection observer for lazy loading additional effects
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all content sections for fade-in effects
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        observer.observe(section);
    });
});