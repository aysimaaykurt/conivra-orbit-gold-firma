"use client";

import { useState } from "react";
import ProjectsList from "@/components/projects/ProjectsList";
import { useProjects } from "@/src/hooks/useProjects";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMobileTab, setActiveMobileTab] = useState<"draft" | "pending" | "active" | "completed" | "cancelled" | "expired" | "paused" | "inactive">("active");

  // Fetch all projects. Backend might not support search query yet, so we fetch all and filter on the client.
  const { projects, isLoading, error } = useProjects({ page: 1, pageSize: 100 });

  // Filter by search query
  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.assignee?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group projects by exactly 8 statuses
  const draftProjects = filteredProjects.filter((p) => p.status === "draft");
  const pendingProjects = filteredProjects.filter((p) => p.status === "pending");
  const activeProjects = filteredProjects.filter((p) => p.status === "active");
  const completedProjects = filteredProjects.filter((p) => p.status === "completed");
  const cancelledProjects = filteredProjects.filter((p) => p.status === "cancelled");
  const expiredProjects = filteredProjects.filter((p) => p.status === "expired");
  const pausedProjects = filteredProjects.filter((p) => p.status === "paused");
  const inactiveProjects = filteredProjects.filter((p) => p.status === "inactive");

  const tabConfigs = [
    { 
      id: "draft", 
      label: "Taslak", 
      icon: "pi-file", 
      projects: draftProjects, 
      iconColor: "text-gray-500", 
      badgeTextClass: "text-gray-700", 
      badgeBgClass: "bg-gray-100", 
      emptyText: "Taslak bulunmuyor." 
    },
    { 
      id: "pending", 
      label: "Onay Bekliyor", 
      icon: "pi-clock", 
      projects: pendingProjects, 
      iconColor: "text-orange-500", 
      badgeTextClass: "text-orange-700", 
      badgeBgClass: "bg-orange-100", 
      emptyText: "Bekleyen bulunmuyor." 
    },
    { 
      id: "active", 
      label: "Aktif / Yayında", 
      icon: "pi-play", 
      projects: activeProjects, 
      iconColor: "text-blue-500", 
      badgeTextClass: "text-blue-700", 
      badgeBgClass: "bg-blue-100", 
      emptyText: "Aktif ilan bulunmuyor." 
    },
    { 
      id: "completed", 
      label: "Tamamlandı", 
      icon: "pi-check-circle", 
      projects: completedProjects, 
      iconColor: "text-green-500", 
      badgeTextClass: "text-green-700", 
      badgeBgClass: "bg-green-100", 
      emptyText: "Tamamlanan bulunmuyor." 
    },
    { 
      id: "paused", 
      label: "Duraklatıldı", 
      icon: "pi-pause", 
      projects: pausedProjects, 
      iconColor: "text-amber-500", 
      badgeTextClass: "text-amber-700", 
      badgeBgClass: "bg-amber-100", 
      emptyText: "Duraklatılan bulunmuyor." 
    },
    { 
      id: "cancelled", 
      label: "İptal Edildi", 
      icon: "pi-times-circle", 
      projects: cancelledProjects, 
      iconColor: "text-red-500", 
      badgeTextClass: "text-red-700", 
      badgeBgClass: "bg-red-100", 
      emptyText: "İptal edilen bulunmuyor." 
    },
    { 
      id: "expired", 
      label: "Süresi Doldu", 
      icon: "pi-history", 
      projects: expiredProjects, 
      iconColor: "text-slate-500", 
      badgeTextClass: "text-slate-700", 
      badgeBgClass: "bg-slate-100", 
      emptyText: "Süresi dolan bulunmuyor." 
    },
    { 
      id: "inactive", 
      label: "Diğer Pasif", 
      icon: "pi-minus-circle", 
      projects: inactiveProjects, 
      iconColor: "text-gray-400", 
      badgeTextClass: "text-gray-700", 
      badgeBgClass: "bg-gray-100", 
      emptyText: "Pasif ilan bulunmuyor." 
    }
  ];

  const populatedTabs = tabConfigs.filter(t => t.projects.length > 0);
  const emptyTabs = tabConfigs.filter(t => t.projects.length === 0);
  const sortedTabs = [...populatedTabs, ...emptyTabs];

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
        <div className="flex flex-col items-center justify-center flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <i className="pi pi-exclamation-triangle text-red-500" style={{ fontSize: '48px' }}></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Bağlantı Hatası</h2>
          <p className="text-gray-500 text-center max-w-md mb-6 leading-relaxed">
            Projelerinizi yüklerken bir sunucu veya ağ hatası oluştu. Lütfen bağlantınızı kontrol edip sayfayı yenilemeyi deneyin.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#4C226A] text-white font-semibold rounded-xl shadow-md hover:bg-[#3b1a52] transition-colors flex items-center gap-2"
          >
            <i className="pi pi-refresh"></i> Tekrar Dene
          </button>
        </div>
      ) : (
        <>
          {/* Mobile Tabs */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {sortedTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMobileTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-lg font-medium whitespace-nowrap flex-shrink-0 transition-colors ${activeMobileTab === tab.id
                  ? "text-white bg-[#4C226A]"
                  : "text-gray-600 bg-white border border-gray-200"
                  }`}
              >
                <i className={`pi ${tab.icon} mr-2`}></i> {tab.label} ({tab.projects.length})
              </button>
            ))}
          </div>

          {/* Columns */}
          <div className="flex flex-row gap-6 flex-1 min-h-0 pb-4 overflow-x-auto snap-x snap-mandatory md:snap-none">
            {sortedTabs.map((tab) => (
              <div key={tab.id} className={`flex-col w-full shrink-0 snap-center md:min-w-[340px] md:w-[340px] h-[calc(100vh-280px)] md:h-full ${activeMobileTab === tab.id ? "flex" : "hidden md:flex"}`}>
                <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100 shrink-0">
                  <h2 className="text-lg font-bold text-dark flex items-center gap-2">
                    <i className={`pi ${tab.icon} ${tab.iconColor}`}></i>
                    {tab.label}
                  </h2>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${tab.badgeTextClass} ${tab.badgeBgClass}`}>
                    {tab.projects.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 pb-4">
                  {tab.projects.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8 bg-white/50 rounded-lg border border-dashed border-gray-300">{tab.emptyText}</p>
                  ) : <ProjectsList projects={tab.projects} />}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

