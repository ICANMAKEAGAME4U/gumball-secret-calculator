// Gumball Coin Rush Game Logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let gameRunning = true;
let gameScore = 0;
let gameLives = 3;
let gameLevel = 1;
let gameSpeed = 3;

// Player (Gumball)
const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    speed: 5,
    color: '#3498db'
};

// Coins array
let coins = [];

// Enemies array
let enemies = [];

// Game loop
let gameLoop = null;
let spawnCoinTimer = 0;
let spawnEnemyTimer = 0;

function startGame() {
    gameRunning = true;
    gameScore = 0;
    gameLives = 3;
    gameLevel = 1;
    gameSpeed = 3;
    coins = [];
    enemies = [];
    spawnCoinTimer = 0;
    spawnEnemyTimer = 0;
    
    updateStats();
    
    // Clear any previous game loop
    if (gameLoop) clearInterval(gameLoop);
    
    // Set up keyboard controls
    setupControls();
    
    // Start game loop
    gameLoop = setInterval(update, 1000 / 60); // 60 FPS
}

function stopGame() {
    gameRunning = false;
    if (gameLoop) clearInterval(gameLoop);
}

function setupControls() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

function removeControls() {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
}

let keysPressed = {};

function handleKeyDown(e) {
    keysPressed[e.key] = true;
}

function handleKeyUp(e) {
    keysPressed[e.key] = false;
}

function update() {
    // Clear canvas
    ctx.fillStyle = 'rgba(30, 60, 114, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update player position
    if (keysPressed['ArrowLeft'] || keysPressed['a']) {
        player.x = Math.max(0, player.x - player.speed);
    }
    if (keysPressed['ArrowRight'] || keysPressed['d']) {
        player.x = Math.min(canvas.width - player.width, player.x + player.speed);
    }
    
    // Spawn coins
    spawnCoinTimer++;
    if (spawnCoinTimer > 30 - gameLevel * 2) {
        spawnCoin();
        spawnCoinTimer = 0;
    }
    
    // Spawn enemies
    spawnEnemyTimer++;
    if (spawnEnemyTimer > 100 - gameLevel * 10) {
        spawnEnemy();
        spawnEnemyTimer = 0;
    }
    
    // Update coins
    for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].y += gameSpeed;
        
        // Check collision with player
        if (checkCollision(player, coins[i])) {
            gameScore += 10 * gameLevel;
            coins.splice(i, 1);
            updateStats();
            continue;
        }
        
        // Remove coin if off screen
        if (coins[i].y > canvas.height) {
            coins.splice(i, 1);
        }
    }
    
    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += gameSpeed * 1.5;
        
        // Enemy AI - move towards player
        if (enemies[i].x < player.x) {
            enemies[i].x += 1;
        } else if (enemies[i].x > player.x) {
            enemies[i].x -= 1;
        }
        
        // Check collision with player
        if (checkCollision(player, enemies[i])) {
            gameLives--;
            enemies.splice(i, 1);
            updateStats();
            
            if (gameLives <= 0) {
                endGame();
                return;
            }
            continue;
        }
        
        // Remove enemy if off screen
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
        }
    }
    
    // Increase difficulty
    if (gameScore > gameLevel * 100) {
        gameLevel++;
        gameSpeed += 0.5;
        updateStats();
    }
    
    // Draw everything
    drawPlayer();
    drawCoins();
    drawEnemies();
    drawUI();
}

function spawnCoin() {
    const coin = {
        x: Math.random() * (canvas.width - 20),
        y: -20,
        width: 20,
        height: 20,
        color: '#f1c40f'
    };
    coins.push(coin);
}

function spawnEnemy() {
    const enemy = {
        x: Math.random() * (canvas.width - 30),
        y: -30,
        width: 30,
        height: 30,
        color: '#e74c3c'
    };
    enemies.push(enemy);
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function drawPlayer() {
    // Draw Gumball (circle)
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(player.x + 8, player.y + 10, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(player.x + 22, player.y + 10, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(player.x + 8, player.y + 10, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(player.x + 22, player.y + 10, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawCoins() {
    coins.forEach(coin => {
        // Draw coin
        ctx.fillStyle = coin.color;
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw coin border
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw $ symbol
        ctx.fillStyle = '#d4af37';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', coin.x + coin.width / 2, coin.y + coin.height / 2);
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        // Draw enemy (red square)
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Draw eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(enemy.x + 5, enemy.y + 5, 8, 8);
        ctx.fillRect(enemy.x + 17, enemy.y + 5, 8, 8);
        
        // Draw pupils
        ctx.fillStyle = 'black';
        ctx.fillRect(enemy.x + 7, enemy.y + 7, 4, 4);
        ctx.fillRect(enemy.x + 19, enemy.y + 7, 4, 4);
    });
}

function drawUI() {
    // Draw score indicator on canvas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Use Arrow Keys or A/D to Move', 10, 20);
}

function updateStats() {
    document.getElementById('score').textContent = gameScore;
    document.getElementById('lives').textContent = gameLives;
    document.getElementById('level').textContent = gameLevel;
}

function endGame() {
    gameRunning = false;
    if (gameLoop) clearInterval(gameLoop);
    removeControls();
    
    // Draw game over message
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
    
    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${gameScore}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText(`Level Reached: ${gameLevel}`, canvas.width / 2, canvas.height / 2 + 50);
}
