import React from "react";
import { useMemo } from "react";
import {
  Users,
  ClipboardList,
  CheckCircle2,
  Clock3,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import StatCard from "../components/StatCard";
import Avatar from "../components/Avatar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { employees, tasks, user } = useApp();
  const mine =
    user.role === "employee"
      ? tasks.filter((t) => t.employeeId === user.employeeId)
      : tasks;
  const done = mine.filter((t) => t.status === "Done").length;
  const active = mine.filter((t) => t.status === "In progress").length;
  const todo = mine.filter((t) => t.status === "Todo").length;
  const heading =
    user.role === "admin"
      ? "Good morning, Alex"
      : `Welcome back, ${user.name.split(" ")[0]}`;
  const subheading =
    user.role === "admin"
      ? "Here's what's happening across your workspace today."
      : "Here's a snapshot of your work and what's coming up.";
  const recent = useMemo(
    () =>
      [...mine]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5),
    [mine]
  );
  const employee = (id) => employees.find((e) => e.id === id);
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            {user.role === "admin" ? "OVERVIEW" : "MY WORKSPACE"}
          </span>
          <h1>{heading}</h1>
          <p>{subheading}</p>
        </div>
        <div className="today-chip">
          <CalendarDays size={16} /> Sunday, November 1, 2026
        </div>
      </div>
      <div className="stats-grid">
        {user.role === "admin" && (
          <StatCard
            label="Total employees"
            value={employees.length}
            note="Across all departments"
            icon={Users}
            tone="blue"
          />
        )}
        <StatCard
          label={user.role === "admin" ? "Total tasks" : "Assigned to me"}
          value={mine.length}
          note="Tasks in your workspace"
          icon={ClipboardList}
          tone="violet"
        />
        <StatCard
          label="In progress"
          value={active}
          note="Currently being worked on"
          icon={Clock3}
          tone="orange"
        />
        <StatCard
          label="Completed"
          value={done}
          note="Successfully finished"
          icon={CheckCircle2}
          tone="green"
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel task-panel">
          <div className="panel-heading">
            <div>
              <h2>{user.role === "admin" ? "Recent tasks" : "Your tasks"}</h2>
              <p>Keep track of the latest work updates.</p>
            </div>
            <Link to="/tasks" className="text-link">
              View all <ArrowUpRight size={15} />
            </Link>
          </div>
          {recent.length ? (
            <div className="task-list">
              {recent.map((task) => (
                <div className="task-row" key={task.id}>
                  <span
                    className={`task-bullet ${
                      task.status === "Done"
                        ? "bullet-done"
                        : task.status === "In progress"
                        ? "bullet-progress"
                        : ""
                    }`}
                  />
                  <div className="task-row-main">
                    <strong>{task.title}</strong>
                    <span>
                      {user.role === "admin"
                        ? employee(task.employeeId)?.name || "Unassigned"
                        : task.id}{" "}
                      · Due {task.dueDate}
                    </span>
                  </div>
                  <span
                    className={`status status-${task.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No tasks yet. You're all caught up.
            </div>
          )}
        </section>
        {user.role === "admin" ? (
          <section className="panel people-panel">
            <div className="panel-heading">
              <div>
                <h2>Team members</h2>
                <p>Your growing team at a glance.</p>
              </div>
              <Link to="/employees" className="text-link">
                View all <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className="people-list">
              {employees.slice(0, 5).map((person) => (
                <div className="person-row" key={person.id}>
                  <Avatar name={person.name} color={person.color} />
                  <div className="person-info">
                    <strong>{person.name}</strong>
                    <span>{person.role}</span>
                  </div>
                  <span
                    className={`status status-${person.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {person.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="panel progress-panel">
            <div className="panel-heading">
              <div>
                <h2>Task progress</h2>
                <p>Your current completion rate.</p>
              </div>
            </div>
            <div className="progress-number">
              {mine.length ? Math.round((done / mine.length) * 100) : 0}
              <small>%</small>
            </div>
            <div className="progress-track">
              <span
                style={{
                  width: `${mine.length ? (done / mine.length) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="progress-legend">
              <span>
                <i className="legend-dot done-dot" /> {done} completed
              </span>
              <span>
                <i className="legend-dot todo-dot" /> {todo + active} remaining
              </span>
            </div>
            <p className="progress-note">
              Keep going — every completed task moves the team forward.
            </p>
          </section>
        )}
      </div>
      <div className="bottom-note">
        <span className="note-icon">✦</span>
        <div>
          <strong>
            {user.role === "admin"
              ? "A little team insight"
              : "A little reminder"}
          </strong>
          <p>
            {user.role === "admin"
              ? `${
                  employees.filter((e) => e.status === "Active").length
                } team members are currently active. Keep tasks clear and priorities aligned.`
              : "Break larger projects into small steps, and remember to update your task status as you go."}
          </p>
        </div>
      </div>
    </div>
  );
}
