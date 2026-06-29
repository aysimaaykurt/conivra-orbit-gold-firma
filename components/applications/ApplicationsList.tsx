"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "@/src/navigation";
import { useTranslations } from "next-intl";
import { adTypeTabs, ApplicationListItem, AdType } from "@/src/mocks/applications";
import { useApplications } from "@/src/hooks/useApplications";
import { updateApplicationStatus } from "@/src/api/applications/applications.service";
import { ApplicationStatus } from "@/src/api/applications/applicationStatus.enum";
import { Toast } from "primereact/toast";

export default function ApplicationsList() {
  const t = useTranslations("applications.adTypes");
  const [activeTab, setActiveTab] = useState<AdType>("soiree-menu");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    type: "approve" | "reject" | null;
    id: string;
  }>({
    visible: false,
    type: null,
    id: "",
  });
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const itemsPerPage = 10;

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const toastRef = useRef<any>(null);

  const { data: currentApplications, totalItems, totalPages, isLoading, refetch } = useApplications({
    page: currentPage,
    pageSize: itemsPerPage,
    searchTerm: debouncedSearch,
    adType: activeTab,
    sortOrder: sortOrder,
    sortBy: "createDate",
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const handleApprove = (id: string) => {
    setConfirmModal({ visible: true, type: "approve", id });
  };

  const handleReject = (id: string) => {
    setConfirmModal({ visible: true, type: "reject", id });
  };

  const handleConfirmAction = async () => {
    const { type, id } = confirmModal;
    setConfirmModal({ visible: false, type: null, id: "" });
    if (!id || !type) return;

    if (type === "approve") {
      console.log("Approve Application ID:", id);
      try {
        await updateApplicationStatus(id, { status: ApplicationStatus.APPROVED });
        toastRef.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: "Başvuru başarıyla onaylandı.",
          life: 3000,
        });
        refetch();
      } catch (err: any) {
        console.error("Failed to approve application status:", err);
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: err.message || "Başvuru onaylanırken bir hata oluştu.",
          life: 3000,
        });
      }
    } else if (type === "reject") {
      console.log("Reject Application ID:", id);
      try {
        await updateApplicationStatus(id, { status: ApplicationStatus.REJECTED });
        toastRef.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: "Başvuru başarıyla reddedildi.",
          life: 3000,
        });
        refetch();
      } catch (err: any) {
        console.error("Failed to reject application status:", err);
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: err.message || "Başvuru reddedilirken bir hata oluştu.",
          life: 3000,
        });
      }
    }
  };

  const handleShare = (id: string) => {
    console.log("Share:", id);
    // TODO: Implement share logic
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#4C226A" }}>
          Başvurularım
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ara"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {/* Sort */}
          <button 
            onClick={() => {
              setSortOrder(prev => prev === "desc" ? "asc" : "desc");
              setCurrentPage(1);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex-shrink-0"
          >
            <i className="pi pi-list text-gray-600" />
            <span className="text-gray-700 w-[55px] text-left">{sortOrder === "asc" ? "En Eski" : "En Yeni"}</span>
            <i className="pi pi-sort-alt text-gray-400 text-xs ml-1" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {adTypeTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
            }}
            className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
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
            {t(tab.id)}
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
            {Array.isArray(currentApplications) && currentApplications.map((app) => (
              <ApplicationTableRow
                key={app.id || Math.random().toString()}
                application={app}
                onApprove={handleApprove}
                onReject={handleReject}
                onShare={handleShare}
              />
            ))}
            {Array.isArray(currentApplications) && currentApplications.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-20">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-24 h-24 bg-[#4C226A]/5 rounded-full flex items-center justify-center mb-2">
                      <i className="pi pi-folder-open text-[#4C226A] opacity-80" style={{ fontSize: '36px' }} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Başvuru Bulunamadı</h3>
                    <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                      Seçili filtrelere ve arama kriterlerine uygun herhangi bir başvuru sonucu bulamadık. Lütfen farklı kelimelerle veya sekmelerle tekrar deneyin.
                    </p>
                  </div>
                </td>
              </tr>
            )}
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
      <Toast ref={toastRef} />

      {/* Custom Confirmation Modal */}
      {confirmModal.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100 transform scale-100 transition-transform duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              {confirmModal.type === "approve" ? (
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                  <i className="pi pi-check-circle text-3xl" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                  <i className="pi pi-exclamation-triangle text-3xl" />
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-800">
                {confirmModal.type === "approve" ? "Başvuruyu Onayla" : "Başvuruyu Reddet"}
              </h3>
              
              <p className="text-sm text-gray-500 leading-relaxed">
                {confirmModal.type === "approve" 
                  ? "Bu influencer başvurusunu onaylamak istediğinize emin misiniz? Bu işlem geri alınamaz."
                  : "Bu influencer başvurusunu reddetmek istediğinize emin misiniz? Bu işlem geri alınamaz."}
              </p>
              
              <div className="flex items-center gap-3 w-full mt-6">
                <button
                  type="button"
                  onClick={() => setConfirmModal({ visible: false, type: null, id: "" })}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className="flex-1 py-3 px-4 rounded-xl text-white font-medium shadow-lg hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: confirmModal.type === "approve" ? "#10B981" : "#EF4444"
                  }}
                >
                  Evet, Eminim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
  onApprove: (id: string, app?: any) => void;
  onReject: (id: string, app?: any) => void;
  onShare: (id: string) => void;
}) {
  const adId = 
    (application as any).advertId || 
    (application as any).advertisementId || 
    (application as any).adId || 
    (application as any).advert?.id || 
    (application as any).advertisement?.id || 
    application.id;

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
          {(() => {
            const status = application.status;
            if (status === 2 || status === "2" || status === "Approved") {
              return (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  Onaylandı
                </span>
              );
            }
            if (status === 3 || status === "3" || status === "Rejected") {
              return (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                  Reddedildi
                </span>
              );
            }
            return (
              <>
                <button
                  onClick={() => onApprove(application.id, application)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#10B981" }}
                >
                  Onayla
                </button>
                <button
                  onClick={() => onReject(application.id, application)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  Reddet
                </button>
              </>
            );
          })()}
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

