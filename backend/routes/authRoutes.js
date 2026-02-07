const express = require("express");
const {
  testAuth,
  signup,
  login,
} = require("../controllers/authController");

const router = express.Router();

// test route (temporary)
router.get("/test", testAuth);

// auth routes
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
