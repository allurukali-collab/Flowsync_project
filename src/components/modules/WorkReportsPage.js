import React from "react";
import CrudModule from "./CrudModule";

export default function WorkReportsPage() {
  return (
    <CrudModule
      title="Work Reports"
      subtitle="Employee work reports, timesheet summaries, and task status tracking."
      endpoint="/timesheet/reports"
      emptyTitle="No work reports yet"
      emptyMessage="Create your first work report to track hours, tasks, and blockers for your team."
      searchKeys={["name", "id", "date", "status", "workStatus"]}
      statusKeys={["status", "workStatus"]}
      columns={[
        { key: "id", label: "ID" },
        { key: "name", label: "Employee" },
        { key: "date", label: "Date" },
        { key: "total", label: "Hours" },
        { key: "workStatus", label: "Work Status" },
        { key: "status", label: "Status" },
      ]}
      fields={[]}
    />
  );
}