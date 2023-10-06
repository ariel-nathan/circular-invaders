const canvas = document.getElementById("canvas");
const scoreEl = document.getElementById("score");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

let player;
let projectiles;
let enemies;
let particles;
let animationId;
let score = 0;

player = new Player(canvas.width / 2, canvas.height / 2, 20, "white");
projectiles = [];
enemies = [];
particles = [];

function spawnEnemies() {
  // Stop flashing
  setInterval(() => {
    let x;
    let y;

    const radius = Math.random() * (30 - 4) + 4;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

function animate() {
  animationId = requestAnimationFrame(animate);

  // Fill canvas with black
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.draw();

  particles.forEach((particle) => {
    if (particle.alpha <= 0) {
      particles.splice(particles.indexOf(particle), 1);
    }

    particle.update();
  });

  projectiles.forEach((projectile) => {
    projectile.update();

    // Remove projectiles from edges of screen
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      // Stop flashing
      setTimeout(() => {
        projectiles.splice(projectiles.indexOf(projectile), 1);
      }, 0);
    }
  });

  enemies.forEach((enemy) => {
    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    // End game
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
    }

    projectiles.forEach((projectile) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // When projectiles touch enemy
      if (dist - enemy.radius - projectile.radius < 1) {
        // Create explosions
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 8),
                y: (Math.random() - 0.5) * (Math.random() * 8),
              }
            )
          );
        }

        // Enemy shrinking and removal
        if (enemy.radius - 10 > 5) {
          score += 5;
          scoreEl.innerHTML = score;

          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });

          // Stop flashing
          setTimeout(() => {
            projectiles.splice(projectiles.indexOf(projectile), 1);
          }, 0);
        } else {
          score += 10;
          scoreEl.innerHTML = score;

          // Stop flashing
          setTimeout(() => {
            enemies.splice(enemies.indexOf(enemy), 1);
            projectiles.splice(projectiles.indexOf(projectile), 1);
          }, 0);
        }
      }
    });
  });
}

animate();
spawnEnemies();
