const Payment = require("../routers/google.router");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

module.exports.googleAuthController = (req, res) => {
  passport.authenticate("google", { scope: ["profile", "email"] });
};

// Callback route that Google will redirect to after authentication
module.exports.authGoogleCallbackController = [
  passport.authenticate("google", { session: false }), // data exchange from google and send user profile data
  (req, res) => {
    try {
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
      // Send the token to the client
      // res.json({ token });
      res.render('userProfile', { user: req.user });
    } catch (error) {
      console.log("error", error);
    }
    console.log(req.user)
 
    // Generate a JWT for the authenticated user
  },
];
