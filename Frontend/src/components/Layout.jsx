import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  LogOut,
  UserCircle,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: CheckSquare,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-72 bg-slate-950 text-white p-5 transition-all duration-300 flex flex-col ${
          open ? "left-0" : "-left-72 lg:left-0"
        }`}
      >
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">
            Task<span className="text-indigo-400">Flow</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Team Task Manager
          </p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="bg-slate-900 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <UserCircle className="text-indigo-400 shrink-0" size={34} />

              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-400 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <main className="flex-1 min-h-screen min-w-0">
        <header className="bg-white border-b border-slate-200 px-5 lg:px-8 py-4 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden bg-slate-100 p-2 rounded-lg shrink-0"
            >
              <Menu />
            </button>

            <div className="min-w-0">
              <h2 className="text-xl font-bold text-slate-800 truncate">
                Welcome, {user?.name}
              </h2>
              <p className="text-sm text-slate-500 truncate">
                Manage projects, tasks and team progress
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex px-4 py-2 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-700 capitalize shrink-0">
            {user?.role}
          </span>
        </header>

        <section className="p-5 lg:p-8">{children}</section>
      </main>
    </div>
  );
};

export default Layout;