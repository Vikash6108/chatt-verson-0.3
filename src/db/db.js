const mongoose = require("mongoose");

function connect() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected to db");
    })
    .catch((err) => {
      console.error("Error connecting to db", err.message);
    });
}

module.exports = connect;
