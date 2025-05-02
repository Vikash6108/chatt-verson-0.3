
// const mongoose = require("mongoose");

// const profileSchema = new mongoose.Schema({
//   media: {
//     type: String,
//   },
//   caption: {
//     type: String,
//   },
// });

// const profileModel = mongoose.model("profile", profileSchema);

// module.exports = profileModel;


// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    sparse: true // In case email is not available
  },
  profileImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
