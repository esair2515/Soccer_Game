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
        speed: 8,
        hasBall: false,
        direction: 'down',  // For animation
    };

    const opponent = {
        x: fieldWidth / 2 + 200,
        y: fieldHeight / 2,
        size: 30,
        color: 'red',
        speed: 5,
        hasBall: false,
        direction: 'down',  // For animation
    };

    const ball = {
        x: fieldWidth / 2,
        y: fieldHeight / 2,
        size: 15,
        color: 'white',
        speed: 10,
        dx: 0,
        dy: 0,
    };

    const camera = {
        x: player.x - canvas.width / 2,
        y: player.y - canvas.height / 2,
    };

    let playerScore = 0;
    let opponentScore = 0;
    let celebrating = false;

    function startCountdown(callback) {
        let countdown = 3;
        const interval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawField();
            drawPlayer(player);
            drawPlayer(opponent);
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

            moveCharacter(opponent, dx, dy);

            // AI decision to shoot when near the goal
            if (Math.abs(opponent.x - 100) < 50 && Math.abs(opponent.y - fieldHeight / 2) < 200) {
                opponent.hasBall = false;
                ball.dx = -ball.speed;
                ball.dy = 0;
            }
        }

        drawPlayer(opponent);
    }

    function drawScore() {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Player: ${playerScore} | Opponent: ${opponentScore}`, canvas.width / 2, 50);
    }

    function checkGoal() {
        if (ball.x < 100 && Math.abs(ball.y - fieldHeight / 2) < 200) {
            opponentScore++;
            resetGame();
        } else if (ball.x > field.width - 100 && Math.abs(ball.y - fieldHeight / 2) < 200) {
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
                // Implement shooting logic
                ball.dx = (player.direction === 'left' ? -1 : 1) * ball.speed;
                ball.dy = (player.direction === 'up' ? -1 : 1) * ball.speed;
            }
        } else if (keysPressed['p']) {
            if (player.hasBall) {
                // Implement passing logic
                player.hasBall = false;
                ball.dx = 3 * ball.speed;
            }
        } else if (keysPressed['o']) {
            if (player.hasBall) {
                // Implement juking logic
                dx *= 2;
                dy *= 2;
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        keysPressed[event.key] = false;
    });

    function gameLoop() {
        movePlayer();
        moveOpponent();
        checkGoal();
        requestAnimationFrame(gameLoop);
    }

    startCountdown(gameLoop);
});
