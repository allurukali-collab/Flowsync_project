import React from "react";
import CrudModule from "./CrudModule";

export default function TestimonialsPage() {
  return (
    <CrudModule
      title="Testimonials"
      subtitle="Employee and client feedback showcased across the organization."
      endpoint="/api/testimonials"
      viewMode="cards"
      emptyTitle="No testimonials yet"
      emptyMessage="Add testimonials from employees and clients to highlight your company culture."
      searchKeys={["name", "designation", "message", "status"]}
      statusKeys={["status"]}
      cardConfig={{
        titleKey: "name",
        subtitleKey: "designation",
        metaKeys: ["status"],
        showMessage: true,
        showRating: true,
      }}
      columns={[
        { key: "name", label: "Name" },
        { key: "designation", label: "Role" },
        { key: "rating", label: "Rating" },
        { key: "status", label: "Status" },
      ]}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "designation", label: "Designation" },
        { key: "message", label: "Message", multiline: true, required: true },
        { key: "rating", label: "Rating (1-5)", type: "number" },
        { key: "status", label: "Status", defaultValue: "PENDING" },
      ]}
    />
  );
}
