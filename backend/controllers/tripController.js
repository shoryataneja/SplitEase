const Trip = require("../models/Trip");

// create trip controller
const createTrip = async (req, res) => {
  try {
    const { name } = req.body;

    // 1. validate input
    if (!name) {
      return res.status(400).json({
        message: "Trip name is required",
      });
    }

    // 2. create trip
    const trip = await Trip.create({
      name,
      createdBy: req.user._id,
      members: [req.user._id], // creator is first member
    });

    // 3. send response
    res.status(201).json({
      message: "Trip created successfully",
      trip,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// get trips for logged-in user
const getMyTrips = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const trips = await Trip.find({
      members: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      trips,
    });
  } catch (error) {
    console.error("Error in getMyTrips:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


const User = require("../models/User");
const Invitation = require("../models/Invitation");

// send invitation to join trip
const addMemberToTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { email } = req.body;

    // 1. validate input
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // 2. find trip
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // 3. check if requester is a member
    const isMember = trip.members.some(
      (member) => member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this trip",
      });
    }

    // 4. find user to invite
    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 5. check if already a member
    const isAlreadyMember = trip.members.some(
      (member) => member.toString() === userToInvite._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({
        message: "User already in trip",
      });
    }

    // 6. check if invitation already exists
    const existingInvite = await Invitation.findOne({
      trip: tripId,
      to: userToInvite._id,
      status: "pending",
    });

    if (existingInvite) {
      return res.status(400).json({
        message: "Invitation already sent",
      });
    }

    // 7. create invitation (DO NOT add to members yet)
    const invitation = await Invitation.create({
      trip: tripId,
      from: req.user._id,
      to: userToInvite._id,
    });

    res.status(201).json({
      message: "Invitation sent successfully",
      invitation,
    });
  } catch (error) {
    console.error("Error in addMemberToTrip:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// get trip by ID
const getTripById = async (req, res) => {
  try {
    const { tripId } = req.params;

    console.log("Fetching trip with ID:", tripId);

    const trip = await Trip.findById(tripId).populate("members", "name email");

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // Check if user is a member
    const isMember = trip.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this trip",
      });
    }

    // Fetch expenses for this trip
    const Expense = require("../models/Expense");
    const expenses = await Expense.find({ trip: tripId })
      .populate("paidBy", "name")
      .sort({ createdAt: -1 });

    // Calculate balances
    const balanceMap = {};

    // Initialize balances for all members
    trip.members.forEach((member) => {
      balanceMap[member._id.toString()] = {
        userId: member._id,
        name: member.name,
        balance: 0,
      };
    });

    // Calculate balances from expenses
    expenses.forEach((expense) => {
      const paidById = expense.paidBy._id.toString();
      const splitCount = trip.members.length;
      const splitAmount = expense.amount / splitCount;

      // Person who paid gets credited
      if (balanceMap[paidById]) {
        balanceMap[paidById].balance += expense.amount;
      }

      // Everyone (including payer) owes their share
      trip.members.forEach((member) => {
        const memberId = member._id.toString();
        if (balanceMap[memberId]) {
          balanceMap[memberId].balance -= splitAmount;
        }
      });
    });

    // Convert to array and format for frontend
    const balances = Object.values(balanceMap)
      .filter((b) => Math.abs(b.balance) > 0.01) // Filter out near-zero balances
      .map((b) => ({
        userId: b.userId,
        name: b.name,
        amount: Math.round(b.balance * 100) / 100,
      }));

    res.status(200).json({
      trip,
      expenses,
      balances,
    });
  } catch (error) {
    console.error("Error in getTripById:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



module.exports = {
  createTrip,
  getMyTrips,
  addMemberToTrip,
  getTripById,
};
