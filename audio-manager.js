// Audio Manager for Ambient City Sounds
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.masterVolume = 0.3;
        this.isEnabled = false;
        this.currentAmbient = null;
        
        this.init();
    }
    
    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            await this.createSynthSounds();
            this.setupVolumeControl();
        } catch (error) {
            console.log('Audio not available:', error);
        }
    }
    
    async createSynthSounds() {
        // Create synthetic ambient sounds using Web Audio API
        this.sounds = {
            nightAmbient: this.createNightAmbient(),
            dawnBirds: this.createBirdSounds(),
            cityHum: this.createCityHum(),
            wind: this.createWindSound(),
            rain: this.createRainSound(),
            traffic: this.createTrafficSound()
        };
    }
    
    createNightAmbient() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        return { oscillator, gainNode };
    }
    
    createBirdSounds() {
        // Create chirping bird sounds
        const sounds = [];
        for (let i = 0; i < 3; i++) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800 + Math.random() * 400, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            sounds.push({ oscillator, gainNode });
        }
        return sounds;
    }
    
    createCityHum() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(120, this.audioContext.currentTime);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        return { oscillator, gainNode, filter };
    }
    
    createWindSound() {
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate white noise for wind
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        source.buffer = buffer;
        source.loop = true;
        
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(300, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        return { source, gainNode, filter };
    }
    
    createRainSound() {
        const bufferSize = this.audioContext.sampleRate * 0.1;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate rain-like noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.5;
        }
        
        const sources = [];
        for (let i = 0; i < 5; i++) {
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            source.buffer = buffer;
            source.loop = true;
            
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1000 + Math.random() * 2000, this.audioContext.currentTime);
            filter.Q.setValueAtTime(0.5, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            
            source.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            sources.push({ source, gainNode, filter });
        }
        
        return sources;
    }
    
    createTrafficSound() {
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator1.type = 'sawtooth';
        oscillator1.frequency.setValueAtTime(80, this.audioContext.currentTime);
        
        oscillator2.type = 'triangle';
        oscillator2.frequency.setValueAtTime(160, this.audioContext.currentTime);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        oscillator1.connect(filter);
        oscillator2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        return { oscillator1, oscillator2, gainNode, filter };
    }
    
    setupVolumeControl() {
        // Create audio control panel
        const audioPanel = document.createElement('div');
        audioPanel.id = 'audio-controls';
        audioPanel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 15px;
            border-radius: 10px;
            color: white;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            z-index: 1000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        audioPanel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: 600;">🎵 Audio Controls</div>
            <label style="display: block; margin-bottom: 5px;">
                <input type="checkbox" id="audio-toggle" style="margin-right: 8px;">
                Enable Audio
            </label>
            <label style="display: block; margin-bottom: 10px;">
                Volume: <input type="range" id="volume-slider" min="0" max="100" value="30" style="width: 80px;">
            </label>
            <div style="font-size: 10px; opacity: 0.7;">Click to enable Web Audio</div>
        `;
        
        document.body.appendChild(audioPanel);
        
        const toggle = document.getElementById('audio-toggle');
        const volumeSlider = document.getElementById('volume-slider');
        
        toggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.enable();
            } else {
                this.disable();
            }
        });
        
        volumeSlider.addEventListener('input', (e) => {
            this.masterVolume = e.target.value / 100;
            this.updateVolume();
        });
    }
    
    async enable() {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        this.isEnabled = true;
    }
    
    disable() {
        this.isEnabled = false;
        this.stopAll();
    }
    
    playAmbient(type, volume = 0.3) {
        if (!this.isEnabled || !this.sounds[type]) return;
        
        const sound = this.sounds[type];
        
        if (Array.isArray(sound)) {
            sound.forEach(s => {
                if (s.source && !s.started) {
                    s.source.start();
                    s.started = true;
                }
                if (s.oscillator && !s.started) {
                    s.oscillator.start();
                    s.started = true;
                }
                s.gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume, this.audioContext.currentTime + 1);
            });
        } else {
            if (sound.source && !sound.started) {
                sound.source.start();
                sound.started = true;
            }
            if (sound.oscillator && !sound.started) {
                sound.oscillator.start();
                sound.started = true;
            }
            if (sound.oscillator1 && !sound.started) {
                sound.oscillator1.start();
                sound.oscillator2.start();
                sound.started = true;
            }
            sound.gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume, this.audioContext.currentTime + 1);
        }
        
        this.currentAmbient = type;
    }
    
    fadeOut(type) {
        if (!this.sounds[type]) return;
        
        const sound = this.sounds[type];
        
        if (Array.isArray(sound)) {
            sound.forEach(s => {
                s.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 2);
            });
        } else {
            sound.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 2);
        }
    }
    
    updateVolume() {
        Object.values(this.sounds).forEach(sound => {
            if (Array.isArray(sound)) {
                sound.forEach(s => {
                    const currentVolume = s.gainNode.gain.value;
                    if (currentVolume > 0) {
                        s.gainNode.gain.setValueAtTime(currentVolume * this.masterVolume, this.audioContext.currentTime);
                    }
                });
            } else {
                const currentVolume = sound.gainNode.gain.value;
                if (currentVolume > 0) {
                    sound.gainNode.gain.setValueAtTime(currentVolume * this.masterVolume, this.audioContext.currentTime);
                }
            }
        });
    }
    
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            if (Array.isArray(sound)) {
                sound.forEach(s => {
                    s.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                });
            } else {
                sound.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            }
        });
    }
    
    updateForScrollProgress(progress) {
        if (!this.isEnabled) return;
        
        if (progress < 0.3) {
            // Night time
            this.playAmbient('nightAmbient', 0.2);
            this.fadeOut('dawnBirds');
            this.fadeOut('cityHum');
        } else if (progress < 0.7) {
            // Dawn
            this.fadeOut('nightAmbient');
            this.playAmbient('dawnBirds', 0.3);
            this.playAmbient('wind', 0.1);
        } else {
            // Morning
            this.fadeOut('dawnBirds');
            this.playAmbient('cityHum', 0.2);
            this.playAmbient('traffic', 0.1);
        }
    }
}

window.AudioManager = AudioManager;