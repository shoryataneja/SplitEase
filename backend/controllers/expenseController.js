const Expense = require("../models/Expense");
const Trip = require("../models/Trip");

// add expense controller
const addExpense = async (req, res) => {
  try {
    const { description, amount, tripId, splitAmong } = req.body;

    // 1. validate input
    if (!description || !amount || !tripId) {
      return res.status(400).json({
        message: "Description, amount and tripId are required",
      });
    }

    // 2. find trip
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // 3. check if user is part of the trip
    if (!trip.members.includes(req.user._id)) {
      return res.status(403).json({
        message: "You are not a member of this trip",
      });
    }

    // 4. determine split members
    const membersToSplit = splitAmong && splitAmong.length > 0
      ? splitAmong
      : trip.members;

    // 5. create expense
    const expense = await Expense.create({
      description,
      amount,
      paidBy: req.user._id,
      trip: tripId,
      splitAmong: membersToSplit,
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  addExpense,
};
