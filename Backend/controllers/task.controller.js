const Task = require("../models/task.model");
const Project = require("../models/project.model");
const User = require("../models/user.model");

// Create task - Admin only
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      status,
      priority,
      dueDate
    } = req.body;

    if (!title || !project || !assignedTo || !dueDate) {
      return res.status(400).json({
        message: "Title, project, assignedTo and dueDate are required"
      });
    }

    const existingProject = await Project.findById(project);

    if (!existingProject) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    if (existingProject.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can create tasks only in your own project"
      });
    }

    const assignedUser = await User.findById(assignedTo);

    if (!assignedUser) {
      return res.status(404).json({
        message: "Assigned user not found"
      });
    }

    const isProjectMember = existingProject.members.includes(assignedTo);

    if (!isProjectMember) {
      return res.status(400).json({
        message: "Assigned user must be a member of this project"
      });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      createdBy: req.user._id,
      status,
      priority,
      dueDate
    });

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name description")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
      error: error.message
    });
  }
};

// Get all tasks
const getTasks = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "admin") {
      filter.createdBy = req.user._id;
    } else {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate("project", "name description")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message
    });
  }
};

// Get single task
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name description createdBy members")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const isAdminCreator = task.createdBy._id.toString() === req.user._id.toString();
    const isAssignedMember = task.assignedTo._id.toString() === req.user._id.toString();

    if (!isAdminCreator && !isAssignedMember) {
      return res.status(403).json({
        message: "You are not allowed to view this task"
      });
    }

    res.status(200).json({
      task
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch task",
      error: error.message
    });
  }
};

// Update full task - Admin only
const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      status,
      priority,
      dueDate
    } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only task creator can update this task"
      });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    const updatedTask = await task.save();

    const populatedTask = await Task.findById(updatedTask._id)
      .populate("project", "name description")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    res.status(200).json({
      message: "Task updated successfully",
      task: populatedTask
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error.message
    });
  }
};

// Update task status - Admin or assigned member
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required"
      });
    }

    const allowedStatus = ["todo", "in-progress", "completed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const isAdminCreator = task.createdBy.toString() === req.user._id.toString();
    const isAssignedMember = task.assignedTo.toString() === req.user._id.toString();

    if (!isAdminCreator && !isAssignedMember) {
      return res.status(403).json({
        message: "You are not allowed to update this task status"
      });
    }

    task.status = status;

    const updatedTask = await task.save();

    const populatedTask = await Task.findById(updatedTask._id)
      .populate("project", "name description")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    res.status(200).json({
      message: "Task status updated successfully",
      task: populatedTask
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task status",
      error: error.message
    });
  }
};

// Delete task - Admin only
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only task creator can delete this task"
      });
    }

    await Task.findByIdAndDelete(task._id);

    res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
      error: error.message
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
};