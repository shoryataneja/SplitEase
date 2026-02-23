const express = require("express");
const {
  testAuth,
  signup,
  login,
  getMe,
  updateName,
  changePassword,
  deleteAccount,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

// test route (temporary)
router.get("/test", protect, testAuth);


// auth routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/update-name", protect, updateName);
router.put("/change-password", protect, changePassword);
router.delete("/delete-account", protect, deleteAccount);

module.exports = router;
