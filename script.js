const maze = document.getElementById('maze');
const player = document.getElementById('player');
const enemy = document.getElementById('enemy');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const scoreDisplay = document.getElementById('score');

const gridSize = 10;
const cellSize = 40;

// Maze layout: 0 = path, 1 = wall
const mazeLayout = [
    [0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 0]
];

let playerPosition = { x: 0, y: 0 };
let enemyPosition = { x: 9, y: 9 };
let score = 0;

// Questions and answers
const questions = [
    {
        question: "Apa ibukota Indonesia?",
        options: ["Jakarta", "Bandung", "Surabaya", "Medan"],
        correctAnswer: "Jakarta"
    },
    {
        question: "Berapa hasil dari 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4"
    },
    {
        question: "Planet terdekat dari matahari?",
        options: ["Bumi", "Mars", "Venus", "Merkurius"],
        correctAnswer: "Merkurius"
    }
];

let currentQuestionIndex = 0;

// Generate maze
function generateMaze() {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (mazeLayout[y][x] === 1) {
                cell.classList.add('wall');
            }
            maze.appendChild(cell);
        }
    }
}

// Move player
function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize && mazeLayout[newY][newX] === 0) {
        playerPosition.x = newX;
        playerPosition.y = newY;
        player.style.left = `${playerPosition.x * cellSize}px`;
        player.style.top = `${playerPosition.y * cellSize}px`;

        // Check if player collides with enemy
        if (playerPosition.x === enemyPosition.x && playerPosition.y === enemyPosition.y) {
            alert("Game Over! Anda menabrak musuh.");
            resetGame();
        }

        // Check if player reached the end
        if (newX === gridSize - 1 && newY === gridSize - 1) {
            alert('Selamat! Anda berhasil keluar dari labirin!');
            resetGame();
        }
    }
}

// Move enemy randomly
function moveEnemy() {
    const directions = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
    ];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const newX = enemyPosition.x + randomDirection.dx;
    const newY = enemyPosition.y + randomDirection.dy;

    if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize && mazeLayout[newY][newX] === 0) {
        enemyPosition.x = newX;
        enemyPosition.y = newY;
        enemy.style.left = `${enemyPosition.x * cellSize}px`;
        enemy.style.top = `${enemyPosition.y * cellSize}px`;
    }
}

// Show question
function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    optionsContainer.innerHTML = "";
    question.options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => checkAnswer(option, question.correctAnswer));
        optionsContainer.appendChild(optionElement);
    });
}

// Check answer
function checkAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        score += 3;
        alert("Jawaban benar! Skor +3");
    } else {
        score -= 1;
        alert("Jawaban salah! Skor -1");
    }
    scoreDisplay.textContent = score;
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    showQuestion();
}

// Reset game
function resetGame() {
    playerPosition = { x: 0, y: 0 };
    enemyPosition = { x: 9, y: 9 };
    player.style.left = "0px";
    player.style.top = "0px";
    enemy.style.left = "360px";
    enemy.style.top = "360px";
    score = 0;
    scoreDisplay.textContent = score;
    currentQuestionIndex = 0;
    showQuestion();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
});

// Initialize game
generateMaze();
showQuestion();
setInterval(moveEnemy, 1000); // Move enemy every second
