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
    const trips = await Trip.find({
      members: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      trips,
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
  getMyTrips
};
