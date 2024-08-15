document.getElementById('start-game').addEventListener('click', function() {
    document.getElementById('home-page').style.display = 'none';
    const canvas = document.getElementById('gameCanvas');
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');

    // Set the field dimensions
    const fieldWidth = 4000;
    const fieldHeight = 2500;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Field setup
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
    };

    const opponent = {
        x: fieldWidth / 2 + 200,
        y: fieldHeight / 2,
        size: 30,
        color: 'red',
        speed: 5, // Slower than player
    };

    const ball = {
        x: fieldWidth / 2,
        y: fieldHeight / 2,
        size: 15,
        color: 'white',
        speed: 10,
    };

    const camera = {
        x: player.x - canvas.width / 2,
        y: player.y - canvas.height / 2,
    };

    let playerScore = 0;
    let opponentScore = 0;

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

        // Draw goals
        ctx.strokeRect(0 - camera.x, (field.height / 2) - 200 - camera.y, 400, 400);
        ctx.strokeRect(field.width - 400 - camera.x, (field.height / 2) - 200 - camera.y, 400, 400);

        // Draw penalty boxes
        ctx.strokeRect(0 - camera.x, (field.height / 2) - 600 - camera.y, 800, 1200);
        ctx.strokeRect(field.width - 800 - camera.x, (field.height / 2) - 600 - camera.y, 800, 1200);
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

    function handleBallCollision() {
        const distX = player.x - ball.x;
        const distY = player.y - ball.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < player.size / 2 + ball.size) {
            const angle = Math.atan2(distY, distX);
            ball.x += Math.cos(angle) * ball.speed;
            ball.y += Math.sin(angle) * ball.speed;
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
        handleBallCollision();
        drawField();
        drawPlayer(player);
        drawPlayer(opponent);
        drawBall();
        drawScore();
    }

    function moveOpponent() {
        const dx = (ball.x > opponent.x) ? opponent.speed : -opponent.speed;
        const dy = (ball.y > opponent.y) ? opponent.speed : -opponent.speed;

        moveCharacter(opponent, dx, dy);
        drawPlayer(opponent);
    }

    function drawScore() {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText(`Player: ${playerScore}`, 50, 50);
        ctx.fillText(`Opponent: ${opponentScore}`, canvas.width - 200, 50);
    }

    function checkGoal() {
        if (ball.x < 400 && ball.y > field.height / 2 - 200 && ball.y < field.height / 2 + 200) {
            opponentScore++;
            resetBall();
        } else if (ball.x > field.width - 400 && ball.y > field.height / 2 - 200 && ball.y < field.height / 2 + 200) {
            playerScore++;
            resetBall();
        }
    }

    function resetBall() {
        ball.x = fieldWidth / 2;
        ball.y = fieldHeight / 2;
    }

    const keysPressed = {};

    document.addEventListener('keydown', function(event) {
        keysPressed[event.key] = true;

        // Handle special controls
        if (keysPressed['p'] && keysPressed['o']) {
            console.log("Shoot!");
            // Implement shooting logic here
        } else if (event.key === 'p') {
            console.log("Pass!");
            // Implement passing logic here
        } else if (event.key === 'o') {
            console.log("Juke!");
            // Implement juking logic here
        }

        movePlayer();
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

    drawField();
    drawPlayer(player);
    drawPlayer(opponent);
    drawBall();
    gameLoop();
});
