import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

const normalizeRole = (role) => {
  const r = String(role || "").toLowerCase();
  if (r === "partner") return "manager";
  return r;
};

export default function RequireRole({ allow = [], children }) {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const role = normalizeRole(auth?.role) || "guest";

  console.log("RequireRole", { role, allow });

  if (allow.includes(role)) return children;

  return <Navigate to="/signin" replace state={{ from: location }} />;
}

