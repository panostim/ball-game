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

    // Constrain ball to screen borders and make it bounce with reduced speed
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= width) {
        ball.velocity.x *= -0.5; // Reverse x-direction with reduced speed
        ball.x = constrain(ball.x, ball.radius, width - ball.radius); // Keep within bounds
    }
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= height) {
        ball.velocity.y *= -0.5; // Reverse y-direction with reduced speed
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

    // Display the note
    drawNote();
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

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    resetGame();
}

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

function isCollidingWithShape(ball, shape) {
    if (shape.type === 'circle') {
        const distance = dist(ball.x, ball.y, shape.x, shape.y);
        return distance < ball.radius + shape.size / 2;
    } else if (shape.type === 'rectangle') {
        return (
            ball.x + ball.radius > shape.x &&
            ball.x - ball.radius < shape.x + shape.size &&
            ball.y + ball.radius > shape.y &&
            ball.y - ball.radius < shape.y + shape.size
        );
    } else if (shape.type === 'triangle') {
        return (
            ball.x + ball.radius > shape.x - shape.size / 2 &&
            ball.x - ball.radius < shape.x + shape.size / 2 &&
            ball.y + ball.radius > shape.y - shape.size / 2 &&
            ball.y - ball.radius < shape.y + shape.size / 2
        );
    }
    return false;
}

function handleShapeCollision(ball, shape) {
    const boost = 3; // Speed boost factor upon collision
    if (shape.type === 'circle') {
        const angle = atan2(ball.y - shape.y, ball.x - shape.x);
        ball.velocity.x = cos(angle) * ball.velocity.x * -boost;
        ball.velocity.y = sin(angle) * ball.velocity.y * -boost;
    } else {
        const dx = ball.x - (shape.x + shape.size / 2);
        const dy = ball.y - (shape.y + shape.size / 2);

        if (abs(dx) > abs(dy)) {
            ball.velocity.x *= -boost;
        } else {
            ball.velocity.y *= -boost;
        }
    }
}

// Draw the note in the bottom-right corner
function drawNote() {
    fill(0);
    textSize(16);
    textAlign(RIGHT, BOTTOM);
    text("Use the arrows to move the ball", width - 10, height - 10);
}
