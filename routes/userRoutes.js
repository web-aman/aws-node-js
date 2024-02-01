const express = require("express");
const {
  registerUser,
  currentUser,
  testUser,
  loginUser,
} = require('../controller/userController');
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/test", testUser);

router.get("/current", validateToken, currentUser);

module.exports = router;