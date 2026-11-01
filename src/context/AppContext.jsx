import React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  initializeStorage,
  getEmployees,
  saveEmployees,
  getTasks,
  saveTasks,
  getSession,
  saveSession,
  clearSession,
  getAdmin,
} from "../utils/storage";

const AppContext = createContext(null);
export function AppProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    initializeStorage();
    setEmployees(getEmployees());
    setTasks(getTasks());
    setUser(getSession());
  }, []);

  const updateEmployees = (value) => {
    setEmployees(value);
    saveEmployees(value);
  };
  const updateTasks = (value) => {
    setTasks(value);
    saveTasks(value);
  };

  const login = (email, password) => {
    const admin = getAdmin();
    if (email.toLowerCase() === admin.email && password === admin.password) {
      const session = { email: admin.email, name: admin.name, role: "admin" };
      setUser(session);
      saveSession(session);
      return { ok: true };
    }
    const employee = employees.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password
    );
    if (employee) {
      const session = {
        email: employee.email,
        name: employee.name,
        role: "employee",
        employeeId: employee.id,
      };
      setUser(session);
      saveSession(session);
      return { ok: true };
    }
    return { ok: false, message: "Email or password is incorrect." };
  };
  const logout = () => {
    clearSession();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      employees,
      tasks,
      user,
      login,
      logout,
      updateEmployees,
      updateTasks,
    }),
    [employees, tasks, user]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export const useApp = () => useContext(AppContext);
