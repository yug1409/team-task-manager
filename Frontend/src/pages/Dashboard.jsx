import { useEffect, useState } from "react";
import {
  FolderKanban,
  CheckSquare,
  Clock3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import API from "../api/axios";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard/stats");

      setStats(res.data.stats);
      setRecentTasks(res.data.recentTasks || []);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const totalTasks = stats?.totalTasks || 0;
  const completedTasks = stats?.completedTasks || 0;

  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-700 p-8 text-white shadow-2xl">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 left-20 h-60 w-60 rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <span className="inline-flex px-4 py-2 rounded-full bg-white/10 text-indigo-100 text-sm font-semibold mb-5">
              {user?.role === "admin" ? "Admin Dashboard" : "Member Dashboard"}
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name}
            </h1>

            <p className="text-indigo-100 mt-3 max-w-2xl">
              Track your projects, assigned tasks, completed work, and overdue
              activities.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/10 rounded-3xl p-6 w-full lg:w-80">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">Overall Progress</p>
              <TrendingUp className="text-green-300" />
            </div>

            <h2 className="text-5xl font-extrabold">{progress}%</h2>

            <div className="mt-5 h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm text-indigo-100 mt-3">
              {completedTasks} out of {totalTasks} tasks completed
            </p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-6">
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects || 0}
          icon={FolderKanban}
          color="indigo"
          subtitle="Projects available"
        />

        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          icon={CheckSquare}
          color="blue"
          subtitle="All assigned work"
        />

        <StatCard
          title="In Progress"
          value={stats?.inProgressTasks || 0}
          icon={Clock3}
          color="yellow"
          subtitle="Currently active"
        />

        <StatCard
          title="Completed"
          value={stats?.completedTasks || 0}
          icon={CheckCircle2}
          color="green"
          subtitle="Finished tasks"
        />

        <StatCard
          title="Overdue"
          value={stats?.overdueTasks || 0}
          icon={AlertCircle}
          color="red"
          subtitle="Need attention"
        />
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Recent Tasks
              </h2>
              <p className="text-slate-500 mt-1">
                Latest task activities from your workspace.
              </p>
            </div>

            <Link
              to="/tasks"
              className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700"
            >
              View all
              <ArrowRight size={18} />
            </Link>
          </div>

          {recentTasks.length > 0 ? (
            <div className="space-y-5">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusUpdated={fetchDashboard}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-14 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <CheckSquare className="mx-auto text-slate-300" size={46} />
              <h3 className="text-lg font-bold text-slate-800 mt-4">
                No recent tasks found
              </h3>
              <p className="text-slate-500 mt-2">
                Tasks will appear here after they are created or assigned.
              </p>
            </div>
          )}
        </div>

        <div className="card p-6 h-fit">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Quick Summary
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50">
              <div className="flex items-center gap-3">
                <FolderKanban className="text-indigo-600" />
                <span className="font-semibold text-slate-700">Projects</span>
              </div>
              <span className="font-extrabold text-indigo-700">
                {stats?.totalProjects || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-green-50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-600" />
                <span className="font-semibold text-slate-700">Completed</span>
              </div>
              <span className="font-extrabold text-green-700">
                {stats?.completedTasks || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600" />
                <span className="font-semibold text-slate-700">Overdue</span>
              </div>
              <span className="font-extrabold text-red-700">
                {stats?.overdueTasks || 0}
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-750 text-white p-5">
            <CalendarDays className="text-indigo-300" size={32} />

            <h3 className="text-lg font-bold mt-4">Today’s Focus</h3>

            <p className="text-sm text-slate-300 mt-2">
              Complete pending and overdue tasks first to improve your project
              progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;