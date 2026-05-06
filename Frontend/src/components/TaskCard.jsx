import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Pencil,
  Trash2,
  UserRound,
  FolderKanban,
  ChevronDown,
} from "lucide-react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const TaskCard = ({ task, onStatusUpdated, onEdit, onDelete }) => {
  const { user } = useAuth();

  const isOverdue =
    task?.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  const dueDate = task?.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No date";

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return "bg-green-50 text-green-700 border-green-100";
    }

    if (status === "in-progress") {
      return "bg-yellow-50 text-yellow-700 border-yellow-100";
    }

    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getPriorityStyle = (priority) => {
    if (priority === "high") {
      return "bg-red-50 text-red-700 border-red-100";
    }

    if (priority === "medium") {
      return "bg-orange-50 text-orange-700 border-orange-100";
    }

    return "bg-blue-50 text-blue-700 border-blue-100";
  };

  const getProgressWidth = (status) => {
    if (status === "completed") return "100%";
    if (status === "in-progress") return "60%";
    return "18%";
  };

  const getProgressColor = (status) => {
    if (status === "completed") return "bg-green-500";
    if (status === "in-progress") return "bg-yellow-500";
    return "bg-slate-400";
  };

  const handleStatusChange = async (e) => {
    try {
      const newStatus = e.target.value;

      await API.patch(`/tasks/${task._id}/status`, {
        status: newStatus,
      });

      toast.success("Task status updated");

      if (onStatusUpdated) {
        onStatusUpdated();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="group relative overflow-hidden bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition" />
      <div className="absolute -left-12 -bottom-16 h-32 w-32 rounded-full bg-slate-50" />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div className="flex items-start gap-4 min-w-0">
            <div
              className={`h-14 w-14 rounded-3xl flex items-center justify-center shadow-lg shrink-0 ${
                isOverdue
                  ? "bg-red-50 text-red-600 shadow-red-100"
                  : "bg-indigo-50 text-indigo-600 shadow-indigo-100"
              }`}
            >
              {isOverdue ? (
                <AlertCircle size={26} />
              ) : (
                <CheckCircle2 size={26} />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-xl font-extrabold text-slate-900 line-clamp-1 group-hover:text-indigo-700 transition">
                {task?.title}
              </h3>

              <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {task?.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap lg:justify-end">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${getStatusStyle(
                task?.status
              )}`}
            >
              {task?.status}
            </span>

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${getPriorityStyle(
                task?.priority
              )}`}
            >
              {task?.priority}
            </span>

            {user?.role === "admin" && onEdit && onDelete && (
              <>
                <button
                  onClick={() => onEdit(task)}
                  className="h-9 w-9 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition"
                  title="Edit Task"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => onDelete(task._id)}
                  className="h-9 w-9 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 transition"
                  title="Delete Task"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Progress
            </p>

            <p className="text-xs font-bold text-slate-500 capitalize">
              {task?.status}
            </p>
          </div>

          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                task?.status
              )}`}
              style={{ width: getProgressWidth(task?.status) }}
            />
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
              <FolderKanban size={15} />
              Project
            </div>

            <p className="font-bold text-slate-800 mt-1 truncate">
              {task?.project?.name || "N/A"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
              <UserRound size={15} />
              Assigned To
            </div>

            <p className="font-bold text-slate-800 mt-1 truncate">
              {task?.assignedTo?.name || "N/A"}
            </p>
          </div>

          <div
            className={`rounded-2xl p-4 ${
              isOverdue ? "bg-red-50" : "bg-slate-50"
            }`}
          >
            <div
              className={`flex items-center gap-2 text-xs font-bold ${
                isOverdue ? "text-red-600" : "text-slate-500"
              }`}
            >
              {isOverdue ? (
                <AlertCircle size={15} />
              ) : (
                <CalendarDays size={15} />
              )}
              Due Date
            </div>

            <p
              className={`font-bold mt-1 truncate ${
                isOverdue ? "text-red-700" : "text-slate-800"
              }`}
            >
              {dueDate}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
              <Clock3 size={15} />
              Created By
            </div>

            <p className="font-bold text-slate-800 mt-1 truncate">
              {task?.createdBy?.name || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p
            className={`text-sm font-semibold ${
              isOverdue ? "text-red-600" : "text-slate-500"
            }`}
          >
            {isOverdue
              ? "This task is overdue and needs attention."
              : "Update task progress when work changes."}
          </p>

          <div className="relative w-full sm:w-52">
            <select
              value={task?.status}
              onChange={handleStatusChange}
              className="w-full px-4 py-3 pr-10 rounded-2xl border border-slate-200 bg-white appearance-none text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
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
    </div>
  );
};

export default TaskCard;