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
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-80 bg-[#050816] text-white transition-all duration-300 flex flex-col border-r border-white/10 ${
          open ? "left-0" : "-left-80 lg:left-0"
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4"
            >
              <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
                <Sparkles size={27} className="text-white" />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  Task<span className="text-indigo-400">Flow</span>
                </h1>
                <p className="text-sm text-slate-400 font-medium">
                  Team Task Manager
                </p>
              </div>
            </Link>

            <button
              onClick={() => setOpen(false)}
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-white/10 transition"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <nav className="px-5 py-8 flex-1">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-black px-4 mb-5">
            Menu
          </p>

          <div className="space-y-3">
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
                  className={`group relative flex items-center gap-4 px-4 py-4 rounded-3xl transition-all duration-300 ${
                    active
                      ? "bg-white text-slate-950 shadow-xl shadow-black/20"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-9 w-1.5 bg-indigo-500 rounded-r-full" />
                  )}

                  <div
                    className={`h-13 w-13 min-h-13 min-w-13 rounded-2xl flex items-center justify-center transition ${
                      active
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                        : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-indigo-300"
                    }`}
                  >
                    <Icon size={23} />
                  </div>

                  <div>
                    <p className="font-extrabold text-lg">{item.name}</p>
                    <p
                      className={`text-sm mt-0.5 ${
                        active ? "text-slate-500" : "text-slate-500"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-5 border-t border-white/10">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 mb-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-3xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                <UserCircle className="text-indigo-400" size={36} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-base truncate">
                  {user?.name || "User"}
                </p>

                <p className="text-sm text-slate-400 truncate">
                  {user?.email}
                </p>

                <span className="inline-flex mt-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-black capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white py-4 rounded-3xl font-extrabold transition-all border border-red-500/20"
          >
            <LogOut size={19} />
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
              <Menu size={24} />
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