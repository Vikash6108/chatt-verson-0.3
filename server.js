const app = require("./src/app");
const connect = require("./src/db/db");
const http=require("http")

const socketIO=require("socket.io")

connect();
require('dotenv').config();

const server = http.createServer(app);
const io = socketIO(server);

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendUser-Message", (data) => {
    io.emit("sendMsg-EveryUser", data);
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing");
  });
});




server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
  