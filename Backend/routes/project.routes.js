const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMemberToProject
} = require("../controllers/project.controller");

const protect = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", protect, adminOnly, createProject);

router.get("/", protect, getProjects);

router.get("/:id", protect, getProjectById);

router.put("/:id", protect, adminOnly, updateProject);

router.delete("/:id", protect, adminOnly, deleteProject);

router.post("/:id/members", protect, adminOnly, addMemberToProject);

module.exports = router;