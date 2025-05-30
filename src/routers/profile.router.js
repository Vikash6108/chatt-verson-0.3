const express = require("express");
const message = require("../models/message.model");
const router = express.Router();
const profileController = require("../controllers/profiles.controller");
const userMiddleware = require("../middleware/user.middleware");
const passport = require("passport");
const jwt = require('jsonwebtoken');

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

// router.get(
//   "/dashboard",
//   function (req, res) {
//     // console.log(req.cookies);
//     const data = jwt.verify(req.cookies.token,process.env.JWT_SECRET)
//     // console.log(data);
    
//     res.render("userprofile", { user: data });
//   }
// );



router.get(
  "/dashboard",
  userMiddleware.authUser,  // Ensure the user is authenticated
  function (req, res) {
    // console.log("Hello at dashboard")
    // Verify the JWT token and authenticate the user
    const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    res.render("userprofile", { users: data });
  }
);



module.exports = router;
