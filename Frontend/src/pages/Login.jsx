import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await login(formData);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950">
      <div className="hidden lg:flex relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-slate-950 to-slate-900" />
        <div className="absolute h-96 w-96 bg-indigo-400/20 rounded-full blur-3xl -top-20 -left-20" />
        <div className="absolute h-96 w-96 bg-purple-400/20 rounded-full blur-3xl bottom-0 right-0" />

        <div className="relative z-10 max-w-xl">
          <h1 className="text-5xl font-extrabold text-white leading-tight">
            Manage your team tasks with clarity.
          </h1>

          <p className="text-slate-300 text-lg mt-6 leading-relaxed">
            Create projects, assign work, monitor progress and keep your team
            aligned with a clean dashboard.
          </p>

          <div className="mt-10 space-y-5">
            {[
              "Role-based Admin and Member access",
              "Project and task management",
              "Dashboard with overdue tracking",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white">
                <CheckCircle2 className="text-green-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900">
              Task<span className="text-indigo-600">Flow</span>
            </h1>

            <p className="text-slate-500 mt-2">
              Welcome back. Please login to continue.
            </p>
          </div>

          <div className="card p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Login to your account
            </h2>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="admin@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="primary-btn w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
                {!loading && <ArrowRight size={19} />}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Do not have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-indigo-600 hover:text-indigo-700"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;