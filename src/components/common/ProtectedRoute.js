import React from "react";
import { Navigate } from "react-router-dom";
import { getStoredToken, getStoredUser } from "../../hooks/useAuth";
import { isEmployeeDesignation } from "../../constants/roles";
import AccessDenied from "./AccessDenied";

export default function ProtectedRoute({ children, requirePrivileged = false }) {
  const user = getStoredUser();
  const token = getStoredToken();

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  if (requirePrivileged && isEmployeeDesignation(user.designation)) {
    return <AccessDenied />;
  }

  return children;
}
