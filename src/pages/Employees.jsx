import React from "react";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Users, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import Modal from "../components/Modal";
import Avatar from "../components/Avatar";

const blank = {
  name: "",
  email: "",
  role: "",
  department: "Engineering",
  phone: "",
  joined: "2026-11-01",
  status: "Active",
  password: "123456",
  color: "blue",
};
export default function Employees() {
  const { employees, updateEmployees } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");
  const filtered = useMemo(
    () =>
      employees.filter(
        (e) =>
          (filter === "All" || e.status === filter) &&
          `${e.name} ${e.email} ${e.department} ${e.role}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [employees, filter, query]
  );
  const openAdd = () => {
    setEditing(null);
    setForm(blank);
    setError("");
    setModal(true);
  };
  const openEdit = (e) => {
    setEditing(e.id);
    setForm({ ...e });
    setError("");
    setModal(true);
  };
  const save = (event) => {
    event.preventDefault();
    if (
      employees.some(
        (e) =>
          e.email.toLowerCase() === form.email.toLowerCase() && e.id !== editing
      )
    ) {
      setError("An employee with this email already exists.");
      return;
    }
    const next = editing
      ? employees.map((e) => (e.id === editing ? { ...e, ...form } : e))
      : [
          ...employees,
          { ...form, id: `EMP-${Date.now().toString().slice(-6)}` },
        ];
    updateEmployees(next);
    setModal(false);
  };
  const remove = (id) => {
    if (
      confirm("Delete this employee? Their tasks will remain in the task list.")
    )
      updateEmployees(employees.filter((e) => e.id !== id));
  };
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">PEOPLE</span>
          <h1>Employees</h1>
          <p>Manage your people, roles and team information.</p>
        </div>
        <button className="button button-primary" onClick={openAdd}>
          <Plus size={17} /> Add employee
        </button>
      </div>
      <div className="employee-summary">
        <div className="summary-icon">
          <Users size={20} />
        </div>
        <div>
          <strong>{employees.length} team members</strong>
          <span>
            {employees.filter((e) => e.status === "Active").length} active ·{" "}
            {employees.filter((e) => e.status !== "Active").length} away or
            inactive
          </span>
        </div>
      </div>
      <section className="panel table-panel">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search employees..."
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X size={15} />
              </button>
            )}
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Active</option>
            <option>On leave</option>
            <option>Inactive</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>ROLE</th>
                <th>DEPARTMENT</th>
                <th>STATUS</th>
                <th>JOINED</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((person) => (
                <tr key={person.id}>
                  <td>
                    <div className="table-person">
                      <Avatar name={person.name} color={person.color} />
                      <div>
                        <strong>{person.name}</strong>
                        <span>{person.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{person.role}</td>
                  <td>{person.department}</td>
                  <td>
                    <span
                      className={`status status-${person.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {person.status}
                    </span>
                  </td>
                  <td>
                    {new Date(`${person.joined}T00:00:00`).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="icon-button"
                        title="Edit employee"
                        onClick={() => openEdit(person)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="icon-button danger-hover"
                        title="Delete employee"
                        onClick={() => remove(person.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">No employees match your search.</div>
          )}
        </div>
        <div className="table-footer">
          Showing <b>{filtered.length}</b> of <b>{employees.length}</b>{" "}
          employees
        </div>
      </section>
      {modal && (
        <Modal
          title={editing ? "Edit employee" : "Add a new employee"}
          onClose={() => setModal(false)}
        >
          <form className="modal-form" onSubmit={save}>
            <div className="form-grid">
              <label>
                Full name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Jamie Smith"
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jamie@company.com"
                />
              </label>
              <label>
                Job title
                <input
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. UX Designer"
                />
              </label>
              <label>
                Department
                <select
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                >
                  {[
                    "Engineering",
                    "Design",
                    "Marketing",
                    "Sales",
                    "Human Resources",
                    "Finance",
                    "Operations",
                  ].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 555 0100"
                />
              </label>
              <label>
                Joining date
                <input
                  type="date"
                  value={form.joined}
                  onChange={(e) => setForm({ ...form, joined: e.target.value })}
                />
              </label>
              <label>
                Status
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option>Active</option>
                  <option>On leave</option>
                  <option>Inactive</option>
                </select>
              </label>
              {!editing && (
                <label>
                  Temporary password
                  <input
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    minLength="6"
                  />
                </label>
              )}
            </div>
            {error && <p className="form-error">{error}</p>}
            <div className="modal-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
              <button className="button button-primary">
                {editing ? "Save changes" : "Add employee"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
