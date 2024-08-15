document.getElementById('start-game').addEventListener('click', function() {
    document.getElementById('home-page').style.display = 'none';
    const canvas = document.getElementById('gameCanvas');
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');

    // Set the field dimensions and player size
    const fieldWidth = 2500; // Reduced size to zoom out
    const fieldHeight = 1600; // Reduced size to zoom out
    const playerSize = 30; // Smaller player for zoom out

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
        size: playerSize,
        color: 'blue',
        speed: 5,
    };

    const camera = {
        x: player.x - canvas.width / 2,
        y: player.y - canvas.height / 2,
    };

    function drawField() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the field
        ctx.fillStyle = field.color;
        ctx.fillRect(-camera.x, -camera.y, field.width, field.height);

        // Draw field markings
        ctx.strokeStyle = field.lineColor;
        ctx.lineWidth = field.lineWidth;

        // Center circle
        ctx.beginPath();
        ctx.arc(field.width / 2 - camera.x, field.height / 2 - camera.y, 100, 0, 2 * Math.PI);
        ctx.stroke();

        // Midfield line
        ctx.beginPath();
        ctx.moveTo(field.width / 2 - camera.x, 0 - camera.y);
        ctx.lineTo(field.width / 2 - camera.x, field.height - camera.y);
        ctx.stroke();

        // Goal boxes
        ctx.strokeRect(0 - camera.x, (field.height / 2) - 200 - camera.y, 400, 400); // Left goal box
        ctx.strokeRect(field.width - 400 - camera.x, (field.height / 2) - 200 - camera.y, 400, 400); // Right goal box
    }

    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x - player.size / 2 - camera.x, player.y - player.size / 2 - camera.y, player.size, player.size);
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
        drawField();
        drawPlayer();
    }

    // Track multiple key presses
    const keysPressed = {};

    document.addEventListener('keydown', function(event) {
        keysPressed[event.key] = true;
        movePlayer();
    });

    document.addEventListener('keyup', function(event) {
        keysPressed[event.key] = false;
    });

    // Initial draw
    drawField();
    drawPlayer();
});
