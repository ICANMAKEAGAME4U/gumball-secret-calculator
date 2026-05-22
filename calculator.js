// Calculator Logic
let display = document.getElementById('display');
let currentValue = '0';
let previousValue = '';
let operator = null;
let shouldResetDisplay = false;

// Secret code to unlock the game
const SECRET_CODE = '5318008';

function appendNumber(num) {
    if (shouldResetDisplay) {
        currentValue = num;
        shouldResetDisplay = false;
    } else {
        if (currentValue === '0' && num !== '.') {
            currentValue = num;
        } else if (num === '.' && currentValue.includes('.')) {
            return;
        } else {
            currentValue += num;
        }
    }
    updateDisplay();
}

function setOperator(op) {
    if (currentValue === '') return;
    
    if (previousValue !== '') {
        calculate();
    }
    
    operator = op;
    previousValue = currentValue;
    shouldResetDisplay = true;
}

function calculate() {
    if (!previousValue || !operator || !currentValue) return;
    
    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = current !== 0 ? prev / current : 0;
            break;
        default:
            return;
    }
    
    currentValue = result.toString();
    operator = null;
    previousValue = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function clearDisplay() {
    currentValue = '0';
    previousValue = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function updateDisplay() {
    // Limit display to 12 characters
    let displayText = currentValue;
    if (displayText.length > 12) {
        displayText = displayText.substring(0, 12);
    }
    display.textContent = displayText;
}

function checkSecret() {
    // Check if the current display shows the secret code
    if (currentValue === SECRET_CODE) {
        unlockSecret();
    } else {
        // Otherwise, calculate normally
        calculate();
    }
}

function unlockSecret() {
    console.log('🎮 SECRET UNLOCKED! Launching Gumball Coin Rush...');
    
    // Hide calculator, show game
    document.getElementById('calculator-view').classList.remove('active');
    document.getElementById('game-view').classList.add('active');
    
    // Start the game
    if (typeof startGame === 'function') {
        startGame();
    }
}

function resetCalculator() {
    // Hide game, show calculator
    document.getElementById('game-view').classList.remove('active');
    document.getElementById('calculator-view').classList.add('active');
    
    // Reset calculator state
    clearDisplay();
    
    // Stop the game
    if (typeof stopGame === 'function') {
        stopGame();
    }
}

// Initialize display
updateDisplay();
