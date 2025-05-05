// controllers/chatController.js
// exports.getHomePage = (req, res) => {
//     res.render("index", { user: req.user }); // Pass the user object here
//   };
  



// controllers/message.controller.js
const Message = require("../models/message.model");

module.exports.getMessagesBetweenUsers = async (req, res) => {
  try {
    const { user1, user2 } = req.query; // sender and receiver IDs from URL

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    })
      .sort({ timestamp: 1 })
      .populate("sender", "name")
      .populate("receiver", "name");

    res.render("userProfile", { messages }); // here render "userProfile" to show chat where save the data in var "message"
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load messages");
  }
};
