const Payment = require("../routers/google.router");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });


module.exports.authGoogleCallbackController = [
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      console.log("hello at google controller")
      const token = jwt.sign(
        {
          id: req.user.id,
          displayName: req.user.displayName,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Create a clean user object with googleImage
      const user = {
        id: req.user.id,
        displayName: req.user.displayName,
        email: req.user.emails && req.user.emails[0]?.value,
        googleImage: req.user.photos && req.user.photos[0]?.value,
      };

      console.log("User sent to EJS:", user);

      res.render("userProfile", { user });
    } catch (error) {
      console.log("Google Auth Error:", error);
      res.redirect("/login");
    }
  },
];
