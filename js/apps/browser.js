// Web Browser App
window.browser = {
    container: null,
    currentUrl: 'https://example.com',
    history: [],
    historyIndex: -1,
    bookmarks: [
        { name: 'Example', url: 'https://example.com' },
        { name: 'Google', url: 'https://www.google.com' },
        { name: 'GitHub', url: 'https://github.com' }
    ],

    // Initialize the browser
    init: function(containerElement) {
        this.container = containerElement;
        this.render();
    },

    // Render the browser
    render: function() {
        if (!this.container) return;

        // Create browser UI
        const browserHTML = `
            <div class="browser-container font-ubuntu">
                <div class="browser-toolbar">
                    <div class="browser-controls">
                        <button id="back-button" class="browser-button" ${this.history.length === 0 ? 'disabled' : ''}>
                            <span class="icon-back">←</span>
                        </button>
                        <button id="forward-button" class="browser-button" disabled>
                            <span class="icon-forward">→</span>
                        </button>
                        <button id="reload-button" class="browser-button">
                            <span class="icon-reload">↻</span>
                        </button>
                    </div>
                    <div class="url-bar">
                        <input type="text" id="url-input" value="${this.currentUrl}">
                        <button id="go-button" class="browser-button">Go</button>
                    </div>
                    <div class="browser-menu">
                        <button id="bookmark-button" class="browser-button">
                            <span class="icon-bookmark">★</span>
                        </button>
                        <button id="menu-button" class="browser-button">
                            <span class="icon-menu">≡</span>
                        </button>
                    </div>
                </div>
                <div class="bookmarks-bar" id="bookmarks-bar">
                    ${this.renderBookmarks()}
                </div>
                <div class="browser-content" id="browser-content">
                    ${this.renderWebPage(this.currentUrl)}
                </div>
            </div>
        `;

        this.container.innerHTML = browserHTML;
        
        // Add custom styles for browser
        const style = document.createElement('style');
        style.textContent = `
            .browser-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                background-color: #fff;
                border-radius: 4px;
                overflow: hidden;
            }
            
            .browser-toolbar {
                display: flex;
                align-items: center;
                padding: 8px;
                background-color: #f5f5f5;
                border-bottom: 1px solid #ddd;
            }
            
            .browser-controls {
                display: flex;
                gap: 5px;
                margin-right: 10px;
            }
            
            .url-bar {
                flex: 1;
                display: flex;
                align-items: center;
            }
            
            #url-input {
                flex: 1;
                padding: 6px 10px;
                border: 1px solid #ddd;
                border-radius: 20px;
                font-size: 14px;
                color: #333;
                background-color: #fff;
            }
            
            .browser-menu {
                display: flex;
                gap: 5px;
                margin-left: 10px;
            }
            
            .browser-button {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: none;
                background-color: transparent;
                color: #555;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .browser-button:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
            
            .browser-button:disabled {
                color: #ccc;
                cursor: not-allowed;
            }
            
            #go-button {
                border-radius: 4px;
                margin-left: 5px;
                width: auto;
                padding: 0 10px;
                background-color: #E95420;
                color: white;
            }
            
            .bookmarks-bar {
                display: flex;
                align-items: center;
                padding: 5px 10px;
                background-color: #f9f9f9;
                border-bottom: 1px solid #eee;
                overflow-x: auto;
                white-space: nowrap;
            }
            
            .bookmark-item {
                padding: 4px 8px;
                margin-right: 10px;
                border-radius: 4px;
                background-color: #fff;
                border: 1px solid #eee;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
                animation: fadeIn 0.3s ease;
            }
            
            .bookmark-item:hover {
                background-color: #f0f0f0;
                border-color: #ddd;
            }
            
            .browser-content {
                flex: 1;
                overflow: auto;
                padding: 15px;
                background-color: #fff;
            }
            
            .web-page {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                animation: fadeIn 0.5s ease;
            }
            
            .loading {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            /* Example Page Styles */
            .example-page {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                line-height: 1.6;
            }
            
            .example-page h1 {
                color: #333;
                margin-bottom: 20px;
            }
            
            .example-page p {
                margin-bottom: 15px;
                color: #555;
            }
            
            .example-page a {
                color: #0066cc;
                text-decoration: none;
            }
            
            .example-page a:hover {
                text-decoration: underline;
            }
        `;
        this.container.appendChild(style);
        
        // Setup event listeners
        this.setupEventListeners();
    },

    // Render bookmarks bar
    renderBookmarks: function() {
        let html = '';
        this.bookmarks.forEach((bookmark) => {
            html += `<div class="bookmark-item" data-url="${bookmark.url}">${bookmark.name}</div>`;
        });
        return html;
    },

    // Render different web pages based on URL
    renderWebPage: function(url) {
        if (url === 'https://example.com') {
            return `
                <div class="web-page example-page">
                    <h1>Example Domain</h1>
                    <p>This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.</p>
                    <p>This is a simulation of a real browser in our RonakOS web operating system. Try clicking the bookmarks or entering a different URL.</p>
                    <p><a href="https://www.google.com">Visit Google</a></p>
                </div>
            `;
        }
        else if (url === 'https://www.google.com') {
            return `
                <div class="web-page google-page">
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 90px; margin-bottom: 20px; color: #4285F4; font-weight: bold;">
                            <span style="color: #4285F4">G</span><span style="color: #EA4335">o</span><span style="color: #FBBC05">o</span><span style="color: #4285F4">g</span><span style="color: #34A853">l</span><span style="color: #EA4335">e</span>
                        </div>
                        <div style="max-width: 500px; margin: 0 auto;">
                            <input type="text" style="width: 100%; padding: 12px 20px; border-radius: 24px; border: 1px solid #dfe1e5; font-size: 16px; box-shadow: 0 1px 6px rgba(32,33,36,.28);">
                        </div>
                        <div style="margin-top: 20px;">
                            <button style="background-color: #f8f9fa; border: 1px solid #f8f9fa; border-radius: 4px; color: #3c4043; font-size: 14px; margin: 11px 4px; padding: 0 16px; line-height: 27px; height: 36px; cursor: pointer;">Google Search</button>
                            <button style="background-color: #f8f9fa; border: 1px solid #f8f9fa; border-radius: 4px; color: #3c4043; font-size: 14px; margin: 11px 4px; padding: 0 16px; line-height: 27px; height: 36px; cursor: pointer;">I'm Feeling Lucky</button>
                        </div>
                    </div>
                </div>
            `;
        }
        else if (url === 'https://github.com') {
            return `
                <div class="web-page github-page">
                    <div style="background-color: #24292e; color: white; padding: 16px; display: flex; align-items: center;">
                        <div style="font-size: 24px; margin-right: 15px;">
                            <svg height="32" viewBox="0 0 16 16" width="32" style="fill: white;">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                            </svg>
                        </div>
                        <div style="font-weight: bold;">GitHub</div>
                    </div>
                    <div style="padding: 20px;">
                        <h2 style="margin-bottom: 15px; color: #24292e;">Where the world builds software</h2>
                        <p style="margin-bottom: 20px; color: #586069;">Millions of developers and companies build, ship, and maintain their software on GitHub—the largest and most advanced development platform in the world.</p>
                        <button style="background-color: #2ea44f; color: white; padding: 5px 16px; border-radius: 6px; border: 1px solid rgba(27,31,35,.15);">Sign up for GitHub</button>
                    </div>
                </div>
            `;
        }
        else {
            return `
                <div class="web-page">
                    <h1>Website Not Found</h1>
                    <p>The URL "${url}" could not be loaded.</p>
                    <p>This is a simulated browser and can only access a few predefined pages.</p>
                    <p><a href="https://example.com">Return to Example.com</a></p>
                </div>
            `;
        }
    },

    // Navigate to a URL
    navigateTo: function(url) {
        // Show loading spinner
        const contentElement = document.getElementById('browser-content');
        contentElement.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
            </div>
        `;
        
        // Add current page to history if navigating to a new page
        if (this.currentUrl && this.currentUrl !== url) {
            // If we navigated back and now we're navigating to a new page,
            // remove all forward history
            if (this.historyIndex >= 0 && this.historyIndex < this.history.length - 1) {
                this.history = this.history.slice(0, this.historyIndex + 1);
            }
            
            this.history.push(this.currentUrl);
            this.historyIndex = this.history.length - 1;
        }
        
        // Update current URL
        this.currentUrl = url;
        
        // Update address bar
        const urlInput = document.getElementById('url-input');
        if (urlInput) {
            urlInput.value = url;
        }
        
        // Update back/forward buttons
        this.updateNavigationButtons();
        
        // Simulate loading delay
        setTimeout(() => {
            contentElement.innerHTML = this.renderWebPage(url);
            
            // Add click handlers for links
            const links = contentElement.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateTo(link.href);
                });
            });
        }, 500);
    },

    // Go back in browser history
    goBack: function() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.navigateTo(this.history[this.historyIndex]);
        }
    },

    // Go forward in browser history
    goForward: function() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.navigateTo(this.history[this.historyIndex]);
        }
    },

    // Update navigation buttons based on history
    updateNavigationButtons: function() {
        const backButton = document.getElementById('back-button');
        const forwardButton = document.getElementById('forward-button');
        
        if (backButton) {
            backButton.disabled = this.historyIndex <= 0;
        }
        
        if (forwardButton) {
            forwardButton.disabled = this.historyIndex >= this.history.length - 1;
        }
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Back button
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', () => this.goBack());
        }
        
        // Forward button
        const forwardButton = document.getElementById('forward-button');
        if (forwardButton) {
            forwardButton.addEventListener('click', () => this.goForward());
        }
        
        // Reload button
        const reloadButton = document.getElementById('reload-button');
        if (reloadButton) {
            reloadButton.addEventListener('click', () => this.navigateTo(this.currentUrl));
        }
        
        // URL input and Go button
        const urlInput = document.getElementById('url-input');
        const goButton = document.getElementById('go-button');
        
        if (urlInput && goButton) {
            // Navigate on Enter key
            urlInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.navigateTo(urlInput.value);
                }
            });
            
            // Navigate on Go button click
            goButton.addEventListener('click', () => {
                this.navigateTo(urlInput.value);
            });
        }
        
        // Bookmark items
        const bookmarkItems = document.querySelectorAll('.bookmark-item');
        bookmarkItems.forEach(item => {
            item.addEventListener('click', () => {
                const url = item.dataset.url;
                if (url) {
                    this.navigateTo(url);
                }
            });
        });
        
        // Bookmark button
        const bookmarkButton = document.getElementById('bookmark-button');
        if (bookmarkButton) {
            bookmarkButton.addEventListener('click', () => {
                // Simple implementation - just toggle bookmark bar visibility
                const bookmarksBar = document.getElementById('bookmarks-bar');
                bookmarksBar.style.display = bookmarksBar.style.display === 'none' ? 'flex' : 'none';
            });
        }
    }
}; 