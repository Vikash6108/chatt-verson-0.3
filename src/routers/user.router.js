const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");

/* /users/register [get]  */
router.get("/register", userController.registerViewController);

/* /users/register  [post] */
router.post("/register", userController.registerUserController);

/* users/login */
router.get("/login", userController.loginViewController);

/* users/login   */
router.post("/login", userController.loginUserController);

module.exports = router;
