import React from "react";
import CrudModule from "./CrudModule";

export default function PeoplePage() {
  return (
    <CrudModule
      title="People"
      subtitle="Company employee directory — search by name, email, or role."
      endpoint="/api/people"
      readOnly
      viewMode="cards"
      cardEqualHeight
      emptyTitle="No people found"
      emptyMessage="Employee records will appear here once users are registered in the system."
      searchKeys={["name", "email", "designation", "employeeId"]}
      cardConfig={{
        titleKey: "name",
        subtitleKey: "email",
        metaKeys: ["employeeId", "designation"],
      }}
      columns={[
        { key: "employeeId", label: "Employee ID" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "designation", label: "Role" },
      ]}
      fields={[]}
    />
  );
}
