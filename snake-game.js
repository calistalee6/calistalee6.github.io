// Pokemon-Inspired Snake Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');

// Game settings
const gridSize = 25;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: Math.floor(tileCount/2), y: Math.floor(tileCount/2)},
    {x: Math.floor(tileCount/2), y: Math.floor(tileCount/2) + 1},
    {x: Math.floor(tileCount/2), y: Math.floor(tileCount/2) + 2}
];
let food = {};
let specialFood = null;
let dx = 0;
let dy = -1; // Start moving up
let score = 0;
let gameRunning = true;
let gameSpeed = 200;
let lastDirection = {x: 0, y: -1};
let particles = [];
let powerUpActive = false;
let powerUpTimer = 0;

// Generate random food position
function randomTilePosition() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

// Initialize food position
function generateFood() {
    food = randomTilePosition();
    
    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

// Generate special power-up food occasionally
function generateSpecialFood() {
    if (Math.random() < 0.3 && !specialFood) {
        specialFood = randomTilePosition();
        // Make sure special food doesn't spawn on snake or regular food
        for (let segment of snake) {
            if ((segment.x === specialFood.x && segment.y === specialFood.y) ||
                (specialFood.x === food.x && specialFood.y === food.y)) {
                specialFood = null;
                return;
            }
        }
        // Remove special food after 8 seconds
        setTimeout(() => {
            specialFood = null;
        }, 8000);
    }
}

// Draw Pokemon-style snake segment
function drawSnakeSegment(segment, index, isHead = false) {
    const x = segment.x * gridSize;
    const y = segment.y * gridSize;
    
    if (isHead) {
        // Pokemon-style head with depth and shading
        const gradient = ctx.createRadialGradient(
            x + gridSize/2 - 3, y + gridSize/2 - 3, 0,
            x + gridSize/2, y + gridSize/2, gridSize/2
        );
        gradient.addColorStop(0, powerUpActive ? '#FFD700' : '#66BB6A');
        gradient.addColorStop(0.7, powerUpActive ? '#FFA000' : '#4CAF50');
        gradient.addColorStop(1, powerUpActive ? '#FF8F00' : '#2E7D32');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, gridSize - 2, gridSize - 2, 12);
        ctx.fill();
        
        // Head outline
        ctx.strokeStyle = powerUpActive ? '#FF6F00' : '#1B5E20';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Eyes with direction awareness
        const eyeOffsetX = dx * 2;
        const eyeOffsetY = dy * 2;
        
        // Left eye
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(x + gridSize/2 - 5 + eyeOffsetX, y + gridSize/2 - 3 + eyeOffsetY, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Right eye
        ctx.beginPath();
        ctx.arc(x + gridSize/2 + 5 + eyeOffsetX, y + gridSize/2 - 3 + eyeOffsetY, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Eye pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + gridSize/2 - 5 + eyeOffsetX + dx, y + gridSize/2 - 3 + eyeOffsetY + dy, 2, 0, 2 * Math.PI);
        ctx.arc(x + gridSize/2 + 5 + eyeOffsetX + dx, y + gridSize/2 - 3 + eyeOffsetY + dy, 2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Nostrils
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(x + gridSize/2 - 2, y + gridSize/2 + 3, 1, 0, 2 * Math.PI);
        ctx.arc(x + gridSize/2 + 2, y + gridSize/2 + 3, 1, 0, 2 * Math.PI);
        ctx.fill();
        
    } else {
        // Body segments with alternating pattern
        const isEven = index % 2 === 0;
        const gradient = ctx.createRadialGradient(
            x + gridSize/2 - 2, y + gridSize/2 - 2, 0,
            x + gridSize/2, y + gridSize/2, gridSize/2
        );
        
        if (powerUpActive) {
            gradient.addColorStop(0, isEven ? '#FFD54F' : '#FFC107');
            gradient.addColorStop(1, isEven ? '#FF8F00' : '#FF6F00');
        } else {
            gradient.addColorStop(0, isEven ? '#81C784' : '#66BB6A');
            gradient.addColorStop(1, isEven ? '#388E3C' : '#2E7D32');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, gridSize - 4, gridSize - 4, 8);
        ctx.fill();
        
        // Body segment outline
        ctx.strokeStyle = powerUpActive ? '#E65100' : '#1B5E20';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Scale pattern
        ctx.fillStyle = powerUpActive ? 'rgba(255, 193, 7, 0.3)' : 'rgba(76, 175, 80, 0.3)';
        ctx.beginPath();
        ctx.arc(x + gridSize/2 - 3, y + gridSize/2 - 3, 2, 0, 2 * Math.PI);
        ctx.arc(x + gridSize/2 + 3, y + gridSize/2 + 3, 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Draw Pokemon-style food (Poke Ball)
function drawFood() {
    const x = food.x * gridSize;
    const y = food.y * gridSize;
    const centerX = x + gridSize/2;
    const centerY = y + gridSize/2;
    const radius = gridSize/2 - 3;
    
    // Poke Ball base
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
    ctx.fill();
    
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI, false);
    ctx.fill();
    
    // Black border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Middle line
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.stroke();
    
    // Center circle
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(centerX - 3, centerY - 3, 3, 0, 2 * Math.PI);
    ctx.fill();
}

// Draw special power-up food (Master Ball)
function drawSpecialFood() {
    if (!specialFood) return;
    
    const x = specialFood.x * gridSize;
    const y = specialFood.y * gridSize;
    const centerX = x + gridSize/2;
    const centerY = y + gridSize/2;
    const radius = gridSize/2 - 2;
    
    // Master Ball gradient
    const gradient = ctx.createRadialGradient(centerX - 3, centerY - 3, 0, centerX, centerY, radius);
    gradient.addColorStop(0, '#9C27B0');
    gradient.addColorStop(1, '#6A1B9A');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Pink decorative M pattern
    ctx.strokeStyle = '#E91E63';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - 6, centerY - 2);
    ctx.lineTo(centerX - 3, centerY - 6);
    ctx.lineTo(centerX, centerY - 2);
    ctx.lineTo(centerX + 3, centerY - 6);
    ctx.lineTo(centerX + 6, centerY - 2);
    ctx.stroke();
    
    // Border
    ctx.strokeStyle = '#4A148C';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Sparkle effect
    const time = Date.now() * 0.005;
    for (let i = 0; i < 3; i++) {
        const angle = time + (i * 2 * Math.PI / 3);
        const sparkleX = centerX + Math.cos(angle) * (radius + 5);
        const sparkleY = centerY + Math.sin(angle) * (radius + 5);
        
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 1, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Create particle effect
function createParticle(x, y, color, velocity) {
    particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * velocity,
        vy: (Math.random() - 0.5) * velocity,
        color: color,
        life: 1.0,
        decay: 0.02
    });
}

// Update and draw particles
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        
        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }
        
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.life, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}

// Draw Pokemon-style grass background
function drawBackground() {
    // Base gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(1, '#2E7D32');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grass pattern
    ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
    for (let x = 0; x < canvas.width; x += 15) {
        for (let y = 0; y < canvas.height; y += 15) {
            if (Math.random() > 0.7) {
                ctx.beginPath();
                ctx.arc(x + Math.random() * 10, y + Math.random() * 10, 1, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
    
    // Subtle grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

// Draw game
function drawGame() {
    // Draw background
    drawBackground();
    
    // Update power-up timer
    if (powerUpActive) {
        powerUpTimer--;
        if (powerUpTimer <= 0) {
            powerUpActive = false;
        }
    }
    
    // Draw food
    drawFood();
    drawSpecialFood();
    
    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        drawSnakeSegment(snake[i], i, i === 0);
    }
    
    // Update and draw particles
    updateParticles();
    
    // Power-up indicator
    if (powerUpActive) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        ctx.font = '14px Arial';
        ctx.fillText(`Power Up: ${Math.ceil(powerUpTimer / 60)}s`, 10, 30);
    }
}

// Move snake
function moveSnake() {
    if (!gameRunning || (dx === 0 && dy === 0)) return;
    
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    // Wall wrapping (like Google Snake)
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;
    
    // Check self collision (but only after a minimum length)
    if (snake.length > 4) {
        for (let i = 0; i < snake.length - 1; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                if (!powerUpActive) {
                    gameOver();
                    return;
                } else {
                    // With power-up, phase through yourself
                    break;
                }
            }
        }
    }
    
    // Store last direction
    lastDirection.x = dx;
    lastDirection.y = dy;
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        
        // Create celebration particles
        for (let i = 0; i < 8; i++) {
            createParticle(
                food.x * gridSize + gridSize/2,
                food.y * gridSize + gridSize/2,
                '#FFD700',
                8
            );
        }
        
        generateFood();
        generateSpecialFood();
        
        // Increase speed slightly
        if (gameSpeed > 80) {
            gameSpeed -= 2;
        }
    } else if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
        // Special food gives more points and power-up
        score += 50;
        scoreElement.textContent = score;
        powerUpActive = true;
        powerUpTimer = 300; // 5 seconds at 60fps
        
        // Create special particles
        for (let i = 0; i < 15; i++) {
            createParticle(
                specialFood.x * gridSize + gridSize/2,
                specialFood.y * gridSize + gridSize/2,
                '#9C27B0',
                12
            );
        }
        
        specialFood = null;
        generateFood();
    } else {
        snake.pop();
    }
}

// Smooth movement with input buffering
let inputBuffer = [];
let lastMoveTime = 0;

function bufferInput(newDx, newDy) {
    // Prevent opposite direction
    if ((newDx === -lastDirection.x && newDy === -lastDirection.y) ||
        (newDx === dx && newDy === dy)) {
        return;
    }
    
    inputBuffer = [{x: newDx, y: newDy}];
}

function processInputBuffer() {
    if (inputBuffer.length > 0) {
        const input = inputBuffer.shift();
        // Double check opposite direction
        if (!(input.x === -lastDirection.x && input.y === -lastDirection.y)) {
            dx = input.x;
            dy = input.y;
        }
    }
}

// Game over with effects
function gameOver() {
    gameRunning = false;
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
    }
    
    // Create explosion particles
    const head = snake[0];
    for (let i = 0; i < 20; i++) {
        createParticle(
            head.x * gridSize + gridSize/2,
            head.y * gridSize + gridSize/2,
            '#FF4444',
            15
        );
    }
    
    // Show game over after a short delay
    setTimeout(() => {
        gameOverElement.style.display = 'block';
    }, 500);
}

