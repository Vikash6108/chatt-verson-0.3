const jwt = require("jsonwebtoken");

module.exports.authUser = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        message: "unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
  }
};
