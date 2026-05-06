import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  UserPlus,
  X,
  CalendarDays,
  Users,
  FolderKanban,
} from "lucide-react";
import API from "../api/axios";
import Loader from "../components/Loader";
import TaskCard from "../components/TaskCard";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [membersList, setMembersList] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  const [memberId, setMemberId] = useState("");

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });

  const fetchProjectDetails = async () => {
    try {
      const res = await API.get(`/projects/${id}`);

      setProject(res.data.project);
      setTasks(res.data.tasks);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch project");
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await API.get("/users/members");
      setMembersList(res.data.members);
    } catch (error) {
      toast.error("Failed to fetch members");
    }
  };

  useEffect(() => {
    fetchProjectDetails();

    if (user?.role === "admin") {
      fetchMembers();
    }
  }, [id, user?.role]);

  const handleTaskChange = (e) => {
    setTaskForm({
      ...taskForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    try {
      await API.post(`/projects/${id}/members`, {
        memberId,
      });

      toast.success("Member added successfully");
      setMemberId("");
      setShowMemberModal(false);
      fetchProjectDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  };

  const openCreateTaskModal = () => {
    setEditingTask(null);

    setTaskForm({
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
    });

    setShowTaskModal(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);

    setTaskForm({
      title: task.title || "",
      description: task.description || "",
      assignedTo: task.assignedTo?._id || "",
      priority: task.priority || "medium",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });

    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);

    setTaskForm({
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
    });
  };
useLockBodyScroll(showMemberModal || showTaskModal);
  const handleSubmitTask = async (e) => {
    e.preventDefault();

    try {
      if (editingTask) {
        await API.put(`/tasks/${editingTask._id}`, {
          ...taskForm,
        });

        toast.success("Task updated successfully");
      } else {
        await API.post("/tasks", {
          ...taskForm,
          project: id,
        });

        toast.success("Task created successfully");
      }

      closeTaskModal();
      fetchProjectDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/tasks/${taskId}`);

      toast.success("Task deleted successfully");
      fetchProjectDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  const availableMembers = membersList.filter((member) => {
    const alreadyAdded = project?.members?.some(
      (projectMember) => projectMember._id === member._id
    );

    return !alreadyAdded;
  });

  if (loading) {
    return <Loader />;
  }

  if (!project) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center">
        <h2 className="text-xl font-bold text-slate-900">Project not found</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <FolderKanban className="text-indigo-600" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {project.name}
                </h1>
                <p className="text-slate-500 mt-1">
                  {project.description || "No description provided."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-5">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                <Users size={17} />
                {project.members?.length || 0} Members
              </span>

              <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                <CalendarDays size={17} />
                {tasks.length} Tasks
              </span>
            </div>
          </div>

          {user?.role === "admin" && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowMemberModal(true)}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-semibold transition"
              >
                <UserPlus size={18} />
                Add Member
              </button>

              <button
                onClick={openCreateTaskModal}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition"
              >
                <Plus size={18} />
                Create Task
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            Project Tasks
          </h2>

          {tasks.length > 0 ? (
            <div className="space-y-5">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusUpdated={fetchProjectDetails}
                  onEdit={openEditTaskModal}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No tasks found in this project.</p>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-fit">
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            Team Members
          </h2>

          {project.members?.length > 0 ? (
            <div className="space-y-3">
              {project.members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between border border-slate-100 rounded-2xl p-4"
                >
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {member.name}
                    </h3>
                    <p className="text-sm text-slate-500">{member.email}</p>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold capitalize">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No members added yet.</p>
          )}
        </div>
      </div>

      {showMemberModal && (
        <div
  onClick={() => setShowMemberModal(false)}
  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 overflow-y-auto"
>
<div
  onClick={(e) => e.stopPropagation()}
  className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Add Member
              </h2>

              <button
                onClick={() => setShowMemberModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Select Member
                </label>

                <select
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Choose a member</option>

                  {availableMembers.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} - {member.email}
                    </option>
                  ))}
                </select>

                {availableMembers.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">
                    No available members found. Create a member account first or
                    all members are already added.
                  </p>
                )}
              </div>

              <button
                disabled={availableMembers.length === 0}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Member
              </button>
            </form>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div
  onClick={closeTaskModal}
  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 overflow-y-auto"
>
          <div
  onClick={(e) => e.stopPropagation()}
  className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto"
>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingTask ? "Edit Task" : "Create Task"}
              </h2>

              <button
                onClick={closeTaskModal}
                className="p-2 hover:bg-slate-100 rounded-xl"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Task Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Create Login Page"
                  value={taskForm.title}
                  onChange={handleTaskChange}
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Write task details..."
                  value={taskForm.description}
                  onChange={handleTaskChange}
                  rows="3"
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Assign To
                </label>
                <select
                  name="assignedTo"
                  value={taskForm.assignedTo}
                  onChange={handleTaskChange}
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select member</option>

                  {project.members?.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} - {member.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={taskForm.priority}
                    onChange={handleTaskChange}
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={taskForm.dueDate}
                    onChange={handleTaskChange}
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <button
                disabled={project.members?.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingTask ? "Update Task" : "Create Task"}
              </button>

              {project.members?.length === 0 && (
                <p className="text-xs text-red-500 text-center">
                  Add at least one member before creating a task.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;