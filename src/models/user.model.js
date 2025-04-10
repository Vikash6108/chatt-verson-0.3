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
  conform_password: {
    type: String,
  },
});
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
