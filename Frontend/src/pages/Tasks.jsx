import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ClipboardList,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import API from "../api/axios";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Tasks = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");

      setTasks(res.data.tasks || []);
      setFilteredTasks(res.data.tasks || []);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let result = [...tasks];

    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
    }

    if (search.trim() !== "") {
      result = result.filter((task) => {
        const title = task?.title?.toLowerCase() || "";
        const project = task?.project?.name?.toLowerCase() || "";
        const assignedTo = task?.assignedTo?.name?.toLowerCase() || "";
        const keyword = search.toLowerCase();

        return (
          title.includes(keyword) ||
          project.includes(keyword) ||
          assignedTo.includes(keyword)
        );
      });
    }

    setFilteredTasks(result);
  }, [statusFilter, search, tasks]);

  if (loading) {
    return <Loader />;
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const todoTasks = tasks.filter((task) => task.status === "todo").length;

  const overdueTasks = tasks.filter(
    (task) =>
      task?.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "completed"
  ).length;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-700 p-8 text-white shadow-2xl">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 left-20 h-60 w-60 rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-indigo-100 text-sm font-bold mb-5">
              <Sparkles size={16} />
              Task Workspace
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight">Tasks</h1>

            <p className="text-indigo-100 mt-3 max-w-2xl leading-relaxed">
              {user?.role === "admin"
                ? "Track all tasks created by you, monitor progress, and manage workload efficiently."
                : "View your assigned tasks, update progress, and keep your work on track."}
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 text-white rounded-full text-sm font-bold">
                <ClipboardList size={17} />
                {totalTasks} Tasks
              </span>

              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 text-white rounded-full text-sm font-bold capitalize">
                {user?.role} Access
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/10 rounded-3xl p-6 w-full lg:w-80">
            <div className="flex items-center justify-between">
              <p className="font-bold text-indigo-100">Completed</p>
              <CheckCircle2 className="text-green-300" />
            </div>

            <h2 className="text-5xl font-extrabold mt-4">
              {completedTasks}
            </h2>

            <p className="text-sm text-indigo-100 mt-2">
              out of {totalTasks} total tasks
            </p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-6">
        <div className="card card-hover p-6">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <ClipboardList className="text-indigo-600" />
          </div>
          <p className="text-sm font-bold text-slate-500">Total</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
            {totalTasks}
          </h3>
        </div>

        <div className="card card-hover p-6">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <ClipboardList className="text-slate-600" />
          </div>
          <p className="text-sm font-bold text-slate-500">Todo</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
            {todoTasks}
          </h3>
        </div>

        <div className="card card-hover p-6">
          <div className="h-12 w-12 rounded-2xl bg-yellow-50 flex items-center justify-center mb-4">
            <Clock3 className="text-yellow-600" />
          </div>
          <p className="text-sm font-bold text-slate-500">In Progress</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
            {inProgressTasks}
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
      </div>

      <div className="card p-5">
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search by task, project or member..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-2xl border border-slate-200 bg-slate-50 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid xl:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusUpdated={fetchTasks}
            />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-3xl bg-indigo-50 flex items-center justify-center mb-5">
            <ClipboardList className="text-indigo-600" size={34} />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900">
            No tasks found
          </h2>

          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            {tasks.length > 0
              ? "No task matched your search or selected filter."
              : user?.role === "admin"
              ? "Create a project and add tasks to start tracking work."
              : "No task has been assigned to you yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Tasks;