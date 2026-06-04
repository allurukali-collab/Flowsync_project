import React from "react";
import CrudModule from "./CrudModule";

export default function CareersPage() {
  return (
    <CrudModule
      title="Careers"
      subtitle="Manage job openings and internal career opportunities."
      endpoint="/api/careers"
      emptyTitle="No job openings available"
      emptyMessage="Post your first job opening to attract internal and external candidates."
      searchKeys={["jobTitle", "department", "location", "jobType", "status"]}
      statusKeys={["status"]}
      columns={[
        { key: "jobTitle", label: "Job Title" },
        { key: "department", label: "Department" },
        { key: "location", label: "Location" },
        { key: "jobType", label: "Type" },
        { key: "status", label: "Status" },
      ]}
      fields={[
        { key: "jobTitle", label: "Job Title", required: true },
        { key: "department", label: "Department", required: true },
        { key: "location", label: "Location" },
        { key: "jobType", label: "Job Type" },
        { key: "experienceRequired", label: "Experience Required" },
        { key: "skillsRequired", label: "Skills Required", multiline: true },
        { key: "description", label: "Description", multiline: true },
        { key: "status", label: "Status", defaultValue: "OPEN" },
        { key: "closingDate", label: "Closing Date (YYYY-MM-DD)" },
      ]}
    />
  );
}
