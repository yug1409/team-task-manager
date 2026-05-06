import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  LogOut,
  UserCircle,
  Menu,
  X,
  Sparkles,
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
      description: "Overview",
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
      description: "Manage projects",
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: CheckSquare,
      description: "Track tasks",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-80 bg-slate-950 text-white transition-all duration-300 flex flex-col border-r border-slate-800 ${
          open ? "left-0" : "-left-80 lg:left-0"
        }`}
      >
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3"
            >
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
                <Sparkles size={24} className="text-white" />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  Task<span className="text-indigo-400">Flow</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  Team Task Manager
                </p>
              </div>
            </Link>

            <button
              onClick={() => setOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-800 transition"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-5 shadow-xl shadow-indigo-950/30">
            <p className="text-xs uppercase tracking-wider text-indigo-100 font-bold">
              Workspace
            </p>

            <h2 className="text-lg font-extrabold mt-2">
              Project Control Panel
            </h2>

            <p className="text-sm text-indigo-100 mt-2 leading-relaxed">
              Manage projects, tasks and team progress from one place.
            </p>
          </div>
        </div>

        <nav className="px-5 mt-2 space-y-2 flex-1">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-bold px-3 mb-3">
            Main Menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 ${
                  active
                    ? "bg-white text-slate-950 shadow-lg"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <div
                  className={`h-11 w-11 rounded-2xl flex items-center justify-center transition ${
                    active
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-indigo-300"
                  }`}
                >
                  <Icon size={21} />
                </div>

                <div>
                  <p className="font-bold">{item.name}</p>
                  <p
                    className={`text-xs mt-0.5 ${
                      active ? "text-slate-500" : "text-slate-500"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-5 border-t border-slate-800">
          <div className="bg-slate-900 rounded-3xl p-4 mb-4 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center">
                <UserCircle className="text-indigo-400" size={32} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm truncate">
                  {user?.name || "User"}
                </p>

                <p className="text-xs text-slate-400 truncate">
                  {user?.email}
                </p>

                <span className="inline-flex mt-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white py-3.5 rounded-2xl font-bold transition-all border border-red-500/20"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen min-w-0">
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-5 lg:px-8 py-4 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden bg-slate-100 hover:bg-slate-200 p-2.5 rounded-xl transition shrink-0"
            >
              <Menu />
            </button>

            <div className="min-w-0">
              <h2 className="text-xl font-extrabold text-slate-900 truncate">
                Welcome, {user?.name}
              </h2>

              <p className="text-sm text-slate-500 truncate">
                Manage projects, tasks and team progress
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex px-4 py-2 rounded-full text-sm font-bold bg-indigo-50 text-indigo-700 capitalize shrink-0">
            {user?.role}
          </span>
        </header>

        <section className="p-5 lg:p-8">{children}</section>
      </main>
    </div>
  );
};

export default Layout;