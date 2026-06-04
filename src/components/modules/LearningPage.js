import React from "react";
import CrudModule from "./CrudModule";

export default function LearningPage() {
  return (
    <CrudModule
      title="Learning"
      subtitle="Training courses and learning resources for your team."
      endpoint="/api/learning"
      viewMode="cards"
      emptyTitle="No learning courses available yet"
      emptyMessage="Add courses and training materials to help employees grow their skills."
      searchKeys={["title", "category", "difficultyLevel", "status"]}
      statusKeys={["status"]}
      cardConfig={{
        titleKey: "title",
        subtitleKey: "category",
        metaKeys: ["difficultyLevel", "duration", "status"],
      }}
      columns={[
        { key: "title", label: "Course" },
        { key: "category", label: "Category" },
        { key: "difficultyLevel", label: "Level" },
        { key: "duration", label: "Duration" },
        { key: "status", label: "Status" },
      ]}
      fields={[
        { key: "title", label: "Course Title", required: true },
        { key: "category", label: "Category", required: true },
        { key: "description", label: "Description", multiline: true },
        { key: "resourceUrl", label: "Resource URL" },
        { key: "videoUrl", label: "Video URL" },
        { key: "difficultyLevel", label: "Difficulty (Beginner/Intermediate/Advanced)" },
        { key: "duration", label: "Duration (e.g. 2 hours)" },
        { key: "status", label: "Status", defaultValue: "ACTIVE" },
      ]}
    />
  );
}
