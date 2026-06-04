import api from "./api";

export async function fetchLeaveHistory(employeeId) {
  const response = await api.get(`/api/leaves/history/${employeeId}`);
  return response.data;
}

export async function applyLeave(payload) {
  const response = await api.post("/api/leaves/apply", payload);
  return response.data;
}

export async function withdrawLeave(leaveId) {
  const response = await api.put(`/api/leaves/withdraw/${leaveId}`);
  return response.data;
}

export async function fetchPendingLeavesForManager(managerName) {
  const encoded = encodeURIComponent(managerName);
  const response = await api.get(`/api/leaves/manager/pending/${encoded}`);
  return response.data;
}

export async function approveLeave(leaveId) {
  const response = await api.put(`/api/leaves/approve/${leaveId}`);
  return response.data;
}

export async function rejectLeave(leaveId) {
  const response = await api.put(`/api/leaves/reject/${leaveId}`);
  return response.data;
}

export function mapLeaveHistoryToRow(item) {
  const formatDate = (value) => {
    if (!value) return "";
    if (typeof value === "string" && value.includes("-") && value.length === 10) {
      const [y, m, d] = value.split("-");
      return `${d}-${m}-${y}`;
    }
    return value;
  };

  return {
    id: item.id,
    empId: item.employeeId,
    name: item.employeeName || "",
    leaveType: item.leaveType,
    startDate: formatDate(item.startDate),
    endDate: formatDate(item.endDate),
    days: item.days,
    appliedOn: formatDate(item.appliedOn),
    reason: item.reason || "",
    balance: item.balance ?? "-",
    status: item.status || "PENDING",
    category: "Normal Leave",
  };
}
