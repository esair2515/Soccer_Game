// JavaScript code for Premier League Soccer Game

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

let gameStarted = false;

const player = {
    x: 100,
    y: 300,
    width: 20,
    height: 20,
    dx: 0,
    dy: 0,
    speed: 5,
    shirtColor: "blue",
    pantsColor: "black",
    hasBall: false
};

const aiPlayer = {
    x: 700,
    y: 300,
    width: 20,
    height: 20,
    dx: 0,
    dy: 0,
    speed: 4,
    shirtColor: "red",
    pantsColor: "white",
    hasBall: false
};

const ball = {
    x: 400,
    y: 300,
    dx: 0,
    dy: 0,
    radius: 10,
    speed: 3
};

// Premier League Teams Data
const teams = [
    { name: "Manchester United", colors: { shirt: "red", pants: "white" } },
    { name: "Chelsea", colors: { shirt: "blue", pants: "white" } },
    { name: "Liverpool", colors: { shirt: "red", pants: "red" } },
    { name: "Arsenal", colors: { shirt: "red", pants: "white" } },
    // Add more teams as needed
];

let selectedTeam = teams[0]; // Default to the first team

// Function to display team selection options
function displayTeamSelection() {
    const teamSelectDiv = document.getElementById("team-selection");
    teamSelectDiv.innerHTML = "<h2>Select Your Team</h2>";

    teams.forEach((team, index) => {
        const teamButton = document.createElement("button");
        teamButton.innerText = team.name;
        teamButton.style.backgroundColor = team.colors.shirt;
        teamButton.style.color = "white";
        teamButton.onclick = () => selectTeam(index);
        teamSelectDiv.appendChild(teamButton);
    });
}

// Function to select a team
function selectTeam(index) {
    selectedTeam = teams[index];
    player.shirtColor = selectedTeam.colors.shirt;
    player.pantsColor = selectedTeam.colors.pants;
}

// Call this function when the player is choosing their team
displayTeamSelection();

// Function to draw the player
function drawPlayer(player) {
    ctx.fillStyle = player.shirtColor;
    ctx.fillRect(player.x - 10, player.y - 20, 20, 20); // Shirt
    ctx.fillStyle = player.pantsColor;
    ctx.fillRect(player.x - 10, player.y, 20, 20); // Pants
}

// Function to draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

// Function to draw the goals with shadows for more realism
function drawGoal(x, y) {
    ctx.fillStyle = '#ffffff'; // White for the goal post
    ctx.fillRect(x, y - 40, 10, 80); // Goal post
    ctx.fillStyle = '#cccccc'; // Gray for the shadow
    ctx.fillRect(x + 10, y - 40, 5, 80); // Shadow
}

// Function to handle player movement
function movePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Function to handle ball movement
function moveBall() {
    if (player.hasBall) {
        ball.x = player.x + player.dx * ball.speed;
        ball.y = player.y + player.dy * ball.speed;
    } else {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Bounce off the walls
        if (ball.x < 0 || ball.x > canvas.width) ball.dx *= -1;
        if (ball.y < 0 || ball.y > canvas.height) ball.dy *= -1;
    }
}

// Function to check collision between player and ball
function checkBallCollision() {
    const distX = player.x - ball.x;
    const distY = player.y - ball.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < player.width / 2 + ball.radius) {
        player.hasBall = true;
        ball.dx = 0;
        ball.dy = 0;
    } else {
        player.hasBall = false;
    }
}

// Game loop
function gameLoop() {
    if (!gameStarted) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGoal(50, canvas.height / 2); // Left goal
    drawGoal(canvas.width - 60, canvas.height / 2); // Right goal

    movePlayer();
    moveBall();
    checkBallCollision();

    drawPlayer(player);
    drawPlayer(aiPlayer);
    drawBall();

    requestAnimationFrame(gameLoop);
}

// Countdown function
function startCountdown() {
    let countdownValue = 3;
    const countdownInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "60px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(countdownValue, canvas.width / 2, canvas.height / 2);

        if (countdownValue === 0) {
            clearInterval(countdownInterval);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            startGame(); // Start the game after countdown
        } else {
            countdownValue--;
        }
    }, 1000); // 1 second interval for countdown
}

// Ensure the game starts properly after the countdown
function startGame() {
    gameStarted = true;
    gameLoop();
}

// Event listeners for player movement
document.addEventListener("keydown", (e) => {
    if (e.key === "w") player.dy = -player.speed;
    if (e.key === "s") player.dy = player.speed;
    if (e.key === "a") player.dx = -player.speed;
    if (e.key === "d") player.dx = player.speed;
    if (e.key === "p") {
        // Passing logic here (not yet implemented)
    }
    if (e.key === "o") {
        // Juking logic here (not yet implemented)
    }
    if (e.key === " ") {
        // Shooting logic here (not yet implemented)
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "w" || e.key === "s") player.dy = 0;
    if (e.key === "a" || e.key === "d") player.dx = 0;
});

// Trigger countdown when the start button is clicked
document.getElementById("start-button").onclick = () => {
    startCountdown();
};
