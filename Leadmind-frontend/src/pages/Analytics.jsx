import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import logo from "../assets/logo.svg";

const statusMeta = {
  new: { label: "New", color: "#0F6E6E" },
  contacted: { label: "Contacted", color: "#3B82F6" },
  interested: { label: "Interested", color: "#0891B2" },
  negotiation: { label: "Negotiation", color: "#FF7A50" },
  won: { label: "Won", color: "#34D399" },
  lost: { label: "Lost", color: "#EF6461" },
};

export default function Analytics() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosInstance.get("/analytics/dashboard");
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (!data || !chartRef.current || !window.Chart) return;

    const counts = Object.keys(statusMeta).map((statusKey) => {
      const stat = data.pipelineStats.find((p) => p._id === statusKey);
      return stat ? stat.count : 0;
    });
    const colors = Object.values(statusMeta).map((m) => m.color);
    const labels = Object.values(statusMeta).map((m) => m.label);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new window.Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: counts,
            backgroundColor: colors,
            borderColor: "#F4F7FA",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        cutout: "65%",
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7FA", padding: "32px" }}>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="LeadMind AI" className="w-11 h-11" />
          <div>
            <h1 className="font-display font-bold text-[26px] text-[var(--color-ink)] m-0 leading-tight">
              Analytics
            </h1>
            <p className="text-[14px] text-[var(--color-slate)] m-0 mt-1">
              Logged in as {user?.name} ({user?.role})
            </p>
          </div>
        </div>
        <Link
          to="/leads"
          className="text-[var(--color-teal)] text-[14px] font-semibold hover:underline"
        >
          ← Back to Leads
        </Link>
      </div>

      {loading ? (
        <p style={{ color: "#64748b" }}>Loading analytics...</p>
      ) : error ? (
        <p style={{ color: "#EF4444" }}>{error}</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
              marginBottom: "28px",
            }}
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <p className="text-[13px] text-[var(--color-slate)] m-0 mb-2">Total Leads</p>
              <p className="font-display font-bold text-[28px] text-[var(--color-ink)] m-0">
                {data.totalLeads}
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <p className="text-[13px] text-[var(--color-slate)] m-0 mb-2">Won Leads</p>
              <p className="font-display font-bold text-[28px] m-0" style={{ color: "#34D399" }}>
                {data.wonLeads}
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <p className="text-[13px] text-[var(--color-slate)] m-0 mb-2">Conversion Rate</p>
              <p className="font-display font-bold text-[28px] text-[var(--color-ink)] m-0">
                {data.conversionRate.toFixed(1)}%
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <p className="text-[13px] text-[var(--color-slate)] m-0 mb-2">Total Revenue (Won)</p>
              <p className="font-display font-bold text-[28px] text-[var(--color-ink)] m-0">
                ₹{data.totalRevenue.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
            <h2 className="font-display font-semibold text-[16px] text-[var(--color-ink)] m-0 mb-4">
              Pipeline Breakdown
            </h2>

            {data.pipelineStats.length === 0 ? (
              <p className="text-[13px] text-slate-400">No leads yet.</p>
            ) : (
              <>
                <div style={{ position: "relative", width: "100%", height: "260px" }}>
                  <canvas
                    ref={chartRef}
                    role="img"
                    aria-label="Donut chart of leads by pipeline status"
                  />
                </div>
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                  {Object.keys(statusMeta).map((statusKey) => {
                    const stat = data.pipelineStats.find((p) => p._id === statusKey);
                    const count = stat ? stat.count : 0;
                    const meta = statusMeta[statusKey];
                    return (
                      <span
                        key={statusKey}
                        className="flex items-center gap-1.5 text-[13px] text-[var(--color-slate)]"
                      >
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "2px",
                            background: meta.color,
                            display: "inline-block",
                          }}
                        />
                        {meta.label} {count}
                      </span>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}