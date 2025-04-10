const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  media: {
    type: String,
  },
  caption: {
    type: String,
  },
});

const profileModel = mongoose.model("profile", profileSchema);

module.exports = profileModel;
