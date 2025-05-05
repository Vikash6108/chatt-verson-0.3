const express = require("express");
const upload = require("../multer-Setup");
const router = express.Router();
const userController = require("../controllers/users.controller");

/* /users/register [get]  */
router.get("/register", userController.registerViewController);

/* /users/register  [post] */
router.post("/register",  upload.single("ProfileImage"),userController.registerUserController);

/* users/login */
router.get("/login", userController.loginViewController);

/* users/login   */
router.post("/login", userController.loginUserController);


router.get('/logout', userController.logoutUser);

module.exports = router;
