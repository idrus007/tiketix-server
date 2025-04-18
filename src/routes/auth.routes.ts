const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authenticateToken = require("../lib/authenticateToken");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/profile", authenticateToken, authController.getProfile);

module.exports = router;
