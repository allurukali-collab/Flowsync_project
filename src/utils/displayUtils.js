/**
 * Resolves a display name from API/local row shapes.
 * Never returns "-" when employeeId is present.
 */
export function resolvePersonName(row) {
  if (!row) return "";
  const name =
    row.employeeName ||
    row.name ||
    row.employee_name ||
    row.fullName ||
    "";
  if (name && String(name).trim()) {
    return String(name).trim();
  }
  if (row.employeeId != null && row.employeeId !== "") {
    return `Employee ${row.employeeId}`;
  }
  if (row.empId != null && row.empId !== "") {
    return `Employee ${row.empId}`;
  }
  return "";
}

export function displayPersonName(row) {
  return resolvePersonName(row) || "—";
}
