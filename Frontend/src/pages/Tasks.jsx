import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
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

      setTasks(res.data.tasks);
      setFilteredTasks(res.data.tasks);
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
      result = result.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTasks(result);
  }, [statusFilter, search, tasks]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
        <p className="text-slate-500 mt-2">
          {user?.role === "admin"
            ? "View and track all tasks created by you."
            : "View and update your assigned tasks."}
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search task by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
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
        <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            No tasks found
          </h2>
          <p className="text-slate-500 mt-2">
            Try changing your search or filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default Tasks;