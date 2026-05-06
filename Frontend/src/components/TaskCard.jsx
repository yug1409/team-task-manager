import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Pencil,
  Trash2,
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

  const getStatusStyle = (status) => {
    if (status === "completed") return "bg-green-50 text-green-700";
    if (status === "in-progress") return "bg-yellow-50 text-yellow-700";
    return "bg-slate-100 text-slate-700";
  };

  const getPriorityStyle = (priority) => {
    if (priority === "high") return "bg-red-50 text-red-700";
    if (priority === "medium") return "bg-orange-50 text-orange-700";
    return "bg-blue-50 text-blue-700";
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
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {task?.title}
          </h3>

          <p className="text-sm text-slate-500 mt-2 line-clamp-2">
            {task?.description || "No description provided."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
              task?.status
            )}`}
          >
            {task?.status}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityStyle(
              task?.priority
            )}`}
          >
            {task?.priority}
          </span>

          {user?.role === "admin" && (
            <>
              <button
                onClick={() => onEdit && onEdit(task)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
                title="Edit Task"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => onDelete && onDelete(task._id)}
                className="p-2 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-600"
                title="Delete Task"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-5 grid sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-slate-500">
          <Clock3 size={17} />
          <span>Project: {task?.project?.name || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <CheckCircle2 size={17} />
          <span>Assigned to: {task?.assignedTo?.name || "N/A"}</span>
        </div>

        <div
          className={`flex items-center gap-2 ${
            isOverdue ? "text-red-600" : "text-slate-500"
          }`}
        >
          {isOverdue ? <AlertCircle size={17} /> : <CalendarDays size={17} />}
          <span>
            Due:{" "}
            {task?.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "No date"}
          </span>
        </div>

        <div className="text-slate-500">
          Created by: {task?.createdBy?.name || "N/A"}
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-slate-400">
          {isOverdue ? "This task is overdue" : "Update task progress"}
        </p>

        <select
          value={task?.status}
          onChange={handleStatusChange}
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard;