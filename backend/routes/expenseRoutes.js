const express = require("express");
const { addExpense , getTripBalances } = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// add expense (protected)
router.post("/", protect, addExpense);

// get balances for a trip (protected)
router.get("/trip/:tripId/balances", protect, getTripBalances);

module.exports = router;
