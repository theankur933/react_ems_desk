import { seedAdmin, seedEmployees, seedTasks } from "../data/seed";

const KEYS = {
  employees: "EMS Desk Employee",
  tasks: "EMS Desk Task",
  admin: "EMS Desk Admin",
  session: "EMS Desk Session",
};

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function initializeStorage() {
  if (!localStorage.getItem(KEYS.employees))
    localStorage.setItem(KEYS.employees, JSON.stringify(seedEmployees));
  if (!localStorage.getItem(KEYS.tasks))
    localStorage.setItem(KEYS.tasks, JSON.stringify(seedTasks));
  if (!localStorage.getItem(KEYS.admin))
    localStorage.setItem(KEYS.admin, JSON.stringify(seedAdmin));
}

export const getEmployees = () => read(KEYS.employees, []);
export const saveEmployees = (value) =>
  localStorage.setItem(KEYS.employees, JSON.stringify(value));
export const getTasks = () => read(KEYS.tasks, []);
export const saveTasks = (value) =>
  localStorage.setItem(KEYS.tasks, JSON.stringify(value));
export const getSession = () => read(KEYS.session, null);
export const saveSession = (value) =>
  localStorage.setItem(KEYS.session, JSON.stringify(value));
export const clearSession = () => localStorage.removeItem(KEYS.session);
export const getAdmin = () => read(KEYS.admin, seedAdmin);
