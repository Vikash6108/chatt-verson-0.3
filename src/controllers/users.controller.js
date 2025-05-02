const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.welcomePage = (req, res) => {
  res.render("userWelcome");
};

module.exports.registerViewController = (req, res) => {
  res.render("userRegister");
};

module.exports.registerUserController = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    let profileImage = null;
    if (req.file) {
      profileImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      fullname,
      email,
      password: hashPassword,
      profileImage,
    });

    // console.log(user);
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SEC
    );
    res.cookie("token", token);
    res.redirect("/profiles/create");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.loginViewController = (req, res) => {
  res.render("userLogin");
};

module.exports.loginUserController = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({
    email,
  });

  if (!user) {
    return res.status(400).send(`
    <script> alert("user not found") </script>
      `);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).send(`
    <script> alert("invalid password")</script>
      `);
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SEC
  );

  res.cookie("token", token);
  res.redirect("/profiles/create");
};

