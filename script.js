document.getElementById('start-game').addEventListener('click', function() {
    document.getElementById('home-page').style.display = 'none';
    const canvas = document.getElementById('gameCanvas');
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');

    // Set the field dimensions
    const fieldWidth = 2500;
    const fieldHeight = 1600;

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
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 30,
        color: 'blue',
        speed: 5,
    };

    const ball = {
        x: fieldWidth / 2,
        y: fieldHeight / 2,
        size: 20,
        color: 'white',
        speed: 8,
    };

    const camera = {
        x: player.x - canvas.width / 2,
        y: player.y - canvas.height / 2,
    };

    function drawField() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = field.color;
        ctx.fillRect(-camera.x, -camera.y, field.width, field.height);

        ctx.strokeStyle = field.lineColor;
        ctx.lineWidth = field.lineWidth;

        ctx.beginPath();
        ctx.arc(field.width / 2 - camera.x, field.height / 2 - camera.y, 100, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(field.width / 2 - camera.x, 0 - camera.y);
        ctx.lineTo(field.width / 2 - camera.x, field.height - camera.y);
        ctx.stroke();

        ctx.strokeRect(0 - camera.x, (field.height / 2) - 200 - camera.y, 400, 400);
        ctx.strokeRect(field.width - 400 - camera.x, (field.height / 2) - 200 - camera.y, 400, 400);
    }

    function drawPlayer() {
        ctx.fillStyle = player.color;

        // Draw head
        ctx.beginPath();
        ctx.arc(player.x - camera.x, player.y - player.size / 1.5 - camera.y, player.size / 2, 0, 2 * Math.PI);
        ctx.fill();

        // Draw body
        ctx.fillRect(player.x - player.size / 4 - camera.x, player.y - player.size / 2 - camera.y, player.size / 2, player.size);

        // Draw legs
        ctx.fillRect(player.x - player.size / 4 - camera.x, player.y + player.size / 2 - camera.y, player.size / 4, player.size / 2);
        ctx.fillRect(player.x - camera.x, player.y + player.size / 2 - camera.y, player.size / 4, player.size / 2);
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

    function movePlayer() {
        let dx = 0, dy = 0;

        if (keysPressed['w']) dy -= player.speed;
        if (keysPressed['a']) dx -= player.speed;
        if (keysPressed['s']) dy += player.speed;
        if (keysPressed['d']) dx += player.speed;

        player.x += dx;
        player.y += dy;
        updateCamera();
        handleBallCollision();
        drawField();
        drawPlayer();
        drawBall();
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

    const keysPressed = {};

    document.addEventListener('keydown', function(event) {
        keysPressed[event.key] = true;
        movePlayer();
    });

    document.addEventListener('keyup', function(event) {
        keysPressed[event.key] = false;
    });

    drawField();
    drawPlayer();
    drawBall();
});
