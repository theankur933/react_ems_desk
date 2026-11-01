import React from "react";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, ListTodo } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

const blank = {
  title: "",
  description: "",
  employeeId: "",
  priority: "Medium",
  status: "Todo",
  dueDate: "2026-11-10",
  createdAt: "2026-11-01",
};
export default function Tasks() {
  const { tasks, updateTasks, employees, user } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const mine =
    user.role === "employee"
      ? tasks.filter((t) => t.employeeId === user.employeeId)
      : tasks;
  const filtered = useMemo(
    () =>
      mine.filter(
        (t) =>
          (statusFilter === "All" || t.status === statusFilter) &&
          `${t.title} ${t.description}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [mine, statusFilter, query]
  );
  const openAdd = () => {
    setEditing(null);
    setForm({ ...blank, employeeId: employees[0]?.id || "" });
    setModal(true);
  };
  const openEdit = (task) => {
    setEditing(task.id);
    setForm({ ...task });
    setModal(true);
  };
  const save = (e) => {
    e.preventDefault();
    const next = editing
      ? tasks.map((t) => (t.id === editing ? { ...t, ...form } : t))
      : [...tasks, { ...form, id: `TSK-${Date.now().toString().slice(-6)}` }];
    updateTasks(next);
    setModal(false);
  };
  const remove = (id) => {
    if (confirm("Delete this task?"))
      updateTasks(tasks.filter((t) => t.id !== id));
  };
  const updateStatus = (id, status) =>
    updateTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  const nameFor = (id) =>
    employees.find((e) => e.id === id)?.name || "Unassigned";
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">WORK MANAGEMENT</span>
          <h1>{user.role === "admin" ? "Task management" : "My tasks"}</h1>
          <p>
            {user.role === "admin"
              ? "Create, assign and follow up on your team’s work."
              : "Stay on top of your assignments and update progress."}
          </p>
        </div>
        {user.role === "admin" && (
          <button className="button button-primary" onClick={openAdd}>
            <Plus size={17} /> Create task
          </button>
        )}
      </div>
      <div className="task-summary-grid">
        <div className="mini-summary">
          <span className="mini-icon mini-purple">
            <ListTodo size={17} />
          </span>
          <div>
            <small>Total tasks</small>
            <strong>{mine.length}</strong>
          </div>
        </div>
        <div className="mini-summary">
          <span className="mini-icon mini-orange">◷</span>
          <div>
            <small>In progress</small>
            <strong>
              {mine.filter((t) => t.status === "In progress").length}
            </strong>
          </div>
        </div>
        <div className="mini-summary">
          <span className="mini-icon mini-green">✓</span>
          <div>
            <small>Completed</small>
            <strong>{mine.filter((t) => t.status === "Done").length}</strong>
          </div>
        </div>
      </div>
      <section className="panel table-panel">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks..."
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Todo</option>
            <option>In progress</option>
            <option>Done</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>TASK</th>
                {user.role === "admin" && <th>ASSIGNEE</th>}
                <th>PRIORITY</th>
                <th>DUE DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => (
                <tr key={task.id}>
                  <td>
                    <div className="task-table-title">
                      <strong>{task.title}</strong>
                      <span>{task.id}</span>
                    </div>
                  </td>
                  {user.role === "admin" && <td>{nameFor(task.employeeId)}</td>}
                  <td>
                    <span
                      className={`priority priority-${task.priority.toLowerCase()}`}
                    >
                      <i /> {task.priority}
                    </span>
                  </td>
                  <td>
                    {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </td>
                  <td>
                    {user.role === "employee" ? (
                      <select
                        className="inline-status"
                        value={task.status}
                        onChange={(e) => updateStatus(task.id, e.target.value)}
                      >
                        <option>Todo</option>
                        <option>In progress</option>
                        <option>Done</option>
                      </select>
                    ) : (
                      <span
                        className={`status status-${task.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {task.status}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      {user.role === "admin" && (
                        <>
                          <button
                            className="icon-button"
                            title="Edit task"
                            onClick={() => openEdit(task)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="icon-button danger-hover"
                            title="Delete task"
                            onClick={() => remove(task.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              No tasks found. Try changing your filters.
            </div>
          )}
        </div>
        <div className="table-footer">
          Showing <b>{filtered.length}</b> of <b>{mine.length}</b> tasks
        </div>
      </section>
      {modal && (
        <Modal
          title={editing ? "Edit task" : "Create a task"}
          onClose={() => setModal(false)}
          wide
        >
          <form className="modal-form" onSubmit={save}>
            <div className="form-grid">
              <label className="full-field">
                Task title
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="What needs to be done?"
                />
              </label>
              <label className="full-field">
                Description
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Add a few details about this task..."
                />
              </label>
              <label>
                Assign to
                <select
                  required
                  value={form.employeeId}
                  onChange={(e) =>
                    setForm({ ...form, employeeId: e.target.value })
                  }
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Priority
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
              <label>
                Due date
                <input
                  type="date"
                  required
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                />
              </label>
              <label>
                Status
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option>Todo</option>
                  <option>In progress</option>
                  <option>Done</option>
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
              <button className="button button-primary">
                {editing ? "Save changes" : "Create task"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
