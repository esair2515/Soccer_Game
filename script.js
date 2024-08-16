document.getElementById('start-game').addEventListener('click', function() {
    document.getElementById('home-page').style.display = 'none';
    const canvas = document.getElementById('gameCanvas');
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');

    const fieldWidth = 5000;
    const fieldHeight = 3000;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const field = {
        width: fieldWidth,
        height: fieldHeight,
        color: '#228B22',
        lineColor: 'white',
        lineWidth: 10,
    };

    const player = {
        x: fieldWidth / 2 - 200,
        y: fieldHeight / 2,
        size: 30,
        color: 'blue',
        speed: 10,
        hasBall: false,
        direction: 'down',
    };

    const opponent = {
        x: fieldWidth / 2 + 200,
        y: fieldHeight / 2,
        size: 30,
        color: 'red',
        speed: 6,
        hasBall: false,
        direction: 'down',
    };

    const goalkeeper = {
        x: 100,
        y: fieldHeight / 2,
        size: 30,
        color: 'yellow',
        speed: 5,
    };

    const opponentGoalkeeper = {
        x: fieldWidth - 100,
        y: fieldHeight / 2,
        size: 30,
        color: 'yellow',
        speed: 5,
    };

    const ball = {
        x: fieldWidth / 2,
        y: fieldHeight / 2,
        size: 12,
        color: 'white',
        speed: 12,
        dx: 0,
        dy: 0,
        friction: 0.98,
    };

    const camera = {
        x: player.x - canvas.width / 2,
        y: player.y - canvas.height / 2,
    };

    let playerScore = 0;
    let opponentScore = 0;
    let celebrating = false;
    let gameOver = false;

    function startCountdown(callback) {
        let countdown = 3;
        const interval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawField();
            drawPlayer(player);
            drawPlayer(opponent);
            drawPlayer(goalkeeper);
            drawPlayer(opponentGoalkeeper);
            drawBall();
            drawScore();

            ctx.fillStyle = 'white';
            ctx.font = '100px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(countdown > 0 ? countdown : 'Go!', canvas.width / 2, canvas.height / 2);

            countdown--;

            if (countdown < -1) {
                clearInterval(interval);
                callback();
            }
        }, 1000);
    }

    function drawField() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = field.color;
        ctx.fillRect(-camera.x, -camera.y, field.width, field.height);

        ctx.strokeStyle = field.lineColor;
        ctx.lineWidth = field.lineWidth;

        // Draw center circle
        ctx.beginPath();
        ctx.arc(field.width / 2 - camera.x, field.height / 2 - camera.y, 100, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw center line
        ctx.beginPath();
        ctx.moveTo(field.width / 2 - camera.x, 0 - camera.y);
        ctx.lineTo(field.width / 2 - camera.x, field.height - camera.y);
        ctx.stroke();

        // Draw goals with shadows
        drawGoalWithShadow(0 - camera.x, (field.height / 2) - 200 - camera.y);
        drawGoalWithShadow(field.width - 100 - camera.x, (field.height / 2) - 200 - camera.y);

        // Draw penalty boxes
        ctx.strokeRect(0 - camera.x, (field.height / 2) - 600 - camera.y, 800, 1200);
        ctx.strokeRect(field.width - 800 - camera.x, (field.height / 2) - 600 - camera.y, 800, 1200);
    }

    function drawGoalWithShadow(x, y) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.strokeRect(x, y, 100, 400);
        ctx.fillStyle = 'gray';
        ctx.fillRect(x + 100, y + 20, 20, 400); // Shadow effect
    }

    function drawPlayer(character) {
        ctx.fillStyle = character.color;

        // Draw head
        ctx.beginPath();
        ctx.arc(character.x - camera.x, character.y - character.size / 1.5 - camera.y, character.size / 2, 0, 2 * Math.PI);
        ctx.fill();

        // Draw body
        ctx.fillRect(character.x - character.size / 4 - camera.x, character.y - character.size / 2 - camera.y, character.size / 2, character.size);

        // Draw legs
        ctx.fillRect(character.x - character.size / 4 - camera.x, character.y + character.size / 2 - camera.y, character.size / 4, character.size / 2);
        ctx.fillRect(character.x - camera.x, character.y + character.size / 2 - camera.y, character.size / 4, character.size / 2);
    }

    function drawBall() {
        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc(ball.x - camera.x, ball.y - camera.y, ball.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    function updateCamera() {
        camera.x = player.x - canvas.width / 2;
        camera.y = player.y - canvas.height / 2;
    }

    function moveCharacter(character, dx, dy) {
        character.x += dx;
        character.y += dy;

        // Prevent moving out of bounds
        character.x = Math.max(character.size / 2, Math.min(character.x, field.width - character.size / 2));
        character.y = Math.max(character.size / 2, Math.min(character.y, field.height - character.size / 2));
    }

    function handleBallCollision(character) {
        const distX = character.x - ball.x;
        const distY = character.y - ball.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < character.size / 2 + ball.size) {
            character.hasBall = true;
            if (character === player) {
                opponent.hasBall = false;
            } else {
                player.hasBall = false;
            }
            ball.x = character.x;
            ball.y = character.y;
            ball.dx = 0;
            ball.dy = 0;
        } else {
            character.hasBall = false;
        }
    }

    function movePlayer() {
        let dx = 0, dy = 0;

        if (keysPressed['w']) dy -= player.speed;
        if (keysPressed['a']) dx -= player.speed;
        if (keysPressed['s']) dy += player.speed;
        if (keysPressed['d']) dx += player.speed;

        moveCharacter(player, dx, dy);
        updateCamera();
        handleBallCollision(player);
        drawField();
        drawPlayer(player);
        drawPlayer(opponent);
        drawPlayer(goalkeeper);
        drawPlayer(opponentGoalkeeper);
        drawBall();
        drawScore();
    }

    function moveOpponent() {
        let dx = 0, dy = 0;

        if (!opponent.hasBall) {
            if (ball.x > opponent.x) dx = opponent.speed;
            else if (ball.x < opponent.x) dx = -opponent.speed;

            if (ball.y > opponent.y) dy = opponent.speed;
            else if (ball.y < opponent.y) dy = -opponent.speed;
        }

        moveCharacter(opponent, dx, dy);
        handleBallCollision(opponent);

        // If the opponent has the ball, move towards the player's goal
        if (opponent.hasBall) {
            if (opponent.x > fieldWidth / 2) dx = -opponent.speed;
            if (opponent.y > fieldHeight / 2 + 200) dy = -opponent.speed;
            if (opponent.y < fieldHeight / 2 - 200) dy = opponent.speed;
        }

        moveCharacter(opponent, dx, dy);
    }

    function moveGoalkeeper(character) {
        if (ball.y > character.y) character.y += character.speed;
        if (ball.y < character.y) character.y -= character.speed;

        character.y = Math.max(200, Math.min(character.y, fieldHeight - 200));
    }

    function drawScore() {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${playerScore} - ${opponentScore}`, canvas.width / 2, 50);
    }

    function checkGoal() {
        if (ball.x < 100 && Math.abs(ball.y - fieldHeight / 2) < 200) {
            opponentScore++;
            resetGame();
        } else if (ball.x > fieldWidth - 100 && Math.abs(ball.y - fieldHeight / 2) < 200) {
            playerScore++;
            resetGame();
        }
    }

    function resetGame() {
        player.x = fieldWidth / 2 - 200;
        player.y = fieldHeight / 2;
        opponent.x = fieldWidth / 2 + 200;
        opponent.y = fieldHeight / 2;
        ball.x = fieldWidth / 2;
        ball.y = fieldHeight / 2;
        ball.dx = 0;
        ball.dy = 0;
        player.hasBall = false;
        opponent.hasBall = false;
        celebrating = true;

        setTimeout(() => {
            celebrating = false;
        }, 2000);
    }

    document.addEventListener('keydown', function(event) {
        keysPressed[event.key] = true;

        if (keysPressed[' ']) {
            if (player.hasBall) {
                ball.dx = (player.direction === 'left' ? -1 : 1) * ball.speed;
                ball.dy = (player.direction === 'up' ? -1 : 1) * ball.speed;
            }
        } else if (keysPressed['p']) {
            if (player.hasBall) {
                player.hasBall = false;
                ball.dx = 3 * ball.speed;
            }
        } else if (keysPressed['o']) {
            if (player.hasBall) {
                ball.dx *= 2;
                ball.dy *= 2;
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        keysPressed[event.key] = false;
    });

    function gameLoop() {
        movePlayer();
        moveOpponent();
        moveGoalkeeper(goalkeeper);
        moveGoalkeeper(opponentGoalkeeper);
        checkGoal();
        requestAnimationFrame(gameLoop);
    }

    startCountdown(gameLoop);
});
// Add team selection to the game

const teams = [
    { name: 'Manchester United', shirtColor: 'red', pantsColor: 'white' },
    { name: 'Chelsea', shirtColor: 'blue', pantsColor: 'white' },
    { name: 'Liverpool', shirtColor: 'red', pantsColor: 'red' },
    { name: 'Manchester City', shirtColor: 'skyblue', pantsColor: 'white' },
    { name: 'Arsenal', shirtColor: 'red', pantsColor: 'white' },
];

let selectedTeam = teams[0]; // Default team

document.getElementById('teamButton').addEventListener('click', function() {
    const teamName = prompt('Choose your team: Manchester United, Chelsea, Liverpool, Manchester City, Arsenal');
    const team = teams.find(t => t.name.toLowerCase() === teamName.toLowerCase());

    if (team) {
        selectedTeam = team;
        alert(`You selected ${selectedTeam.name}!`);
    } else {
        alert('Team not found. Defaulting to Manchester United.');
    }
});

// Update player colors based on selected team
function drawPlayer(player) {
    ctx.fillStyle = selectedTeam.shirtColor;
    ctx.fillRect(player.x - 10, player.y - 20, 20, 20); // Shirt
    ctx.fillStyle = selectedTeam.pantsColor;
    ctx.fillRect(player.x - 10, player.y, 20, 20); // Pants
}

// Ensure the game starts after the countdown
function startCountdown(callback) {
    let count = 3;
    const countdownInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(count, canvas.width / 2, canvas.height / 2);
        count--;

        if (count < 0) {
            clearInterval(countdownInterval);
            callback(); // Start the game
        }
    }, 1000);
}

// Call this function when the "Start Game" button is clicked
document.getElementById('startGame').addEventListener('click', function() {
    startCountdown(() => {
        gameLoop();
    });
});

// The rest of the game loop, AI, ball movement, etc.
function gameLoop() {
    movePlayer();
    moveOpponent();
    moveGoalkeeper(goalkeeper);
    moveGoalkeeper(opponentGoalkeeper);
    checkGoal();
    requestAnimationFrame(gameLoop);
}

// Example function to draw the ball and other elements
function drawGameElements() {
    drawField();
    drawPlayer(player);
    drawPlayer(opponent);
    drawBall();
    drawGoals();
    drawScore();
}

requestAnimationFrame(gameLoop);
// Handle the team selection modal
const teamSelectionModal = document.getElementById('teamSelectionModal');
const teamDropdown = document.getElementById('teamDropdown');
const selectTeamButton = document.getElementById('selectTeam');
const closeModal = document.getElementById('closeModal');

// Open the modal when the team button is clicked
document.getElementById('teamButton').addEventListener('click', function() {
    teamSelectionModal.style.display = 'flex';
});

// Close the modal when the user clicks the close button
closeModal.addEventListener('click', function() {
    teamSelectionModal.style.display = 'none';
});

// Select the team and update player colors
selectTeamButton.addEventListener('click', function() {
    const selectedTeamName = teamDropdown.value;
    selectedTeam = teams.find(t => t.name === selectedTeamName);
    alert(`You selected ${selectedTeam.name}!`);
    teamSelectionModal.style.display = 'none';
});

// Improved countdown sequence
function startCountdown(callback) {
    let count = 3;
    const countdownElement = document.createElement('div');
    countdownElement.className = 'countdown';
    document.body.appendChild(countdownElement);

    const countdownInterval = setInterval(() => {
        countdownElement.textContent = count > 0 ? count : 'Go!';
        count--;

        if (count < 0) {
            clearInterval(countdownInterval);
            document.body.removeChild(countdownElement);
            callback(); // Start the game
        }
    }, 1000);
}

// Updated player and ball interaction
document.addEventListener('keydown', function(event) {
    keysPressed[event.key] = true;

    if (keysPressed[' ']) {
        if (player.hasBall) {
            ball.dx = (player.direction === 'left' ? -1 : 1) * ball.speed;
            ball.dy = (player.direction === 'up' ? -1 : 1) * ball.speed;
            player.hasBall = false;
        }
    } else if (keysPressed['p']) {
        if (player.hasBall) {
            ball.dx = 3 * ball.speed;
            player.hasBall = false;
        }
    } else if (keysPressed['o']) {
        if (player.hasBall) {
            ball.dx *= 2;
            ball.dy *= 2;
        }
    }
});

function drawPlayer(player) {
    ctx.fillStyle = selectedTeam.shirtColor;
    ctx.fillRect(player.x - 10, player.y - 20, 20, 20); // Shirt
    ctx.fillStyle = selectedTeam.pantsColor;
    ctx.fillRect(player.x - 10, player.y, 20, 20); // Pants
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(player.x, player.y - 30, 10, 0, Math.PI * 2); // Head
    ctx.fill();
}
// AI Logic for Stealing, Passing, and Shooting
function aiBehavior() {
    // AI should only steal the ball if it's close enough and if it doesn't already have the ball
    const distanceToBall = Math.hypot(aiPlayer.x - ball.x, aiPlayer.y - ball.y);
    if (distanceToBall < 30 && !aiPlayer.hasBall) {
        aiPlayer.hasBall = true;
        player.hasBall = false;
    }

    // AI movement logic to either pass, shoot, or juke
    if (aiPlayer.hasBall) {
        const randomAction = Math.random();
        if (randomAction < 0.4) {
            // Pass
            aiPass();
        } else if (randomAction < 0.7) {
            // Shoot
            aiShoot();
        } else {
            // Juke
            aiJuke();
        }
    }

    // AI movement towards the goal
    aiPlayer.x += aiPlayer.dx;
    aiPlayer.y += aiPlayer.dy;
    // Keep the AI within the field bounds
    keepPlayerInBounds(aiPlayer);
}

// AI Pass Function
function aiPass() {
    if (aiPlayer.hasBall) {
        ball.dx = -2 * ball.speed;
        ball.dy = 1 * ball.speed;
        aiPlayer.hasBall = false;
    }
}

// AI Shoot Function
function aiShoot() {
    if (aiPlayer.hasBall) {
        ball.dx = 5 * ball.speed;
        ball.dy = 0;
        aiPlayer.hasBall = false;
    }
}

// AI Juke Function
function aiJuke() {
    if (aiPlayer.hasBall) {
        ball.dx = 0;
        ball.dy = -5 * ball.speed;
        aiPlayer.hasBall = false;
    }
}

// Ensure the AI Player stays within the bounds of the field
function keepPlayerInBounds(player) {
    if (player.x < 0) player.x = 0;
    if (player.x > fieldWidth) player.x = fieldWidth;
    if (player.y < 0) player.y = 0;
    if (player.y > fieldHeight) player.y = fieldHeight;
}
// Drawing the goals with shadows for more realism
function drawGoal(x, y) {
    ctx.fillStyle = '#ffffff'; // White for the goal post
    ctx.fillRect(x, y - 40, 10, 80); // Goal post
    ctx.fillStyle = '#cccccc'; // Gray for the shadow
    ctx.fillRect(x + 10, y - 40, 5, 80); // Shadow
}

// Updated draw function for the game
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawField(); // Function to draw the field
    drawPlayer(player);
    drawPlayer(aiPlayer);
    drawBall();
    drawGoal(50, canvas.height / 2); // Left goal
    drawGoal(canvas.width - 60, canvas.height / 2); // Right goal
    updateScores();
}

// Adjust field size and zoom
function adjustField() {
    fieldWidth = canvas.width * 1.2;
    fieldHeight = canvas.height * 1.2;
    ctx.scale(0.9, 0.9); // Zoom out slightly
}

// Call this function at the start of the game
adjustField();
