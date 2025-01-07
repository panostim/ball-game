let ball = { x: 0, y: 0, radius: 20, velocity: { x: 0, y: 0 } };
const boxes = [];
const boxCount = 10; // Number of boxes

function setup() {
    // Fullscreen canvas
    createCanvas(windowWidth, windowHeight);
    resetGame();
}

function draw() {
    background(220);

    // Draw boxes
    for (let box of boxes) {
        fill(box.color);
        rect(box.x, box.y, box.width, box.height);
    }

    // Update and constrain ball position
    ball.x = constrain(ball.x + ball.velocity.x, ball.radius, width - ball.radius);
    ball.y = constrain(ball.y + ball.velocity.y, ball.radius, height - ball.radius);

    // Simulate friction to slow the ball down
    ball.velocity.x *= 0.98;
    ball.velocity.y *= 0.98;

    // Draw the ball
    fill(0);
    ellipse(ball.x, ball.y, ball.radius * 2);
}

function mousePressed() {
    for (let box of boxes) {
        if (
            mouseX > box.x &&
            mouseX < box.x + box.width &&
            mouseY > box.y &&
            mouseY < box.y + box.height
        ) {
            // Apply force based on box color intensity
            const force = red(box.color) / 255; // Redder = stronger push
            const angle = atan2(mouseY - ball.y, mouseX - ball.x); // Direction to ball
            ball.velocity.x += cos(angle) * force * 10; // Push horizontally
            ball.velocity.y += sin(angle) * force * 10; // Push vertically
        }
    }
}

function keyPressed() {
    // Arrow key movement
    if (keyCode === LEFT_ARROW) ball.velocity.x -= 5;
    if (keyCode === RIGHT_ARROW) ball.velocity.x += 5;
    if (keyCode === UP_ARROW) ball.velocity.y -= 5;
    if (keyCode === DOWN_ARROW) ball.velocity.y += 5;
}

// Ensure canvas adjusts when the window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    resetGame();
}

// Reset the game and reposition the boxes
function resetGame() {
    ball.x = width / 2;
    ball.y = height - 50; // Start at the bottom of the screen
    ball.velocity = { x: 0, y: 0 };

    // Recreate boxes with random positions and colors
    boxes.length = 0;
    for (let i = 0; i < boxCount; i++) {
        boxes.push({
            x: random(50, width - 100),
            y: random(50, height - 150),
            width: 50,
            height: 50,
            color: color(random(255), random(255), random(255)),
        });
    }
}
