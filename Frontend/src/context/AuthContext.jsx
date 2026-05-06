import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (formData) => {
    const res = await API.post("/auth/login", formData);

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);

    toast.success("Login successful");
    return res.data.user;
  };

  const signup = async (formData) => {
    const res = await API.post("/auth/signup", formData);

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);

    toast.success("Signup successful");
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out");
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      const res = await API.get("/auth/me");
      setUser(res.data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);