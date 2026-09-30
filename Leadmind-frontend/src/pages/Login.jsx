import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { setCredentials } from "../features/auth/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F7FA" }}>
      <div style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.6)", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "400px" }}>
        <h1 style={{ color: "#1E293B", fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>Welcome back</h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>Login to LeadMind AI</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#1E293B", marginBottom: "6px" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#1E293B", marginBottom: "6px" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
            />
          </div>

          {error && <p style={{ color: "#D85A30", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#0F6E6E", color: "#fff", padding: "10px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#64748b", marginTop: "16px" }}>
          Don't have an account? <Link to="/signup" style={{ color: "#0F6E6E", fontWeight: "600" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}