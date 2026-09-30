import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { setLeads, removeLead } from "../features/leads/leadsSlice";
import LeadCard from "../components/LeadCard";
import KanbanBoard from "../components/KanbanBoard";
import { Link } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import AddLeadModal from "../components/AddLeadModal";
import logo from "../assets/logo.svg";

export default function Leads() {
  const user = useSelector((state) => state.auth.user);
  const leads = useSelector((state) => state.leads.items);
  const total = useSelector((state) => state.leads.total);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const isAdmin = user?.role === "admin";

  const fetchLeads = async (
    pageNum = page,
    searchTerm = search,
    statusValue = statusFilter,
  ) => {
    try {
      setLoading(true);
      const searchQuery = searchTerm
        ? `&search=${encodeURIComponent(searchTerm)}`
        : "";
      const statusQuery = statusValue ? `&status=${statusValue}` : "";
      const res = await axiosInstance.get(
        `/leads?limit=10&page=${pageNum}${searchQuery}${statusQuery}`,
      );
      dispatch(setLeads({ leads: res.data.leads, total: res.data.total }));
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.page || pageNum);
    } catch (err) {
      console.log("Error fetching leads:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLeadsForBoard = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/leads?limit=1000`);
      dispatch(setLeads({ leads: res.data.leads, total: res.data.total }));
    } catch (err) {
      console.log("Error fetching leads:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "list") {
      fetchLeads(1);
    } else {
      fetchAllLeadsForBoard();
    }
  }, [view]);

  const refresh = () => {
    if (view === "list") {
      fetchLeads(page);
    } else {
      fetchAllLeadsForBoard();
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?",
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/leads/${id}`);
      dispatch(removeLead(id));
      refresh();
    } catch (err) {
      console.log("Delete error:", err.response?.data);
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingLead(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLead(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await axiosInstance.put(`/leads/${leadId}`, { status: newStatus });
      refresh();
    } catch (err) {
      console.log("Status update error:", err.response?.data);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchLeads(1, value, statusFilter);
  };

  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    fetchLeads(1, search, value);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F4F7FA", padding: "32px" }}>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="LeadMind AI" className="w-11 h-11" />
          <div>
            <h1 className="font-display font-bold text-[26px] text-[var(--color-ink)] m-0 leading-tight">
              LeadMind AI
            </h1>
            <p className="text-[14px] text-[var(--color-slate)] m-0 mt-1">
              {total} leads · Logged in as {user?.name} ({user?.role})
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search by name, email or company..."
            value={search}
            onChange={handleSearchChange}
            className="text-[14px] px-4 py-2 rounded-lg border border-slate-200 bg-white w-64 focus:outline-none focus:border-[var(--color-teal)]"
          />

          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="text-[14px] px-4 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[var(--color-teal)]"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>

          <div className="flex bg-black/[0.05] rounded-lg p-1">
            <button
              onClick={() => setView("list")}
              className={`text-[14px] font-semibold px-4 py-2 rounded-md transition-colors ${
                view === "list"
                  ? "bg-white text-[var(--color-ink)] shadow-sm"
                  : "text-slate-500"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView("board")}
              className={`text-[14px] font-semibold px-4 py-2 rounded-md transition-colors ${
                view === "board"
                  ? "bg-white text-[var(--color-ink)] shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Board
            </button>
          </div>

          {isAdmin && (
            <Link
              to="/invite-employee"
              className="bg-white border border-slate-200 text-[var(--color-teal)] px-4 py-2 rounded-lg text-[14px] font-semibold hover:bg-slate-50 transition-colors no-underline"
            >
              + Invite Employee
            </Link>
          )}

          <Link
            to="/analytics"
            className="bg-white border border-slate-200 text-[var(--color-teal)] px-4 py-2 rounded-lg text-[14px] font-semibold hover:bg-slate-50 transition-colors no-underline"
          >
            Analytics
          </Link>

          {isAdmin && (
            <Link
              to="/employees"
              className="bg-white border border-slate-200 text-[var(--color-teal)] px-4 py-2 rounded-lg text-[14px] font-semibold hover:bg-slate-50 transition-colors no-underline"
            >
              Employees
            </Link>
          )}

          <button
            onClick={handleAddNew}
            className="bg-[var(--color-teal)] text-white border-none px-5 py-2.5 rounded-lg text-[14px] font-semibold cursor-pointer hover:bg-[var(--color-teal-dark)] transition-colors"
          >
            + Add Lead
          </button>
          <button
            onClick={handleLogout}
            className="bg-[var(--color-coral)] text-white border-none px-5 py-2.5 rounded-lg text-[14px] font-semibold cursor-pointer hover:opacity-90 transition-opacity"
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#64748b", fontSize: "15px" }}>Loading...</p>
      ) : leads.length === 0 ? (
        <p style={{ color: "#64748b", fontSize: "15px" }}>
          No leads yet. Add your first one!
        </p>
      ) : view === "list" ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "18px",
            }}
          >
            {leads.map((lead, index) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUpdated={refresh}
                isAdmin={isAdmin}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-5 mt-8">
              <button
                onClick={() => fetchLeads(page - 1)}
                disabled={page <= 1}
                className="text-[14px] font-semibold px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-[var(--color-ink)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                ← Previous
              </button>
              <span className="text-[14px] text-[var(--color-slate)]">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => fetchLeads(page + 1)}
                disabled={page >= totalPages}
                className="text-[14px] font-semibold px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-[var(--color-ink)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : (
        <KanbanBoard
          leads={leads}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdated={refresh}
          onStatusChange={handleStatusChange}
          isAdmin={isAdmin}
        />
      )}

      {showModal && (
        <AddLeadModal
          onClose={handleCloseModal}
          onSaved={refresh}
          editingLead={editingLead}
        />
      )}
    </div>
  );
}