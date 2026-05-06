import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
    
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      <div className="hidden lg:flex bg-slate-950 text-white p-14 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Task<span className="text-indigo-400">Flow</span>
          </h1>
          <p className="text-slate-400 mt-3 text-lg">
            A modern team task manager for projects, tasks and progress tracking.
          </p>
        </div>

        <div className="space-y-5">
          {[
            "Role based Admin/Member access",
            "Project and team management",
            "Task assignment and status tracking",
            "Dashboard with progress insights",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle2 className="text-indigo-400" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-slate-500">
          
        </p>
      </div>

      <div className="flex items-center justify-center px-5">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100"
        >
          <h2 className="text-3xl font-bold text-slate-900">
            Welcome Back
          </h2>
          <p className="text-slate-500 mt-2">
            Login to continue to your workspace.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;