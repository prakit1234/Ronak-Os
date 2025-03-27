// Control Panel (pulls down from the top like iOS/Android)
window.controlPanel = {
    isOpen: false,
    isInitialized: false,
    networkEnabled: true,
    brightness: 100,
    volume: 80,
    
    // Initialize the control panel
    init: function() {
        if (this.isInitialized) return;
        
        // Create control panel element
        const controlPanel = document.createElement('div');
        controlPanel.id = 'control-panel';
        controlPanel.className = 'control-panel';
        
        // Create handle for pulling down
        const handle = document.createElement('div');
        handle.className = 'control-panel-handle';
        
        // Create content area
        const content = document.createElement('div');
        content.className = 'control-panel-content';
        
        // Add quick settings
        content.innerHTML = `
            <div class="control-panel-row">
                <div class="control-toggle ${this.networkEnabled ? 'active' : ''}" id="network-toggle">
                    <div class="control-toggle-icon">📶</div>
                    <div class="control-toggle-label">Network</div>
                </div>
                <div class="control-toggle" id="bluetooth-toggle">
                    <div class="control-toggle-icon">📱</div>
                    <div class="control-toggle-label">Bluetooth</div>
                </div>
                <div class="control-toggle" id="airplane-toggle">
                    <div class="control-toggle-icon">✈️</div>
                    <div class="control-toggle-label">Airplane</div>
                </div>
                <div class="control-toggle" id="location-toggle">
                    <div class="control-toggle-icon">📍</div>
                    <div class="control-toggle-label">Location</div>
                </div>
            </div>
            
            <div class="control-panel-slider">
                <div class="slider-icon">🔆</div>
                <input type="range" id="brightness-slider" min="20" max="100" value="${this.brightness}">
                <div class="slider-value">${this.brightness}%</div>
            </div>
            
            <div class="control-panel-slider">
                <div class="slider-icon">🔊</div>
                <input type="range" id="volume-slider" min="0" max="100" value="${this.volume}">
                <div class="slider-value">${this.volume}%</div>
            </div>
            
            <div class="control-panel-apps">
                <div class="quick-app" data-app="files">
                    <div class="icon icon-files small-icon"></div>
                    <div class="quick-app-label">Files</div>
                </div>
                <div class="quick-app" data-app="settings">
                    <div class="icon icon-settings small-icon"></div>
                    <div class="quick-app-label">Settings</div>
                </div>
                <div class="quick-app" data-app="terminal">
                    <div class="icon icon-terminal small-icon"></div>
                    <div class="quick-app-label">Terminal</div>
                </div>
                <div class="quick-app" data-app="browser">
                    <div class="icon icon-browser small-icon"></div>
                    <div class="quick-app-label">Browser</div>
                </div>
            </div>
        `;
        
        // Add handle and content to panel
        controlPanel.appendChild(handle);
        controlPanel.appendChild(content);
        
        // Add panel to the DOM
        document.body.appendChild(controlPanel);
        
        // Add styles to document
        const style = document.createElement('style');
        style.textContent = `
            .control-panel {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(10px);
                color: white;
                z-index: 9999;
                transform: translateY(-100%);
                transition: transform 0.3s cubic-bezier(0.17, 0.84, 0.44, 1);
                border-radius: 0 0 15px 15px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            }
            
            .control-panel.open {
                transform: translateY(0);
            }
            
            .control-panel-handle {
                height: 5px;
                width: 40px;
                background-color: rgba(255, 255, 255, 0.5);
                border-radius: 3px;
                margin: 10px auto;
                cursor: pointer;
            }
            
            .control-panel-content {
                padding: 10px 20px 20px;
            }
            
            .control-panel-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
            }
            
            .control-toggle {
                width: 65px;
                height: 65px;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .control-toggle.active {
                background-color: var(--primary-color);
            }
            
            .control-toggle-icon {
                font-size: 24px;
                margin-bottom: 5px;
            }
            
            .control-toggle-label {
                font-size: 11px;
            }
            
            .control-panel-slider {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .slider-icon {
                font-size: 18px;
                margin-right: 10px;
                width: 20px;
            }
            
            .slider-value {
                margin-left: 10px;
                width: 40px;
                text-align: right;
            }
            
            .control-panel-slider input[type="range"] {
                flex: 1;
                height: 6px;
                -webkit-appearance: none;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 3px;
                outline: none;
            }
            
            .control-panel-slider input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
            }
            
            .control-panel-apps {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }
            
            .quick-app {
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
            }
            
            .small-icon {
                width: 40px;
                height: 40px;
                margin-bottom: 5px;
            }
            
            .quick-app-label {
                font-size: 11px;
            }
            
            /* Pull down overlay */
            .pull-indicator {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 30px;
                z-index: 9998;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
        
        // Add a pull indicator area at the top of the screen
        const pullIndicator = document.createElement('div');
        pullIndicator.className = 'pull-indicator';
        document.body.appendChild(pullIndicator);
        
        // Setup pull down gesture
        let touchStartY = 0;
        let touchEndY = 0;
        let currentPullDistance = 0;
        
        pullIndicator.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchEndY = touchStartY;
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
        
        pullIndicator.addEventListener('touchmove', (e) => {
            touchEndY = e.touches[0].clientY;
            currentPullDistance = Math.max(0, touchEndY - touchStartY);
            
            if (currentPullDistance > 0) {
                controlPanel.style.transform = `translateY(-${Math.max(0, 100 - currentPullDistance)}%)`;
                e.preventDefault();
            }
        });
        
        pullIndicator.addEventListener('touchend', () => {
            document.body.style.overflow = '';
            
            if (currentPullDistance > 50) {
                // If pulled down more than 50px, open the panel
                this.openPanel();
            } else {
                // Otherwise close it
                this.closePanel();
            }
            
            currentPullDistance = 0;
        });
        
        // Alternative click to open
        pullIndicator.addEventListener('click', () => {
            this.togglePanel();
        });
        
        // Click handle to close
        handle.addEventListener('click', () => {
            this.closePanel();
        });
        
        // Setup toggle controls
        document.getElementById('network-toggle').addEventListener('click', () => {
            this.toggleNetwork();
        });
        
        const bluetoothToggle = document.getElementById('bluetooth-toggle');
        const airplaneToggle = document.getElementById('airplane-toggle');
        const locationToggle = document.getElementById('location-toggle');
        
        // Basic toggle functionality (these don't affect anything yet)
        [bluetoothToggle, airplaneToggle, locationToggle].forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
            });
        });
        
        // Setup sliders
        document.getElementById('brightness-slider').addEventListener('input', (e) => {
            this.setBrightness(e.target.value);
        });
        
        document.getElementById('volume-slider').addEventListener('input', (e) => {
            this.setVolume(e.target.value);
        });
        
        // Setup quick app launchers
        document.querySelectorAll('.quick-app').forEach(appButton => {
            appButton.addEventListener('click', () => {
                const appName = appButton.dataset.app;
                if (window.openApp && typeof window.openApp === 'function') {
                    this.closePanel();
                    setTimeout(() => {
                        window.openApp(appName);
                    }, 300);
                }
            });
        });
        
        this.isInitialized = true;
    },
    
    // Open the control panel
    openPanel: function() {
        if (!this.isInitialized) this.init();
        
        const panel = document.getElementById('control-panel');
        panel.classList.add('open');
        this.isOpen = true;
    },
    
    // Close the control panel
    closePanel: function() {
        if (!this.isInitialized) return;
        
        const panel = document.getElementById('control-panel');
        panel.style.transform = '';
        panel.classList.remove('open');
        this.isOpen = false;
    },
    
    // Toggle the control panel
    togglePanel: function() {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    },
    
    // Toggle network
    toggleNetwork: function() {
        this.networkEnabled = !this.networkEnabled;
        const networkToggle = document.getElementById('network-toggle');
        
        if (this.networkEnabled) {
            networkToggle.classList.add('active');
        } else {
            networkToggle.classList.remove('active');
        }
        
        // Apply network status change
        document.documentElement.style.setProperty('--network-status', this.networkEnabled ? 'online' : 'offline');
        
        // Dispatch an event that other apps can listen to
        const event = new CustomEvent('network-status-change', { 
            detail: { enabled: this.networkEnabled } 
        });
        document.dispatchEvent(event);
    },
    
    // Set brightness
    setBrightness: function(value) {
        this.brightness = value;
        document.querySelector('#brightness-slider + .slider-value').textContent = `${value}%`;
        
        // Apply brightness effect to the whole OS
        document.documentElement.style.filter = `brightness(${value}%)`;
    },
    
    // Set volume
    setVolume: function(value) {
        this.volume = value;
        document.querySelector('#volume-slider + .slider-value').textContent = `${value}%`;
        
        // We could apply this to any audio elements if needed
        document.querySelectorAll('audio').forEach(audio => {
            audio.volume = value / 100;
        });
    }
}; 