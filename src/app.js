const express = require("express");
const app = express();
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const jwt = require("jsonwebtoken");

const userRoutes = require("./routers/user.router");
const profileRoutes = require("./routers/profile.router");
const authRouter = require("./routers/google.router");
const userModel = require("./models/user.model");

dotenv.config();

// Middleware
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());

app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ googleId: profile.id });
        if (!user) {
          user = await userModel.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            googleProfileImage: profile.photos[0].value,
          });
        }

        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        user = user.toObject();
        user.token = token;

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Routes
app.get("/", (req, res) => {
  res.render("userWelcome");
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: true }),
  (req, res) => {
    try {
      const token = req.user.token;
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/profiles/dashboard");
    } catch (err) {
      console.error("Error while setting JWT token:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Router bindings
app.use("/users", userRoutes);
app.use("/profiles", profileRoutes);
app.use("/auth", authRouter);

module.exports = app;
