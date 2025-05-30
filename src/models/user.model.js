const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  fullname: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  googleProfileImage: {
    type: String,
  },
  profileImage: {
    data: Buffer,
    contentType: String
  },
  googleId: { 
    type: String,
    // required: true, 
    // unique: true
   },
});
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
