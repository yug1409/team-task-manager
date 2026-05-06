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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-80 bg-gradient-to-b from-white via-indigo-50/60 to-slate-100 text-slate-900 transition-all duration-300 flex flex-col border-r border-slate-200 shadow-xl shadow-slate-200/60 ${
          open ? "left-0" : "-left-80 lg:left-0"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 h-52 w-52 rounded-full bg-indigo-200/50 blur-3xl" />
          <div className="absolute top-40 -right-24 h-56 w-56 rounded-full bg-purple-200/40 blur-3xl" />
          <div className="absolute bottom-20 -left-20 h-52 w-52 rounded-full bg-blue-200/40 blur-3xl" />
        </div>

        <div className="relative z-10 p-6 border-b border-slate-200/70">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4"
            >
              <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-300">
                <Sparkles size={28} className="text-white" />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950">
                  Task<span className="text-indigo-600">Flow</span>
                </h1>
                <p className="text-sm text-slate-500 font-semibold">
                  Team Task Manager
                </p>
              </div>
            </Link>

            <button
              onClick={() => setOpen(false)}
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-slate-100 transition"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <nav className="relative z-10 px-5 py-7 flex-1">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-black px-4 mb-5">
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
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-200 scale-[1.02]"
                      : "bg-white/60 text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-lg hover:shadow-slate-200/70"
                  }`}
                >
                  <div
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center transition shrink-0 ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                    }`}
                  >
                    <Icon size={23} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-extrabold text-lg truncate">
                      {item.name}
                    </p>
                    <p
                      className={`text-sm mt-0.5 truncate ${
                        active ? "text-indigo-100" : "text-slate-500"
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

        <div className="relative z-10 p-5 border-t border-slate-200/70">
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-lg shadow-slate-200/70 rounded-[2rem] p-5 mb-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shrink-0">
                <UserCircle className="text-indigo-600" size={36} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-base text-slate-950 truncate">
                  {user?.name || "User"}
                </p>

                <p className="text-sm text-slate-500 truncate">
                  {user?.email}
                </p>

                <span className="inline-flex mt-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-500 text-red-500 hover:text-white py-4 rounded-3xl font-extrabold transition-all border border-red-100 shadow-lg shadow-red-100/60"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen min-w-0 overflow-x-hidden">
  <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200 px-6 lg:px-8 py-4 flex items-center justify-between gap-4 sticky top-0 z-20">
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

        <section className="p-6 lg:p-8 overflow-x-hidden">{children}</section>
          </main>
    </div>
  );
};

export default Layout;