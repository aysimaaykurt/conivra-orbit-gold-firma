"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "@/src/navigation";
import { useTranslations } from "next-intl";
import { adTypeTabs, ApplicationListItem, AdType } from "@/src/mocks/applications";
import { useApplications } from "@/src/hooks/useApplications";
import { updateApplicationStatus, bulkUpdateApplicationStatus, approveSubmission } from "@/src/api/applications/applications.service";
import { ApplicationStatus } from "@/src/api/applications/applicationStatus.enum";
import { Toast } from "primereact/toast";
import { BASE_URL } from "@/src/api/axios";

export default function ApplicationsList() {
  const t = useTranslations("applications.adTypes");
  const [activeTab, setActiveTab] = useState<AdType>("campaign");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    type: "approve" | "reject" | "bulk-approve" | "bulk-reject" | "approve-submission" | null;
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

  const handleApproveSubmissionClick = (id: string) => {
    setConfirmModal({ visible: true, type: "approve-submission", id });
  };

  const handleBulkAction = (actionType: "approve" | "reject") => {
    setConfirmModal({
      visible: true,
      type: actionType === "approve" ? "bulk-approve" : "bulk-reject",
      id: "",
    });
  };

  const handleConfirmAction = async () => {
    const { type, id } = confirmModal;
    setConfirmModal({ visible: false, type: null, id: "" });
    if (!type) return;

    if (type === "approve") {
      if (!id) return;
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
      if (!id) return;
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
    } else if (type === "approve-submission") {
      if (!id) return;
      try {
        await approveSubmission(id);
        toastRef.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: "İş onaylandı, başvuru durumu güncellendi.",
          life: 3000,
        });
        refetch();
      } catch (err: any) {
        console.error("Failed to approve submission:", err);
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: err.message || "İş onaylanırken bir hata oluştu.",
          life: 3000,
        });
      }
    } else if (type === "bulk-approve") {
      if (selectedAppIds.length === 0) return;
      try {
        await bulkUpdateApplicationStatus({
          applicationIds: selectedAppIds,
          status: ApplicationStatus.APPROVED,
        });
        toastRef.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: "Seçilen başvurular başarıyla onaylandı.",
          life: 3000,
        });
        setSelectedAppIds([]);
        refetch();
      } catch (err: any) {
        console.error("Failed bulk approve:", err);
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: err.message || "Başvurular onaylanırken bir hata oluştu.",
          life: 3000,
        });
      }
    } else if (type === "bulk-reject") {
      if (selectedAppIds.length === 0) return;
      try {
        await bulkUpdateApplicationStatus({
          applicationIds: selectedAppIds,
          status: ApplicationStatus.REJECTED,
        });
        toastRef.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: "Seçilen başvurular başarıyla reddedildi.",
          life: 3000,
        });
        setSelectedAppIds([]);
        refetch();
      } catch (err: any) {
        console.error("Failed bulk reject:", err);
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: err.message || "Başvurular reddedilirken bir hata oluştu.",
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
      {/* Header & Tabs Control Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Left: Tabs & Bulk Actions */}
        <div className="flex items-center gap-4 flex-wrap flex-1 min-w-0">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {adTypeTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex-shrink-0 text-sm ${
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

          {selectedAppIds.length > 0 && (
            <div className="flex items-center gap-2 bg-[#4C226A]/5 px-3 py-1.5 rounded-lg border border-[#4C226A]/20 animate-fade-in flex-shrink-0">
              <span className="text-sm font-semibold text-[#4C226A]">{selectedAppIds.length} Seçildi</span>
              <button
                onClick={() => handleBulkAction("approve")}
                className="ml-2 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
              >
                Toplu Onayla
              </button>
              <button
                onClick={() => handleBulkAction("reject")}
                className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
              >
                Toplu Reddet
              </button>
            </div>
          )}
        </div>

        {/* Right: Search & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
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
              className="w-full sm:w-60 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          {/* Sort */}
          <button 
            onClick={() => {
              setSortOrder(prev => prev === "desc" ? "asc" : "desc");
              setCurrentPage(1);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex-shrink-0 text-sm"
          >
            <i className="pi pi-list text-gray-600" />
            <span className="text-gray-700 w-[55px] text-left">{sortOrder === "asc" ? "En Eski" : "En Yeni"}</span>
            <i className="pi pi-sort-alt text-gray-400 text-xs ml-1" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-left w-12 text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  checked={
                    Array.isArray(currentApplications) &&
                    currentApplications.length > 0 &&
                    currentApplications.filter((app) => Number(app.status) === 1).length > 0 &&
                    currentApplications
                      .filter((app) => Number(app.status) === 1)
                      .every((app) => selectedAppIds.includes(app.id))
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      const pendingIds = currentApplications
                        .filter((app) => Number(app.status) === 1)
                        .map((app) => app.id);
                      setSelectedAppIds(pendingIds);
                    } else {
                      setSelectedAppIds([]);
                    }
                  }}
                />
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                Görsel
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                Ad-Soyad
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                Takipçi Sayısı
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                Lokasyon
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap min-w-[200px]">
                Başvurulan İlan
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                Sosyal Medya
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
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
                onApproveSubmission={handleApproveSubmissionClick}
                onShare={handleShare}
                selected={selectedAppIds.includes(app.id)}
                onSelectChange={(id, checked) => {
                  setSelectedAppIds((prev) =>
                    checked ? [...prev, id] : prev.filter((item) => item !== id)
                  );
                }}
              />
            ))}
            {Array.isArray(currentApplications) && currentApplications.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-20">
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
              {confirmModal.type === "approve" || confirmModal.type === "bulk-approve" || confirmModal.type === "approve-submission" ? (
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                  <i className="pi pi-check-circle text-3xl" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                  <i className="pi pi-exclamation-triangle text-3xl" />
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900">
                {confirmModal.type === "approve"
                  ? "Başvuruyu Onayla"
                  : confirmModal.type === "approve-submission"
                  ? "İşi Onayla"
                  : confirmModal.type === "reject"
                  ? "Başvuruyu Reddet"
                  : confirmModal.type === "bulk-approve"
                  ? "Toplu Onaylama"
                  : "Toplu Reddetme"}
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                {confirmModal.type === "approve"
                  ? "Bu başvuruyu onaylamak istediğinize emin misiniz? Bu işlem geri alınamaz."
                  : confirmModal.type === "approve-submission"
                  ? "Teslim edilen işi onaylamak istediğinize emin misiniz? Bu işlem geri alınamaz."
                  : confirmModal.type === "reject"
                  ? "Bu başvuruyu reddetmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                  : confirmModal.type === "bulk-approve"
                  ? "Seçilen başvuruları onaylamak istediğinize emin misiniz?"
                  : "Seçilen başvuruları reddetmek istediğinize emin misiniz?"}
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
                    backgroundColor: confirmModal.type === "approve" || confirmModal.type === "bulk-approve" ? "#10B981" : "#EF4444"
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
  onApproveSubmission,
  onShare,
  selected,
  onSelectChange,
}: {
  application: ApplicationListItem;
  onApprove: (id: string, item: ApplicationListItem) => void;
  onReject: (id: string, item: ApplicationListItem) => void;
  onApproveSubmission: (id: string) => void;
  onShare: (id: string) => void;
  selected: boolean;
  onSelectChange: (id: string, checked: boolean) => void;
}) {
  const adId = 
    (application as any).advertId || 
    (application as any).advertisementId || 
    (application as any).adId || 
    (application as any).advert?.id || 
    (application as any).advertisement?.id || 
    application.id;

  const urlCategory = 
    application.adType === "campaign" ? "reklam" :
    application.adType === "giftkit" ? "hediye_kiti" :
    application.adType === "workshop" ? "workshop" :
    "reklam";

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-4 px-4 w-12 text-center whitespace-nowrap">
        {Number(application.status) === 1 && (
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
            checked={selected}
            onChange={(e) => onSelectChange(application.id, e.target.checked)}
          />
        )}
      </td>
      <td className="py-4 px-4 whitespace-nowrap">
        {application.profileImageSrc || (application as any).profileImageSrc ? (
          <img
            src={
              (() => {
                const img = application.profileImageSrc || (application as any).profileImageSrc;
                return img.startsWith("http")
                  ? img
                  : `${BASE_URL.replace("/api/v1", "")}/${img.replace(/^\//, "")}`;
              })()
            }
            alt={application.fullName}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-100">
            <i className="pi pi-user text-gray-400" />
          </div>
        )}
      </td>
      <td className="py-4 px-4 whitespace-nowrap">
        <Link
          href={`/applications/${application.id}`}
          className="font-semibold text-dark hover:text-purple-600 transition-colors"
        >
          {application.fullName}
        </Link>
      </td>
      <td className="py-4 px-4 text-gray-700 whitespace-nowrap">{application.followerCount}</td>
      <td className="py-4 px-4 whitespace-nowrap">
        <div className="flex items-center gap-2 text-gray-700">
          <i className="pi pi-map-marker text-gray-400" />
          <span>{application.location}</span>
        </div>
      </td>
      <td className="py-4 px-4 min-w-[200px]">
        <div className="flex flex-col gap-1">
          {(() => {
            const adTitle = ((application as any).advertisementTitle || 
              (application as any).adTitle || 
              (application as any).advert?.title || 
              (application as any).advertisement?.title || 
              (application as any).title || 
              "").trim();
            
            return (
              <>
                {adTitle && (
                  <Link
                    href={`/applications/${application.id}`}
                    className="text-sm font-semibold text-purple-700 hover:text-purple-900 hover:underline transition-colors"
                  >
                    {adTitle}
                  </Link>
                )}
                <Link
                  href={`/applications/${application.id}`}
                  className="text-sm text-purple-600 bg-purple-50 w-max px-2.5 py-1 rounded-md font-semibold hover:bg-purple-100 transition-colors"
                  style={{ textDecoration: 'none' }}
                >
                  {application.adType === "campaign" ? "İlan" :
                   application.adType === "giftkit" ? "Hediye Kiti" :
                   application.adType === "workshop" ? "Workshop" :
                   application.adType}
                </Link>
              </>
            );
          })()}
        </div>
      </td>
      <td className="py-4 px-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {application.socialMedia && ((application.socialMedia as any).instagram || (application.socialMedia as any).tiktok || (application.socialMedia as any).youtube || (application.socialMedia as any).instagramLink || (application.socialMedia as any).tiktokLink || (application.socialMedia as any).youtubeLink) ? (
            <>
              {((application.socialMedia as any).instagram || (application.socialMedia as any).instagramLink) && (
                <a
                  href={(application.socialMedia as any).instagramLink || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                  style={{
                    background:
                      "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  }}
                  title="Instagram Profiline Git"
                >
                  <i className="pi pi-instagram text-white text-xs" />
                </a>
              )}
              {((application.socialMedia as any).tiktok || (application.socialMedia as any).tiktokLink) && (
                <a
                  href={(application.socialMedia as any).tiktokLink || "https://tiktok.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:scale-105 transition-transform"
                  title="TikTok Profiline Git"
                >
                  <i className="pi pi-video text-white text-xs" />
                </a>
              )}
              {((application.socialMedia as any).youtube || (application.socialMedia as any).youtubeLink) && (
                <a
                  href={(application.socialMedia as any).youtubeLink || "https://youtube.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center hover:scale-105 transition-transform"
                  title="YouTube Profiline Git"
                >
                  <i className="pi pi-youtube text-white text-xs" />
                </a>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">Sosyal Medya Bağlı Değil</span>
          )}
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          {(() => {
            const status = application.status as any;
            const isResubmitted = (application as any).isResubmitted;

            // isResubmitted + status 7 → tek buton
            if (isResubmitted && (status === 7 || status === "7" || status === "Submitted" || status === "submitted")) {
              return (
                <button
                  onClick={() => onApproveSubmission(application.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
                  style={{ backgroundColor: "#10B981" }}
                >
                  <i className="pi pi-check-circle text-xs" /> Revizyonu Onayla
                </button>
              );
            }
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
            if (status === 4 || status === "4" || status === "RevisionRequested" || status === "revision_requested" || status === "revisionrequested") {
              return (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  Revizyon İstendi
                </span>
              );
            }
            if (status === 5 || status === "5" || status === "Withdrawn" || status === "withdrawn" || status === "Geri Çekildi") {
              return (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                  Geri Çekildi
                </span>
              );
            }
            if (status === 6 || status === "6" || status === "Completed" || status === "completed") {
              return (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                  Tamamlandı
                </span>
              );
            }
            if (status === 7 || status === "7" || status === "Submitted" || status === "submitted") {
              return (
                <button
                  onClick={() => onApproveSubmission(application.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-1"
                  style={{ backgroundColor: "#10B981" }}
                >
                  <i className="pi pi-check-circle text-xs" /> İşi Onayla
                </button>
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

