let ball = { x: 0, y: 0, radius: 20, velocity: { x: 0, y: 0 } };
const boxes = [];
const boxCount = 10; // Number of boxes
const boxPadding = 10; // Minimum distance between boxes

function setup() {
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

    // Update ball position
    ball.x += ball.velocity.x;
    ball.y += ball.velocity.y;

    // Constrain ball to screen borders
    ball.x = constrain(ball.x, ball.radius, width - ball.radius);
    ball.y = constrain(ball.y, ball.radius, height - ball.radius);

    // Detect collision with boxes
    for (let box of boxes) {
        if (isCollidingWithBox(ball, box)) {
            handleBoxCollision(ball, box);
        }
    }

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
            ball.velocity.x += cos(angle) * force * 20; // Push horizontally
            ball.velocity.y += sin(angle) * force * 20; // Push vertically
        }
    }
}

function keyPressed() {
    // Arrow key movement
    if (keyCode === LEFT_ARROW) ball.velocity.x -= 10;
    if (keyCode === RIGHT_ARROW) ball.velocity.x += 10;
    if (keyCode === UP_ARROW) ball.velocity.y -= 10;
    if (keyCode === DOWN_ARROW) ball.velocity.y += 10;
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

    // Recreate boxes without overlap
    boxes.length = 0;
    while (boxes.length < boxCount) {
        const box = {
            x: random(50, width - 100),
            y: random(50, height - 150),
            width: 50,
            height: 50,
            color: color(random(255), random(255), random(255)),
        };

        // Check for overlap with existing boxes
        if (!isOverlappingWithExistingBoxes(box)) {
            boxes.push(box);
        }
    }
}

// Check if a new box overlaps with any existing box
function isOverlappingWithExistingBoxes(newBox) {
    for (let box of boxes) {
        if (
            newBox.x < box.x + box.width + boxPadding &&
            newBox.x + newBox.width + boxPadding > box.x &&
            newBox.y < box.y + box.height + boxPadding &&
            newBox.y + newBox.height + boxPadding > box.y
        ) {
            return true;
        }
    }
    return false;
}

// Check if the ball is colliding with a box
function isCollidingWithBox(ball, box) {
    return (
        ball.x + ball.radius > box.x &&
        ball.x - ball.radius < box.x + box.width &&
        ball.y + ball.radius > box.y &&
        ball.y - ball.radius < box.y + box.height
    );
}

// Handle collision with a box
function handleBoxCollision(ball, box) {
    // Determine collision side
    const ballCenterX = ball.x;
    const ballCenterY = ball.y;

    const boxCenterX = box.x + box.width / 2;
    const boxCenterY = box.y + box.height / 2;

    const dx = ballCenterX - boxCenterX;
    const dy = ballCenterY - boxCenterY;

    // Reflect velocity based on collision direction
    if (abs(dx) > abs(dy)) {
        // Horizontal collision
        ball.velocity.x *= -1;
        ball.x = dx > 0 ? box.x + box.width + ball.radius : box.x - ball.radius;
    } else {
        // Vertical collision
        ball.velocity.y *= -1;
        ball.y = dy > 0 ? box.y + box.height + ball.radius : box.y - ball.radius;
    }

    // Slightly reduce velocity after collision to simulate energy loss
    ball.velocity.x *= 0.95;
    ball.velocity.y *= 0.95;
}
