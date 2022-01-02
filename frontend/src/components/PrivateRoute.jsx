import React from "react";
import { useAuth } from "../services/auth.context";
import Login from "../pages/Login";
import Dashboard from "./Dashboard";

export default function PrivateRoute() {
  const { currentAddr } = useAuth();
  return currentAddr.role ? <Dashboard /> : <Login />;
}
