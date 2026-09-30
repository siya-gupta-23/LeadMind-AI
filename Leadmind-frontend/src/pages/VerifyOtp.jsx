import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axiosInstance.post("/auth/verify-otp", { email, otp });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendMessage("");
    setResending(true);

    try {
      await axiosInstance.post("/auth/resend-otp", { email });
      setResendMessage("A new OTP has been sent to your email.");
      setCooldown(30);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F7FA" }}>
      <div style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.6)", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "400px" }}>
        <h1 style={{ color: "#1E293B", fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>Verify your email</h1>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>Enter the OTP sent to {email}</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#1E293B", marginBottom: "6px" }}>OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
            />
          </div>

          {error && <p style={{ color: "#D85A30", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
          {resendMessage && <p style={{ color: "#0F6E6E", fontSize: "13px", marginBottom: "12px" }}>{resendMessage}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#0F6E6E", color: "#fff", padding: "10px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#64748b" }}>
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            style={{
              background: "none",
              border: "none",
              color: cooldown > 0 ? "#94a3b8" : "#0F6E6E",
              fontWeight: "600",
              cursor: cooldown > 0 ? "not-allowed" : "pointer",
              fontSize: "13px",
              padding: 0,
            }}
          >
            {resending ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
}