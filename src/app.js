const express = require("express");
const app = express();
const userRoutes = require("./routers/user.router");
const profileRoutes = require("./routers/profile.router");

const cookieParser = require("cookie-parser");
const flash = require("connect-flash");



// app.use(express.static(path.join(__dirname, "public")));

const jwt = require("jsonwebtoken");
const authRouter = require("./routers/google.router");
const dotenv = require("dotenv");
const userModel = require("./models/user.model");
// const profileModel = require("./models/profile.model")
dotenv.config();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const session = require('express-session');

const passport = require('passport');
app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET, // change this to a secure secret in production
  resave: false,
  saveUninitialized: false
}));



app.use(passport.initialize());

const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log(profile)
        let user = await userModel.findOne({ googleId: profile.id });
        if (!user) {
          // If not, create a new user
          user = await userModel.create({
            googleId: profile?.id,
            username: profile?.displayName,
            email: profile?.emails[0].value,
            googleProfileImage: profile?.photos[0].value,
          });
          
        }
        const token = jwt.sign(
          {
            id:user._id,
            email:user.email,
          },
          process.env.JWT_SECRET,
          {expiresIn: '1h'},
        );
        user=user.toObject();
        user.token=token;

        // console.log("user created")
        // console.log(user);
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
      // Here, you would typically find or create a user in your database
      // For this example, we'll just return the profile
    }
  )
);

// Serialize user into session (store a unique identifier)
passport.serializeUser((user, done) => {
  console.log(user)
  console.log("serialized user")
  done(null, user._id); // Or use user.googleId if you prefer
});

// Deserialize user from session (retrieve user from DB using the stored identifier)
passport.deserializeUser(async (id, done) => {
  console.log("hello deserializing user ",user)
  try {
    const user = await userModel.findById(id); // Fetch user from the DB
    done(null, user); // Store the user object in the request session
  } catch (err) {
    done(err, null);
  }
});

// Route to initiate Google OAuth flow
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route that Google will redirect to after authentication
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: true,
  }),
  (req, res) => {
    try {
      const token =req.user.token;
      res.cookie("token",token, { httpOnly: true }) 
      res.redirect("/profiles/dashboard");   //  send data to userprofile
      

    } catch (error) {
      console.error("Error while setting JWT token:", err); // Handle errors gracefully
      res.status(500).send("Internal Server Error");
    }
  }
);

app.get("/", function (req, res) {
  res.render("userWelcome");
});
app.use("/users", userRoutes);

app.use("/profiles", profileRoutes);

app.use("/auth", authRouter);



module.exports = app;
