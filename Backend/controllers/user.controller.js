const User = require("../models/user.model");

// Get all members - Admin only
const getMembers = async (req, res) => {
  try {
    const members = await User.find({ role: "member" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: members.length,
      members
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch members",
      error: error.message
    });
  }
};

module.exports = {
  getMembers
};