import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.svg";

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F7FA",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="flex items-center gap-3 mb-8">
        <img src={logo} alt="LeadMind AI" className="w-10 h-10" />
        <span className="font-display font-bold text-[22px] text-[var(--color-ink)]">
          LeadMind AI
        </span>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-sm text-center">
        <h1 className="font-display font-bold text-[24px] text-[var(--color-ink)] m-0 mb-1">
          Welcome, {user?.name}
        </h1>
        <p className="text-[14px] text-[var(--color-slate)] m-0 mb-6 capitalize">
          Role: {user?.role}
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/leads"
            className="inline-flex items-center justify-center bg-[var(--color-teal)] text-white text-[14px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[var(--color-teal-dark)] transition-colors no-underline"
          >
            View Leads
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/invite-employee"
              className="inline-flex items-center justify-center bg-white border border-slate-200 text-[var(--color-teal)] text-[14px] font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors no-underline"
            >
              + Invite New Employee
            </Link>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 bg-[var(--color-coral)] text-white border-none px-5 py-2.5 rounded-lg text-[14px] font-semibold cursor-pointer hover:opacity-90 transition-opacity"
        >
          Logout
        </button>
      </div>
    </div>
  );
}