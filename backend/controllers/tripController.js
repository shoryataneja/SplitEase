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

// add member to trip
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

    // 2. find user to add
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 3. find trip
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // 4. check if user already a member
    if (trip.members.includes(userToAdd._id)) {
      return res.status(400).json({
        message: "User already in trip",
      });
    }

    // 5. add member
    trip.members.push(userToAdd._id);
    await trip.save();

    res.status(200).json({
      message: "Member added successfully",
      trip,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};



module.exports = {
  createTrip,
  getMyTrips,
  addMemberToTrip
};
