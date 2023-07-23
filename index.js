const introMusic = new Audio("./music/introSong.mp3");
const gameStartMusic = new Audio("./music/game_start.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./music/hugeWeapon.mp3");
const killEnemySound = new Audio("./music/killEnemy.mp3");
const killEnemySound_2 = new Audio("./music/killEnemy_2.mp3");
const shootingSound = new Audio("./music/shoooting.mp3");

introMusic.play();

const canvas = document.createElement("canvas");
document.querySelector(".myGame").appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");

let difficulty = 2;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");

let xDistance = 0;
let yDistance = 0;

const lightWeaponDamage = 10;
const heavyWeaponDamage = 20;
// const hugeWeaponDamage = 50;
let playerScore = 0;

document.querySelector("input").addEventListener("click", (e) => {
    e.preventDefault();
    introMusic.pause();
    form.style.display = "none";
    scoreBoard.style.display = "block"

    const userValue = document.getElementById("difficulty").value;

    if (userValue === "Easy") {
        setInterval(spawnEnemy, 2000);
        return difficulty = 5;
    }
    if (userValue === "Medium") {
        setInterval(spawnEnemy, 1400);
        return difficulty = 8;
    }
    if (userValue === "Hard") {
        setInterval(spawnEnemy, 1000);
        return difficulty = 10;
    }
    if (userValue === "Insane") {
        setInterval(spawnEnemy, 700);
        return difficulty = 12;
    }
});

const gameOverLoader = () => {
    const gameOverBanner = document.createElement("div");
    const gameOverBtn = document.createElement("button");
    const highScore = document.createElement("div");

    highScore.innerHTML = `High Score : ${localStorage.getItem("highScore") ? localStorage.getItem("highScore") : playerScore}`

    const oldScore = localStorage.getItem("highScore") && localStorage.getItem("highScore");

    if (oldScore < playerScore) {
        localStorage.setItem("highScore", playerScore);
        highScore.innerHTML = `High Score: ${playerScore}`;
    }

    gameOverBtn.innerHTML = "Play Again";
    gameOverBanner.appendChild(highScore);
    gameOverBanner.appendChild(gameOverBtn);
    gameOverBtn.onclick = () => {
        window.location.reload();
    }
    gameOverBanner.classList.add("gameOver");
    document.querySelector("body").appendChild(gameOverBanner);
}

playerPosition = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle = this.color;
        context.fill();
    }
}

class Weapon {
    constructor(x, y, radius, color, velocity, damage) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.damage = damage;
    }
    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle = this.color;
        context.fill();
    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class HugeWeapon {
    constructor(x, y,
        // radius, 
        // color,
        // velocity, 
        // damage
    ) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.color = "white";
        // this.velocity = velocity;
        // this.damage = damage;
    }
    draw() {
        context.beginPath();
        // context.fillStyle = this.color;
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        // context.fillRect(this.x, this.y, 200, canvas.height);
        // context.fillStyle = this.color;
        // context.fill();
        context.strokeStyle = this.color;

        context.stroke();

    }
    update() {
        this.draw();
        this.radius += 10;
        // this.x += 20;
        // this.y += 10;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle = this.color;
        context.fill();
    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
const friction = 0.98;
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    draw() {
        context.save();
        context.globalAlpha = this.alpha;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    }
    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

const parth = new Player(playerPosition.x - xDistance, playerPosition.y - yDistance, 15, "white");

const weapons = [];
const enemies = [];
const hugeWeapons = [];
const particles = [];

const spawnEnemy = () => {
    const enemySize = Math.random() * (40 - 5) + 5;
    const enemyColor = `hsl(${Math.floor(Math.random() * 360)},100%,50%)`;

    let random;
    if (Math.random() < 0.5) {
        random = {
            x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
            y: Math.random() * canvas.height
        }
    } else {
        random = {
            x: Math.random() * canvas.width,
            y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize
        }
    }

    const myAngle = Math.atan2(
        canvas.height / 2 - random.y,
        canvas.width / 2 - random.x
    )
    const velocity = {
        x: Math.cos(myAngle) * difficulty,
        y: Math.sin(myAngle) * difficulty
    }

    enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity))
}

let animationId;

