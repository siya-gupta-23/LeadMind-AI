import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const statusMeta = {
  new: { border: "#0F6E6E", label: "New" },
  contacted: { border: "#3B82F6", label: "Contacted" },
  interested: { border: "#0891B2", label: "Interested" },
  negotiation: { border: "#FF7A50", label: "Negotiation" },
  won: { border: "#34D399", label: "Won" },
  lost: { border: "#EF6461", label: "Lost" },
};

const priorityColors = {
  Low: "#94a3b8",
  Medium: "#FF7A50",
  High: "#EF4444",
};

export default function LeadCard({ lead, onEdit, onDelete, onUpdated, isAdmin, index = 0 }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingFollowUp, setGeneratingFollowUp] = useState(false);
  const [followUp, setFollowUp] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [aiError, setAiError] = useState("");

  const meta = statusMeta[lead.status] || statusMeta.new;

  const handleAnalyze = async (e) => {
    e.stopPropagation();
    setAiError("");
    setAnalyzing(true);
    try {
      await axiosInstance.post(`/ai/analyze/${lead._id}`);
      onUpdated();
    } catch (err) {
      setAiError(err.response?.data?.message || "AI analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateFollowUp = async (e) => {
    e.stopPropagation();
    setAiError("");
    setGeneratingFollowUp(true);
    try {
      const res = await axiosInstance.post(`/ai/followup/${lead._id}`);
      setFollowUp(res.data.followUp);
      setShowFollowUp(true);
    } catch (err) {
      setAiError(err.response?.data?.message || "Failed to generate follow-up");
    } finally {
      setGeneratingFollowUp(false);
    }
  };

  return (
    <div
      className="lead-card group bg-white/70 backdrop-blur-sm rounded-2xl p-5 border-l-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{ borderLeftColor: meta.border, animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div onClick={() => onEdit(lead)} className="cursor-pointer">
        <div className="flex justify-between items-start mb-1.5">
          <p className="font-display font-semibold text-[17px] text-[var(--color-ink)] m-0">
            {lead.name}
          </p>
          <span className="text-[13px] font-medium m-0" style={{ color: meta.border }}>
            {meta.label}
          </span>
        </div>

        <p className="text-[14px] text-[var(--color-slate)] m-0 mb-1">
          {lead.company || "No company"}
        </p>
        <p className="text-[14px] text-[var(--color-slate)] m-0 mb-3">
          ₹{lead.value || 0}
        </p>
      </div>

      {lead.aiScore != null && (
        <div className="bg-gradient-to-r from-[rgba(34,211,238,0.08)] to-[rgba(59,130,246,0.08)] rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] font-bold bg-gradient-to-r from-[var(--color-ai-cyan)] to-[var(--color-ai-blue)] bg-clip-text text-transparent">
              ✨ AI Score: {lead.aiScore}
            </span>
            <span className="text-[12px] font-bold" style={{ color: priorityColors[lead.aiPriority] }}>
              {lead.aiPriority}
            </span>
          </div>
          <p className="text-[13px] text-slate-600 m-0 mb-1.5">{lead.aiReason}</p>
          <p className="text-[13px] text-[var(--color-teal)] font-medium m-0">
            → {lead.aiNextBestAction}
          </p>
        </div>
      )}

      {aiError && <p className="text-[13px] text-red-500 mb-2">{aiError}</p>}

      <div className="flex gap-2 mb-3">
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="flex-1 text-[13px] font-semibold rounded-lg py-2 transition-colors duration-150 bg-[rgba(15,110,110,0.1)] text-[var(--color-teal)] hover:bg-[rgba(15,110,110,0.18)] disabled:opacity-60"
        >
          {analyzing ? "Analyzing..." : lead.aiScore != null ? "Re-analyze" : "✨ Analyze with AI"}
        </button>
        <button
          onClick={handleGenerateFollowUp}
          disabled={generatingFollowUp}
          className="flex-1 text-[13px] font-semibold rounded-lg py-2 transition-colors duration-150 bg-[rgba(255,122,80,0.1)] text-[var(--color-coral)] hover:bg-[rgba(255,122,80,0.18)] disabled:opacity-60"
        >
          {generatingFollowUp ? "Writing..." : "Follow-up"}
        </button>
      </div>

      {showFollowUp && followUp && (
        <div className="bg-white border border-slate-200 rounded-lg p-3 mb-3">
          <div className="flex justify-between mb-1.5">
            <span className="text-[13px] font-bold text-[var(--color-ink)]">
              {followUp.subject || followUp.channel}
            </span>
            <button
              onClick={() => setShowFollowUp(false)}
              className="text-slate-400 hover:text-slate-600 text-base leading-none"
            >
              ×
            </button>
          </div>
          <p className="text-[13px] text-slate-600 whitespace-pre-wrap m-0 mb-2">
            {followUp.message}
          </p>
          <p className="text-[12px] text-slate-400 italic m-0">
            {followUp.recommendation}
          </p>
        </div>
      )}

      {isAdmin && (
        <div className="border-t border-black/5 pt-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(lead._id);
            }}
            className="text-red-500 text-[13px] hover:text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}