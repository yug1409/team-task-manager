const express = require("express");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
} = require("../controllers/task.controller");

const protect = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", protect, adminOnly, createTask);

router.get("/", protect, getTasks);

router.get("/:id", protect, getTaskById);

router.put("/:id", protect, adminOnly, updateTask);

router.patch("/:id/status", protect, updateTaskStatus);

router.delete("/:id", protect, adminOnly, deleteTask);

module.exports = router;