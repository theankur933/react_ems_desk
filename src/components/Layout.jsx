import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ListTodo,
  LogOut,
  Menu,
  X,
  BriefcaseBusiness,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import Avatar from "./Avatar";

export default function Layout() {
  const { user, logout } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const links =
    user?.role === "admin"
      ? [
          { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
          { to: "/employees", label: "Employees", icon: Users },
          { to: "/tasks", label: "Task management", icon: ListTodo },
        ]
      : [
          { to: "/dashboard", label: "My dashboard", icon: LayoutDashboard },
          { to: "/tasks", label: "My tasks", icon: ListTodo },
        ];
  const signOut = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="app-shell">
      {open && (
        <button
          className="mobile-scrim"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
      )}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">
            <BriefcaseBusiness size={20} />
          </span>
          <span>
            People<span className="brand-light">Desk</span>
          </span>
          <button
            className="mobile-close icon-button"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-dot">?</div>
            <strong>Need a hand?</strong>
            <p>Manage your team with confidence.</p>
          </div>
          <button className="nav-link logout-link" onClick={signOut}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu icon-button"
            onClick={() => setOpen(true)}
          >
            <Menu size={21} />
          </button>
          <div className="breadcrumb">
            Workspace <span>/</span>{" "}
            <b>
              {links.find((link) => location.pathname.startsWith(link.to))
                ?.label || "Dashboard"}
            </b>
          </div>
          <div className="topbar-user">
            <div className="topbar-user-copy">
              <strong>{user?.name}</strong>
              <span>
                {user?.role === "admin" ? "Administrator" : "Employee"}
              </span>
            </div>
            <Avatar name={user?.name} />
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
