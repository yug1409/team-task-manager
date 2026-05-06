const Project = require("../models/project.model");
const User = require("../models/user.model");
const Task = require("../models/task.model");

// Create project - Admin only
const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required"
      });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: members || []
    });

    res.status(201).json({
      message: "Project created successfully",
      project
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create project",
      error: error.message
    });
  }
};

// Get all projects
const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      projects = await Project.find({ createdBy: req.user._id })
        .populate("createdBy", "name email role")
        .populate("members", "name email role");
    } else {
      projects = await Project.find({ members: req.user._id })
        .populate("createdBy", "name email role")
        .populate("members", "name email role");
    }

    res.status(200).json({
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message
    });
  }
};

// Get single project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    const isAdminOwner = project.createdBy._id.toString() === req.user._id.toString();
    const isMember = project.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (!isAdminOwner && !isMember) {
      return res.status(403).json({
        message: "You are not allowed to view this project"
      });
    }

    const tasks = await Task.find({ project: project._id })
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    res.status(200).json({
      project,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch project",
      error: error.message
    });
  }
};

// Update project - Admin owner only
const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only project creator can update this project"
      });
    }

    project.name = name || project.name;
    project.description = description || project.description;

    const updatedProject = await project.save();

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update project",
      error: error.message
    });
  }
};

// Delete project - Admin owner only
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only project creator can delete this project"
      });
    }

    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(project._id);

    res.status(200).json({
      message: "Project and related tasks deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete project",
      error: error.message
    });
  }
};

// Add member to project - Admin owner only
const addMemberToProject = async (req, res) => {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({
        message: "Member ID is required"
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only project creator can add members"
      });
    }

    const member = await User.findById(memberId);

    if (!member) {
      return res.status(404).json({
        message: "Member not found"
      });
    }

    if (member.role !== "member") {
      return res.status(400).json({
        message: "Only users with member role can be added"
      });
    }

    const alreadyAdded = project.members.includes(memberId);

    if (alreadyAdded) {
      return res.status(400).json({
        message: "Member already added to project"
      });
    }

    project.members.push(memberId);

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    res.status(200).json({
      message: "Member added successfully",
      project: updatedProject
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add member",
      error: error.message
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMemberToProject
};