const express = require("express");
const {
  registerUser,
  verifyOTP,
  signup,
  forgotPassword,
  resetPassword,
  verifyForgotPasswordOTP,
  login,
  test,
  logout
} = require('../controller/userController');

const { userDataValidateChainMethod ,userOTPVerify, forgotPass, resetPass, loginData} = require('../validations/validator');
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();
const upload = require('../upload');

router.post("/register", userDataValidateChainMethod, registerUser);

router.put("/verify-otp/:id", userOTPVerify, verifyOTP);

router.put("/signup/:id", upload.single('file'), signup);

router.post("/forgot-password", forgotPass, forgotPassword);

router.put("/verify-forgot-otp/:email", userOTPVerify, verifyForgotPasswordOTP);

router.put("/reset-password/:token", resetPass, resetPassword);

router.post("/login", loginData, login);

router.get('/test', validateToken, test);

router.post("/logout",logout);

module.exports = router;