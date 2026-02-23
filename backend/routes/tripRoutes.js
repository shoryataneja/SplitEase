const express = require("express");
const {
  createTrip,
  getMyTrips,
  addMemberToTrip,
  getTripById,
} = require("../controllers/tripController");
const { addExpense, getExpensesByTrip } = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// create trip (protected)
router.post("/", protect, createTrip);

// get all trips for logged-in user (protected)
router.get("/", protect, getMyTrips);

// get trip by ID (protected) - MUST come after "/" route
router.get("/:tripId", protect, getTripById);

// invite member to trip (protected)
router.post("/:tripId/invite", protect, addMemberToTrip);

// add expense to trip (protected)
router.post("/:tripId/expenses", protect, addExpense);

// get expenses for trip (protected)
router.get("/:tripId/expenses", protect, getExpensesByTrip);

module.exports = router;
