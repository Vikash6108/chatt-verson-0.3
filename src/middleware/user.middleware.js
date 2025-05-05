const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.authUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log(token);

    if (!token) {
      res.redirect('/users/login')
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
