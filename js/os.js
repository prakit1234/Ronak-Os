document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const lockScreen = document.getElementById('lockScreen');
    const osInterface = document.getElementById('osInterface');
    const passwordInput = document.getElementById('passwordInput');
    const unlockButton = document.getElementById('unlockButton');
    const currentTimeElement = document.getElementById('currentTime');
    const dockItems = document.querySelectorAll('.dock-item');
    const appWindows = document.getElementById('appWindows');
    const desktop = document.getElementById('desktop');

    // Constants
    const PASSWORD = '1234'; // Simple default password
    let activeWindow = null;
    let zIndex = 100;

    // Desktop icons data
    const desktopIcons = [
        { name: 'Files', iconClass: 'icon-files', app: 'files' },
        { name: 'Terminal', iconClass: 'icon-terminal', app: 'terminal' },
        { name: 'Browser', iconClass: 'icon-browser', app: 'browser' },
        { name: 'Games', iconClass: 'icon-games', app: 'games' },
        { name: 'Messages', iconClass: 'icon-messages', app: 'messages' },
        { name: 'Settings', iconClass: 'icon-settings', app: 'settings' },
        { name: 'Documents', iconClass: 'icon-folder', app: 'files', params: { path: '/home/user/Documents' } },
        { name: 'Pictures', iconClass: 'icon-folder', app: 'files', params: { path: '/home/user/Pictures' } }
    ];

    // Initialize the OS
    init();

    function init() {
        // Initialize file system first
        if (window.fileSystem && typeof window.fileSystem.init === 'function') {
            window.fileSystem.init();
        }
        
        // Initialize control panel
        if (window.controlPanel && typeof window.controlPanel.init === 'function') {
            window.controlPanel.init();
        }
        
        renderDesktopIcons();
        setupEventListeners();
        updateClock();
        setInterval(updateClock, 60000); // Update clock every minute
        
        // Add credit in console
        console.log("%c RonakOS v1.0 ", "background: #E95420; color: white; font-size: 14px; padding: 5px; border-radius: 3px;");
        console.log("%c Made by Prakit Chetia (Kai) ", "background: #333; color: white; font-size: 12px; padding: 3px;");
    }

    function renderDesktopIcons() {
        desktopIcons.forEach(icon => {
            const iconElement = document.createElement('div');
            iconElement.className = 'desktop-icon';
            iconElement.dataset.app = icon.app;
            if (icon.params) {
                iconElement.dataset.params = JSON.stringify(icon.params);
            }

            iconElement.innerHTML = `
                <div class="icon ${icon.iconClass}"></div>
                <p class="desktop-icon-text">${icon.name}</p>
            `;

            desktop.appendChild(iconElement);
        });

        // Add desktop icon click event
        const desktopIconElements = document.querySelectorAll('.desktop-icon');
        desktopIconElements.forEach(icon => {
            icon.addEventListener('dblclick', () => {
                const app = icon.dataset.app;
                const params = icon.dataset.params ? JSON.parse(icon.dataset.params) : {};
                
                // Add bounce animation before opening
                const iconEl = icon.querySelector('.icon');
                iconEl.classList.add('animate-bounce');
                
                // Open app after short delay for animation
                setTimeout(() => {
                    openApp(app, params);
                    iconEl.classList.remove('animate-bounce');
                }, 300);
            });
        });
    }

    function setupEventListeners() {
        // Unlock screen
        unlockButton.addEventListener('click', tryUnlock);
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                tryUnlock();
            }
        });

        // Dock app launching
        dockItems.forEach(item => {
            item.addEventListener('click', () => {
                const app = item.dataset.app;
                
                // Add bounce animation
                const iconEl = item.querySelector('.icon');
                iconEl.classList.add('animate-bounce');
                
                // Open app after short delay for animation
                setTimeout(() => {
                    openApp(app);
                    iconEl.classList.remove('animate-bounce');
                }, 300);
            });
        });

        // Window focus management
        document.addEventListener('mousedown', (e) => {
            const windowElement = e.target.closest('.app-window');
            if (windowElement) {
                focusWindow(windowElement);
            } else {
                // Clicked outside of any window
                if (activeWindow) {
                    activeWindow.classList.remove('active');
                    activeWindow = null;
                }
            }
        });
        
        // Pull down to reveal control panel with keyboard
        document.addEventListener('keydown', (e) => {
            // Alt+Down Arrow to open control panel
            if (e.altKey && e.key === 'ArrowDown' && window.controlPanel) {
                window.controlPanel.openPanel();
                e.preventDefault();
            }
            
            // Escape to close control panel
            if (e.key === 'Escape' && window.controlPanel && window.controlPanel.isOpen) {
                window.controlPanel.closePanel();
                e.preventDefault();
            }
        });
    }

    function tryUnlock() {
        if (passwordInput.value === PASSWORD) {
            lockScreen.classList.add('hidden');
            osInterface.classList.remove('hidden');
            passwordInput.value = '';
        } else {
            passwordInput.style.borderColor = 'red';
            passwordInput.classList.add('shake-animation');
            setTimeout(() => {
                passwordInput.style.borderColor = '';
                passwordInput.classList.remove('shake-animation');
            }, 1500);
        }
    }

    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        currentTimeElement.textContent = `${hours}:${minutes}`;
    }

    function openApp(appName, params = {}) {
        // Check if app is already open
        const existingApp = document.querySelector(`.app-window[data-app="${appName}"]`);
        if (existingApp) {
            focusWindow(existingApp);
            return;
        }

        // Create new window
        const appWindow = document.createElement('div');
        appWindow.className = 'app-window app-opening';
        appWindow.dataset.app = appName;
        appWindow.style.width = getAppDefaultSize(appName).width;
        appWindow.style.height = getAppDefaultSize(appName).height;
        appWindow.style.left = '50%';
        appWindow.style.top = '50%';
        appWindow.style.transform = 'translate(-50%, -50%)';
        
        // Generate window header
        const appTitle = getAppTitle(appName);
        appWindow.innerHTML = `
            <div class="window-header">
                <div class="window-title">${appTitle}</div>
                <div class="window-controls">
                    <div class="control-button minimize"></div>
                    <div class="control-button maximize"></div>
                    <div class="control-button close"></div>
                </div>
            </div>
            <div class="window-content" id="${appName}-content">
                <div class="loading-spinner"></div>
            </div>
        `;
        
        appWindows.appendChild(appWindow);
        focusWindow(appWindow);
        
        // Load app content with small delay to show loading animation
        setTimeout(() => {
            loadAppContent(appName, params);
            appWindow.classList.remove('app-opening');
        }, 500);
        
        // Setup window controls
        setupWindowControls(appWindow);
        
        // Make window draggable
        makeWindowDraggable(appWindow);
        
        // Make this function available globally
        window.openApp = openApp;
    }

    function getAppTitle(appName) {
        const titles = {
            'files': 'File Explorer',
            'terminal': 'Terminal',
            'browser': 'Web Browser',
            'games': 'Games',
            'settings': 'Settings',
            'messages': 'Messages'
        };
        return titles[appName] || 'Application';
    }
    
    function getAppDefaultSize(appName) {
        const sizes = {
            'files': { width: '700px', height: '500px' },
            'terminal': { width: '600px', height: '400px' },
            'browser': { width: '800px', height: '600px' },
            'games': { width: '800px', height: '600px' },
            'settings': { width: '700px', height: '550px' },
            'messages': { width: '800px', height: '550px' }
        };
        return sizes[appName] || { width: '600px', height: '400px' };
    }

    function loadAppContent(appName, params) {
        const contentElement = document.getElementById(`${appName}-content`);
        
        switch(appName) {
            case 'files':
                // File explorer app will handle this in its own script
                if (window.fileExplorer && typeof window.fileExplorer.init === 'function') {
                    window.fileExplorer.init(contentElement, params);
                } else {
                    contentElement.innerHTML = '<p>File Explorer is loading...</p>';
                }
                break;
                
            case 'terminal':
                // Terminal app will handle this in its own script
                if (window.terminal && typeof window.terminal.init === 'function') {
                    window.terminal.init(contentElement);
                } else {
                    contentElement.innerHTML = '<p>Terminal is loading...</p>';
                }
                break;
                
            case 'browser':
                // Browser app will handle this in its own script
                if (window.browser && typeof window.browser.init === 'function') {
                    window.browser.init(contentElement);
                } else {
                    contentElement.innerHTML = '<p>Web Browser is loading...</p>';
                }
                break;
                
            case 'games':
                // Games app will handle this in its own script
                if (window.games && typeof window.games.init === 'function') {
                    window.games.init(contentElement);
                } else {
                    contentElement.innerHTML = '<p>Games are loading...</p>';
                }
                break;
                
            case 'settings':
                // Settings app will handle this in its own script
                if (window.settings && typeof window.settings.init === 'function') {
                    window.settings.init(contentElement);
                } else {
                    contentElement.innerHTML = '<p>Settings are loading...</p>';
                }
                break;
                
            case 'messages':
                // Messages app will handle this in its own script
                if (window.messages && typeof window.messages.init === 'function') {
                    window.messages.init(contentElement);
                } else {
                    contentElement.innerHTML = '<p>Messages are loading...</p>';
                }
                break;
                
            default:
                contentElement.innerHTML = '<p>App not found</p>';
        }
    }

    function setupWindowControls(windowElement) {
        const closeButton = windowElement.querySelector('.control-button.close');
        const minimizeButton = windowElement.querySelector('.control-button.minimize');
        const maximizeButton = windowElement.querySelector('.control-button.maximize');
        
        closeButton.addEventListener('click', () => {
            // Add closing animation
            windowElement.classList.add('app-closing');
            setTimeout(() => {
                windowElement.remove();
                if (activeWindow === windowElement) {
                    activeWindow = null;
                }
            }, 300);
        });
        
        minimizeButton.addEventListener('click', () => {
            windowElement.classList.add('minimized');
            // Add animation class
            windowElement.classList.add('minimize-animation');
            
            // After animation completes, hide the window
            setTimeout(() => {
                windowElement.style.display = 'none';
                windowElement.classList.remove('minimize-animation');
                windowElement.classList.remove('active');
                if (activeWindow === windowElement) {
                    activeWindow = null;
                }
            }, 300);
            
            // Add to taskbar (simplified version - just re-opens the window)
            const appName = windowElement.dataset.app;
            const taskbarItem = document.querySelector(`.dock-item[data-app="${appName}"]`);
            if (taskbarItem) {
                taskbarItem.classList.add('has-minimized-window');
                
                // Click event to restore the window
                const restoreHandler = () => {
                    windowElement.style.display = 'block';
                    windowElement.classList.remove('minimized');
                    focusWindow(windowElement);
                    taskbarItem.classList.remove('has-minimized-window');
                    taskbarItem.removeEventListener('click', restoreHandler);
                };
                
                taskbarItem.addEventListener('click', restoreHandler);
            }
        });
        
        maximizeButton.addEventListener('click', () => {
            windowElement.classList.toggle('maximized');
            if (windowElement.classList.contains('maximized')) {
                // Save original position and size for restore
                windowElement.dataset.originalWidth = windowElement.style.width;
                windowElement.dataset.originalHeight = windowElement.style.height;
                windowElement.dataset.originalLeft = windowElement.style.left;
                windowElement.dataset.originalTop = windowElement.style.top;
                
                // Maximize
                windowElement.style.width = '100%';
                windowElement.style.height = 'calc(100% - 30px)';
                windowElement.style.left = '0';
                windowElement.style.top = '30px';
                windowElement.style.transform = 'none';
            } else {
                // Restore original position and size
                windowElement.style.width = windowElement.dataset.originalWidth;
                windowElement.style.height = windowElement.dataset.originalHeight;
                windowElement.style.left = windowElement.dataset.originalLeft;
                windowElement.style.top = windowElement.dataset.originalTop;
                windowElement.style.transform = 'none';
            }
        });
    }

    function makeWindowDraggable(windowElement) {
        const header = windowElement.querySelector('.window-header');
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', startDrag);
        
        function startDrag(e) {
            // Only if not maximized and not clicking on controls
            if (windowElement.classList.contains('maximized') || 
                e.target.closest('.window-controls')) {
                return;
            }
            
            isDragging = true;
            focusWindow(windowElement);
            
            // Get the cursor position relative to the window
            const rect = windowElement.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            
            header.style.cursor = 'grabbing';
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            windowElement.style.left = `${e.clientX - offsetX}px`;
            windowElement.style.top = `${e.clientY - offsetY}px`;
            windowElement.style.transform = 'none';
        }
        
        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
            header.style.cursor = '';
        }
    }

    function focusWindow(windowElement) {
        if (activeWindow) {
            activeWindow.classList.remove('active');
        }
        
        activeWindow = windowElement;
        windowElement.classList.add('active');
        
        // Bring to front
        zIndex++;
        windowElement.style.zIndex = zIndex;
    }
}); 