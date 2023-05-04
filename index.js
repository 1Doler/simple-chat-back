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

const users = {};

socketIO.on("connection", (socket) => {
  console.log(`${socket.id} user connected`);

  socket.on("message", (data) => {
    socketIO.to(data.chatId).emit("response", data);
  });

  socket.on("newUser", (data) => {
    const chatId = data.chatId;
    console.log(chatId);
    users?.[chatId] ? users[chatId].push(data) : (users[chatId] = [data]);
    /* users.push(data); */
    socket.join(chatId);
    socketIO.to(chatId).emit("responseNewUser", users);
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
