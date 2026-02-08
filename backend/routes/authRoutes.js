const express = require("express");
const {
  testAuth,
  signup,
  login,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

// test route (temporary)
router.get("/test", protect, testAuth);


// auth routes
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
