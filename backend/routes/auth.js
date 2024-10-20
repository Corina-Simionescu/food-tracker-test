const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.js");

router.post("/sign-up", authController.postSignUp);
router.post("/sign-in", authController.postSignIn);

module.exports = router;
