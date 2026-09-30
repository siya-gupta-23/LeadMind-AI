import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function InviteEmployee() {
  const user = useSelector((state) => state.auth.user);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Only admin can access this page.
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/invite-employee", {
        email,
        role: "sales_executive",
      });
      setMessage(res.data.message);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7FA", padding: "24px" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.6)", borderRadius: "16px", padding: "32px" }}>
        <h1 style={{ color: "#1E293B", fontSize: "22px", fontWeight: "700", marginBottom: "4px" }}>Invite Employee</h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
          Enter an employee's email to invite them as a Sales Executive
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#1E293B", marginBottom: "6px" }}>
              Employee Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="employee@company.com"
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
            />
          </div>

          {error && <p style={{ color: "#D85A30", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
          {message && <p style={{ color: "#0F6E6E", fontSize: "13px", marginBottom: "12px" }}>{message}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#0F6E6E", color: "#fff", padding: "10px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
          >
            {loading ? "Inviting..." : "Send Invite"}
          </button>
        </form>
      </div>
    </div>
  );
}