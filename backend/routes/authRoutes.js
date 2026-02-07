const express = require("express");
const { testAuth, signup } = require("../controllers/authController");

const router = express.Router();

// test route (temporary)
router.get("/test", testAuth);

// signup route
router.post("/signup", signup);

module.exports = router;