// Restart game
function restartGame() {
    snake = [
        {x: Math.floor(tileCount/2), y: Math.floor(tileCount/2)},
        {x: Math.floor(tileCount/2), y: Math.floor(tileCount/2) + 1},
        {x: Math.floor(tileCount/2), y: Math.floor(tileCount/2) + 2}
    ];
    dx = 0;
    dy = -1;
    lastDirection = {x: 0, y: -1};
    score = 0;
    gameSpeed = 200;
    gameRunning = true;
    powerUpActive = false;
    powerUpTimer = 0;
    specialFood = null;
    particles = [];
    inputBuffer = [];
    scoreElement.textContent = score;
    gameOverElement.style.display = 'none';
    generateFood();
    lastMoveTime = Date.now();
    gameLoop();
}

// Handle keyboard input with buffering
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    const key = e.key.toLowerCase();
    
    // Prevent page scrolling
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
    }
    
    // Buffer input for smoother controls
    if (key === 'arrowleft' || key === 'a') {
        bufferInput(-1, 0);
    }
    if (key === 'arrowright' || key === 'd') {
        bufferInput(1, 0);
    }
    if (key === 'arrowup' || key === 'w') {
        bufferInput(0, -1);
    }
    if (key === 'arrowdown' || key === 's') {
        bufferInput(0, 1);
    }
    
    // Space to pause/unpause
    if (key === ' ') {
        e.preventDefault();
        // Implementation for pause can be added here
    }
});

// Add support for CanvasRenderingContext2D.roundRect for older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}

// Smooth game loop with variable speed
let gameLoopId;

function gameLoop() {
    const now = Date.now();
    
    if (now - lastMoveTime > gameSpeed) {
        processInputBuffer();
        moveSnake();
        lastMoveTime = now;
    }
    
    drawGame();
    
    if (gameRunning) {
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

// Initialize game
generateFood();
drawGame();

// Start smooth game loop
lastMoveTime = Date.now();
gameLoop(); 