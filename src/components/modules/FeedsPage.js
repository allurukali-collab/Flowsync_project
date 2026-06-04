import React from "react";
import CrudModule from "./CrudModule";

export default function FeedsPage() {
  return (
    <CrudModule
      title="Feeds"
      subtitle="Company announcements, updates, and internal communications."
      endpoint="/api/feeds"
      viewMode="cards"
      emptyTitle="No announcements yet"
      emptyMessage="Publish company updates, policy changes, and team announcements here."
      searchKeys={["title", "content", "category", "postedBy", "priority"]}
      statusKeys={["status", "priority"]}
      cardConfig={{
        titleKey: "title",
        subtitleKey: "postedBy",
        metaKeys: ["category", "status"],
        showPriority: true,
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "priority", label: "Priority" },
        { key: "postedBy", label: "Posted By" },
        { key: "status", label: "Status" },
      ]}
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "content", label: "Content", multiline: true, required: true },
        { key: "category", label: "Category" },
        { key: "priority", label: "Priority (HIGH/MEDIUM/LOW)", defaultValue: "MEDIUM" },
        { key: "postedBy", label: "Posted By" },
        { key: "status", label: "Status", defaultValue: "ACTIVE" },
      ]}
    />
  );
}
