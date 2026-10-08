const screen_game = document.querySelector('.screen_game');
const ball_game = document.getElementById("ball");
const crossbar = document.getElementById("crossbar");
const notification = document.getElementById("notification");

const Width_Brick = 90;
const Height_Brick = 40;
const Row_Brick = 3;
const Cols_Brick = 5;
const Gap = 10;

let gameState = "playing";
const paddle = { x: 350, y: 588, width: 100, height: 12, speed: 10 };
const ball = { x: 392, y: 540, width: 16, height: 16, dx: 3, dy: -3 };
let bricks = [];
const keys = { left: false, right: false };
const W = 800;
const H = 600;
const createBrick = () => {
    for (let row = 0; row < Row_Brick; row++) {
        for (let col = 0; col < Cols_Brick; col++) {
            const brickCh = document.createElement("div");
            brickCh.classList.add("brick");
            screen_game.appendChild(brickCh);

            bricks.push({
                x: 30 + col * (Width_Brick + Gap),
                y: 40 + row * (Height_Brick + Gap),
                width: Width_Brick,
                height: Height_Brick,
                hp: Math.floor(Math.random() * 3) + 1,
                listBrick: brickCh
            });
        }
    }
}

const isCollie = (a, b) => {
    if ((a.x < b.x + b.width) && (a.x + a.width > b.x) &&
        (a.y < b.y + b.height) &&
        (a.y + a.height > b.y)) {
        return true;
    }
    return false;
}
const update = () => {
    if (keys.left) paddle.x -= paddle.speed;
    if (keys.right) paddle.x += paddle.speed;
    paddle.x = Math.max(0, Math.min(paddle.x, W - paddle.width));

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x <= 0) {
        ball.x = 0;
        ball.dx = Math.abs(ball.dx);
    }
    if (ball.x + ball.width >= W) {
        ball.x = W - ball.width;
        ball.dx = -Math.abs(ball.dx);
    }
    if (ball.y <= 0) {
        ball.y = 0;
        ball.dy = Math.abs(ball.dy);
    }

    if (ball.dy > 0 && isCollie(ball, paddle)) {
        ball.dy = -Math.abs(ball.dy);
        ball.y = paddle.y - ball.height;

        const hit = (ball.x + ball.width / 2 - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        ball.dx = hit * 5;
    }

    for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i];
        if (isCollie(ball, b)) {
            b.hp--;

            const overlapX = Math.min(ball.x + ball.width, b.x + b.width) - Math.max(ball.x, b.x);
            const overlapY = Math.min(ball.y + ball.height, b.y + b.height) - Math.max(ball.y, b.y);


            if (overlapX < overlapY) {
                ball.dx = -ball.dx;
            } else {
                ball.dy = -ball.dy;
            }
            break;
        }
    }

    for (const b of bricks) {
        if (b.hp <= 0) b.listBrick.remove();
    }
    bricks = bricks.filter(b => b.hp > 0);

    if (bricks.length === 0) {
        gameState = "won";
        showMessage("You Win!");
    } else if (ball.y > H) {
        gameState = "lost";
        showMessage("Game Over!");
    }
}

const render = () => {
    crossbar.style.transform = `translate(${paddle.x}px, ${paddle.y}px)`;
    ball_game.style.transform = `translate(${ball.x}px, ${ball.y}px)`;

    for (const b of bricks) {
        b.listBrick.style.transform = `translate(${b.x}px, ${b.y}px)`;
        b.listBrick.textContent = b.hp;
        b.listBrick.dataset.hp = b.hp;
    }
}


function showMessage(text) {
    notification.textContent = text;
    notification.style.display = "flex";
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowRight") keys.right = true;
    if (e.key === " " && gameState !== "playing") location.reload();
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
});


function loop() {
    if (gameState === "playing") update();
    render();
    requestAnimationFrame(loop);
}

createBrick();
requestAnimationFrame(loop);




