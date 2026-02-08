const express = require("express");
const { createTrip, getMyTrips } = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// create trip (protected)
router.post("/", protect, createTrip);

// get all trips for logged-in user (protected)
router.get("/", protect, getMyTrips);

module.exports = router;
