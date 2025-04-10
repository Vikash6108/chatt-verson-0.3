const express = require("express");
const app = express();
const userRoutes = require("./routers/user.router");
const profileRoutes = require("./routers/profile.router");
const payRouter = require("./routers/pay.router");
const cookieParser = require("cookie-parser");
const session=require("express-session")
const flash=require("connect-flash")

// const cors = require("cors")
// app.use(cors())

const jwt = require("jsonwebtoken");
const authRouter = require("./routers/google.router");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

const dotenv = require("dotenv");
dotenv.config();

app.use(passport.initialize());

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure Passport to use Google OAuth 2.0 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Here, you would typically find or create a user in your database
      // For this example, we'll just return the profile
      // console.log("askdkjfjkafkjaf");

      return done(null, profile);
    }
  )
);

// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// Callback route that Google will redirect to after authentication
// app.get('/auth/google/callback',
//     passport.authenticate('google', { session: false }),   // data exchange from google and send user profile data
//     (req, res) => {
//       // console.log(req.user)
//       // Generate a JWT for the authenticated user
//       const token = jwt.sign({
//         id: req.user.id,
//         displayName: req.user.displayName,
//       },process.env.JWT_SECRET,
//       {
//           expiresIn: '1h'
//       });
//       // Send the token to the client
//       res.json({ token });
//     }
//   );

app.get("/", function (req, res) {
  res.render("userWelcome");
});
app.use("/users", userRoutes);

app.use("/profiles", profileRoutes);

app.use("/pay", payRouter);

app.use("/auth", authRouter);

module.exports = app;
