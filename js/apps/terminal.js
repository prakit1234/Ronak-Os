// Terminal App
window.terminal = {
    container: null,
    currentDir: '/home/user',
    commandHistory: [],
    historyIndex: -1,
    fileSystem: null,

    // Command definitions with descriptions
    commands: {
        'help': {
            description: 'Display available commands',
            usage: 'help [command]',
            action: function(args) {
                if (!args.length) {
                    let output = 'Available commands:\n\n';
                    for (const cmd in window.terminal.commands) {
                        output += `${cmd.padEnd(12)} - ${window.terminal.commands[cmd].description}\n`;
                    }
                    return output;
                } else {
                    const cmd = args[0];
                    if (window.terminal.commands[cmd]) {
                        return `${cmd} - ${window.terminal.commands[cmd].description}\nUsage: ${window.terminal.commands[cmd].usage}`;
                    } else {
                        return `Command not found: ${cmd}`;
                    }
                }
            }
        },
        'ls': {
            description: 'List directory contents',
            usage: 'ls [options]',
            action: function(args) {
                // Simple ls command simulation
                return 'documents  pictures  downloads  notes.txt';
            }
        },
        'cd': {
            description: 'Change the current directory',
            usage: 'cd [directory]',
            action: function(args) {
                if (!args.length || args[0] === '~') {
                    window.terminal.currentDir = '/home/user';
                    return '';
                }
                
                // Simulate directory change
                if (args[0] === '..') {
                    // Go up one directory
                    const parts = window.terminal.currentDir.split('/');
                    if (parts.length > 2) { // Don't go past root
                        parts.pop();
                        window.terminal.currentDir = parts.join('/');
                    }
                    return '';
                } else if (args[0].startsWith('/')) {
                    // Absolute path
                    window.terminal.currentDir = args[0];
                    return '';
                } else {
                    // Relative path
                    window.terminal.currentDir += '/' + args[0];
                    return '';
                }
            }
        },
        'pwd': {
            description: 'Print working directory',
            usage: 'pwd',
            action: function(args) {
                return window.terminal.currentDir;
            }
        },
        'echo': {
            description: 'Display a line of text',
            usage: 'echo [text]',
            action: function(args) {
                return args.join(' ');
            }
        },
        'clear': {
            description: 'Clear the terminal screen',
            usage: 'clear',
            action: function(args) {
                window.terminal.clearTerminal();
                return null; // Return null to avoid printing output
            }
        },
        'date': {
            description: 'Display the current date and time',
            usage: 'date',
            action: function(args) {
                return new Date().toString();
            }
        },
        'mkdir': {
            description: 'Create a new directory',
            usage: 'mkdir [directory]',
            action: function(args) {
                if (!args.length) {
                    return 'mkdir: missing operand';
                }
                return `Directory created: ${args[0]}`;
            }
        },
        'touch': {
            description: 'Create an empty file',
            usage: 'touch [file]',
            action: function(args) {
                if (!args.length) {
                    return 'touch: missing file operand';
                }
                return `File created: ${args[0]}`;
            }
        },
        'cat': {
            description: 'Concatenate and display file content',
            usage: 'cat [file]',
            action: function(args) {
                if (!args.length) {
                    return 'cat: missing file operand';
                }
                
                // Simulate file reading
                if (args[0] === 'notes.txt') {
                    return 'This is the content of notes.txt file.';
                } else {
                    return `cat: ${args[0]}: No such file or directory`;
                }
            }
        },
        'rm': {
            description: 'Remove files or directories',
            usage: 'rm [options] [file]',
            action: function(args) {
                if (!args.length) {
                    return 'rm: missing operand';
                }
                
                return `Removed: ${args[0]}`;
            }
        },
        'cp': {
            description: 'Copy files or directories',
            usage: 'cp [options] source destination',
            action: function(args) {
                if (args.length < 2) {
                    return 'cp: missing destination file operand';
                }
                
                return `Copied ${args[0]} to ${args[1]}`;
            }
        },
        'mv': {
            description: 'Move or rename files or directories',
            usage: 'mv [options] source destination',
            action: function(args) {
                if (args.length < 2) {
                    return 'mv: missing destination file operand';
                }
                
                return `Moved ${args[0]} to ${args[1]}`;
            }
        },
        'grep': {
            description: 'Search for patterns in files',
            usage: 'grep [options] pattern [file]',
            action: function(args) {
                if (args.length < 2) {
                    return 'grep: missing pattern and file operands';
                }
                
                return `Found pattern '${args[0]}' in ${args[1]}`;
            }
        },
        'find': {
            description: 'Search for files in a directory hierarchy',
            usage: 'find [path] [expression]',
            action: function(args) {
                if (!args.length) {
                    return 'find: missing path operand';
                }
                
                return `Found files in ${args[0]}:\nfile1.txt\nfile2.txt`;
            }
        },
        'whoami': {
            description: 'Print the current user name',
            usage: 'whoami',
            action: function(args) {
                return 'user';
            }
        },
        'ps': {
            description: 'Report process status',
            usage: 'ps [options]',
            action: function(args) {
                return 'PID  TTY          TIME CMD\n1234 pts/0    00:00:01 bash\n1235 pts/0    00:00:00 ps';
            }
        },
        'kill': {
            description: 'Terminate processes',
            usage: 'kill [options] pid',
            action: function(args) {
                if (!args.length) {
                    return 'kill: missing process id';
                }
                
                return `Process ${args[0]} terminated`;
            }
        },
        'chmod': {
            description: 'Change file mode bits',
            usage: 'chmod [options] mode file',
            action: function(args) {
                if (args.length < 2) {
                    return 'chmod: missing operand';
                }
                
                return `Mode of ${args[1]} changed to ${args[0]}`;
            }
        },
        'chown': {
            description: 'Change file owner and group',
            usage: 'chown [options] owner[:group] file',
            action: function(args) {
                if (args.length < 2) {
                    return 'chown: missing operand';
                }
                
                return `Owner of ${args[1]} changed to ${args[0]}`;
            }
        },
        'df': {
            description: 'Report file system disk space usage',
            usage: 'df [options]',
            action: function(args) {
                return 'Filesystem     Size  Used Avail Use% Mounted on\n/dev/sda1      100G   25G   75G  25% /';
            }
        },
        'du': {
            description: 'Estimate file space usage',
            usage: 'du [options] [file]',
            action: function(args) {
                return '4.0K\t./file1.txt\n8.0K\t./folder\n12K\t.';
            }
        },
        'top': {
            description: 'Display Linux processes',
            usage: 'top',
            action: function(args) {
                return 'top - 12:34:56 up 1 day, 2:34, 1 user, load average: 0.01, 0.05, 0.10\nTasks: 100 total, 1 running, 99 sleeping, 0 stopped, 0 zombie\n%Cpu(s): 5.0 us, 2.0 sy, 0.0 ni, 92.9 id, 0.1 wa, 0.0 hi, 0.0 si, 0.0 st\nMiB Mem : 4096.0 total, 2048.0 free, 1024.0 used, 1024.0 buff/cache\nMiB Swap: 2048.0 total, 2048.0 free, 0.0 used. 3072.0 avail Mem';
            }
        },
        'uname': {
            description: 'Print system information',
            usage: 'uname [options]',
            action: function(args) {
                if (args.length && args[0] === '-a') {
                    return 'Linux hostname 5.4.0-42-generic #46-Ubuntu SMP Fri Jul 10 00:24:02 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux';
                }
                return 'Linux';
            }
        },
        'ping': {
            description: 'Send ICMP ECHO_REQUEST to network hosts',
            usage: 'ping [options] destination',
            action: function(args) {
                if (!args.length) {
                    return 'ping: missing destination';
                }
                
                return `PING ${args[0]} (127.0.0.1) 56(84) bytes of data.\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.01 ms\n64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.02 ms`;
            }
        },
        'ssh': {
            description: 'OpenSSH SSH client (remote login program)',
            usage: 'ssh [options] [user@]hostname [command]',
            action: function(args) {
                if (!args.length) {
                    return 'ssh: missing destination';
                }
                
                return `Connected to ${args[0]}`;
            }
        },
        'wget': {
            description: 'Network downloader',
            usage: 'wget [options] [URL]',
            action: function(args) {
                if (!args.length) {
                    return 'wget: missing URL';
                }
                
                return `Downloading ${args[0]}...\nDownload complete`;
            }
        },
        'curl': {
            description: 'Transfer data from or to a server',
            usage: 'curl [options] [URL]',
            action: function(args) {
                if (!args.length) {
                    return 'curl: try \'curl --help\' for more information';
                }
                
                return `<!DOCTYPE html><html><head><title>Example</title></head><body><h1>Example Page</h1><p>This is a sample response from curl command.</p></body></html>`;
            }
        },
        'zip': {
            description: 'Package and compress files',
            usage: 'zip [options] zipfile files',
            action: function(args) {
                if (args.length < 2) {
                    return 'zip: missing file operands';
                }
                
                return `Adding: ${args[1]} to ${args[0]}`;
            }
        },
        'unzip': {
            description: 'List, test and extract compressed files in a ZIP archive',
            usage: 'unzip [options] file[.zip] [file(s)] [-d dir]',
            action: function(args) {
                if (!args.length) {
                    return 'unzip: missing file operand';
                }
                
                return `Extracting ${args[0]}...\nExtraction complete`;
            }
        },
        'history': {
            description: 'Show command history',
            usage: 'history',
            action: function(args) {
                if (window.terminal.commandHistory.length === 0) {
                    return 'No commands in history';
                }
                
                let output = '';
                for (let i = 0; i < window.terminal.commandHistory.length; i++) {
                    output += `${i + 1}  ${window.terminal.commandHistory[i]}\n`;
                }
                return output.trim();
            }
        }
    },

    // Initialize the terminal
    init: function(containerElement) {
        this.container = containerElement;
        this.fileSystem = window.fileExplorer ? window.fileExplorer.fileSystem : null;
        this.render();
    },

    // Render the terminal
    render: function() {
        if (!this.container) return;

        const terminalHTML = `
            <div class="terminal-container">
                <div class="terminal-output terminal-text font-jetbrains" id="terminal-output"></div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt terminal-text font-jetbrains">user@ronakos:${this.currentDir}$</span>
                    <input type="text" id="terminal-input" class="terminal-text font-jetbrains" autocomplete="off">
                </div>
            </div>
        `;

        this.container.innerHTML = terminalHTML;
        
        // Add custom styles for terminal
        const style = document.createElement('style');
        style.textContent = `
            .terminal-container {
                height: 100%;
                background-color: #2C001E;
                color: #F9F9F9;
                border-radius: 4px;
                padding: 10px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .terminal-output {
                flex: 1;
                overflow-y: auto;
                padding-bottom: 10px;
                white-space: pre-wrap;
                word-break: break-word;
            }
            
            .terminal-input-line {
                display: flex;
                align-items: center;
                position: relative;
            }
            
            .terminal-prompt {
                color: #50FA7B;
                margin-right: 5px;
            }
            
            #terminal-input {
                flex: 1;
                background: transparent;
                border: none;
                color: #F9F9F9;
                outline: none;
                font-size: 0.9rem;
            }
            
            .output-line {
                padding: 2px 0;
                animation: terminalLine 0.2s ease;
            }
            
            @keyframes terminalLine {
                from {
                    opacity: 0;
                    transform: translateY(5px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .terminal-text {
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            /* Command highlighting */
            .command-success {
                color: #50FA7B;
            }
            
            .command-error {
                color: #FF5555;
            }
            
            .command-warning {
                color: #F1FA8C;
            }
            
            .command-info {
                color: #8BE9FD;
            }
        `;
        this.container.appendChild(style);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Add welcome message
        this.addOutput('Welcome to RonakOS Terminal! Type "help" to see available commands.');
        
        // Focus the input
        document.getElementById('terminal-input').focus();
    },

    // Set up terminal event listeners
    setupEventListeners: function() {
        const input = document.getElementById('terminal-input');
        
        // Handle command execution on Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                
                if (command) {
                    // Add command to history
                    this.commandHistory.push(command);
                    this.historyIndex = this.commandHistory.length;
                    
                    // Show command in output
                    this.addOutput(`<span class="terminal-prompt">user@ronakos:${this.currentDir}$</span> ${command}`);
                    
                    // Execute command and show result
                    const result = this.executeCommand(command);
                    if (result !== null) {
                        this.addOutput(result);
                    }
                }
                
                // Clear input
                input.value = '';
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                // Navigate command history (up)
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    input.value = this.commandHistory[this.historyIndex];
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                // Navigate command history (down)
                if (this.historyIndex < this.commandHistory.length - 1) {
                    this.historyIndex++;
                    input.value = this.commandHistory[this.historyIndex];
                } else if (this.historyIndex === this.commandHistory.length - 1) {
                    this.historyIndex = this.commandHistory.length;
                    input.value = '';
                }
                e.preventDefault();
            }
        });
        
        // Re-focus input when clicking anywhere in the terminal
        this.container.addEventListener('click', () => {
            document.getElementById('terminal-input').focus();
        });
    },

    // Execute a command and return the result
    executeCommand: function(commandStr) {
        const parts = commandStr.split(' ');
        const command = parts[0];
        const args = parts.slice(1).filter(arg => arg !== '');
        
        if (this.commands[command]) {
            return this.commands[command].action(args);
        } else if (command) {
            return `${command}: command not found`;
        }
        
        return '';
    },

    // Add output to the terminal
    addOutput: function(text) {
        const output = document.getElementById('terminal-output');
        const newOutput = document.createElement('div');
        newOutput.className = 'output-line';
        
        // Add syntax highlighting for common commands
        if (text.startsWith('user@ronakos')) {
            const commandPart = text.split(' ')[1]; // Get the command part
            if (this.commands[commandPart]) {
                text = text.replace(commandPart, `<span class="command-info">${commandPart}</span>`);
            }
        } else if (text.includes('error') || text.includes('missing')) {
            newOutput.classList.add('command-error');
        } else if (text.startsWith('Directory created') || text.includes('complete')) {
            newOutput.classList.add('command-success');
        }
        
        // Handle multi-line output
        if (text.includes('\n')) {
            newOutput.innerHTML = text.split('\n').join('<br>');
        } else {
            newOutput.innerHTML = text;
        }
        
        output.appendChild(newOutput);
        output.scrollTop = output.scrollHeight;
    },

    // Clear the terminal
    clearTerminal: function() {
        const output = document.getElementById('terminal-output');
        output.innerHTML = '';
    }
}; 