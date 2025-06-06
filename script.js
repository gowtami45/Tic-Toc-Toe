document.addEventListener('DOMContentLoaded', () => {
    // Create confetti function
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        document.body.appendChild(confettiContainer);
        
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = Math.random() * 2 + 3 + 's';
            confettiContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
        
        // Remove container after all confetti is gone
        setTimeout(() => {
            confettiContainer.remove();
        }, 6000);
    }
    // DOM Elements
    const playerForm = document.getElementById('player-form');
    const gameContainer = document.getElementById('game-container');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const startButton = document.getElementById('start-game');
    const restartButton = document.getElementById('restart');
    const statusDisplay = document.getElementById('status');
    const cells = document.querySelectorAll('.cell');
    
    // Game variables
    let gameActive = false;
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let player1Name = '';
    let player2Name = '';
    
    // Winning combinations
    const winningConditions = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal top-left to bottom-right
        [2, 4, 6]  // Diagonal top-right to bottom-left
    ];
    
    // Start game when form is submitted
    startButton.addEventListener('click', startGame);
    
    // Restart game when restart button is clicked
    restartButton.addEventListener('click', restartGame);
    
    // Add click event listeners to all cells
    cells.forEach(cell => {
        cell.addEventListener('click', () => handleCellClick(cell));
    });
    
    // Start the game
    function startGame() {
        // Validate player names
        if (!player1Input.value.trim() || !player2Input.value.trim()) {
            alert('Please enter names for both players!');
            return;
        }
        
        // Set player names
        player1Name = player1Input.value.trim();
        player2Name = player2Input.value.trim();
        
        // Hide form and show game
        playerForm.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        
        // Initialize game
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.textContent = `${player1Name}'s turn (X)`;
        statusDisplay.classList.remove('winner');
        
        // Clear the board
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
    }
    
    // Handle cell click
    function handleCellClick(cell) {
        const cellIndex = parseInt(cell.getAttribute('data-cell-index'));
        
        // Check if cell is already filled or game is not active
        if (gameState[cellIndex] !== '' || !gameActive) {
            // Add a shake animation if cell is already filled
            if (gameState[cellIndex] !== '') {
                cell.classList.add('shake');
                setTimeout(() => {
                    cell.classList.remove('shake');
                }, 500);
            }
            return;
        }
        
        // Update game state
        gameState[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        cell.classList.add('pop-in');
        
        // Check for win or draw
        checkResult();
    }
    
    // Check for win or draw
    function checkResult() {
        let roundWon = false;
        let winningLine = null;
        
        // Check all winning combinations
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const condition = gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c];
            
            if (condition) {
                roundWon = true;
                winningLine = winningConditions[i];
                break;
            }
        }
        
        // If someone won
        if (roundWon) {
            const winner = currentPlayer === 'X' ? player1Name : player2Name;
            statusDisplay.textContent = `${winner} wins!`;
            statusDisplay.classList.add('winner');
            gameActive = false;
            
            // Highlight winning cells with animation
            if (winningLine) {
                winningLine.forEach(index => {
                    setTimeout(() => {
                        cells[index].classList.add('winning-cell');
                    }, 200 * index);
                });
            }
            
            // Create confetti effect
            createConfetti();
            return;
        }
        
        // If it's a draw
        if (!gameState.includes('')) {
            statusDisplay.textContent = 'Game ended in a draw!';
            gameActive = false;
            return;
        }
        
        // Continue game with next player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        const currentPlayerName = currentPlayer === 'X' ? player1Name : player2Name;
        statusDisplay.textContent = `${currentPlayerName}'s turn (${currentPlayer})`;
    }
    
    // Restart the game
    function restartGame() {
        // Show form and hide game
        playerForm.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        
        // Reset inputs
        player1Input.value = '';
        player2Input.value = '';
        
        // Reset game state
        gameActive = false;
        gameState = ['', '', '', '', '', '', '', '', ''];
        
        // Clear the board
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell', 'pop-in', 'shake');
        });
        
        // Remove any confetti
        const confetti = document.querySelectorAll('.confetti');
        confetti.forEach(item => item.remove());
    }
});