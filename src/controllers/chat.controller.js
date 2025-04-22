// controllers/chatController.js
exports.getHomePage = (req, res) => {
    res.render("index", { user: req.user }); // Pass the user object here
  };
  