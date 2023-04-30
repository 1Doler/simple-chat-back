const express = require("express");
const app = express();
const PORT = 5000;

const http = require("http").Server(app);
const cors = require("cors");

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
  },
});
app.get("api", (req, res) => {
  res.json({
    message: "API",
  });
});

const users = [];

socketIO.on("connection", (socket) => {
  console.log(`${socket.id} user connected`);

  socket.on("message", (data) => {
    socketIO.emit("response", data);
  });

  socket.on("newUser", (data) => {
    users.push(data);
    socketIO.emit("responseNewUser", users);
  });
  socket.on("typing", (data) => {
    socketIO.emit("responseTyping", data);
  });
  socket.on("disconnect", (socket) => {
    console.log(`${socket.id} user disconnet`);
  });
});

http.listen(PORT, () => {
  console.log("Server OK");
});
