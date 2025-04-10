const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profiles.controller");
const userMiddleware = require("../middleware/user.middleware");

/* /profiles/create [get] */
router.get(
  "/create",
  userMiddleware.authUser,
  profileController.createProfileView
);

/* /profiles/create [post] */
router.post(
  "/create",
  userMiddleware.authUser,
  profileController.createProfileUser
);

module.exports = router;
