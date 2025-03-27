// Settings App
window.settings = {
    container: null,
    currentSettings: {
        wallpaper: 'default.jpg',
        fontFamily: 'Ubuntu',
        fontSize: 'medium',
        iconSize: 'medium',
        theme: 'light',
        brightness: 100
    },
    
    // Available options
    options: {
        wallpapers: [
            { id: 'default.jpg', name: 'Default', thumbnail: 'assets/wallpapers/thumbs/default.jpg' },
            { id: 'ubuntu.jpg', name: 'Ubuntu', thumbnail: 'assets/wallpapers/thumbs/ubuntu.jpg' },
            { id: 'mountains.jpg', name: 'Mountains', thumbnail: 'assets/wallpapers/thumbs/mountains.jpg' },
            { id: 'space.jpg', name: 'Space', thumbnail: 'assets/wallpapers/thumbs/space.jpg' },
            { id: 'forest.jpg', name: 'Forest', thumbnail: 'assets/wallpapers/thumbs/forest.jpg' }
        ],
        fonts: [
            { id: 'Ubuntu', name: 'Ubuntu' },
            { id: 'Roboto', name: 'Roboto' },
            { id: 'Poppins', name: 'Poppins' },
            { id: 'Open Sans', name: 'Open Sans' }
        ],
        fontSizes: [
            { id: 'small', name: 'Small', value: '0.9rem' },
            { id: 'medium', name: 'Medium', value: '1rem' },
            { id: 'large', name: 'Large', value: '1.1rem' }
        ],
        iconSizes: [
            { id: 'small', name: 'Small', value: '32px' },
            { id: 'medium', name: 'Medium', value: '40px' },
            { id: 'large', name: 'Large', value: '48px' }
        ],
        themes: [
            { id: 'light', name: 'Light' },
            { id: 'dark', name: 'Dark' }
        ]
    },

    // Initialize settings
    init: function(containerElement) {
        this.container = containerElement;
        
        // Load saved settings from localStorage if available
        this.loadSettings();
        
        this.render();
    },
    
    // Load settings from localStorage
    loadSettings: function() {
        const savedSettings = localStorage.getItem('ronakos-settings');
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                this.currentSettings = { ...this.currentSettings, ...parsedSettings };
                
                // Apply settings immediately when loaded
                this.applySettings();
            } catch (e) {
                console.error('Failed to parse saved settings:', e);
            }
        }
    },
    
    // Save settings to localStorage
    saveSettings: function() {
        localStorage.setItem('ronakos-settings', JSON.stringify(this.currentSettings));
    },
    
    // Apply settings to the OS
    applySettings: function() {
        // Apply wallpaper
        document.querySelector('.os-interface').style.backgroundImage = `url('assets/wallpapers/${this.currentSettings.wallpaper}')`;
        
        // Apply font family
        document.documentElement.style.setProperty('--system-font', this.currentSettings.fontFamily);
        
        // Apply font size
        const fontSizeObj = this.options.fontSizes.find(size => size.id === this.currentSettings.fontSize);
        if (fontSizeObj) {
            document.documentElement.style.setProperty('--base-font-size', fontSizeObj.value);
        }
        
        // Apply icon size
        const iconSizeObj = this.options.iconSizes.find(size => size.id === this.currentSettings.iconSize);
        if (iconSizeObj) {
            document.documentElement.style.setProperty('--icon-size', iconSizeObj.value);
        }
        
        // Apply theme
        if (this.currentSettings.theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        
        // Apply brightness
        document.documentElement.style.setProperty('--screen-brightness', `${this.currentSettings.brightness}%`);
        
        // Save settings to localStorage
        this.saveSettings();
    },
    
    // Handle settings changes
    handleSettingChange: function(setting, value) {
        this.currentSettings[setting] = value;
        this.applySettings();
        
        // Re-render the settings UI to reflect changes
        this.render();
    },
    
    // Render the settings app
    render: function() {
        if (!this.container) return;
        
        const html = `
            <div class="settings-app font-ubuntu">
                <div class="settings-sidebar">
                    <div class="settings-nav-item active" data-section="appearance">
                        <span class="settings-icon">🎨</span>
                        <span class="settings-nav-text">Appearance</span>
                    </div>
                    <div class="settings-nav-item" data-section="display">
                        <span class="settings-icon">🖥️</span>
                        <span class="settings-nav-text">Display</span>
                    </div>
                    <div class="settings-nav-item" data-section="system">
                        <span class="settings-icon">⚙️</span>
                        <span class="settings-nav-text">System</span>
                    </div>
                    <div class="settings-nav-item" data-section="about">
                        <span class="settings-icon">ℹ️</span>
                        <span class="settings-nav-text">About</span>
                    </div>
                </div>
                <div class="settings-content">
                    <div class="settings-section active" id="appearance-section">
                        <h2>Appearance</h2>
                        
                        <div class="settings-group">
                            <h3>Wallpaper</h3>
                            <div class="wallpaper-grid">
                                ${this.options.wallpapers.map(wp => `
                                    <div class="wallpaper-item ${this.currentSettings.wallpaper === wp.id ? 'selected' : ''}" 
                                         data-wallpaper="${wp.id}">
                                        <div class="wallpaper-thumbnail" style="background-image: url('${wp.thumbnail}')"></div>
                                        <div class="wallpaper-name">${wp.name}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Theme</h3>
                            <div class="setting-options">
                                ${this.options.themes.map(theme => `
                                    <label class="setting-option-radio">
                                        <input type="radio" name="theme" value="${theme.id}" 
                                               ${this.currentSettings.theme === theme.id ? 'checked' : ''}>
                                        <span class="option-label">${theme.name}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-section" id="display-section">
                        <h2>Display</h2>
                        
                        <div class="settings-group">
                            <h3>Font</h3>
                            <select id="font-family-select" class="settings-select">
                                ${this.options.fonts.map(font => `
                                    <option value="${font.id}" 
                                            ${this.currentSettings.fontFamily === font.id ? 'selected' : ''}>
                                        ${font.name}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Font Size</h3>
                            <div class="setting-options">
                                ${this.options.fontSizes.map(size => `
                                    <label class="setting-option-radio">
                                        <input type="radio" name="font-size" value="${size.id}" 
                                               ${this.currentSettings.fontSize === size.id ? 'checked' : ''}>
                                        <span class="option-label">${size.name}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Icon Size</h3>
                            <div class="setting-options">
                                ${this.options.iconSizes.map(size => `
                                    <label class="setting-option-radio">
                                        <input type="radio" name="icon-size" value="${size.id}" 
                                               ${this.currentSettings.iconSize === size.id ? 'checked' : ''}>
                                        <span class="option-label">${size.name}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Brightness</h3>
                            <div class="slider-container">
                                <input type="range" id="brightness-slider" min="30" max="100" step="5" 
                                       value="${this.currentSettings.brightness}">
                                <span class="slider-value">${this.currentSettings.brightness}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-section" id="system-section">
                        <h2>System</h2>
                        
                        <div class="settings-group">
                            <h3>System Information</h3>
                            <div class="info-item">
                                <span class="info-label">OS Name:</span>
                                <span class="info-value">RonakOS</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Version:</span>
                                <span class="info-value">1.0</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Memory:</span>
                                <span class="info-value">Virtual / Web Browser</span>
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Storage</h3>
                            <div class="storage-bar">
                                <div class="storage-used" style="width: 35%"></div>
                            </div>
                            <div class="storage-info">
                                <span>35% used - 650MB free of 1GB</span>
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Reset Settings</h3>
                            <button id="reset-settings-btn" class="settings-button">Reset to Default</button>
                        </div>
                    </div>
                    
                    <div class="settings-section" id="about-section">
                        <h2>About RonakOS</h2>
                        
                        <div class="about-logo">
                            <div class="icon icon-files" style="width: 80px; height: 80px;"></div>
                            <h3>RonakOS 1.0</h3>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Credits</h3>
                            <p>Designed and developed by Prakit Chetia (Kai)</p>
                            <p>A web-based operating system with Ubuntu-inspired UI</p>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Technologies</h3>
                            <ul class="tech-list">
                                <li>HTML5</li>
                                <li>CSS3</li>
                                <li>JavaScript</li>
                            </ul>
                        </div>
                        
                        <div class="settings-group">
                            <h3>Features</h3>
                            <ul class="feature-list">
                                <li>File Management System</li>
                                <li>Terminal with 30+ Commands</li>
                                <li>Web Browser</li>
                                <li>Games</li>
                                <li>Customizable Interface</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // Add custom styles
        const style = document.createElement('style');
        style.textContent = `
            .settings-app {
                display: flex;
                height: 100%;
                overflow: hidden;
                color: #333;
            }
            
            .settings-sidebar {
                width: 200px;
                background-color: #f5f5f5;
                border-right: 1px solid #ddd;
                padding: 20px 0;
            }
            
            .settings-nav-item {
                padding: 12px 15px;
                display: flex;
                align-items: center;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .settings-nav-item:hover {
                background-color: rgba(0, 0, 0, 0.05);
            }
            
            .settings-nav-item.active {
                background-color: rgba(233, 84, 32, 0.1);
                color: var(--primary-color);
                font-weight: 500;
            }
            
            .settings-icon {
                margin-right: 10px;
                font-size: 18px;
            }
            
            .settings-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }
            
            .settings-section {
                display: none;
                animation: fadeIn 0.3s ease;
            }
            
            .settings-section.active {
                display: block;
            }
            
            .settings-group {
                margin-bottom: 24px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
            }
            
            .settings-group:last-child {
                border-bottom: none;
            }
            
            .settings-group h3 {
                margin-bottom: 12px;
                color: #555;
            }
            
            .wallpaper-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            
            .wallpaper-item {
                cursor: pointer;
                border-radius: 8px;
                overflow: hidden;
                transition: transform 0.2s, box-shadow 0.2s;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            
            .wallpaper-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
            }
            
            .wallpaper-item.selected {
                box-shadow: 0 0 0 3px var(--primary-color);
            }
            
            .wallpaper-thumbnail {
                height: 80px;
                background-size: cover;
                background-position: center;
            }
            
            .wallpaper-name {
                padding: 8px;
                text-align: center;
                font-size: 12px;
                background-color: white;
            }
            
            .setting-options {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 10px;
            }
            
            .setting-option-radio {
                display: flex;
                align-items: center;
                cursor: pointer;
            }
            
            .settings-select {
                width: 100%;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ddd;
                margin-top: 8px;
            }
            
            .slider-container {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-top: 10px;
            }
            
            input[type="range"] {
                flex: 1;
                height: 6px;
                -webkit-appearance: none;
                background: #ddd;
                border-radius: 3px;
                outline: none;
            }
            
            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: var(--primary-color);
                cursor: pointer;
            }
            
            .slider-value {
                width: 40px;
                text-align: right;
            }
            
            .settings-button {
                padding: 8px 16px;
                background-color: #f0f0f0;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .settings-button:hover {
                background-color: #e0e0e0;
            }
            
            .info-item {
                margin-bottom: 8px;
                display: flex;
            }
            
            .info-label {
                font-weight: 500;
                width: 120px;
            }
            
            .storage-bar {
                height: 6px;
                background-color: #ddd;
                border-radius: 3px;
                overflow: hidden;
                margin: 10px 0;
            }
            
            .storage-used {
                height: 100%;
                background-color: var(--primary-color);
            }
            
            .storage-info {
                font-size: 12px;
                color: #666;
            }
            
            .about-logo {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .tech-list, .feature-list {
                margin-left: 20px;
                margin-top: 10px;
            }
            
            .tech-list li, .feature-list li {
                margin-bottom: 5px;
            }
        `;
        this.container.appendChild(style);
        
        // Setup event listeners
        this.setupEventListeners();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Navigation tabs
        const navItems = this.container.querySelectorAll('.settings-nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                
                // Update active nav item
                navItems.forEach(navItem => navItem.classList.remove('active'));
                item.classList.add('active');
                
                // Show the selected section
                const sections = this.container.querySelectorAll('.settings-section');
                sections.forEach(sectionEl => sectionEl.classList.remove('active'));
                this.container.querySelector(`#${section}-section`).classList.add('active');
            });
        });
        
        // Wallpaper selection
        const wallpaperItems = this.container.querySelectorAll('.wallpaper-item');
        wallpaperItems.forEach(item => {
            item.addEventListener('click', () => {
                const wallpaperId = item.dataset.wallpaper;
                this.handleSettingChange('wallpaper', wallpaperId);
            });
        });
        
        // Font family select
        const fontSelect = this.container.querySelector('#font-family-select');
        if (fontSelect) {
            fontSelect.addEventListener('change', () => {
                this.handleSettingChange('fontFamily', fontSelect.value);
            });
        }
        
        // Font size radio buttons
        const fontSizeRadios = this.container.querySelectorAll('input[name="font-size"]');
        fontSizeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    this.handleSettingChange('fontSize', radio.value);
                }
            });
        });
        
        // Icon size radio buttons
        const iconSizeRadios = this.container.querySelectorAll('input[name="icon-size"]');
        iconSizeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    this.handleSettingChange('iconSize', radio.value);
                }
            });
        });
        
        // Theme radio buttons
        const themeRadios = this.container.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    this.handleSettingChange('theme', radio.value);
                }
            });
        });
        
        // Brightness slider
        const brightnessSlider = this.container.querySelector('#brightness-slider');
        if (brightnessSlider) {
            brightnessSlider.addEventListener('input', () => {
                const brightnessValue = brightnessSlider.value;
                this.container.querySelector('.slider-value').textContent = `${brightnessValue}%`;
                this.handleSettingChange('brightness', brightnessValue);
            });
        }
        
        // Reset settings button
        const resetButton = this.container.querySelector('#reset-settings-btn');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                // Reset to default settings
                this.currentSettings = {
                    wallpaper: 'default.jpg',
                    fontFamily: 'Ubuntu',
                    fontSize: 'medium',
                    iconSize: 'medium',
                    theme: 'light',
                    brightness: 100
                };
                
                this.applySettings();
                this.render();
            });
        }
    }
}; 