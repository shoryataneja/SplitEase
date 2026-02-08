const express = require("express");
const {
  createTrip,
  getMyTrips,
  addMemberToTrip,
} = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// create trip (protected)
router.post("/", protect, createTrip);

// get all trips for logged-in user (protected)
router.get("/", protect, getMyTrips);

// add member to trip (protected)
router.post("/:tripId/members", protect, addMemberToTrip);

module.exports = router;
