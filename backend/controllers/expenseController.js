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


const getTripBalances = async (req, res) => {
  try {
    const { tripId } = req.params;

    // 1. get all expenses of this trip
    const expenses = await Expense.find({ trip: tripId })
      .populate("paidBy", "name")
      .populate("splitAmong", "name");

    const balances = {};

    // 2. calculate balances
    expenses.forEach((expense) => {
      const splitCount = expense.splitAmong.length;
      const splitAmount = expense.amount / splitCount;

      // add paid amount
      const paidById = expense.paidBy._id.toString();
      balances[paidById] = balances[paidById] || {
        name: expense.paidBy.name,
        balance: 0,
      };
      balances[paidById].balance += expense.amount;

      // subtract owed amount
      expense.splitAmong.forEach((user) => {
        const userId = user._id.toString();
        balances[userId] = balances[userId] || {
          name: user.name,
          balance: 0,
        };
        balances[userId].balance -= splitAmount;
      });
    });

    res.status(200).json({
      balances,
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
  getTripBalances
};
