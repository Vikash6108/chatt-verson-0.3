// controllers/messageController.js
const Message = require("../models/message.model");

exports.saveMessage = async (data) => {
  try {
    const message = new Message({
      senderId: data.senderId,
      receiverId: data.receiverId,
      content: data.content,
    });
    await message.save();
    return message;
  } catch (err) {
    console.error("Error saving message:", err);
    throw err;
  }
};
