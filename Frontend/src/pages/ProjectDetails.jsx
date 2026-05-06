import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  UserPlus,
  X,
  CalendarDays,
  Users,
  FolderKanban,
  ClipboardList,
  UserRound,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
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

  useLockBodyScroll(showMemberModal || showTaskModal);

  const fetchProjectDetails = async () => {
    try {
      const res = await API.get(`/projects/${id}`);

      setProject(res.data.project);
      setTasks(res.data.tasks || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch project");
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await API.get("/users/members");
      setMembersList(res.data.members || []);
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

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const progress =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const overdueTasks = tasks.filter(
    (task) =>
      task?.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "completed"
  ).length;

  if (loading) {
    return <Loader />;
  }

  if (!project) {
    return (
      <div className="card p-12 text-center">
        <div className="mx-auto h-16 w-16 rounded-3xl bg-red-50 flex items-center justify-center mb-5">
          <AlertCircle className="text-red-600" size={34} />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900">
          Project not found
        </h2>

        <p className="text-slate-500 mt-2">
          The project may have been deleted or you do not have access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-700 p-8 text-white shadow-2xl">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 left-20 h-60 w-60 rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
          <div className="flex items-start gap-5">
            <div className="h-16 w-16 rounded-3xl bg-white/10 border border-white/10 backdrop-blur flex items-center justify-center shrink-0">
              <FolderKanban className="text-indigo-200" size={34} />
            </div>

            <div>
              <span className="inline-flex px-4 py-2 rounded-full bg-white/10 text-indigo-100 text-sm font-semibold mb-4">
                Project Details
              </span>

              <h1 className="text-4xl font-extrabold tracking-tight">
                {project.name}
              </h1>

              <p className="text-indigo-100 mt-3 max-w-2xl leading-relaxed">
                {project.description || "No description provided."}
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 text-white rounded-full text-sm font-bold">
                  <Users size={17} />
                  {project.members?.length || 0} Members
                </span>

                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 text-white rounded-full text-sm font-bold">
                  <ClipboardList size={17} />
                  {tasks.length} Tasks
                </span>

                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 text-white rounded-full text-sm font-bold">
                  <CheckCircle2 size={17} />
                  {progress}% Completed
                </span>
              </div>
            </div>
          </div>

          {user?.role === "admin" && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowMemberModal(true)}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white px-5 py-3 rounded-2xl font-bold transition"
              >
                <UserPlus size={18} />
                Add Member
              </button>

              <button
                onClick={openCreateTaskModal}
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-5 py-3 rounded-2xl font-bold transition"
              >
                <Plus size={18} />
                Create Task
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="card card-hover p-6">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <ClipboardList className="text-indigo-600" />
          </div>
          <p className="text-sm font-bold text-slate-500">Total Tasks</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
            {tasks.length}
          </h3>
        </div>

        <div className="card card-hover p-6">
          <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
            <CheckCircle2 className="text-green-600" />
          </div>
          <p className="text-sm font-bold text-slate-500">Completed</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
            {completedTasks}
          </h3>
        </div>

        <div className="card card-hover p-6">
          <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="text-red-600" />
          </div>
          <p className="text-sm font-bold text-slate-500">Overdue</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
            {overdueTasks}
          </h3>
        </div>

        <div className="card card-hover p-6">
          <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
            <Users className="text-purple-600" />
          </div>
          <p className="text-sm font-bold text-slate-500">Members</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
            {project.members?.length || 0}
          </h3>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Project Tasks
              </h2>
              <p className="text-slate-500 mt-1">
                View, assign, edit and track all tasks in this project.
              </p>
            </div>

            {user?.role === "admin" && (
              <button onClick={openCreateTaskModal} className="primary-btn">
                <Plus size={18} />
                New Task
              </button>
            )}
          </div>

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
            <div className="text-center py-14 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <ClipboardList className="mx-auto text-slate-300" size={50} />

              <h3 className="text-xl font-extrabold text-slate-800 mt-4">
                No tasks found
              </h3>

              <p className="text-slate-500 mt-2">
                {user?.role === "admin"
                  ? "Create the first task and assign it to a team member."
                  : "No task has been assigned in this project yet."}
              </p>

              {user?.role === "admin" && (
                <button onClick={openCreateTaskModal} className="primary-btn mt-6">
                  <Plus size={18} />
                  Create Task
                </button>
              )}
            </div>
          )}
        </div>

        <div className="card p-6 h-fit">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Team Members
              </h2>
              <p className="text-slate-500 mt-1">
                Members added to this project.
              </p>
            </div>

            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <Users className="text-indigo-600" />
            </div>
          </div>

          {project.members?.length > 0 ? (
            <div className="space-y-3">
              {project.members.map((member) => (
                <div
                  key={member._id}
                  className="group flex items-center justify-between gap-3 border border-slate-100 rounded-3xl p-4 hover:border-indigo-100 hover:bg-indigo-50/40 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-11 w-11 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-white">
                      <UserRound className="text-slate-600" size={22} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-extrabold text-slate-900 truncate">
                        {member.name}
                      </h3>
                      <p className="text-sm text-slate-500 truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold capitalize shrink-0">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <Users className="mx-auto text-slate-300" size={44} />

              <h3 className="text-lg font-extrabold text-slate-800 mt-4">
                No members added
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Add members before creating tasks.
              </p>

              {user?.role === "admin" && (
                <button
                  onClick={() => setShowMemberModal(true)}
                  className="dark-btn mt-5"
                >
                  <UserPlus size={18} />
                  Add Member
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showMemberModal && (
        <div
          onClick={() => setShowMemberModal(false)}
          className="modal-overlay"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-box max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Add Member
                </h2>
                <p className="text-slate-500 mt-1">
                  Select a member to add into this project.
                </p>
              </div>

              <button
                onClick={() => setShowMemberModal(false)}
                className="h-10 w-10 flex items-center justify-center hover:bg-slate-100 rounded-2xl transition"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-700">
                  Select Member
                </label>

                <div className="relative">
                  <select
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="select-field"
                    required
                  >
                    <option value="">Choose a member</option>

                    {availableMembers.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name} - {member.email}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 translate-y-1 text-slate-400"
                  />
                </div>

                {availableMembers.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">
                    No available members found. Create a member account first or
                    all members are already added.
                  </p>
                )}
              </div>

              <button
                disabled={availableMembers.length === 0}
                className="dark-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus size={18} />
                Add Member
              </button>
            </form>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div onClick={closeTaskModal} className="modal-overlay">
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-box max-w-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {editingTask ? "Edit Task" : "Create Task"}
                </h2>
                <p className="text-slate-500 mt-1">
                  {editingTask
                    ? "Update task details and assignment."
                    : "Create a new task and assign it to a member."}
                </p>
              </div>

              <button
                onClick={closeTaskModal}
                className="h-10 w-10 flex items-center justify-center hover:bg-slate-100 rounded-2xl transition"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-700">
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Create Login Page"
                  value={taskForm.title}
                  onChange={handleTaskChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Write task details..."
                  value={taskForm.description}
                  onChange={handleTaskChange}
                  rows="3"
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Assign To
                </label>

                <div className="relative">
                  <select
                    name="assignedTo"
                    value={taskForm.assignedTo}
                    onChange={handleTaskChange}
                    className="select-field"
                    required
                  >
                    <option value="">Select member</option>

                    {project.members?.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name} - {member.email}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 translate-y-1 text-slate-400"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Priority
                  </label>

                  <div className="relative">
                    <select
                      name="priority"
                      value={taskForm.priority}
                      onChange={handleTaskChange}
                      className="select-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>

                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 translate-y-1 text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={taskForm.dueDate}
                    onChange={handleTaskChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <button
                disabled={project.members?.length === 0}
                className="primary-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
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