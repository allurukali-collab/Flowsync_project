import { useMemo } from "react";
import { getUserRole, isEmployeeDesignation } from "../constants/roles";

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredToken() {
  const token = localStorage.getItem("token");
  if (token) return token;
  const user = getStoredUser();
  return user?.token || null;
}

export function useAuth() {
  const user = getStoredUser();
  const token = getStoredToken();

  return useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      role: getUserRole(user),
      isEmployee: isEmployeeDesignation(user?.designation),
      isPrivileged: !isEmployeeDesignation(user?.designation),
    }),
    [user, token]
  );
}
