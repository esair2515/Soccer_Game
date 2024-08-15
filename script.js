document.getElementById('start-game').addEventListener('click', function() {
    document.getElementById('home-page').style.display = 'none';
    const canvas = document.getElementById('gameCanvas');
    canvas.style.display = 'block';
    canvas.width = 800;
    canvas.height = 600;

    const ctx = canvas.getContext('2d');

    // Draw the soccer field
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw field markings
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;

    // Center circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, 2 * Math.PI);
    ctx.stroke();

    // Midfield line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Goal boxes
    ctx.strokeRect(0, (canvas.height / 2) - 50, 100, 100); // Left goal box
    ctx.strokeRect(canvas.width - 100, (canvas.height / 2) - 50, 100, 100); // Right goal box

    // Player setup
    const player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 20,
        color: 'blue',
    };

    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
    }

    function movePlayer(dx, dy) {
        player.x += dx;
        player.y += dy;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
    }

    // Initial draw
    drawPlayer();

    // Player movement
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'w':
                movePlayer(0, -10);
                break;
            case 'a':
                movePlayer(-10, 0);
                break;
            case 's':
                movePlayer(0, 10);
                break;
            case 'd':
                movePlayer(10, 0);
                break;
        }
    });
});
