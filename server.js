const app = require("./src/app");
const connect = require("./src/db/db");
const Message = require("./src/models/message.model");
const user = require("./src/models/user.model");
const http = require("http");

connect();
require("dotenv").config();

const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

// Socket.IO setup
const onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  //
  // When user logs in, pass their actual userId (not socket.id)
  socket.on("user-online", async (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User online:", userId);

    // Fetch unread messages from DB and send them to this user
    const unreadMessages = await Message.find({ receiverId: userId })
      .sort({ timestamp: 1 })
      .populate("senderId", "fullname");

    unreadMessages.forEach((msg) => {
      io.to(socket.id).emit("receiveMsg-FromDB", {
        message: msg.message,
        senderName: msg.senderId.fullname,
        timestamp: msg.timestamp,
      });
    });
  });

  socket.on("sendUser-Message", async (data) => {
    // console.log("Received message:", data);
    const { message, senderId, receiverId } = data;

    try {
      const newMessage = new Message({ message, senderId, receiverId });
      await newMessage.save();

      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("sendMsg-EveryUser", {
          message,
          senderId,
        });
      }
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing");
  });

  socket.on("disconnect", () => {
    // remove user from onlineUsers
    for (let [uid, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(uid);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
