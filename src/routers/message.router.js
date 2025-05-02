
const express = require("express");
const router = express.Router();
const { getMessagesBetweenUsers } = require("../controllers/message.controller");

router.get("/messages", getMessagesBetweenUsers); // ?user1=ID1&user2=ID2

module.exports = router;
