"use client";

import { useState } from "react";
import { mockProjects, Project, ProjectStatus } from "@/src/mocks/projects";
import ProjectsList from "@/components/projects/ProjectsList";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Group projects by status
  const pendingProjects = mockProjects.filter((p) => p.status === "pending");
  const ongoingProjects = mockProjects.filter((p) => p.status === "ongoing");
  const completedProjects = mockProjects.filter((p) => p.status === "completed");

  return (
    <div className="p-6 bg-[#F7F6F9] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "#4C226A" }}>
          Projelerim
        </h1>
        <div className="relative">
          <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Ara"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Three Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bekleyen Projelerim */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark">
              Bekleyen Projelerim
            </h2>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {pendingProjects.length}
            </span>
          </div>
          <ProjectsList projects={pendingProjects} />
        </div>

        {/* Devam Eden Projelerim */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark">
              Devam Eden Projelerim
            </h2>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {ongoingProjects.length}
            </span>
          </div>
          <ProjectsList projects={ongoingProjects} />
        </div>

        {/* Tamamlanan Projelerim */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark">
              Tamamlanan Projelerim
            </h2>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {completedProjects.length}
            </span>
          </div>
          <ProjectsList projects={completedProjects} />
        </div>
      </div>
    </div>
  );
}

