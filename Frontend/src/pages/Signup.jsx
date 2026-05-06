import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Users,
} from "lucide-react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/signup", formData);

      login(res.data.user, res.data.token);
      toast.success("Signup successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950">
      <div className="hidden lg:flex relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-700" />
        <div className="absolute h-96 w-96 bg-indigo-400/20 rounded-full blur-3xl top-10 right-10" />
        <div className="absolute h-96 w-96 bg-blue-400/20 rounded-full blur-3xl bottom-0 left-0" />

        <div className="relative z-10 max-w-xl">
          <h1 className="text-5xl font-extrabold text-white leading-tight">
            Start managing projects smarter.
          </h1>

          <p className="text-slate-300 text-lg mt-6 leading-relaxed">
            Create an account as Admin or Member and experience a complete task
            management workflow.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 mt-10">
            <div className="bg-white/10 backdrop-blur border border-white/10 rounded-3xl p-5">
              <ShieldCheck className="text-indigo-300" size={34} />
              <h3 className="text-white font-bold mt-4">Admin Access</h3>
              <p className="text-slate-300 text-sm mt-2">
                Manage projects, members and tasks.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/10 rounded-3xl p-5">
              <Users className="text-green-300" size={34} />
              <h3 className="text-white font-bold mt-4">Member Access</h3>
              <p className="text-slate-300 text-sm mt-2">
                View tasks and update progress.
              </p>
            </div>
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
              Create your account to get started.
            </p>
          </div>

          <div className="card p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Create account
            </h2>

            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <div className="relative">
                  
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <div className="relative">
                 
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
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
                  
                  <input
                    type="password"
                    name="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Select Role
                </label>

                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="select-field"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 translate-y-1 text-slate-400 text-xs">
                    ▼
                  </span>
                </div>
              </div>

              <button
                disabled={loading}
                className="primary-btn w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create Account"}
                {!loading && <ArrowRight size={19} />}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-indigo-600 hover:text-indigo-700"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;