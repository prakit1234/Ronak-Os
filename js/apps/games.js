// Games App with 2 games: Snake and Memory Match
window.games = {
    container: null,
    currentGame: null,
    gameInterval: null,
    
    // List of available games
    gamesList: [
        { id: 'snake', name: 'Snake', icon: '🐍', description: 'Classic snake game. Eat food, grow longer, avoid walls and yourself!' },
        { id: 'memory', name: 'Memory Match', icon: '🎴', description: 'Match pairs of cards by remembering their positions.' }
    ],
    
    // Initialize the games app
    init: function(containerElement) {
        this.container = containerElement;
        this.render();
    },
    
    // Render the games app
    render: function() {
        if (!this.container) return;
        
        // If no game is selected, show game selection menu
        if (!this.currentGame) {
            this.renderGameMenu();
        } else {
            // Otherwise render the selected game
            switch(this.currentGame) {
                case 'snake':
                    this.renderSnakeGame();
                    break;
                case 'memory':
                    this.renderMemoryGame();
                    break;
                default:
                    this.renderGameMenu();
            }
        }
    },
    
    // Render the game selection menu
    renderGameMenu: function() {
        const html = `
            <div class="games-app font-ubuntu">
                <div class="games-header">
                    <h2>Games</h2>
                    <p>Select a game to play</p>
                </div>
                
                <div class="games-grid">
                    ${this.gamesList.map(game => `
                        <div class="game-card" data-game="${game.id}">
                            <div class="game-icon">${game.icon}</div>
                            <div class="game-info">
                                <h3>${game.name}</h3>
                                <p>${game.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="games-footer">
                    <p class="games-credit">Games by Prakit Chetia (Kai)</p>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // Add custom styles
        const style = document.createElement('style');
        style.textContent = `
            .games-app {
                height: 100%;
                display: flex;
                flex-direction: column;
                padding: 20px;
                background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
                color: #333;
            }
            
            .games-header {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .games-header h2 {
                font-size: 28px;
                color: #333;
            }
            
            .games-header p {
                color: #666;
            }
            
            .games-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                flex: 1;
            }
            
            .game-card {
                background-color: white;
                border-radius: 10px;
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 15px;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s, box-shadow 0.3s;
                animation: fadeIn 0.5s ease;
            }
            
            .game-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
            }
            
            .game-icon {
                font-size: 36px;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #f0f0f0;
                border-radius: 12px;
            }
            
            .game-info {
                flex: 1;
            }
            
            .game-info h3 {
                margin-bottom: 5px;
                color: #333;
            }
            
            .game-info p {
                font-size: 14px;
                color: #666;
            }
            
            .games-footer {
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
            }
            
            .games-credit {
                font-style: italic;
            }
            
            /* Game-specific styles */
            .game-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                background-color: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            
            .game-toolbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background-color: #f0f0f0;
                border-bottom: 1px solid #ddd;
            }
            
            .game-title {
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .game-score {
                font-weight: 500;
            }
            
            .game-board {
                flex: 1;
                overflow: hidden;
                position: relative;
            }
            
            .game-controls {
                padding: 10px 15px;
                background-color: #f0f0f0;
                border-top: 1px solid #ddd;
                display: flex;
                justify-content: center;
                gap: 10px;
            }
            
            .game-btn {
                padding: 8px 16px;
                background-color: var(--primary-color);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
                transition: background-color 0.2s;
            }
            
            .game-btn:hover {
                background-color: var(--secondary-color);
            }
            
            .game-over {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: white;
                z-index: 10;
                animation: fadeIn 0.5s ease;
            }
            
            .game-over h2 {
                font-size: 32px;
                margin-bottom: 10px;
            }
            
            .game-over p {
                font-size: 18px;
                margin-bottom: 20px;
            }
        `;
        this.container.appendChild(style);
        
        // Setup event listeners
        const gameCards = this.container.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            card.addEventListener('click', () => {
                const gameId = card.dataset.game;
                this.startGame(gameId);
            });
        });
    },
    
    // Start a specific game
    startGame: function(gameId) {
        // Clear any existing game intervals
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        
        this.currentGame = gameId;
        this.render();
    },
    
    // Go back to the game menu
    backToMenu: function() {
        // Clear any game intervals
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        
        this.currentGame = null;
        this.render();
    },
    
    // SNAKE GAME IMPLEMENTATION
    renderSnakeGame: function() {
        const html = `
            <div class="games-app font-ubuntu">
                <div class="game-container">
                    <div class="game-toolbar">
                        <div class="game-title">
                            <span class="game-icon-small">🐍</span> Snake
                        </div>
                        <div class="game-score">Score: <span id="snake-score">0</span></div>
                    </div>
                    
                    <div class="game-board" id="snake-board">
                        <canvas id="snake-canvas"></canvas>
                    </div>
                    
                    <div class="game-controls">
                        <button class="game-btn" id="snake-start-btn">Start Game</button>
                        <button class="game-btn" id="snake-back-btn">Back to Games</button>
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // Add snake specific styles
        const style = document.createElement('style');
        style.textContent = `
            #snake-canvas {
                background-color: #111;
                width: 100%;
                height: 100%;
            }
            
            .game-icon-small {
                font-size: 18px;
            }
            
            @media (max-width: 600px) {
                .game-controls {
                    flex-direction: column;
                }
            }
        `;
        this.container.appendChild(style);
        
        // Setup snake game
        this.initSnakeGame();
    },
    
    // Initialize the Snake game
    initSnakeGame: function() {
        const canvas = document.getElementById('snake-canvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('snake-score');
        const startButton = document.getElementById('snake-start-btn');
        const backButton = document.getElementById('snake-back-btn');
        
        // Game variables
        let snake = [];
        let food = {};
        let direction = 'right';
        let nextDirection = 'right';
        let gameRunning = false;
        let score = 0;
        let speed = 100; // milliseconds between updates
        let boardSize = { width: 0, height: 0 };
        let cellSize = 0;
        
        // Resize canvas to fit container
        function resizeCanvas() {
            const board = document.getElementById('snake-board');
            canvas.width = board.clientWidth;
            canvas.height = board.clientHeight;
            
            // Calculate cell size and board dimensions in cells
            cellSize = Math.min(
                Math.floor(canvas.width / 20), 
                Math.floor(canvas.height / 20)
            );
            
            boardSize.width = Math.floor(canvas.width / cellSize);
            boardSize.height = Math.floor(canvas.height / cellSize);
        }
        
        // Initialize game
        function initGame() {
            // Set initial snake
            snake = [
                { x: 3, y: 1 },
                { x: 2, y: 1 },
                { x: 1, y: 1 }
            ];
            
            direction = 'right';
            nextDirection = 'right';
            score = 0;
            scoreElement.textContent = score;
            
            // Place food at random position
            placeFood();
        }
        
        // Place food at a random position not occupied by the snake
        function placeFood() {
            while (true) {
                food = {
                    x: Math.floor(Math.random() * boardSize.width),
                    y: Math.floor(Math.random() * boardSize.height)
                };
                
                // Check if food overlaps with snake
                let validPosition = true;
                for (let segment of snake) {
                    if (segment.x === food.x && segment.y === food.y) {
                        validPosition = false;
                        break;
                    }
                }
                
                if (validPosition) break;
            }
        }
        
        // Update game state
        function update() {
            // Update direction
            direction = nextDirection;
            
            // Calculate new head position
            let head = { ...snake[0] };
            
            switch (direction) {
                case 'up':
                    head.y -= 1;
                    break;
                case 'down':
                    head.y += 1;
                    break;
                case 'left':
                    head.x -= 1;
                    break;
                case 'right':
                    head.x += 1;
                    break;
            }
            
            // Check for collisions with walls
            if (head.x < 0 || head.x >= boardSize.width || head.y < 0 || head.y >= boardSize.height) {
                gameOver();
                return;
            }
            
            // Check for collisions with self
            for (let i = 0; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    gameOver();
                    return;
                }
            }
            
            // Move snake
            snake.unshift(head);
            
            // Check if snake ate food
            if (head.x === food.x && head.y === food.y) {
                // Increase score
                score += 10;
                scoreElement.textContent = score;
                
                // Place new food
                placeFood();
                
                // Increase speed slightly
                speed = Math.max(50, speed - 2);
            } else {
                // Remove tail if no food was eaten
                snake.pop();
            }
            
            // Render updated state
            render();
        }
        
        // Render game state
        function render() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw snake
            ctx.fillStyle = '#4CAF50';
            for (let segment of snake) {
                ctx.fillRect(
                    segment.x * cellSize, 
                    segment.y * cellSize, 
                    cellSize, 
                    cellSize
                );
            }
            
            // Draw head with different color
            ctx.fillStyle = '#388E3C';
            ctx.fillRect(
                snake[0].x * cellSize,
                snake[0].y * cellSize,
                cellSize,
                cellSize
            );
            
            // Draw food
            ctx.fillStyle = '#F44336';
            ctx.beginPath();
            ctx.arc(
                food.x * cellSize + cellSize / 2,
                food.y * cellSize + cellSize / 2,
                cellSize / 2,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
        
        // Start game
        function startGame() {
            if (gameRunning) return;
            
            resizeCanvas();
            initGame();
            
            gameRunning = true;
            startButton.textContent = 'Restart Game';
            
            // Start game loop
            if (window.games.gameInterval) {
                clearInterval(window.games.gameInterval);
            }
            
            window.games.gameInterval = setInterval(() => {
                if (gameRunning) {
                    update();
                }
            }, speed);
        }
        
        // Game over
        function gameOver() {
            gameRunning = false;
            
            // Show game over message
            const gameOverElement = document.createElement('div');
            gameOverElement.className = 'game-over';
            gameOverElement.innerHTML = `
                <h2>Game Over!</h2>
                <p>Your score: ${score}</p>
                <button class="game-btn" id="retry-btn">Play Again</button>
            `;
            
            document.getElementById('snake-board').appendChild(gameOverElement);
            
            // Setup retry button
            document.getElementById('retry-btn').addEventListener('click', () => {
                gameOverElement.remove();
                startGame();
            });
        }
        
        // Handle keyboard input
        document.addEventListener('keydown', (e) => {
            if (!gameRunning) return;
            
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                    if (direction !== 'down') nextDirection = 'up';
                    break;
                case 'ArrowDown':
                case 's':
                    if (direction !== 'up') nextDirection = 'down';
                    break;
                case 'ArrowLeft':
                case 'a':
                    if (direction !== 'right') nextDirection = 'left';
                    break;
                case 'ArrowRight':
                case 'd':
                    if (direction !== 'left') nextDirection = 'right';
                    break;
            }
        });
        
        // Setup buttons
        startButton.addEventListener('click', startGame);
        backButton.addEventListener('click', () => {
            this.backToMenu();
        });
        
        // Add touch controls for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        
        canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            e.preventDefault();
        }, { passive: false });
        
        canvas.addEventListener('touchmove', (e) => {
            if (!gameRunning) return;
            
            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;
            
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            
            // Determine swipe direction based on which axis had larger movement
            if (Math.abs(dx) > Math.abs(dy)) {
                // Horizontal swipe
                if (dx > 0 && direction !== 'left') {
                    nextDirection = 'right';
                } else if (dx < 0 && direction !== 'right') {
                    nextDirection = 'left';
                }
            } else {
                // Vertical swipe
                if (dy > 0 && direction !== 'up') {
                    nextDirection = 'down';
                } else if (dy < 0 && direction !== 'down') {
                    nextDirection = 'up';
                }
            }
            
            touchStartX = touchEndX;
            touchStartY = touchEndY;
            e.preventDefault();
        }, { passive: false });
        
        // Initial resize
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        render();
    },
    
    // MEMORY MATCH GAME IMPLEMENTATION
    renderMemoryGame: function() {
        const html = `
            <div class="games-app font-ubuntu">
                <div class="game-container">
                    <div class="game-toolbar">
                        <div class="game-title">
                            <span class="game-icon-small">🎴</span> Memory Match
                        </div>
                        <div class="game-score">Moves: <span id="memory-moves">0</span></div>
                    </div>
                    
                    <div class="game-board" id="memory-board">
                        <div class="memory-grid" id="memory-grid"></div>
                    </div>
                    
                    <div class="game-controls">
                        <button class="game-btn" id="memory-start-btn">Start Game</button>
                        <button class="game-btn" id="memory-back-btn">Back to Games</button>
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // Add memory game specific styles
        const style = document.createElement('style');
        style.textContent = `
            #memory-board {
                background-color: #f8f8f8;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            
            .memory-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                grid-template-rows: repeat(4, 1fr);
                gap: 10px;
                width: 100%;
                max-width: 500px;
                aspect-ratio: 1;
            }
            
            .memory-card {
                background-color: #E95420;
                border-radius: 8px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                font-size: 24px;
                transition: transform 0.3s, background-color 0.3s;
                transform-style: preserve-3d;
                position: relative;
                user-select: none;
            }
            
            .memory-card.flipped {
                transform: rotateY(180deg);
                background-color: white;
            }
            
            .memory-card.matched {
                background-color: #4CAF50;
                transform: rotateY(180deg) scale(0.95);
                cursor: default;
            }
            
            .memory-card-front, .memory-card-back {
                position: absolute;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                backface-visibility: hidden;
            }
            
            .memory-card-back {
                transform: rotateY(180deg);
            }
            
            @media (max-width: 500px) {
                .memory-grid {
                    gap: 5px;
                }
                
                .memory-card {
                    font-size: 18px;
                }
            }
        `;
        this.container.appendChild(style);
        
        // Setup memory game
        this.initMemoryGame();
    },
    
    // Initialize the Memory Match game
    initMemoryGame: function() {
        const gridElement = document.getElementById('memory-grid');
        const movesElement = document.getElementById('memory-moves');
        const startButton = document.getElementById('memory-start-btn');
        const backButton = document.getElementById('memory-back-btn');
        
        // Game variables
        let cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let moves = 0;
        let gameRunning = false;
        const totalPairs = 8;
        
        // Card symbols
        const symbols = [
            '🍎', '🍌', '🍊', '🍇', '🍉', '🍓', '🍒', '🥥',
            '🦊', '🐶', '🐱', '🦁', '🐯', '🐺', '🦝', '🐻'
        ];
        
        // Initialize game
        function initGame() {
            moves = 0;
            matchedPairs = 0;
            flippedCards = [];
            movesElement.textContent = moves;
            
            // Prepare card pairs (select 8 pairs from symbols)
            const selectedSymbols = symbols.slice(0, totalPairs);
            cards = [...selectedSymbols, ...selectedSymbols];
            
            // Shuffle cards
            for (let i = cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cards[i], cards[j]] = [cards[j], cards[i]];
            }
            
            // Create grid
            renderGrid();
        }
        
        // Render the card grid
        function renderGrid() {
            gridElement.innerHTML = '';
            
            cards.forEach((symbol, index) => {
                const card = document.createElement('div');
                card.className = 'memory-card';
                card.dataset.index = index;
                
                card.innerHTML = `
                    <div class="memory-card-front"></div>
                    <div class="memory-card-back">${symbol}</div>
                `;
                
                card.addEventListener('click', () => flipCard(card, index));
                gridElement.appendChild(card);
            });
        }
        
        // Flip a card
        function flipCard(card, index) {
            // Ignore if game not running, card already flipped or matched, or two cards already flipped
            if (!gameRunning || 
                card.classList.contains('flipped') || 
                card.classList.contains('matched') || 
                flippedCards.length >= 2) {
                return;
            }
            
            // Flip the card
            card.classList.add('flipped');
            flippedCards.push({ card, index });
            
            // If two cards are flipped, check for a match
            if (flippedCards.length === 2) {
                moves++;
                movesElement.textContent = moves;
                
                if (cards[flippedCards[0].index] === cards[flippedCards[1].index]) {
                    // It's a match!
                    setTimeout(() => {
                        flippedCards[0].card.classList.add('matched');
                        flippedCards[1].card.classList.add('matched');
                        flippedCards = [];
                        
                        matchedPairs++;
                        
                        // Check if game is complete
                        if (matchedPairs === totalPairs) {
                            gameComplete();
                        }
                    }, 500);
                } else {
                    // Not a match, flip cards back
                    setTimeout(() => {
                        flippedCards[0].card.classList.remove('flipped');
                        flippedCards[1].card.classList.remove('flipped');
                        flippedCards = [];
                    }, 1000);
                }
            }
        }
        
        // Game complete
        function gameComplete() {
            gameRunning = false;
            
            // Show completion message
            const gameOverElement = document.createElement('div');
            gameOverElement.className = 'game-over';
            gameOverElement.innerHTML = `
                <h2>Congratulations!</h2>
                <p>You completed the game in ${moves} moves</p>
                <button class="game-btn" id="play-again-btn">Play Again</button>
            `;
            
            document.getElementById('memory-board').appendChild(gameOverElement);
            
            // Setup play again button
            document.getElementById('play-again-btn').addEventListener('click', () => {
                gameOverElement.remove();
                startGame();
            });
        }
        
        // Start game
        function startGame() {
            if (gameRunning) return;
            
            initGame();
            gameRunning = true;
            startButton.textContent = 'Restart Game';
            
            // Add a brief preview of all cards at the beginning
            const allCards = document.querySelectorAll('.memory-card');
            allCards.forEach(card => card.classList.add('flipped'));
            
            setTimeout(() => {
                allCards.forEach(card => card.classList.remove('flipped'));
            }, 2000);
        }
        
        // Setup buttons
        startButton.addEventListener('click', startGame);
        backButton.addEventListener('click', () => {
            this.backToMenu();
        });
    }
}; 