let ball, shapes, shapeCount, score, gameTimer;
let nickname = "";
let gameInterval;
let isGameRunning = false;

// Landing page logic
document.getElementById("name-form").addEventListener("submit", (e) => {
    e.preventDefault();
    nickname = document.getElementById("nickname").value;
    startGame();
});

function startGame() {
    document.getElementById("landing-page").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");

    isGameRunning = true;

    // Start the game timer
    gameTimer = 60; // Game duration in seconds
    gameInterval = setInterval(() => {
        gameTimer--;
        document.getElementById("timer-display").textContent = `Time: ${gameTimer}s`;

        if (gameTimer <= 0) {
            endGame();
        }
    }, 1000);

    // Call resetGame after p5.js canvas is ready
    setTimeout(() => {
        resetGame(); // Ensure the p5.js setup has run
    }, 100);
}


function endGame() {
    clearInterval(gameInterval);
    isGameRunning = false;

    // Submit the player's score to the server
    fetch("/server/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, score }),
    })
        .then(() => fetchLeaderboard())
        .catch(console.error);

    // Switch to the leaderboard view
    document.getElementById("game-container").classList.add("hidden");
    document.getElementById("leaderboard-container").classList.remove("hidden");
}

// Fetch and display the leaderboard
function fetchLeaderboard() {
    fetch("/server/leaderboard")
        .then((res) => res.json())
        .then((data) => {
            const leaderboard = document.getElementById("leaderboard");
            leaderboard.innerHTML = ""; // Clear previous leaderboard
            data.forEach((entry, index) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${index + 1}. ${entry.nickname} - ${entry.score}`;
                leaderboard.appendChild(listItem);
            });
        });
}

// Restart button logic
document.getElementById("restart-btn").addEventListener("click", () => {
    document.getElementById("leaderboard-container").classList.add("hidden");
    document.getElementById("landing-page").classList.remove("hidden");
});

// Game setup and logic
function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("game-container");
    resetGame();
}

function draw() {
    if (!isGameRunning) return; // Stop rendering when the game is not running

    background(255);

    // Draw shapes
    for (let shape of shapes) {
        fill(shape.color);
        if (shape.type === "circle") {
            ellipse(shape.x, shape.y, shape.size);
        } else if (shape.type === "rectangle") {
            rect(shape.x, shape.y, shape.size, shape.size);
        } else if (shape.type === "triangle") {
            triangle(
                shape.x,
                shape.y - shape.size / 2,
                shape.x - shape.size / 2,
                shape.y + shape.size / 2,
                shape.x + shape.size / 2,
                shape.y + shape.size / 2
            );
        }
    }

    // Update ball position
    ball.x += ball.velocity.x;
    ball.y += ball.velocity.y;

    // Bounce on borders
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= width) {
        ball.velocity.x *= -1; // Reverse horizontal direction
        ball.x = constrain(ball.x, ball.radius, width - ball.radius);
    }
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= height) {
        ball.velocity.y *= -1; // Reverse vertical direction
        ball.y = constrain(ball.y, ball.radius, height - ball.radius);
    }

    // Detect collisions and update score
    for (let shape of shapes) {
        if (isCollidingWithShape(ball, shape)) {
            handleShapeCollision(ball, shape);
            score += calculateScore(shape);
            document.getElementById("score-display").textContent = `Score: ${score}`;
        }
    }

    // Draw ball
    fill(0);
    ellipse(ball.x, ball.y, ball.radius * 2);
}

function resetGame() {
    ball = { x: width / 2, y: height - 50, radius: 20, velocity: { x: 0, y: 0 } };
    shapes = [];
    shapeCount = 10;
    score = 0;

    // Generate shapes
    for (let i = 0; i < shapeCount; i++) {
        const size = random(ball.radius * 2, ball.radius * 10); // Size between 1x and 5x the ball
        shapes.push({
            x: random(size / 2, width - size / 2),
            y: random(size / 2, height - size / 2),
            size: size,
            type: random(["circle", "rectangle", "triangle"]),
            color: color(random(255), random(255), random(255)),
        });
    }

    document.getElementById("score-display").textContent = "Score: 0";
    document.getElementById("timer-display").textContent = "Time: 60s";
}

function isCollidingWithShape(ball, shape) {
    const distance = dist(ball.x, ball.y, shape.x, shape.y);
    return distance < ball.radius + shape.size / 2;
}

function handleShapeCollision(ball, shape) {
    ball.velocity.x *= -1; // Reverse direction on collision
    ball.velocity.y *= -1;
}

function calculateScore(shape) {
    return Math.round(10000 / shape.size); // Smaller shapes give higher scores
}
