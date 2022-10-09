const express = require("express");
const router = express();
const userController = require("../controllers/userController");

router.post("/signup", userController.signup);
router.post("/login", userController.login);

module.exports = router;
