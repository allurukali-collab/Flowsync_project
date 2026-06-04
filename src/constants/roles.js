export const EMPLOYEE_DESIGNATIONS = ["ASE", "INTERN"];

export function isEmployeeDesignation(designation) {
  if (!designation) return false;
  return EMPLOYEE_DESIGNATIONS.includes(designation.trim().toUpperCase());
}

export function isPrivilegedDesignation(designation) {
  return !isEmployeeDesignation(designation);
}

export function getUserRole(user) {
  if (!user) return null;
  return isEmployeeDesignation(user.designation) ? "EMPLOYEE" : "PRIVILEGED";
}

export const PRIVILEGED_MODULES = [
  "REPORTS",
  "CAREERS",
  "LEARNING",
  "MORE_APPS",
  "DOCUMENT_CENTER",
  "TESTIMONIALS",
  "FEEDS",
  "WORKFLOW_DELEGATES",
  "PEOPLE",
  "ABOUT",
];

export const EMPLOYEE_MODULES = ["WORK_TRACKER", "EMPLOYEE_DASHBOARD"];
