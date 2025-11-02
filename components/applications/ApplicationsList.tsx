"use client";

import { useState } from "react";
import { Link } from "@/src/navigation";
import { adTypeTabs, ApplicationListItem, applicationsList, AdType } from "@/src/mocks/applications";

export default function ApplicationsList() {
  const [activeTab, setActiveTab] = useState<AdType>("soiree-menu");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter by active tab and search
  const filteredApplications = applicationsList.filter((app) => {
    const matchesTab = app.adType === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Pagination
  const totalItems = filteredApplications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = filteredApplications.slice(startIndex, endIndex);

  const handleApprove = (id: string) => {
    console.log("Approve:", id);
    // TODO: Implement approve logic
  };

  const handleReject = (id: string) => {
    console.log("Reject:", id);
    // TODO: Implement reject logic
  };

  const handleShare = (id: string) => {
    console.log("Share:", id);
    // TODO: Implement share logic
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "#4C226A" }}>
          Başvurularım
        </h1>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ara"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {/* Sort */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <i className="pi pi-list text-gray-600" />
            <span className="text-gray-700">En Yeni</span>
            <i className="pi pi-chevron-down text-gray-400 text-xs" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {adTypeTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? "text-white"
                : "text-gray-600 bg-gray-100 hover:bg-gray-200"
            }`}
            style={
              activeTab === tab.id
                ? { backgroundColor: "#4C226A" }
                : undefined
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Görsel
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Ad-Soyad
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Takipçi Sayısı
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Lokasyon
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Sosyal Medya
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Durum
              </th>
            </tr>
          </thead>
          <tbody>
            {currentApplications.map((app) => (
              <ApplicationTableRow
                key={app.id}
                application={app}
                onApprove={handleApprove}
                onReject={handleReject}
                onShare={handleShare}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          {totalItems} veriden {startIndex + 1}-{Math.min(endIndex, totalItems)}{" "}
          gösteriliyor
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="pi pi-chevron-left text-gray-600" />
          </button>
          {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg border ${
                  currentPage === page
                    ? "text-white border-transparent"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                style={
                  currentPage === page
                    ? { backgroundColor: "#4C226A" }
                    : undefined
                }
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="pi pi-chevron-right text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ApplicationTableRow({
  application,
  onApprove,
  onReject,
  onShare,
}: {
  application: ApplicationListItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onShare: (id: string) => void;
}) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-4 px-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <i className="pi pi-user text-gray-400" />
        </div>
      </td>
      <td className="py-4 px-4">
        <Link
          href={`/applications/${application.id}`}
          className="font-semibold text-dark hover:text-purple-600 transition-colors"
        >
          {application.fullName}
        </Link>
      </td>
      <td className="py-4 px-4 text-gray-700">{application.followerCount}</td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2 text-gray-700">
          <i className="pi pi-map-marker text-gray-400" />
          <span>{application.location}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          {application.socialMedia.instagram && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              }}
            >
              <i className="pi pi-instagram text-white text-xs" />
            </div>
          )}
          {application.socialMedia.tiktok && (
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <i className="pi pi-video text-white text-xs" />
            </div>
          )}
          {application.socialMedia.youtube && (
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
              <i className="pi pi-youtube text-white text-xs" />
            </div>
          )}
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onApprove(application.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#10B981" }}
          >
            Onayla
          </button>
          <button
            onClick={() => onReject(application.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#EF4444" }}
          >
            Reddet
          </button>
          <button
            onClick={() => onShare(application.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            style={{ color: "#4C226A" }}
          >
            <i className="pi pi-share-alt" />
          </button>
        </div>
      </td>
    </tr>
  );
}

