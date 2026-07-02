"use client";

import React, { useRef } from "react";
import { useRouter } from "@/src/navigation";
import { useState, useEffect } from "react";
import { getApplicationDetail, requestApplicationRevision, approveSubmission } from "@/src/api/applications/applications.service";
import { getAdvertisement } from "@/src/api/advertisements/advertisements.service";
import { getGiftKit } from "@/src/api/advertisements/giftKits.service";
import { getWorkshop } from "@/src/api/advertisements/workshops.service";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import apiClient, { BASE_URL } from "@/src/api/axios";
import { useSectors } from "@/src/hooks/useSectors";
import { useCategories } from "@/src/hooks/useCategories";
import EvaluationModal from "@/components/projects/EvaluationModal";

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [detailData, setDetailData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);
  const [isApprovingSubmission, setIsApprovingSubmission] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const toastRef = useRef<any>(null);
  const { sectors } = useSectors();
  const { categories } = useCategories();
  const [adData, setAdData] = useState<any>(null);
  const [adLoading, setAdLoading] = useState(false);
  const [adDetailsExpanded, setAdDetailsExpanded] = useState(false);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [previewItems, setPreviewItems] = useState<any[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);

  const handleOpenPreview = (file: any, allFiles: any[]) => {
    const items = allFiles.filter(f => !f.url?.toLowerCase().endsWith(".heic"));
    const idx = items.findIndex(f => f.url === file.url);
    if (idx !== -1) {
      setPreviewItems(items);
      setPreviewIndex(idx);
      setPreviewFile(items[idx]);
    } else {
      setPreviewItems([file]);
      setPreviewIndex(0);
      setPreviewFile(file);
    }
  };

  const handleNextPreview = () => {
    if (previewIndex < previewItems.length - 1) {
      setPreviewIndex(previewIndex + 1);
      setPreviewFile(previewItems[previewIndex + 1]);
    }
  };

  const handlePrevPreview = () => {
    if (previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
      setPreviewFile(previewItems[previewIndex - 1]);
    }
  };
  const [isRefreshingFollowers, setIsRefreshingFollowers] = useState(false);

  const handleRefreshFollowers = async () => {
    try {
      setIsRefreshingFollowers(true);
      const res = await apiClient.post(`/applications/${resolvedParams.id}/refresh-followers`);
      if (res.data?.success) {
        toastRef.current?.show({ severity: 'success', summary: 'Başarılı', detail: res.data.message || 'Takipçi sayısı güncelleme işlemi sıraya alındı.', life: 3000 });
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Takipçi sayıları yenilenirken hata oluştu.';
      const isRateLimit = err.response?.status === 400 || errMsg.includes('8 saat');
      toastRef.current?.show({ 
        severity: isRateLimit ? 'warn' : 'error', 
        summary: isRateLimit ? 'Uyarı' : 'Hata', 
        detail: errMsg, 
        life: 4000 
      });
    } finally {
      setIsRefreshingFollowers(false);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await getApplicationDetail(resolvedParams.id);
        if (res && res.success && res.data) {
          setDetailData(res.data);
        } else {
          setError("Başvuru bulunamadı.");
        }
      } catch (err: any) {
        setError(err.message || "Başvuru detayı yüklenemedi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [resolvedParams.id, refreshTrigger]);

  // Fetch the related advertisement detail
  useEffect(() => {
    if (!detailData) return;
    const fetchAdDetail = async () => {
      try {
        setAdLoading(true);
        // Try to get ad ID from application data or extract numeric part from app ID
        const adId = detailData.adId || detailData.advertId || detailData.advertisementId || detailData.advert?.id || detailData.advertisement?.id || detailData.id;
        if (!adId) return;

        let response;
        if (detailData.adType === "giftkit") {
          response = await getGiftKit(String(adId));
        } else if (detailData.adType === "workshop") {
          response = await getWorkshop(String(adId));
        } else {
          response = await getAdvertisement(String(adId));
        }
        if (response?.success && response.data) {
          setAdData(response.data);
        }
      } catch (err) {
        console.log("İlan detayı yüklenemedi (opsiyonel):", err);
      } finally {
        setAdLoading(false);
      }
    };
    fetchAdDetail();
  }, [detailData]);

  const handleSendRevisionRequest = async () => {
    if (!revisionNote.trim()) {
      toastRef.current?.show({
        severity: "warn",
        summary: "Uyarı",
        detail: "Lütfen bir revizyon notu girin.",
        life: 3000,
      });
      return;
    }
    try {
      setIsSubmittingRevision(true);
      const res = await requestApplicationRevision(resolvedParams.id, {
        revisionNote: revisionNote,
      });
      if (res && res.success) {
        toastRef.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: "Revizyon talebi başarıyla iletildi.",
          life: 3000,
        });
        setRevisionModalOpen(false);
        setRevisionNote("");
        const updated = await getApplicationDetail(resolvedParams.id);
        if (updated && updated.success) {
          setDetailData(updated.data);
        }
      }
    } catch (err: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Hata",
        detail: err.message || err.response?.data?.message || "Revizyon talebi gönderilirken bir hata oluştu.",
        life: 4000,
      });
    } finally {
      setIsSubmittingRevision(false);
    }
  };

  const handleApproveSubmission = async () => {
    try {
      setIsApprovingSubmission(true);
      const res = await approveSubmission(resolvedParams.id);
      if (res && res.success) {
        toastRef.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: "İş onaylandı, başvuru durumu güncellendi.",
          life: 3000,
        });
        
        // Refresh detailData
        const detailRes = await getApplicationDetail(resolvedParams.id);
        if (detailRes && detailRes.success && detailRes.data) {
          setDetailData(detailRes.data);
        }
      }
    } catch (err: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Hata",
        detail: err.message || "İş onaylanırken hata oluştu.",
        life: 3000,
      });
    } finally {
      setIsApprovingSubmission(false);
    }
  };

  // Helper: resolve profile image URL
  const getProfileImageUrl = (src: string) => {
    if (!src) return "";
    if (src.startsWith("http")) return src;
    return `${BASE_URL.replace("/api/v1", "")}/${src.replace(/^\//, "")}`;
  };

  // Helper: status badge
  const getStatusBadge = (status: any) => {
    const s = Number(status);
    if (s === 1) return { label: "Bekliyor", className: "bg-yellow-100 text-yellow-800" };
    if (s === 2) return { label: "Onaylandı", className: "bg-green-100 text-green-800" };
    if (s === 3) return { label: "Reddedildi", className: "bg-red-100 text-red-800" };
    if (s === 4) return { label: "Revizyon İstendi", className: "bg-amber-100 text-amber-800" };
    if (s === 5) return { label: "Geri Çekildi", className: "bg-gray-100 text-gray-600" };
    if (s === 6) return { label: "Tamamlandı", className: "bg-purple-100 text-purple-800" };
    return { label: String(status), className: "bg-gray-100 text-gray-800" };
  };

  // Helper: ad type label
  const getAdTypeLabel = (adType: string) => {
    if (adType === "campaign") return "İlan";
    if (adType === "giftkit") return "Hediye Kiti";
    if (adType === "workshop") return "Workshop";
    return adType || "-";
  };

  // Helper: format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '/images/soiree.png';
    if (url.includes('localhost:5100')) {
      try {
        const tunnelOrigin = new URL(BASE_URL).origin;
        return url.replace(/https?:\/\/localhost:5100/g, tunnelOrigin);
      } catch (e) {
        return url;
      }
    }
    if (url.startsWith('http') || url.startsWith('/images/')) return url;
    const cleanPath = url.replace(/\\/g, '/').replace(/^\//, '');
    try {
      return `${new URL(BASE_URL).origin}/${cleanPath}`;
    } catch {
      return `/${cleanPath}`;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-[#F7F6F9] min-h-screen flex items-center justify-center">
        <i className="pi pi-spin pi-spinner text-4xl" style={{ color: "#4C226A" }}></i>
      </div>
    );
  }

  if (error || !detailData) {
    return (
      <div className="p-6 bg-[#F7F6F9] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="pi pi-exclamation-triangle text-red-500 text-3xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Başvuru Bulunamadı</h3>
          <p className="text-sm text-gray-500 mb-4">{error || "Bu başvuruya ait bilgi bulunamadı."}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#4C226A" }}
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(detailData.status);
  const socialMedia = detailData.socialMedia || {};

  const renderFollowers = (followers: any) => {
    const val = String(followers || "").trim();
    if (!val || val === "null" || val === "undefined" || val === "string") {
      return <span className="text-xs text-transparent select-none mt-0.5">Placeholder</span>;
    }
    return <span className="text-xs text-gray-500 font-medium mt-0.5">{val} Takipçi</span>;
  };

  return (
    <div className="p-6 bg-[#F7F6F9] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
        >
          <i className="pi pi-arrow-left" />
          <span className="font-semibold">Başvuru Listesi</span>
        </button>

        <div className="flex gap-3">
          {Number(detailData.status) === 7 && (
            <button
              onClick={handleApproveSubmission}
              disabled={isApprovingSubmission}
              className="px-4 py-2 text-white font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: "#10b981" }}
            >
              {isApprovingSubmission ? <i className="pi pi-spinner pi-spin" /> : <i className="pi pi-check-circle" />} İşi Onayla
            </button>
          )}

          {(Number(detailData.status) === 6 || Number(detailData.status) === 7) && (
            <button
              onClick={() => setRevisionModalOpen(true)}
              className="px-4 py-2 text-white font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 flex items-center gap-2 cursor-pointer"
              style={{ backgroundColor: "#4C226A" }}
            >
              <i className="pi pi-file-edit" /> Revizyon İste
            </button>
          )}
        </div>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6" style={{ color: "#4C226A" }}>
        Başvuru Detayı
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 lg:self-start">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center flex-shrink-0 border-4 overflow-hidden mb-4"
                style={{ borderColor: "#4C226A", backgroundColor: "#E8DAF5" }}
              >
                {detailData.profileImageSrc ? (
                  <img
                    src={getProfileImageUrl(detailData.profileImageSrc)}
                    alt={detailData.fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <i className="pi pi-user text-5xl text-white" />
                )}
              </div>
              <h2 className="text-xl font-bold text-center" style={{ color: "#4C226A" }}>
                {detailData.fullName}
              </h2>
              <span className={`mt-2 px-4 py-1 rounded-full text-xs font-semibold ${statusBadge.className}`}>
                {statusBadge.label}
              </span>
            </div>

            {/* Info Items */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <i className="pi pi-map-marker text-purple-600 text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Lokasyon</p>
                  <p className="text-sm font-semibold text-gray-800">{detailData.location || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <i className="pi pi-users text-purple-600 text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Takipçi Sayısı</p>
                  <p className="text-sm font-semibold text-gray-800">{detailData.followerCount || "0"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <i className="pi pi-tag text-purple-600 text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Sektör</p>
                  <p className="text-sm font-semibold text-gray-800">{sectors.find(s => String(s.value) === String(detailData.sector))?.label || detailData.sector || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <i className="pi pi-calendar text-purple-600 text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Başvuru Tarihi</p>
                  <p className="text-sm font-semibold text-gray-800">{formatDate(detailData.createDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <i className="pi pi-briefcase text-purple-600 text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Başvuru Türü</p>
                  <p className="text-sm font-semibold text-gray-800">{getAdTypeLabel(detailData.adType)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">

          {/* Social Media Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className="pi pi-share-alt" style={{ color: "#4C226A" }} />
                Sosyal Medya Hesapları
              </h3>
              <button
                onClick={handleRefreshFollowers}
                disabled={isRefreshingFollowers}
                className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50"
                style={{ 
                  borderColor: isRefreshingFollowers ? "#e5e7eb" : "#4C226A", 
                  color: isRefreshingFollowers ? "#9ca3af" : "#4C226A",
                  backgroundColor: isRefreshingFollowers ? "#f3f4f6" : "#E8DAF5" 
                }}
              >
                <i className={`pi pi-sync ${isRefreshingFollowers ? "pi-spin" : ""}`} />
                {isRefreshingFollowers ? "Güncelleniyor..." : "Takipçi Sayısını Güncelle"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Instagram */}
              <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  }}
                >
                  <i className="pi pi-instagram text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400">Instagram</p>
                  {socialMedia.instagram || socialMedia.instagramLink ? (
                    <div className="flex flex-col">
                      <a
                        href={socialMedia.instagramLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-purple-700 hover:underline truncate block"
                      >
                        Profili Görüntüle
                      </a>
                      {renderFollowers(socialMedia.instagramFollowers)}
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-400 italic">Bağlı değil</p>
                      <span className="text-xs text-transparent select-none mt-0.5">Spacer</span>
                    </div>
                  )}
                </div>
              </div>

              {/* TikTok */}
              <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                  <i className="pi pi-video text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 font-medium">TikTok</p>
                  {socialMedia.tiktok || socialMedia.tiktokLink ? (
                    <div className="flex flex-col">
                      <a
                        href={socialMedia.tiktokLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-purple-700 hover:underline truncate block"
                      >
                        Profili Görüntüle
                      </a>
                      {renderFollowers(socialMedia.tiktokFollowers)}
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-400 italic">Bağlı değil</p>
                      <span className="text-xs text-transparent select-none mt-0.5">Spacer</span>
                    </div>
                  )}
                </div>
              </div>

              {/* YouTube */}
              <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                  <i className="pi pi-youtube text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 font-medium">YouTube</p>
                  {socialMedia.youtube || socialMedia.youtubeLink ? (
                    <div className="flex flex-col">
                      <a
                        href={socialMedia.youtubeLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-purple-700 hover:underline truncate block"
                      >
                        Profili Görüntüle
                      </a>
                      {renderFollowers(socialMedia.youtubeFollowers)}
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-400 italic">Bağlı değil</p>
                      <span className="text-xs text-transparent select-none mt-0.5">Spacer</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Application Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className="pi pi-file text-purple-600" />
              Başvuru Bilgileri
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Başvuru Durumu</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.className}`}>
                  {statusBadge.label}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Başvuru Türü</p>
                <p className="text-sm font-semibold text-gray-800">{getAdTypeLabel(detailData.adType)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-1">Başvuru Tarihi</p>
                <p className="text-sm font-semibold text-gray-800">{formatDate(detailData.createDate)}</p>
              </div>
              {detailData.withdrawalReason && (
                <div className="bg-gray-50 rounded-lg p-4 sm:col-span-2">
                  <p className="text-xs text-gray-400 mb-1">Çekilme Nedeni</p>
                  <p className="text-sm font-semibold text-gray-800">{detailData.withdrawalReason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Revisions Section */}
          {detailData.revisions && detailData.revisions.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="pi pi-history text-amber-500" />
                Revizyon Geçmişi
              </h3>
              <div className="space-y-3">
                {detailData.revisions.map((rev: any, idx: number) => (
                  <div key={idx} className="border border-amber-100 bg-amber-50/50 rounded-lg p-4">
                    <p className="text-sm text-gray-800">{rev.revisionNote || rev.note || rev.message || JSON.stringify(rev)}</p>
                    {rev.createdAt && (
                      <p className="text-xs text-gray-400 mt-2">{formatDate(rev.createdAt)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded Files Section */}
          {((detailData.documents && detailData.documents.length > 0) || Number(detailData.status) === 6) && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="pi pi-images text-purple-600" />
                Yüklenen Belgeler / Kanıtlar
              </h3>
              
              {(!detailData.documents || detailData.documents.length === 0) ? (
                <div>
                  <p className="text-sm text-gray-500 mb-4 italic">
                    Henüz gerçek yüklenen belge bulunmuyor. Aşağıda örnek yerleşim gösterilmektedir (Entegrasyon aşamasında bağlanacaktır):
                  </p>
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar">
                    {[
                      { id: "mock-1", url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60", type: "image", name: "is_birligi_gorseli_1.jpg" },
                      { id: "mock-2", url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=60", type: "image", name: "is_birligi_gorseli_2.jpg" }
                    ].map((file, _, arr) => (
                      <div key={file.id} className="w-40 sm:w-48 flex-shrink-0 snap-start group relative border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="aspect-square bg-gray-100 relative flex items-center justify-center cursor-pointer" onClick={() => handleOpenPreview(file, arr)}>
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <i className="pi pi-eye text-white text-2xl" />
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs text-gray-600 truncate max-w-[120px]" title={file.name}>{file.name}</span>
                          <a href={file.url} download target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 transition-colors">
                            <i className="pi pi-download" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar">
                  {detailData.documents.map((file: any, idx: number, arr: any[]) => {
                    const resolvedUrl = getImageUrl(file.url);
                    let fileName = file.name || `belge_${idx + 1}`;
                    if (!file.name) {
                      const extMatch = file.url.match(/\.([a-zA-Z0-9]+)$/);
                      fileName += extMatch ? extMatch[0] : (file.type === "video" ? ".mp4" : ".jpg");
                    }
                    const isVideo = file.type === "video" || file.url.toLowerCase().endsWith(".mp4") || file.url.toLowerCase().endsWith(".mov");
                    const isHeic = file.url.toLowerCase().endsWith(".heic");
                    
                    const formattedFile = { url: resolvedUrl, type: isVideo ? "video" : "image", name: fileName };
                    // Format all items for the previewer
                    const allFormattedFiles = arr.map((f, i) => {
                      const rUrl = getImageUrl(f.url);
                      let fName = f.name || `belge_${i + 1}`;
                      if (!f.name) {
                        const eMatch = f.url.match(/\.([a-zA-Z0-9]+)$/);
                        fName += eMatch ? eMatch[0] : (f.type === "video" ? ".mp4" : ".jpg");
                      }
                      const fIsVideo = f.type === "video" || f.url.toLowerCase().endsWith(".mp4") || f.url.toLowerCase().endsWith(".mov");
                      return { url: rUrl, type: fIsVideo ? "video" : "image", name: fName };
                    });

                    return (
                      <div key={file.id || idx} className="w-40 sm:w-48 flex-shrink-0 snap-start group relative border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="aspect-square bg-gray-100 relative flex items-center justify-center cursor-pointer" onClick={() => isHeic ? window.open(resolvedUrl, '_blank') : handleOpenPreview(formattedFile, allFormattedFiles)}>
                          {isVideo ? (
                            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center">
                              <i className="pi pi-video text-white text-3xl mb-1" />
                              <span className="text-[10px] text-gray-400">Video Dosyası</span>
                            </div>
                          ) : isHeic ? (
                            <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center">
                              <i className="pi pi-file text-gray-500 text-3xl mb-1" />
                              <span className="text-[10px] text-gray-500">HEIC Dosyası</span>
                            </div>
                          ) : (
                            <img src={resolvedUrl} alt={fileName} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <i className={`pi ${isVideo ? "pi-play" : isHeic ? "pi-download" : "pi-eye"} text-white text-2xl`} />
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs text-gray-600 truncate max-w-[120px]" title={fileName}>{fileName}</span>
                          <a href={resolvedUrl} download target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 transition-colors">
                            <i className="pi pi-download" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Evaluations Section */}
          {Number(detailData.status) === 6 && (
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
                <i className="pi pi-star-fill text-yellow-500" />
                Karşılıklı Değerlendirmeler
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Influencer Feedback Card */}
                <div className="border border-purple-100 bg-purple-50/20 rounded-xl p-5 space-y-4">
                  <h4 className="font-bold text-purple-900 flex items-center gap-2">
                    <i className="pi pi-user text-purple-700" />
                    Influencer'ın Geri Bildirimi
                  </h4>
                  
                  {detailData.companyEvaluation ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400">İş Birliği Memnuniyeti</p>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i key={star} className={`pi ${star <= detailData.companyEvaluation.collaborationSatisfaction ? "pi-star-fill text-yellow-500" : "pi-star text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Firma Davranış Puanı</p>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i key={star} className={`pi ${star <= detailData.companyEvaluation.companyBehaviorScore ? "pi-star-fill text-yellow-500" : "pi-star text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Temsilci Davranış Puanı</p>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i key={star} className={`pi ${star <= detailData.companyEvaluation.representativeBehaviorScore ? "pi-star-fill text-yellow-500" : "pi-star text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Anlaşma Maddelerine Uyum</p>
                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${detailData.companyEvaluation.agreementRespected === true || detailData.companyEvaluation.agreementRespected === "yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {detailData.companyEvaluation.agreementRespected === true || detailData.companyEvaluation.agreementRespected === "yes" ? "Evet, Uydu" : "Hayır, Uymadı"}
                        </span>
                      </div>
                      {detailData.companyEvaluation.agreementViolationNote && (
                        <div className="bg-white p-3 rounded-lg border border-purple-100/50">
                          <p className="text-xs text-gray-400 mb-1">Uymama Nedeni</p>
                          <p className="text-xs text-gray-700 italic">"{detailData.companyEvaluation.agreementViolationNote}"</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                        <i className="pi pi-info-circle text-purple-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Değerlendirme Yapılmadı</p>
                        <p className="text-xs text-gray-500 mt-1 max-w-[240px]">
                          Influencer bu iş birliğine ait bir değerlendirme bırakmamış.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Business Feedback Card */}
                <div className="border border-emerald-100 bg-emerald-50/10 rounded-xl p-5 space-y-4">
                  <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                    <i className="pi pi-building text-emerald-700" />
                    İşletmenizin Geri Bildirimi
                  </h4>

                  {detailData.influencerEvaluation ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400">Hizmet Memnuniyeti</p>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i key={star} className={`pi ${star <= (detailData.influencerEvaluation.serviceSatisfaction || 4) ? "pi-star-fill text-yellow-500" : "pi-star text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">İş Birliği Etkililiği</p>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i key={star} className={`pi ${star <= (detailData.influencerEvaluation.collaborationEffectiveness || 5) ? "pi-star-fill text-yellow-500" : "pi-star text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Anlaşmaya Uyum</p>
                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${detailData.influencerEvaluation.agreementAdherence === true || detailData.influencerEvaluation.agreementAdherence === "yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {detailData.influencerEvaluation.agreementAdherence === true || detailData.influencerEvaluation.agreementAdherence === "yes" ? "Evet, Uydu" : "Hayır, Uymadı"}
                        </span>
                      </div>
                      
                      {/* Observed Effects */}
                      <div>
                        <p className="text-xs text-gray-400 mb-1.5">Gözlemlenen Etkiler</p>
                        <div className="flex flex-wrap gap-1.5">
                          {detailData.influencerEvaluation.effects?.followerIncrease && <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-medium">Takipçi Arttı</span>}
                          {detailData.influencerEvaluation.effects?.likeIncrease && <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-medium">Beğeni Arttı</span>}
                          {detailData.influencerEvaluation.effects?.viewIncrease && <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-medium">İzlenme Arttı</span>}
                          {detailData.influencerEvaluation.effects?.similarCollaborations && <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-medium">Benzer İş Birlikleri</span>}
                          {(!detailData.influencerEvaluation.effects || Object.values(detailData.influencerEvaluation.effects).every(v => !v)) && (
                            <span className="text-xs text-gray-400 italic">Belirtilmedi</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                        <i className="pi pi-info-circle text-emerald-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Değerlendirme Yapılmadı</p>
                        <p className="text-xs text-gray-500 mt-1 max-w-[240px] mb-3">
                          Bu işe ait değerlendirmeyi henüz yapmadınız.
                        </p>
                        <button
                          onClick={() => setIsEvaluationModalOpen(true)}
                          className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#4C226A] hover:bg-[#4C226A]/90 transition-colors cursor-pointer"
                        >
                          Influencer'ı Değerlendir
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Advertisement Detail Section */}
          {adLoading && (
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center">
              <i className="pi pi-spin pi-spinner text-2xl" style={{ color: "#4C226A" }} />
              <span className="ml-3 text-gray-500">İlan detayı yükleniyor...</span>
            </div>
          )}
          {adData && !adLoading && (
            <div className="bg-white rounded-xl shadow-sm p-6 flex-grow">
              <h3 
                className="text-lg font-bold text-gray-800 flex items-center justify-between cursor-pointer select-none"
                onClick={() => setAdDetailsExpanded(!adDetailsExpanded)}
              >
                <span className="flex items-center gap-2">
                  <i className="pi pi-megaphone" style={{ color: "#4C226A" }} />
                  Başvurulan İlan Detayı
                </span>
                <i className={`pi pi-chevron-down text-gray-500 transition-transform duration-200 ${adDetailsExpanded ? "rotate-180" : ""}`} />
              </h3>

              <div className={`transition-all duration-300 overflow-hidden ${adDetailsExpanded ? "max-h-[2000px] mt-4 opacity-100 animate-fade-in" : "max-h-0 opacity-0 pointer-events-none"}`}>
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  {/* Ad Title */}
                  <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">İlan Başlığı</p>
                    <p className="text-base font-bold" style={{ color: "#4C226A" }}>{adData.title || "-"}</p>
                  </div>

                  {/* Description */}
                  {adData.description && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-1">Açıklama</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{adData.description}</p>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(adData.startDate || adData.endDate) && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Tarih Aralığı</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {adData.startDate ? formatDate(adData.startDate) : "-"}
                          {adData.endDate ? ` — ${formatDate(adData.endDate)}` : ""}
                        </p>
                      </div>
                    )}

                    {(adData.city || adData.district) && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Konum</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {[adData.city, adData.district].filter(Boolean).join(", ") || "-"}
                        </p>
                      </div>
                    )}

                    {adData.address && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Adres</p>
                        <p className="text-sm font-semibold text-gray-800">{adData.address}</p>
                      </div>
                    )}

                    {adData.sector && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Sektör</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {sectors.find(s => String(s.value) === String(adData.sector))?.label || adData.sector}
                        </p>
                      </div>
                    )}

                    {adData.category && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Kategori</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {categories.find((c: any) => String(c.value || c.id) === String(adData.category))?.label || adData.category}
                        </p>
                      </div>
                    )}

                    {adData.services && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Hizmetler</p>
                        <p className="text-sm font-semibold text-gray-800 break-all">{adData.services}</p>
                      </div>
                    )}

                    {adData.guestCount && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Misafir Sayısı</p>
                        <p className="text-sm font-semibold text-gray-800">{adData.guestCount}</p>
                      </div>
                    )}

                    {adData.followerRange && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Takipçi Aralığı</p>
                        <p className="text-sm font-semibold text-gray-800">{adData.followerRange}</p>
                      </div>
                    )}

                    {adData.platformPreference && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Platform Tercihi</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {Array.isArray(adData.platformPreference) ? adData.platformPreference.join(", ") : adData.platformPreference}
                        </p>
                      </div>
                    )}

                    {adData.businessType && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">İşletme Tipi</p>
                        <p className="text-sm font-semibold text-gray-800">{adData.businessType}</p>
                      </div>
                    )}
                  </div>

                  {/* Ad Images */}
                  {adData.images && adData.images.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2">İlan Görselleri</p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {adData.images.map((img: any, idx: number) => {
                          const imgUrl = (img.imageUrl || img.url || img);
                          const resolvedUrl = typeof imgUrl === 'string' && imgUrl.startsWith('http') ? imgUrl : `${BASE_URL.replace('/api/v1', '')}/${String(imgUrl).replace(/^\//, '')}`;
                          return (
                            <img
                              key={idx}
                              src={resolvedUrl}
                              alt={`İlan Görseli ${idx + 1}`}
                              className="w-24 h-24 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <Toast ref={toastRef} />

      <Dialog
        header="Revizyon Talebi"
        visible={revisionModalOpen}
        style={{ width: "450px" }}
        modal
        onHide={() => {
          if (!isSubmittingRevision) {
            setRevisionModalOpen(false);
            setRevisionNote("");
          }
        }}
        footer={
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setRevisionModalOpen(false);
                setRevisionNote("");
              }}
              disabled={isSubmittingRevision}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer text-gray-700"
            >
              Vazgeç
            </button>
            <button
              onClick={handleSendRevisionRequest}
              disabled={isSubmittingRevision}
              className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
              style={{ backgroundColor: "#4C226A" }}
            >
              {isSubmittingRevision && <i className="pi pi-spinner pi-spin" />}
              Talep Et
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-2 pt-2">
          <label htmlFor="revisionNote" className="font-semibold text-gray-700">
            Revizyon Açıklaması
          </label>
          <textarea
            id="revisionNote"
            value={revisionNote}
            onChange={(e) => setRevisionNote(e.target.value)}
            placeholder="Lütfen revizyon notunuzu buraya detaylıca yazın..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            disabled={isSubmittingRevision}
          />
        </div>
      </Dialog>

      <Dialog
        visible={!!previewFile}
        onHide={() => setPreviewFile(null)}
        style={{ width: "90vw", maxWidth: "800px" }}
        header={previewFile?.name || "Dosya Önizleme"}
        modal
        dismissableMask
        contentClassName="flex flex-col items-center justify-center p-4 bg-black/5 relative"
      >
        <div className="relative flex items-center justify-center w-full max-h-[70vh]">
          {previewItems.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevPreview(); }}
              disabled={previewIndex === 0}
              className={`absolute left-0 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${previewIndex === 0 ? "opacity-30 cursor-not-allowed bg-black/30 text-white/50" : "opacity-70 hover:opacity-100 bg-black/50 text-white cursor-pointer"}`}
              style={{ transform: 'translateX(-50%)' }}
            >
              <i className="pi pi-chevron-left text-xl" />
            </button>
          )}

          {previewFile?.type === "video" ? (
            <video src={previewFile.url} controls className="max-w-full max-h-[70vh] rounded-lg shadow" autoPlay />
          ) : (
            <img src={previewFile?.url} alt="Önizleme" className="max-w-full max-h-[70vh] object-contain rounded-lg shadow" />
          )}

          {previewItems.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handleNextPreview(); }}
              disabled={previewIndex === previewItems.length - 1}
              className={`absolute right-0 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${previewIndex === previewItems.length - 1 ? "opacity-30 cursor-not-allowed bg-black/30 text-white/50" : "opacity-70 hover:opacity-100 bg-black/50 text-white cursor-pointer"}`}
              style={{ transform: 'translateX(50%)' }}
            >
              <i className="pi pi-chevron-right text-xl" />
            </button>
          )}
        </div>
        {previewItems.length > 1 && (
          <div className="mt-4 text-center text-sm font-semibold text-gray-500">
            {previewIndex + 1} / {previewItems.length}
          </div>
        )}
      </Dialog>

      <EvaluationModal
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
        onSubmit={() => {
          setRefreshTrigger(prev => prev + 1);
        }}
        applicationId={detailData?.id}
        influencerId={detailData?.influencerId || detailData?.influencer?.id || detailData?.applicantId || detailData?.applicant?.id || detailData?.id}
      />
    </div>
  );
}
