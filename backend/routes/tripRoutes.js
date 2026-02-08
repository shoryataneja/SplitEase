const express = require("express");
const { createTrip } = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// create trip (protected)
router.post("/", protect, createTrip);

module.exports = router;
