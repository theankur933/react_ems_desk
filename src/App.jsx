import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Tasks from "./pages/Tasks";

function ProtectedLayout() {
  const { user } = useApp();
  return user ? <Layout /> : <Navigate to="/login" replace />;
}
function AdminOnly({ children }) {
  const { user } = useApp();
  return user?.role === "admin" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
}
function AppRoutes() {
  const { user } = useApp();
  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/employees"
          element={
            <AdminOnly>
              <Employees />
            </AdminOnly>
          }
        />
        <Route path="/tasks" element={<Tasks />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}
export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
