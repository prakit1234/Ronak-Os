// File Explorer App for RonakOS
// Integrated with the file system module
window.fileExplorer = {
    container: null,
    currentPath: '/home/user',

    // Initialize the file explorer
    init: function(containerElement, params = {}) {
        this.container = containerElement;
        
        // If we have the fileSystem global, reset the current path
        if (window.fileSystem) {
            this.currentPath = window.fileSystem.getCurrentPath();
        }

        // If path parameter is provided, navigate to that path
        if (params.path) {
            this.currentPath = params.path;
        }

        this.render();
    },
    
    // Navigate to a specific folder path
    navigateToPath: function(path) {
        if (window.fileSystem && window.fileSystem.getDirectoryAt(path)) {
            this.currentPath = path;
            this.render();
            return true;
        }
        return false;
    },

    // Navigate to a folder relative to current path
    navigateTo: function(folderName) {
        if (folderName === '..') {
            this.navigateUp();
            return;
        }

        let newPath = this.currentPath === '/' ? 
            '/' + folderName : 
            this.currentPath + '/' + folderName;
            
        if (window.fileSystem && window.fileSystem.getDirectoryAt(newPath)) {
            this.currentPath = newPath;
            this.render();
        }
    },

    // Navigate up one level
    navigateUp: function() {
        if (this.currentPath !== '/') {
            const lastSlash = this.currentPath.lastIndexOf('/');
            if (lastSlash === 0) {
                this.currentPath = '/';
            } else {
                this.currentPath = this.currentPath.substring(0, lastSlash);
            }
            this.render();
        }
    },

    // Open a file
    openFile: function(fileName) {
        const filePath = this.currentPath === '/' ? 
            '/' + fileName : 
            this.currentPath + '/' + fileName;
            
        if (window.fileSystem) {
            const fileContent = window.fileSystem.readFile(filePath);
            if (fileContent !== null) {
                // Create a modal to display file content
                const fileViewer = document.createElement('div');
                fileViewer.className = 'file-viewer';
                
                // Determine the file type for appropriate rendering
                const fileType = window.fileSystem.getFileType(fileName);
                let contentHtml;
                
                if (fileType === 'image') {
                    // For image files (simulated)
                    contentHtml = `<div class="image-placeholder">
                        <p>Image preview would be shown here</p>
                        <p>${fileName}</p>
                    </div>`;
                } else if (fileType === 'markdown') {
                    // For markdown files - simple markdown rendering
                    contentHtml = `<div class="markdown-content">
                        ${this.renderMarkdown(fileContent)}
                    </div>`;
                } else {
                    // For text files and other types
                    contentHtml = `<pre class="font-jetbrains">${fileContent}</pre>`;
                }
                
                fileViewer.innerHTML = `
                    <div class="file-viewer-content">
                        <div class="file-viewer-header">
                            <h3 class="font-ubuntu">${fileName}</h3>
                            <button class="close-viewer font-ubuntu">Close</button>
                        </div>
                        <div class="file-content">
                            ${contentHtml}
                        </div>
                    </div>
                `;
                
                this.container.appendChild(fileViewer);
                
                // Add event listener to close button
                const closeButton = fileViewer.querySelector('.close-viewer');
                closeButton.addEventListener('click', () => {
                    fileViewer.remove();
                });
            }
        }
    },
    
    // Simple Markdown renderer
    renderMarkdown: function(text) {
        // Replace headers
        text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        
        // Replace bold
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Replace italic
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Replace links
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
        
        // Replace lists
        text = text.replace(/^\- (.*$)/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
        
        // Replace paragraphs
        text = text.replace(/^(?!<[a-z].*>)(.*$)/gm, '<p>$1</p>');
        
        return text;
    },

    // Create a new folder
    createFolder: function() {
        const folderName = prompt('Enter folder name:');
        if (folderName && window.fileSystem) {
            const path = this.currentPath === '/' ? 
                '/' + folderName : 
                this.currentPath + '/' + folderName;
                
            if (window.fileSystem.createDirectory(path)) {
                this.render();
            } else {
                alert('Could not create folder. It may already exist.');
            }
        }
    },
    
    // Create a new file
    createFile: function() {
        const fileName = prompt('Enter file name:');
        if (fileName && window.fileSystem) {
            const path = this.currentPath === '/' ? 
                '/' + fileName : 
                this.currentPath + '/' + fileName;
                
            if (window.fileSystem.createFile(path, '')) {
                this.render();
            } else {
                alert('Could not create file. It may already exist.');
            }
        }
    },
    
    // Delete a file or folder
    deleteItem: function(name, type) {
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
            const path = this.currentPath === '/' ? 
                '/' + name : 
                this.currentPath + '/' + name;
                
            if (window.fileSystem && window.fileSystem.delete(path)) {
                this.render();
            } else {
                alert(`Could not delete ${type}.`);
            }
        }
    },

    // Get the file icon class based on file name
    getFileIconClass: function(fileName) {
        if (!fileName) return 'icon-file';
        
        // If we have the fileSystem use its function
        if (window.fileSystem) {
            const fileType = window.fileSystem.getFileType(fileName);
            switch (fileType) {
                case 'text':
                case 'markdown':
                    return 'icon-doc';
                case 'image':
                    return 'icon-image';
                case 'audio':
                case 'video':
                    return 'icon-file';
                case 'pdf':
                case 'document':
                case 'spreadsheet':
                case 'presentation':
                    return 'icon-doc';
                default:
                    return 'icon-file';
            }
        }
        
        const extension = fileName.split('.').pop().toLowerCase();
        
        // Simple mapping based on extension
        switch (extension) {
            case 'txt':
            case 'md':
            case 'doc':
            case 'docx':
            case 'pdf':
                return 'icon-doc';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'bmp':
                return 'icon-image';
            default:
                return 'icon-file';
        }
    },

    // Get the file type based on file name
    getFileType: function(fileName) {
        if (!fileName) return 'File';
        
        // If we have the fileSystem use its function
        if (window.fileSystem) {
            const fileType = window.fileSystem.getFileType(fileName);
            
            // Convert technical type to user-friendly display
            switch (fileType) {
                case 'text': return 'Text File';
                case 'markdown': return 'Markdown';
                case 'image': return 'Image';
                case 'audio': return 'Audio';
                case 'video': return 'Video';
                case 'pdf': return 'PDF';
                case 'document': return 'Document';
                case 'spreadsheet': return 'Spreadsheet';
                case 'presentation': return 'Presentation';
                case 'archive': return 'Archive';
                case 'executable': return 'Application';
                case 'script': return 'Script';
                default: return 'File';
            }
        }
        
        const extension = fileName.split('.').pop().toLowerCase();
        
        // Simple mapping based on extension
        switch (extension) {
            case 'txt': return 'Text File';
            case 'md': return 'Markdown';
            case 'doc':
            case 'docx': return 'Document';
            case 'pdf': return 'PDF';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif': return 'Image';
            case 'mp3':
            case 'wav': return 'Audio';
            case 'mp4':
            case 'avi': return 'Video';
            default: return 'File';
        }
    },

    // Format the path for display
    formatPathForDisplay: function(path) {
        if (!path) return '/';
        
        const parts = path.split('/').filter(p => p.length > 0);
        if (parts.length === 0) return '/';
        
        return '/ ' + parts.join(' / ');
    },

    // Render the file explorer
    render: function() {
        if (!this.container) return;
        
        // Get current directory contents from file system
        let items = [];
        if (window.fileSystem) {
            items = window.fileSystem.listDirectory(this.currentPath);
        }

        // Create the explorer UI
        let html = `
            <div class="file-explorer font-ubuntu">
                <div class="explorer-toolbar">
                    <button id="back-button" class="explorer-button font-ubuntu">
                        <span class="button-icon">←</span> Back
                    </button>
                    <div class="path-bar font-ubuntu font-medium">${this.formatPathForDisplay(this.currentPath)}</div>
                    <div class="explorer-actions">
                        <button id="new-folder-button" class="explorer-button font-ubuntu">New Folder</button>
                        <button id="new-file-button" class="explorer-button font-ubuntu">New File</button>
                    </div>
                </div>
                <div class="explorer-content">
                    <table class="file-list">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Size</th>
                                <th>Modified</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        // Add parent directory entry if not in root
        if (this.currentPath !== '/') {
            html += `
                <tr class="folder-item animate-hover" data-name="..">
                    <td><div class="icon icon-folder small-icon"></div> ..</td>
                    <td>Folder</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                </tr>
            `;
        }

        // Add folders first
        const folders = items.filter(item => item.type === 'directory');
        folders.forEach(folder => {
            html += `
                <tr class="folder-item animate-hover" data-name="${folder.name}">
                    <td><div class="icon icon-folder small-icon"></div> ${folder.name}</td>
                    <td>Folder</td>
                    <td>--</td>
                    <td>${folder.modified || '--'}</td>
                    <td>
                        <button class="delete-btn" data-name="${folder.name}" data-type="folder">Delete</button>
                    </td>
                </tr>
            `;
        });

        // Then add files
        const files = items.filter(item => item.type === 'file');
        files.forEach(file => {
            const fileIconClass = this.getFileIconClass(file.name);
            html += `
                <tr class="file-item animate-hover" data-name="${file.name}">
                    <td><div class="icon ${fileIconClass} small-icon"></div> ${file.name}</td>
                    <td>${this.getFileType(file.name)}</td>
                    <td>${file.size || '--'}</td>
                    <td>${file.modified || '--'}</td>
                    <td>
                        <button class="delete-btn" data-name="${file.name}" data-type="file">Delete</button>
                    </td>
                </tr>
            `;
        });

        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        this.container.innerHTML = html;

        // Add custom styles for the file explorer
        const style = document.createElement('style');
        style.textContent = `
            .file-explorer {
                display: flex;
                flex-direction: column;
                height: 100%;
                background-color: #f9f9f9;
            }
            
            .explorer-toolbar {
                display: flex;
                align-items: center;
                padding: 10px;
                background-color: #e9e9e9;
                border-bottom: 1px solid #ddd;
            }
            
            .explorer-button {
                padding: 5px 10px;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 3px;
                margin-right: 10px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .explorer-button:hover {
                background-color: #f0f0f0;
            }
            
            .path-bar {
                flex: 1;
                padding: 5px 10px;
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 3px;
                margin-right: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .explorer-actions {
                display: flex;
                gap: 5px;
            }
            
            .explorer-content {
                flex: 1;
                overflow: auto;
                padding: 10px;
            }
            
            .file-list {
                width: 100%;
                border-collapse: collapse;
            }
            
            .file-list th {
                text-align: left;
                padding: 8px;
                background-color: #e9e9e9;
                border-bottom: 1px solid #ddd;
            }
            
            .file-list td {
                padding: 8px;
                border-bottom: 1px solid #eee;
            }
            
            .folder-item td:first-child,
            .file-item td:first-child {
                cursor: pointer;
            }
            
            .small-icon {
                width: 24px;
                height: 24px;
                display: inline-block;
                vertical-align: middle;
                margin-right: 8px;
            }
            
            .animate-hover {
                transition: background-color 0.2s;
            }
            
            .animate-hover:hover {
                background-color: rgba(233, 84, 32, 0.1);
            }
            
            .delete-btn {
                padding: 3px 8px;
                background-color: #ff6347;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            
            .delete-btn:hover {
                opacity: 1;
            }
            
            .file-viewer {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10;
            }
            
            .file-viewer-content {
                width: 80%;
                height: 80%;
                background-color: white;
                border-radius: 5px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                animation: fadeIn 0.3s ease;
            }
            
            .file-viewer-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background-color: #f0f0f0;
                border-bottom: 1px solid #ddd;
            }
            
            .file-viewer-header h3 {
                margin: 0;
            }
            
            .close-viewer {
                padding: 5px 10px;
                background-color: #e9542c;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            }
            
            .file-content {
                flex: 1;
                overflow: auto;
                padding: 15px;
            }
            
            .file-content pre {
                margin: 0;
                white-space: pre-wrap;
            }
            
            .image-placeholder {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;
                background-color: #f5f5f5;
                color: #666;
                text-align: center;
            }
            
            .markdown-content {
                padding: 20px;
                line-height: 1.6;
                color: #333;
            }
            
            .markdown-content h1, 
            .markdown-content h2, 
            .markdown-content h3 {
                color: #e9542c;
                margin-top: 0;
            }
            
            .markdown-content ul {
                margin-left: 20px;
                padding-left: 20px;
            }
            
            .markdown-content p {
                margin-bottom: 16px;
            }
        `;
        this.container.appendChild(style);

        // Setup event listeners
        this.setupEventListeners();
    },

    // Setup event listeners for file explorer interactions
    setupEventListeners: function() {
        const backButton = this.container.querySelector('#back-button');
        const newFolderButton = this.container.querySelector('#new-folder-button');
        const newFileButton = this.container.querySelector('#new-file-button');
        const folderItems = this.container.querySelectorAll('.folder-item td:first-child');
        const fileItems = this.container.querySelectorAll('.file-item td:first-child');
        const deleteButtons = this.container.querySelectorAll('.delete-btn');

        // Back button
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.navigateUp();
            });
        }

        // New folder button
        if (newFolderButton) {
            newFolderButton.addEventListener('click', () => {
                this.createFolder();
            });
        }

        // New file button
        if (newFileButton) {
            newFileButton.addEventListener('click', () => {
                this.createFile();
            });
        }

        // Folder items
        folderItems.forEach(item => {
            item.addEventListener('click', () => {
                const folderName = item.parentElement.dataset.name;
                this.navigateTo(folderName);
            });
        });

        // File items
        fileItems.forEach(item => {
            item.addEventListener('click', () => {
                const fileName = item.parentElement.dataset.name;
                this.openFile(fileName);
            });
        });

        // Delete buttons
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const name = button.dataset.name;
                const type = button.dataset.type;
                this.deleteItem(name, type);
            });
        });
    }
}; 