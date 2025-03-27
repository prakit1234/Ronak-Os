// Enhanced File System for RonakOS
// Developed by Prakit Chetia (Kai)

window.fileSystem = {
    // Root structure of the file system
    root: {
        type: 'directory',
        name: '/',
        children: {
            'home': {
                type: 'directory',
                name: 'home',
                children: {
                    'user': {
                        type: 'directory',
                        name: 'user',
                        children: {
                            'Documents': {
                                type: 'directory',
                                name: 'Documents',
                                children: {
                                    'welcome.txt': {
                                        type: 'file',
                                        name: 'welcome.txt',
                                        content: 'Welcome to RonakOS!\n\nThis operating system was developed by Prakit Chetia (Kai).\n\nFeel free to explore the various applications and features available in this web-based Ubuntu-inspired OS.\n\nEnjoy your experience!',
                                        size: '224B',
                                        modified: '2023-05-10'
                                    },
                                    'getting-started.md': {
                                        type: 'file',
                                        name: 'getting-started.md',
                                        content: '# Getting Started with RonakOS\n\n## Applications\n- File Explorer: Browse and manage files\n- Terminal: Execute commands\n- Browser: Surf the web\n- Settings: Customize your experience\n- Games: Play games\n- Messages: Chat with contacts\n\n## Basic Commands\n- Try `help` in the terminal to see available commands\n- Use `ls` to list files and directories\n- Navigate with `cd` command\n\n## Customization\n- Open Settings to change wallpaper, fonts, and themes\n- Adjust brightness and network settings from the control panel\n\nEnjoy!',
                                        size: '512B',
                                        modified: '2023-05-15'
                                    }
                                }
                            },
                            'Pictures': {
                                type: 'directory',
                                name: 'Pictures',
                                children: {
                                    'wallpaper1.jpg': {
                                        type: 'file',
                                        name: 'wallpaper1.jpg',
                                        content: '[Image Data]',
                                        size: '1.2MB',
                                        modified: '2023-04-20'
                                    },
                                    'wallpaper2.jpg': {
                                        type: 'file',
                                        name: 'wallpaper2.jpg',
                                        content: '[Image Data]',
                                        size: '2.4MB',
                                        modified: '2023-04-20'
                                    }
                                }
                            },
                            'Music': {
                                type: 'directory',
                                name: 'Music',
                                children: {}
                            },
                            'Videos': {
                                type: 'directory',
                                name: 'Videos',
                                children: {}
                            },
                            'Downloads': {
                                type: 'directory',
                                name: 'Downloads',
                                children: {
                                    'sample.pdf': {
                                        type: 'file',
                                        name: 'sample.pdf',
                                        content: '[PDF Data]',
                                        size: '2.8MB',
                                        modified: '2023-05-01'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            'etc': {
                type: 'directory',
                name: 'etc',
                children: {
                    'hosts': {
                        type: 'file',
                        name: 'hosts',
                        content: '127.0.0.1 localhost\n192.168.1.1 router',
                        size: '36B',
                        modified: '2023-01-01'
                    },
                    'passwd': {
                        type: 'file',
                        name: 'passwd',
                        content: 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:User:/home/user:/bin/bash',
                        size: '82B',
                        modified: '2023-01-01'
                    }
                }
            },
            'var': {
                type: 'directory',
                name: 'var',
                children: {
                    'log': {
                        type: 'directory',
                        name: 'log',
                        children: {
                            'system.log': {
                                type: 'file',
                                name: 'system.log',
                                content: '2023-05-10 10:00:01 System started\n2023-05-10 10:00:05 Network service started\n2023-05-10 10:00:10 File system mounted',
                                size: '128B',
                                modified: '2023-05-10'
                            }
                        }
                    }
                }
            },
            'usr': {
                type: 'directory',
                name: 'usr',
                children: {
                    'share': {
                        type: 'directory',
                        name: 'share',
                        children: {
                            'doc': {
                                type: 'directory',
                                name: 'doc',
                                children: {
                                    'readme.txt': {
                                        type: 'file',
                                        name: 'readme.txt',
                                        content: 'RonakOS Documentation\n\nVersion 1.0\nDeveloped by Prakit Chetia (Kai)',
                                        size: '64B',
                                        modified: '2023-01-01'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    
    // Current working directory (path)
    currentPath: '/home/user',
    
    // Initialize the file system
    init: function() {
        // Try to load from localStorage if available
        this.loadFromStorage();
        
        // Create a root if it doesn't exist
        if (!this.root) {
            this.root = this.getDefaultFileSystem();
        }
        
        console.log('File system initialized');
    },
    
    // Get default file system (used if none exists in storage)
    getDefaultFileSystem: function() {
        return this.root; // Already defined above
    },
    
    // Save file system to localStorage
    saveToStorage: function() {
        try {
            localStorage.setItem('ronakos_filesystem', JSON.stringify(this.root));
            localStorage.setItem('ronakos_current_path', this.currentPath);
            return true;
        } catch (e) {
            console.error('Could not save file system to localStorage', e);
            return false;
        }
    },
    
    // Load file system from localStorage
    loadFromStorage: function() {
        try {
            const storedFS = localStorage.getItem('ronakos_filesystem');
            const storedPath = localStorage.getItem('ronakos_current_path');
            
            if (storedFS) {
                this.root = JSON.parse(storedFS);
            }
            
            if (storedPath) {
                this.currentPath = storedPath;
            }
            
            return true;
        } catch (e) {
            console.error('Could not load file system from localStorage', e);
            return false;
        }
    },
    
    // Get directory at path
    getDirectoryAt: function(path) {
        if (!path) path = this.currentPath;
        
        // Handle root path
        if (path === '/') return this.root;
        
        // Split path into components
        const components = path.split('/').filter(c => c.length > 0);
        let current = this.root;
        
        // Traverse the path
        for (let i = 0; i < components.length; i++) {
            if (!current.children || !current.children[components[i]]) {
                return null; // Path doesn't exist
            }
            current = current.children[components[i]];
        }
        
        return current.type === 'directory' ? current : null;
    },
    
    // Get file at path
    getFileAt: function(path) {
        if (!path) return null;
        
        // Split path into components
        const components = path.split('/').filter(c => c.length > 0);
        let current = this.root;
        
        // Traverse the path except the last component
        for (let i = 0; i < components.length - 1; i++) {
            if (!current.children || !current.children[components[i]]) {
                return null; // Path doesn't exist
            }
            current = current.children[components[i]];
        }
        
        // Check if the last component exists and is a file
        const fileName = components[components.length - 1];
        if (current.children && current.children[fileName] && current.children[fileName].type === 'file') {
            return current.children[fileName];
        }
        
        return null;
    },
    
    // List contents of a directory
    listDirectory: function(path) {
        const directory = this.getDirectoryAt(path || this.currentPath);
        if (!directory) return [];
        
        const results = [];
        Object.keys(directory.children).forEach(key => {
            const item = directory.children[key];
            results.push({
                name: item.name,
                type: item.type,
                size: item.size || '',
                modified: item.modified || ''
            });
        });
        
        return results;
    },
    
    // Create a new file
    createFile: function(path, content = '') {
        if (!path) return false;
        
        // Split path into directory path and filename
        const lastSlash = path.lastIndexOf('/');
        const dirPath = lastSlash === 0 ? '/' : path.substring(0, lastSlash);
        const fileName = path.substring(lastSlash + 1);
        
        if (!fileName || fileName === '') return false;
        
        // Get parent directory
        const directory = this.getDirectoryAt(dirPath);
        if (!directory) return false;
        
        // Create file if it doesn't exist
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        
        directory.children[fileName] = {
            type: 'file',
            name: fileName,
            content: content,
            size: content.length + 'B',
            modified: dateStr
        };
        
        this.saveToStorage();
        return true;
    },
    
    // Create a new directory
    createDirectory: function(path) {
        if (!path) return false;
        
        // Split path into parent path and dir name
        const lastSlash = path.lastIndexOf('/');
        const parentPath = lastSlash === 0 ? '/' : path.substring(0, lastSlash);
        const dirName = path.substring(lastSlash + 1);
        
        if (!dirName || dirName === '') return false;
        
        // Get parent directory
        const parentDir = this.getDirectoryAt(parentPath);
        if (!parentDir) return false;
        
        // Create directory if it doesn't exist
        parentDir.children[dirName] = {
            type: 'directory',
            name: dirName,
            children: {}
        };
        
        this.saveToStorage();
        return true;
    },
    
    // Delete a file or directory
    delete: function(path) {
        if (!path) return false;
        
        // Split path into parent path and item name
        const lastSlash = path.lastIndexOf('/');
        const parentPath = lastSlash === 0 ? '/' : path.substring(0, lastSlash);
        const itemName = path.substring(lastSlash + 1);
        
        if (!itemName || itemName === '') return false;
        
        // Get parent directory
        const parentDir = this.getDirectoryAt(parentPath);
        if (!parentDir || !parentDir.children[itemName]) return false;
        
        // Delete the item
        delete parentDir.children[itemName];
        this.saveToStorage();
        return true;
    },
    
    // Change current directory
    changeDirectory: function(path) {
        if (!path) return false;
        
        // Handle absolute and relative paths
        let newPath;
        if (path.startsWith('/')) {
            newPath = path; // Absolute path
        } else if (path === '..') {
            // Go up one directory
            const lastSlash = this.currentPath.lastIndexOf('/');
            newPath = lastSlash === 0 ? '/' : this.currentPath.substring(0, lastSlash);
        } else if (path === '.') {
            // Stay in current directory
            return true;
        } else {
            // Relative path
            newPath = this.currentPath === '/' ? '/' + path : this.currentPath + '/' + path;
        }
        
        // Check if the new path exists and is a directory
        const directory = this.getDirectoryAt(newPath);
        if (!directory) return false;
        
        // Change the current path
        this.currentPath = newPath;
        this.saveToStorage();
        return true;
    },
    
    // Read a file's content
    readFile: function(path) {
        const file = this.getFileAt(path);
        return file ? file.content : null;
    },
    
    // Write content to a file
    writeFile: function(path, content) {
        // If the file exists, update it
        const file = this.getFileAt(path);
        if (file) {
            file.content = content;
            file.size = content.length + 'B';
            file.modified = new Date().toISOString().split('T')[0];
            this.saveToStorage();
            return true;
        }
        
        // Otherwise create a new file
        return this.createFile(path, content);
    },
    
    // Get current working directory path
    getCurrentPath: function() {
        return this.currentPath;
    },
    
    // Parse a path (resolve . and .. and make absolute)
    resolvePath: function(path) {
        if (!path) return this.currentPath;
        
        // If already absolute, just clean it
        if (path.startsWith('/')) {
            // Replace multiple slashes with a single slash
            path = path.replace(/\/+/g, '/');
        } else {
            // Relative path, join with current path
            path = this.currentPath === '/' ? '/' + path : this.currentPath + '/' + path;
        }
        
        // Split into components
        const components = path.split('/').filter(c => c.length > 0);
        const result = [];
        
        // Process . and ..
        for (let comp of components) {
            if (comp === '.') {
                // Skip this component
            } else if (comp === '..') {
                // Go up one level if possible
                if (result.length > 0) result.pop();
            } else {
                result.push(comp);
            }
        }
        
        // Rebuild the path
        return '/' + result.join('/');
    },
    
    // Check if a path exists (file or directory)
    exists: function(path) {
        if (!path) return false;
        
        // Handle root path specially
        if (path === '/') return true;
        
        // Resolve the path
        path = this.resolvePath(path);
        
        // Split into components
        const components = path.split('/').filter(c => c.length > 0);
        let current = this.root;
        
        // Traverse the path
        for (let i = 0; i < components.length; i++) {
            if (!current.children || !current.children[components[i]]) {
                return false;
            }
            current = current.children[components[i]];
        }
        
        return true;
    },
    
    // Get parent directory of a path
    getParentPath: function(path) {
        if (!path) return '/';
        
        path = this.resolvePath(path);
        const lastSlash = path.lastIndexOf('/');
        return lastSlash === 0 ? '/' : path.substring(0, lastSlash);
    },
    
    // Copy a file or directory to another location
    copy: function(sourcePath, destPath) {
        if (!sourcePath || !destPath) return false;
        
        // Resolve the paths
        sourcePath = this.resolvePath(sourcePath);
        destPath = this.resolvePath(destPath);
        
        // Can't copy a directory to its own subdirectory
        if (destPath.startsWith(sourcePath + '/')) return false;
        
        // Check if source exists
        if (!this.exists(sourcePath)) return false;
        
        // Check the source type (file or directory)
        const sourceFile = this.getFileAt(sourcePath);
        if (sourceFile) {
            // Source is a file, just create a copy
            return this.createFile(destPath, sourceFile.content);
        }
        
        const sourceDir = this.getDirectoryAt(sourcePath);
        if (sourceDir) {
            // Create destination directory
            if (!this.createDirectory(destPath)) return false;
            
            // Recursively copy all children
            for (const childName in sourceDir.children) {
                const childSource = sourcePath + '/' + childName;
                const childDest = destPath + '/' + childName;
                if (!this.copy(childSource, childDest)) return false;
            }
            
            return true;
        }
        
        return false;
    },
    
    // Move a file or directory to another location
    move: function(sourcePath, destPath) {
        if (!sourcePath || !destPath) return false;
        
        // Copy first
        if (!this.copy(sourcePath, destPath)) return false;
        
        // Then delete the source
        return this.delete(sourcePath);
    },
    
    // Get file type based on extension
    getFileType: function(filename) {
        if (!filename) return 'unknown';
        
        const ext = filename.split('.').pop().toLowerCase();
        
        const types = {
            // Text files
            'txt': 'text',
            'md': 'markdown',
            'json': 'json',
            'js': 'javascript',
            'html': 'html',
            'css': 'css',
            'xml': 'xml',
            'csv': 'csv',
            
            // Image files
            'jpg': 'image',
            'jpeg': 'image',
            'png': 'image',
            'gif': 'image',
            'bmp': 'image',
            'svg': 'image',
            
            // Document files
            'pdf': 'pdf',
            'doc': 'document',
            'docx': 'document',
            'xls': 'spreadsheet',
            'xlsx': 'spreadsheet',
            'ppt': 'presentation',
            'pptx': 'presentation',
            
            // Archive files
            'zip': 'archive',
            'rar': 'archive',
            '7z': 'archive',
            'tar': 'archive',
            'gz': 'archive',
            
            // Audio/Video files
            'mp3': 'audio',
            'wav': 'audio',
            'ogg': 'audio',
            'mp4': 'video',
            'avi': 'video',
            'mov': 'video',
            'mkv': 'video',
            
            // System files
            'exe': 'executable',
            'sh': 'script',
            'bat': 'script',
            'dll': 'library',
            'so': 'library'
        };
        
        return types[ext] || 'unknown';
    },
    
    // Search for files/directories by name
    search: function(query, path) {
        query = query.toLowerCase();
        const startPath = path || '/';
        const results = [];
        
        // Recursive function to search in directories
        const searchIn = (dirPath, dir) => {
            // Check each child
            for (const childName in dir.children) {
                const child = dir.children[childName];
                const childPath = dirPath === '/' ? '/' + childName : dirPath + '/' + childName;
                
                // Add to results if matches
                if (childName.toLowerCase().includes(query)) {
                    results.push({
                        name: childName,
                        path: childPath,
                        type: child.type,
                        size: child.size || '',
                        modified: child.modified || ''
                    });
                }
                
                // If it's a directory, search recursively
                if (child.type === 'directory') {
                    searchIn(childPath, child);
                }
            }
        };
        
        // Start the search
        const startDir = this.getDirectoryAt(startPath);
        if (startDir) {
            searchIn(startPath, startDir);
        }
        
        return results;
    }
};

// Credit note at the bottom of file
// RonakOS File System Module
// Made by Prakit Chetia (Kai) 