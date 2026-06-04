import React from "react";
import CrudModule from "./CrudModule";

export default function DocumentsPage() {
  return (
    <CrudModule
      title="Document Center"
      subtitle="Employee documents — track submission, verification, and approval status."
      endpoint="/api/documents"
      emptyTitle="No documents on file"
      emptyMessage="Add employee document records for onboarding, compliance, and verification."
      searchKeys={["employeeName", "documentName", "documentType", "status"]}
      statusKeys={["status"]}
      columns={[
        { key: "employeeId", label: "Emp ID" },
        { key: "employeeName", label: "Employee" },
        { key: "documentName", label: "Document" },
        { key: "documentType", label: "Type" },
        { key: "status", label: "Status" },
      ]}
      fields={[
        { key: "employeeId", label: "Employee ID", type: "number", required: true },
        { key: "employeeName", label: "Employee Name", required: true },
        { key: "documentName", label: "Document Name", required: true },
        { key: "documentType", label: "Document Type" },
        { key: "documentUrl", label: "Document URL" },
        { key: "status", label: "Status (PENDING/SUBMITTED/VERIFIED/REJECTED)", defaultValue: "PENDING" },
        { key: "remarks", label: "Remarks", multiline: true },
      ]}
    />
  );
}
