const express = require("express");

const {
  getMembers
} = require("../controllers/user.controller");

const protect = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/role.middleware");

const router = express.Router();

router.get("/members", protect, adminOnly, getMembers);

module.exports = router;