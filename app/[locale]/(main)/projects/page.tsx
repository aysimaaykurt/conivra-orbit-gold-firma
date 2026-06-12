"use client";

import { useState } from "react";
import ProjectsList from "@/components/projects/ProjectsList";
import { useProjects } from "@/src/hooks/useProjects";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch all projects. Backend might not support search query yet, so we fetch all and filter on the client.
  const { projects, isLoading, error } = useProjects({ page: 1, pageSize: 100 });

  // Filter by search query
  const filteredProjects = projects.filter(
    (p) => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.assignee?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group projects by status
  const pendingProjects = filteredProjects.filter((p) => p.status === "pending");
  const ongoingProjects = filteredProjects.filter((p) => p.status === "ongoing");
  const completedProjects = filteredProjects.filter((p) => p.status === "completed");

  return (
    <div className="p-4 md:p-6 bg-[#F7F6F9] min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold" style={{ color: "#4C226A" }}>
          Projelerim
        </h1>
        <div className="relative w-full sm:w-64">
          <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Proje veya Kişi Ara"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <i className="pi pi-spinner pi-spin text-4xl text-primary" style={{ color: "#4C226A" }}></i>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : (
        /* Three Columns */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 pb-4">
          {/* Bekleyen Projelerim */}
          <div className="flex flex-col h-[600px] lg:h-full">
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-dark flex items-center gap-2">
                <i className="pi pi-clock text-orange-500"></i>
                Bekleyen
              </h2>
              <span className="text-sm font-semibold text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                {pendingProjects.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 pb-4">
              {pendingProjects.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8 bg-white/50 rounded-lg border border-dashed border-gray-300">Bekleyen proje bulunmuyor.</p>
              ) : (
                <ProjectsList projects={pendingProjects} />
              )}
            </div>
          </div>

          {/* Devam Eden Projelerim */}
          <div className="flex flex-col h-[600px] lg:h-full">
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-dark flex items-center gap-2">
                <i className="pi pi-sync text-blue-500"></i>
                Devam Eden
              </h2>
              <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                {ongoingProjects.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 pb-4">
              {ongoingProjects.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8 bg-white/50 rounded-lg border border-dashed border-gray-300">Devam eden proje bulunmuyor.</p>
              ) : (
                <ProjectsList projects={ongoingProjects} />
              )}
            </div>
          </div>

          {/* Tamamlanan Projelerim */}
          <div className="flex flex-col h-[600px] lg:h-full">
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-dark flex items-center gap-2">
                <i className="pi pi-check-circle text-green-500"></i>
                Tamamlanan
              </h2>
              <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                {completedProjects.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 pb-4">
              {completedProjects.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8 bg-white/50 rounded-lg border border-dashed border-gray-300">Tamamlanan proje bulunmuyor.</p>
              ) : (
                <ProjectsList projects={completedProjects} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

