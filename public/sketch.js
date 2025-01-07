let ball = { x: 0, y: 0, radius: 20, velocity: { x: 0, y: 0 } };
const shapes = [];
const shapeCount = 10; // Number of shapes

function setup() {
    createCanvas(windowWidth, windowHeight);
    resetGame();
}

function draw() {
    background(255); // White background

    // Draw shapes
    for (let shape of shapes) {
        fill(shape.color);
        if (shape.type === 'circle') {
            ellipse(shape.x, shape.y, shape.size);
        } else if (shape.type === 'rectangle') {
            rect(shape.x, shape.y, shape.size, shape.size);
        } else if (shape.type === 'triangle') {
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

    // Constrain ball to screen borders and make it bounce
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= width) {
        ball.velocity.x *= -1; // Reverse x-direction
        ball.x = constrain(ball.x, ball.radius, width - ball.radius); // Keep within bounds
    }
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= height) {
        ball.velocity.y *= -1; // Reverse y-direction
        ball.y = constrain(ball.y, ball.radius, height - ball.radius); // Keep within bounds
    }

    // Detect collision with shapes
    for (let shape of shapes) {
        if (isCollidingWithShape(ball, shape)) {
            handleShapeCollision(ball, shape);
        }
    }

    // Draw the ball
    fill(0);
    ellipse(ball.x, ball.y, ball.radius * 2);
}

function mousePressed() {
    for (let shape of shapes) {
        const distance = dist(mouseX, mouseY, shape.x, shape.y);
        if (distance < shape.size / 2) {
            // Apply a large force to the ball
            const angle = atan2(mouseY - ball.y, mouseX - ball.x); // Direction to ball
            ball.velocity.x += cos(angle) * 50; // Strong push horizontally
            ball.velocity.y += sin(angle) * 50; // Strong push vertically
        }
    }
}

function keyPressed() {
    // Arrow key movement, ball moves 10 times faster
    const speed = 10;
    if (keyCode === LEFT_ARROW) ball.velocity.x -= speed;
    if (keyCode === RIGHT_ARROW) ball.velocity.x += speed;
    if (keyCode === UP_ARROW) ball.velocity.y -= speed;
    if (keyCode === DOWN_ARROW) ball.velocity.y += speed;
}

// Ensure canvas adjusts when the window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    resetGame();
}

// Reset the game and reposition the shapes
function resetGame() {
    ball.x = width / 2;
    ball.y = height - 50; // Start at the bottom of the screen
    ball.velocity = { x: 0, y: 0 };

    // Recreate shapes
    shapes.length = 0;
    for (let i = 0; i < shapeCount; i++) {
        const size = random(ball.radius * 2, ball.radius * 10); // Size between 1x and 5x the ball
        shapes.push({
            x: random(size / 2, width - size / 2),
            y: random(size / 2, height - size / 2),
            size: size,
            type: random(['circle', 'rectangle', 'triangle']), // Random shape type
            color: color(random(255), random(255), random(255)), // Static random color
        });
    }
}

// Check if the ball is colliding with a shape
function isCollidingWithShape(ball, shape) {
    const distance = dist(ball.x, ball.y, shape.x, shape.y);
    return distance < ball.radius + shape.size / 2;
}

// Handle collision with a shape
function handleShapeCollision(ball, shape) {
    // Determine collision direction
    const ballCenterX = ball.x;
    const ballCenterY = ball.y;

    const shapeCenterX = shape.x;
    const shapeCenterY = shape.y;

    const dx = ballCenterX - shapeCenterX;
    const dy = ballCenterY - shapeCenterY;

    // Reflect velocity based on collision direction and boost speed
    const boost = 3; // Speed boost factor
    if (abs(dx) > abs(dy)) {
        // Horizontal collision
        ball.velocity.x = -ball.velocity.x * boost;
    } else {
        // Vertical collision
        ball.velocity.y = -ball.velocity.y * boost;
    }
}