function animation() {
    animationId = requestAnimationFrame(animation);

    scoreBoard.innerHTML = `Score: ${playerScore}`;

    context.fillStyle = `rgba(49,49,49,0.2)`;

    context.fillRect(0, 0, canvas.width, canvas.height);

    parth.draw();

    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(particleIndex, 1);
        } else {
            particle.update();
        }
        particle.update();

    });

    hugeWeapons.forEach((hugeWeapon, hugeWeaponIndex) => {
        if (hugeWeapon.radius > canvas.width) {
            hugeWeapons.splice(hugeWeaponIndex, 1);
        } else {
            hugeWeapon.update();
        }
    })

    weapons.forEach((weapon, weaponIndex) => {
        weapon.update();
        if (
            weapon.x + weapon.radius < 1 ||
            weapon.y + weapon.radius < 1 ||
            weapon.x - weapon.radius > canvas.width ||
            weapon.y - weapon.radius > canvas.height
        ) {
            weapons.splice(weaponIndex, 1);
        }
    });

    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();

        const distanceBetweenPlayerAndEnemy = Math.hypot(
            parth.x - enemy.x,
            parth.y - enemy.y
        );

        if (distanceBetweenPlayerAndEnemy - parth.radius - enemy.radius < 1) {
            cancelAnimationFrame(animationId);
            introMusic.play();
            gameOverSound.play();
            hugeWeaponSound.pause();
            shootingSound.pause();
            heavyWeaponSound.pause();
            killEnemySound.pause();
            return gameOverLoader();
        }

        hugeWeapons.forEach((hugeWeapon) => {
            const distanceBetweenHugeWeaponAndEnemy = hugeWeapon.radius - distanceBetweenPlayerAndEnemy;
            if (distanceBetweenHugeWeaponAndEnemy <= 10
                && distanceBetweenHugeWeaponAndEnemy >= -10
            ) {
                playerScore += 10;
                scoreBoard.innerHTML = `Score : ${playerScore}`;
                setTimeout(() => {
                    killEnemySound_2.play();
                    enemies.splice(enemyIndex, 1);
                }, 0);
            }
        })

        weapons.forEach((weapon, weaponIndex) => {
            const distanceBetweenWeaponAndEnemy = Math.hypot(
                weapon.x - enemy.x,
                weapon.y - enemy.y
            );
            if (distanceBetweenWeaponAndEnemy - weapon.radius - enemy.radius < 1) {
                if (enemy.radius >= weapon.damage + 8) {
                    gsap.to(enemy, {
                        radius: enemy.radius - weapon.damage
                    })
                    setTimeout(() => {
                        weapons.splice(weaponIndex, 1);
                    }, 0);
                } else {
                    for (let i = 0; i < enemy.radius * 5; i++) {
                        particles.push(new Particle(weapon.x, weapon.y, Math.random() * 2, enemy.color, {
                            x: (Math.random() - 0.5) * (Math.random() * 5),
                            y: (Math.random() - 0.5) * (Math.random() * 5)
                        }))
                    }
                    playerScore += 10;
                    scoreBoard.innerHTML = `Score : ${playerScore}`;
                    setTimeout(() => {
                        killEnemySound.play();
                        enemies.splice(enemyIndex, 1);
                        weapons.splice(weaponIndex, 1);
                    }, 0);
                }
            }
        })
    })
}

canvas.addEventListener("click", (e) => {
    const myAngle = Math.atan2(
        e.clientY - playerPosition.y,
        e.clientX - playerPosition.x
    )
    const velocity = {
        x: Math.cos(myAngle) * 6,
        y: Math.sin(myAngle) * 6
    }
    shootingSound.play();
    weapons.push(new Weapon(playerPosition.x, playerPosition.y, 6, "white", velocity, lightWeaponDamage));
});

canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (playerScore <= 0) return;
    heavyWeaponSound.play();
    playerScore -= 2;
    scoreBoard.innerHTML = `Score : ${playerScore}`;
    const myAngle = Math.atan2(
        e.clientY - playerPosition.y,
        e.clientX - playerPosition.x
    )
    const velocity = {
        x: Math.cos(myAngle) * 3,
        y: Math.sin(myAngle) * 3
    }
    weapons.push(new Weapon(playerPosition.x, playerPosition.y, 30, "cyan", velocity, heavyWeaponDamage));
});

addEventListener("keypress", (e) => {
    if (e.key === " ") {
        if (playerScore < 20) return;
        playerScore -= 20;
        scoreBoard.innerHTML = `Score : ${playerScore}`;
        hugeWeaponSound.play();
        hugeWeapons.push(new HugeWeapon(playerPosition.x, playerPosition.y,
            // 30, 
            // `rgb(81,55,194)`,
            // velocity,
            // hugeWeaponDamage
        ));
    }
});
addEventListener("keypress", (e) => {
    if (e.key === "w") {
        yDistance -= 50;
    }
});

addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

addEventListener("resize", () => {
    window.location.reload();
})

animation();