import React from "react";
import CrudModule from "./CrudModule";

export default function WorkflowsPage() {
  return (
    <CrudModule
      title="Workflow Delegates"
      subtitle="Define approval flows and multi-step business processes."
      endpoint="/api/workflows"
      viewMode="cards"
      emptyTitle="No workflows defined yet"
      emptyMessage="Create workflows for onboarding, timesheet approval, or document verification."
      searchKeys={["workflowName", "department", "createdBy", "status"]}
      statusKeys={["status"]}
      cardConfig={{
        titleKey: "workflowName",
        subtitleKey: "department",
        metaKeys: ["status", "createdBy"],
        showSteps: true,
      }}
      columns={[
        { key: "workflowName", label: "Workflow" },
        { key: "department", label: "Department" },
        { key: "status", label: "Status" },
        { key: "createdBy", label: "Created By" },
      ]}
      fields={[
        { key: "workflowName", label: "Workflow Name", required: true },
        { key: "description", label: "Description", multiline: true },
        { key: "department", label: "Department" },
        { key: "status", label: "Status", defaultValue: "ACTIVE" },
      ]}
    />
  );
}
