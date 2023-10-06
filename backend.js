const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  pingInterval: 2000,
  pingTimeout: 5000,
});
const port = 3000;
const backEndPlayers = {};

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname + "/index.html"));
});

io.on("connection", (socket) => {
  console.log("A user connected!", socket.id);

  backEndPlayers[socket.id] = {
    x: 500 * Math.random(),
    y: 500 * Math.random(),
    color: `hsl(${Math.random() * 360}, 50%, 50%)`,
  };

  io.emit("update-players", backEndPlayers);

  socket.on("disconnect", (reason) => {
    console.log("A user disconnected!", reason);
    delete backEndPlayers[socket.id];
    io.emit("update-players", backEndPlayers);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
