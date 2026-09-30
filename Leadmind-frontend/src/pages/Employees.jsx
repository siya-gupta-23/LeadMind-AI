import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import logo from "../assets/logo.svg";

export default function Employees() {
  const user = useSelector((state) => state.auth.user);
  const [employees, setEmployees] = useState([]);
  const [unassignedCount, setUnassignedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/auth/employees");
      setEmployees(res.data.employees);
      setUnassignedCount(res.data.unassignedCount);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleToggleActive = async (emp) => {
    setActionLoadingId(emp._id);
    try {
      const endpoint = emp.isActive
        ? `/auth/deactivate-employee/${emp._id}`
        : `/auth/activate-employee/${emp._id}`;
      await axiosInstance.put(endpoint);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7FA", padding: "32px" }}>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="LeadMind AI" className="w-11 h-11" />
          <div>
            <h1 className="font-display font-bold text-[26px] text-[var(--color-ink)] m-0 leading-tight">
              Employees
            </h1>
            <p className="text-[14px] text-[var(--color-slate)] m-0 mt-1">
              {employees.length} sales executives · {unassignedCount} unassigned leads
            </p>
          </div>
        </div>
        <Link to="/leads" className="text-[var(--color-teal)] text-[14px] font-semibold hover:underline">
          ← Back to Leads
        </Link>
      </div>

      {loading ? (
        <p style={{ color: "#64748b" }}>Loading...</p>
      ) : error ? (
        <p style={{ color: "#EF4444" }}>{error}</p>
      ) : employees.length === 0 ? (
        <p style={{ color: "#64748b" }}>No sales executives yet. Invite one from the dashboard.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "18px" }}>
          {employees.map((emp) => (
            <div key={emp._id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-display font-semibold text-[16px] text-[var(--color-ink)] m-0">
                    {emp.name}
                  </p>
                  <p className="text-[13px] text-[var(--color-slate)] m-0 mt-0.5">{emp.email}</p>
                </div>
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: emp.isActive ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.1)",
                    color: emp.isActive ? "#0F6E6E" : "#EF4444",
                  }}
                >
                  {emp.isActive ? "Active" : "Deactivated"}
                </span>
              </div>

              {!emp.isEmailVerified && (
                <p className="text-[12px] text-orange-500 m-0 mb-2">Invite pending — not signed up yet</p>
              )}

              <div className="flex gap-4 mb-4">
                <div>
                  <p className="text-[12px] text-[var(--color-slate)] m-0">Assigned Leads</p>
                  <p className="font-display font-bold text-[20px] text-[var(--color-ink)] m-0">
                    {emp.totalLeads}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-[var(--color-slate)] m-0">Won</p>
                  <p className="font-display font-bold text-[20px] m-0" style={{ color: "#34D399" }}>
                    {emp.wonLeads}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleToggleActive(emp)}
                disabled={actionLoadingId === emp._id}
                className={`w-full text-[13px] font-semibold rounded-lg py-2 transition-colors disabled:opacity-60 ${
                  emp.isActive
                    ? "bg-[rgba(239,68,68,0.1)] text-red-500 hover:bg-[rgba(239,68,68,0.18)]"
                    : "bg-[rgba(15,110,110,0.1)] text-[var(--color-teal)] hover:bg-[rgba(15,110,110,0.18)]"
                }`}
              >
                {actionLoadingId === emp._id
                  ? "Please wait..."
                  : emp.isActive
                  ? "Deactivate"
                  : "Activate"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}