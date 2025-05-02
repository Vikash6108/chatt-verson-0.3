const express = require("express");
const router = express.Router();
const googleController = require("../controllers/google.controller");
const passport = require("passport");

/*  /auth/google/callback  */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/* /auth/google/callback   */
router.get("/google/callback",passport.authenticate("google", { scope: ["profile", "email"] }), googleController.authGoogleCallbackController);

module.exports = router;

