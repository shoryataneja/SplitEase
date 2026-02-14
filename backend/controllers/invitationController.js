const Invitation = require("../models/Invitation");
const Trip = require("../models/Trip");
const User = require("../models/User");


// 1️⃣ Send Invitation
const sendInvitation = async (req, res) => {
  try {
    const { tripId, email } = req.body;

    if (!tripId || !email) {
      return res.status(400).json({
        message: "Trip ID and email are required",
      });
    }

    // 1️⃣ Find trip
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // 2️⃣ Check if requester is a member
    if (!trip.members.includes(req.user._id)) {
      return res.status(403).json({
        message: "You are not a member of this trip",
      });
    }

    // 3️⃣ Find user by email
    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 4️⃣ Check if already a member
    if (trip.members.includes(userToInvite._id)) {
      return res.status(400).json({
        message: "User already in trip",
      });
    }

    // 5️⃣ Check if invitation already exists
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

    // 6️⃣ Create invitation
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
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// 2️⃣ Get My Invitations
const getMyInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({
      to: req.user._id,
      status: "pending",
    })
      .populate("trip", "name")
      .populate("from", "name email");

    res.status(200).json({
      invitations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// 3️⃣ Accept Invitation
const acceptInvitation = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find invitation
    const invitation = await Invitation.findById(id);

    if (!invitation) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }

    // 2️⃣ Ensure only invited user can accept
    if (!invitation.to.equals(req.user._id)) {
      return res.status(403).json({
        message: "Not authorized to accept this invitation",
      });
    }

    // 3️⃣ Ensure still pending
    if (invitation.status !== "pending") {
      return res.status(400).json({
        message: "Invitation already processed",
      });
    }

    // 4️⃣ Add user to trip
    const trip = await Trip.findById(invitation.trip);

    if (!trip.members.includes(req.user._id)) {
      trip.members.push(req.user._id);
      await trip.save();
    }

    // 5️⃣ Update invitation status
    invitation.status = "accepted";
    await invitation.save();

    res.status(200).json({
      message: "Invitation accepted",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// 4️⃣ Reject Invitation
const rejectInvitation = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find invitation
    const invitation = await Invitation.findById(id);

    if (!invitation) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }

    // 2️⃣ Ensure only invited user can reject
    if (!invitation.to.equals(req.user._id)) {
      return res.status(403).json({
        message: "Not authorized to reject this invitation",
      });
    }

    // 3️⃣ Ensure still pending
    if (invitation.status !== "pending") {
      return res.status(400).json({
        message: "Invitation already processed",
      });
    }

    // 4️⃣ Update status to rejected
    invitation.status = "rejected";
    await invitation.save();

    res.status(200).json({
      message: "Invitation rejected",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  sendInvitation,
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
};
