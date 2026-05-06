import { useEffect, useState } from "react";
import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ListTodo,
} from "lucide-react";
import API from "../api/axios";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await API.get("/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          {user?.role === "admin"
            ? "Overview of your projects and assigned team tasks."
            : "Overview of your assigned tasks and project progress."}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-5">
        <StatCard
          title="Projects"
          value={stats?.totalProjects || 0}
          icon={FolderKanban}
          subtitle="Active projects"
        />

        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          icon={ListTodo}
          subtitle="All tasks"
        />

        <StatCard
          title="In Progress"
          value={stats?.inProgressTasks || 0}
          icon={Clock3}
          subtitle="Currently active"
        />

        <StatCard
          title="Completed"
          value={stats?.completedTasks || 0}
          icon={CheckCircle2}
          subtitle="Finished tasks"
        />

        <StatCard
          title="Overdue"
          value={stats?.overdueTasks || 0}
          icon={AlertTriangle}
          subtitle="Need attention"
        />
      </div>

      <div className="mt-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Recent Tasks
        </h2>

        <div className="mt-5 space-y-4">
          {stats?.recentTasks?.length > 0 ? (
            stats.recentTasks.map((task) => (
              <div
                key={task._id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 border border-slate-100 rounded-2xl p-4"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {task.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Project: {task.project?.name || "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {task.status}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                    {task.assignedTo?.name}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500">
              No recent tasks found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;