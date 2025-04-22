const express = require("express");
const app = express();
const userRoutes = require("./routers/user.router");
const profileRoutes = require("./routers/profile.router");
const payRouter = require("./routers/pay.router");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

const chatRoutes = require("./routers/chatRouter");

// app.use(express.static(path.join(__dirname, "public")));




const jwt = require("jsonwebtoken");
const authRouter = require("./routers/google.router");
const passport = require("passport");

const dotenv = require("dotenv");
const userModel = require("./models/user.model");
dotenv.config();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

const { Strategy: GoogleStrategy } = require("passport-google-oauth20");













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
      return done(null, profile);
    }
  )
);











// Route to initiate Google OAuth flow
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route that Google will redirect to after authentication
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res) => {

    const token = jwt.sign(
      {
        id: req.user.id,
        displayName: req.user.displayName,
        email: req.user.emails[0].value,
        profile:req.user.photos[0].value
      },
      process.env.JWT_SECRET, // Ensure you have a `JWT_SECRET` in your .env file
      { expiresIn: "1h" } // Set token expiration time
    );

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.redirect("/profiles/dashboard");
  }
);

app.get("/", function (req, res) {
  res.render("userWelcome");
});
app.use("/users", userRoutes);

app.use("/profiles", profileRoutes);

app.use("/pay", payRouter);

app.use("/auth", authRouter);

app.use("/socket", chatRoutes);

module.exports = app;
