const express = require("express");
const {
  sendInvitation,
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
} = require("../controllers/invitationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Send invitation
router.post("/", protect, sendInvitation);

// Get my invitations
router.get("/", protect, getMyInvitations);

// Accept invitation
router.post("/:id/accept", protect, acceptInvitation);

// Reject invitation
router.post("/:id/reject", protect, rejectInvitation);

module.exports = router;
