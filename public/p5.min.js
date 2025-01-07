let ball = { x: 200, y: 400, radius: 20, velocity: { x: 0, y: 0 } };
const boxes = [];

function setup() {
    createCanvas(400, 600);

    // Create boxes with random colors
    for (let i = 0; i < 10; i++) {
        boxes.push({
            x: random(50, 350),
            y: random(50, 550),
            width: 50,
            height: 50,
            color: color(random(255), random(255), random(255)),
        });
    }
}

function draw() {
    background(220);

    // Draw boxes
    for (let box of boxes) {
        fill(box.color);
        rect(box.x, box.y, box.width, box.height);
    }

    // Move and draw the ball
    ball.x += ball.velocity.x;
    ball.y += ball.velocity.y;
    ball.velocity.y *= 0.99; // Simulate friction

    fill(0);
    ellipse(ball.x, ball.y, ball.radius * 2);

    // Prevent the ball from leaving the screen
    ball.x = constrain(ball.x, 0, width);
    ball.y = constrain(ball.y, 0, height);
}

function mousePressed() {
    for (let box of boxes) {
        if (
            mouseX > box.x &&
            mouseX < box.x + box.width &&
            mouseY > box.y &&
            mouseY < box.y + box.height
        ) {
            // Calculate force based on box color intensity
            const force = red(box.color) / 255; // Redder = stronger push
            ball.velocity.y -= 10 * force; // Push upward
            ball.velocity.x += random(-3, 3); // Add some horizontal randomness
        }
    }
}
