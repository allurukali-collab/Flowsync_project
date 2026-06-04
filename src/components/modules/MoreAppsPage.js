import React from "react";
import CrudModule from "./CrudModule";

export default function MoreAppsPage() {
  return (
    <CrudModule
      title="More Apps"
      subtitle="Internal company tools and application shortcuts."
      endpoint="/api/more-apps"
      viewMode="cards"
      emptyTitle="No apps configured yet"
      emptyMessage="Add shortcuts to HR Portal, Payroll, Leave Management, and other internal tools."
      searchKeys={["appName", "category", "description", "status"]}
      statusKeys={["status"]}
      cardConfig={{
        titleKey: "appName",
        subtitleKey: "description",
        metaKeys: ["category", "status"],
        showOpen: true,
      }}
      columns={[
        { key: "appName", label: "App" },
        { key: "category", label: "Category" },
        { key: "status", label: "Status" },
      ]}
      fields={[
        { key: "appName", label: "App Name", required: true },
        { key: "description", label: "Description", multiline: true },
        { key: "appUrl", label: "App URL", required: true },
        { key: "iconName", label: "Icon Name" },
        { key: "category", label: "Category" },
        { key: "status", label: "Status", defaultValue: "ACTIVE" },
      ]}
    />
  );
}
