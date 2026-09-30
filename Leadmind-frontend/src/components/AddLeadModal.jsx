import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export default function AddLeadModal({ onClose, onSaved, editingLead }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [source, setSource] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("new");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingLead) {
      setName(editingLead.name || "");
      setEmail(editingLead.email || "");
      setPhone(editingLead.phone || "");
      setCompany(editingLead.company || "");
      setSource(editingLead.source || "");
      setValue(editingLead.value || "");
      setStatus(editingLead.status || "new");
    }
  }, [editingLead]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = { name, email, phone, company, source, value, status };

      if (editingLead) {
        await axiosInstance.put(`/leads/${editingLead._id}`, data);
      } else {
        await axiosInstance.post("/leads", data);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    marginTop: "6px",
  };

  const labelStyle = { fontSize: "13px", color: "#1E293B", fontWeight: "500" };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(30,41,59,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "28px",
          width: "100%",
          maxWidth: "440px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <h2 style={{ color: "#1E293B", fontSize: "18px", fontWeight: "700", margin: 0 }}>
            {editingLead ? "Edit Lead" : "Add Lead"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" }}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
            <div>
              <label style={labelStyle}>Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Company</label>
              <input value={company} onChange={(e) => setCompany(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
            <div>
              <label style={labelStyle}>Source</label>
              <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Website, Referral..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Deal Value (₹)</label>
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="interested">Interested</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {error && <p style={{ color: "#EF4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#0F6E6E", color: "#fff", padding: "10px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
          >
            {loading ? "Saving..." : editingLead ? "Save Changes" : "Add Lead"}
          </button>
        </form>
      </div>
    </div>
  );
}