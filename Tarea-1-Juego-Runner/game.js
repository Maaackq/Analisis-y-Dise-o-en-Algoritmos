const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Estados del juego
const GAME_STATE = {
    MENU: 0,
    PLAYING: 1,
    GAME_OVER: 2
};

let currentState = GAME_STATE.MENU;

// Score
let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
document.getElementById("highscore").innerText = "Highscore: " + highscore;

// Configuración global
let speed = 4;
let gravity = 0.8;

//  Player
class Player {
    constructor() {
        this.width = 40;
        this.height = 60;
        this.x = 100;
        this.y = canvas.height - this.height - 20;
        this.vy = 0;
        this.jumping = false;
        this.crouching = false;
    }

    jump() {
        if (!this.jumping) {
            this.vy = -16;
            this.jumping = true;
        }
    }

    crouch(active) {
        if (active) {
            this.height = 35;
            this.crouching = true;
        } else {
            this.height = 60;
            this.crouching = false;
        }
    }

    update() {
        this.y += this.vy;
        this.vy += gravity;

        if (this.y >= canvas.height - this.height - 20) {
            this.y = canvas.height - this.height - 20;
            this.vy = 0;
            this.jumping = false;
        }
    }

    draw() {
        ctx.fillStyle = "#00ffff";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Obstáculo
class Obstacle {
    constructor() {
        this.width = 30;
        this.height = 40;
        this.x = canvas.width;
        this.y = canvas.height - this.height - 20;
    }

    update() {
        this.x -= speed;
    }

    draw() {
        ctx.fillStyle = "#ff4444";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Instancias
const player = new Player();
let obstacles = [];

// Colisiones
function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// Input
document.addEventListener("keydown", e => {
    if (e.code === "Space") {
        if (currentState === GAME_STATE.MENU) {
            startGame();
        } else if (currentState === GAME_STATE.PLAYING) {
            player.jump();
        } else if (currentState === GAME_STATE.GAME_OVER) {
            startGame();
        }
    }

    if (e.code === "ArrowDown") {
        player.crouch(true);
    }
});

document.addEventListener("keyup", e => {
    if (e.code === "ArrowDown") {
        player.crouch(false);
    }
});

// Iniciar juego
function startGame() {
    obstacles = [];
    score = 0;
    speed = 5;
    currentState = GAME_STATE.PLAYING;
    document.getElementById("message").innerText = "";
}

// Generar obstáculos
setInterval(() => {
    if (currentState === GAME_STATE.PLAYING) {
        obstacles.push(new Obstacle());
    }
}, 1400);

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentState === GAME_STATE.PLAYING) {
        player.update();

        obstacles.forEach(o => o.update());
        obstacles = obstacles.filter(o => o.x > -50);

        obstacles.forEach(o => {
            if (isColliding(player, o)) {
                currentState = GAME_STATE.GAME_OVER;
                document.getElementById("message").innerText =
                    "Game Over - Presiona SPACE";
                if (score > highscore) {
                    highscore = Math.floor(score);
                    localStorage.setItem("highscore", highscore);
                    document.getElementById("highscore").innerText =
                        "Highscore: " + highscore;
                }
            }
        });

        score += 0.10;
        speed += 0.0008;
    }

    // Dibujar
    player.draw();
    obstacles.forEach(o => o.draw());

    document.getElementById("score").innerText =
        "Score: " + Math.floor(score);

    requestAnimationFrame(gameLoop);
}

gameLoop();
