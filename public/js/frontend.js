const canvas = document.getElementById("canvas");
const scoreEl = document.getElementById("score");
const ctx = canvas.getContext("2d");
const socket = io();
const frontEndPlayers = {};

let projectiles;
let enemies;
let particles;
let animationId;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

socket.on("update-players", (backEndPlayers) => {
  console.log(backEndPlayers);
  for (const id in backEndPlayers) {
    if (!frontEndPlayers[id]) {
      frontEndPlayers[id] = new Player({
        x: backEndPlayers[id].x,
        y: backEndPlayers[id].y,
        radius: 20,
        color: backEndPlayers[id].color,
      });
    }
  }

  for (const id in frontEndPlayers) {
    if (!backEndPlayers[id]) {
      delete frontEndPlayers[id];
    }
  }
});

function animate() {
  animationId = requestAnimationFrame(animate);

  // Fill canvas with black
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const id in frontEndPlayers) {
    frontEndPlayers[id].draw();
  }
}

animate();
