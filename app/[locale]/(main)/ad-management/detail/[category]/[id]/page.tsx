"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { getAdvertisement, pauseAdvertisement, duplicateAdvertisement, updateAdvertisementStatus } from "@/src/api/advertisements/advertisements.service";
import { getWorkshop } from "@/src/api/advertisements/workshops.service";
import { getGiftKit } from "@/src/api/advertisements/giftKits.service";
import { Advertisement } from "@/src/api/advertisements/advertisements.models";
import { BASE_URL } from "@/src/api/axios";
import { useCategories } from "@/src/hooks/useCategories";
import { useSectors } from "@/src/hooks/useSectors";
import { Toast } from "primereact/toast";

export default function AdDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  
  const id = params.id as string;
  const categoryParam = params.category as string;

  const { categories } = useCategories();
  const { sectors } = useSectors();

  const [ad, setAd] = useState<Advertisement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingState, setIsUpdatingState] = useState(false);
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const toastRef = useRef<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAd = async () => {
      try {
        let response;
        if (categoryParam === "workshop") {
          response = await getWorkshop(id);
        } else if (categoryParam === "hediye_kiti") {
          response = await getGiftKit(id);
        } else {
          response = await getAdvertisement(id);
        }

        if (response.success && response.data) {
          setAd(response.data as any);
        } else {
          setError("İlan bulunamadı.");
        }
      } catch (err: any) {
        console.error("Error fetching details:", err);
        setError("Detaylar yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  const fetchAdDetail = async () => {
    try {
      let response;
      if (categoryParam === "workshop") {
        response = await getWorkshop(id);
      } else if (categoryParam === "hediye_kiti") {
        response = await getGiftKit(id);
      } else {
        response = await getAdvertisement(id);
      }

      if (response.success && response.data) {
        setAd(response.data as any);
      }
    } catch (err) {
      console.error("Error refreshing ad details:", err);
    }
  };

  const handlePauseAd = async () => {
    if (!id || isUpdatingState || !ad) return;
    try {
      setIsUpdatingState(true);
      const isCurrentlyActive = ad.status === "active";
      
      let res;
      if (isCurrentlyActive) {
        res = await pauseAdvertisement(id);
      } else {
        res = await updateAdvertisementStatus(id, "active");
      }

      if (res && res.success) {
        toastRef.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: res.message || "İlan durumu başarıyla güncellendi.",
          life: 3000,
        });
        await fetchAdDetail();
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: "İşlem Başarısız",
          detail: res?.message || (isCurrentlyActive ? "İlan durdurulamadı." : "Aktifleştirme başarısız: Tarihler çakışıyor."),
          life: 4000,
        });
      }
    } catch (err: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Hata",
        detail: err.message || err.response?.data?.message || "İlan durdurulurken/başlatılırken bir hata oluştu.",
        life: 4000,
      });
    } finally {
      setIsUpdatingState(false);
      setShowPauseConfirm(false);
    }
  };

  const handleDuplicateAd = async () => {
    if (!id || isUpdatingState) return;
    try {
      setIsUpdatingState(true);
      const res = await duplicateAdvertisement(id);
      if (res && res.success) {
        toastRef.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: res.message || "İlan başarıyla kopyalandı.",
          life: 4000,
        });
        setTimeout(() => {
          router.push(`/${locale}/ad-management?tab=${categoryParam}`);
        }, 1500);
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: "İşlem Başarısız",
          detail: res?.message || "İlan kopyalanamadı.",
          life: 4000,
        });
      }
    } catch (err: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Hata",
        detail: err.message || err.response?.data?.message || "İlan kopyalanırken bir hata oluştu.",
        life: 4000,
      });
    } finally {
      setIsUpdatingState(false);
      setShowDuplicateConfirm(false);
    }
  };

  const getImageUrl = (imgInput: any) => {
    if (!imgInput) return '/images/soiree.png';
    let url = "";
    if (typeof imgInput === 'string') {
      url = imgInput;
    } else if (imgInput && typeof imgInput === 'object') {
      url = imgInput.imageUrl || imgInput.url || imgInput.imagePath || imgInput.path || "";
    }
    if (!url) return '/images/soiree.png';
    if (url.includes('localhost:5100')) {
      const tunnelOrigin = new URL(BASE_URL).origin;
      return url.replace(/https?:\/\/localhost:5100/g, tunnelOrigin);
    }
    if (url.startsWith('http') || url.startsWith('/images/')) return url;
    const cleanPath = url.replace(/\\/g, '/').replace(/^\//, '');
    try {
      return `${new URL(BASE_URL).origin}/${cleanPath}`;
    } catch {
      return '/images/soiree.png';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 min-h-screen bg-[#F7F6F9] flex items-center justify-center">
        <i className="pi pi-spinner pi-spin text-4xl text-[#4C226A]"></i>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="p-6 md:p-8 min-h-screen bg-[#F7F6F9] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <i className="pi pi-exclamation-triangle text-red-500 text-4xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">İlan Bulunamadı</h2>
        <p className="text-gray-500 mb-6">{error || "Aradığınız ilan mevcut değil veya silinmiş olabilir."}</p>
        <button 
          onClick={() => router.push(`/${locale}/ad-management?tab=${categoryParam}`)}
          className="px-6 py-3 bg-[#4C226A] text-white font-semibold rounded-xl hover:bg-[#3b1a52] transition-colors"
        >
          Listeye Dön
        </button>
      </div>
    );
  }

  const images = ad.images || (ad as any).adImages || (ad as any).images || [];
  const rawPlatformPref = ad.platformPreference as any;
  const platforms: string[] = Array.isArray(rawPlatformPref)
    ? rawPlatformPref
    : typeof rawPlatformPref === "string"
      ? (rawPlatformPref.startsWith("[") && rawPlatformPref.endsWith("]")
        ? (() => {
            try { return JSON.parse(rawPlatformPref); } catch { return [rawPlatformPref]; }
          })()
        : rawPlatformPref.split(",").map((s: string) => s.trim()).filter(Boolean))
      : [];

  return (
    <div className="p-6 md:p-8 min-h-screen bg-[#F7F6F9]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push(`/${locale}/ad-management?tab=${categoryParam}`)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <i className="pi pi-arrow-left text-[#4C226A]"></i>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{ad.title}</h1>
            {ad.createDate && (
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                <i className="pi pi-calendar-plus text-xs"></i> 
                Oluşturulma: {new Date(ad.createDate).toLocaleDateString("tr-TR")}
                {ad.viewCount !== undefined && (
                  <>
                    <span className="mx-1 text-gray-300">|</span>
                    <i className="pi pi-eye text-xs"></i>
                    Görüntülenme Sayısı: {ad.viewCount}
                  </>
                )}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPauseConfirm(true)}
            disabled={isUpdatingState}
            className={`px-4 py-2 font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
              ad.status === "active"
                ? "bg-red-600 text-white hover:bg-red-700 border border-transparent"
                : "bg-green-600 text-white hover:bg-green-700 border border-transparent"
            }`}
          >
            <i className={`pi pi-${ad.status === "active" ? "pause" : "play"}`}></i> {ad.status === "active" ? "Durdur" : "Yayınla"}
          </button>
          <button
            onClick={() => setShowDuplicateConfirm(true)}
            disabled={isUpdatingState}
            className="px-4 py-2 bg-white text-[#4C226A] font-semibold rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <i className="pi pi-copy"></i> Kopyala
          </button>
          <button 
            onClick={() => {
              let route = `/${locale}/ad-management/add?editId=${ad.id}`;
              if (categoryParam === "workshop") route = `/${locale}/ad-management/workshop/add?editId=${ad.id}`;
              else if (categoryParam === "hediye_kiti") route = `/${locale}/ad-management/gift-kit/add?editId=${ad.id}`;
              router.push(route);
            }}
            className="px-4 py-2 bg-white text-[#4C226A] font-semibold rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <i className="pi pi-pencil"></i> Düzenle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {images.length > 0 ? (
            <>
              <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-md relative bg-gray-100">
                <img 
                  src={getImageUrl(images[0])} 
                  alt={ad.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { 
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/soiree.png';
                  }}
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(1).map((img: any, idx: number) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden shadow-sm relative bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                      <img 
                        src={getImageUrl(img)} 
                        alt={`${ad.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { 
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/soiree.png';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-[4/5] w-full rounded-2xl bg-gray-200 flex items-center justify-center shadow-md">
              <i className="pi pi-image text-4xl text-gray-400"></i>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">İlan Detayları</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Durum</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    ad.status === 'active' 
                      ? 'bg-green-500' 
                      : (ad.status === 'inactive' || ad.status === 'paused')
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                  }`}></span>
                  <p className="font-semibold text-gray-800">
                    {ad.status === 'active' 
                      ? 'Aktif' 
                      : (ad.status === 'inactive' || ad.status === 'paused') 
                        ? 'Durduruldu' 
                        : ad.status === 'draft' 
                          ? 'Taslak' 
                          : ad.status}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Kategori / Sektör</p>
                <div className="flex items-center gap-2 text-gray-800 font-medium capitalize">
                  <i className="pi pi-tag text-[#4C226A]"></i>
                  {(() => {
                    const categoryLabel = categories?.find(c => c.value === ad.category)?.label || ad.category || categoryParam;
                    const sectorLabel = ad.sector ? sectors?.find(s => s.value === ad.sector)?.label || ad.sector : '';
                    return `${categoryLabel}${sectorLabel ? ` / ${sectorLabel}` : ''}`;
                  })()}
                </div>
              </div>

              {categoryParam !== "hediye_kiti" && categoryParam !== "gift-kit" && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Lokasyon</p>
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <i className="pi pi-map-marker text-[#4C226A]"></i>
                    {ad.city || "-"} {ad.district ? `/ ${ad.district}` : ''}
                  </div>
                </div>
              )}

              {categoryParam !== "hediye_kiti" && categoryParam !== "gift-kit" && ad.startDate && ad.endDate && !isNaN(new Date(ad.startDate).getTime()) && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tarih Aralığı</p>
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <i className="pi pi-calendar text-[#4C226A]"></i>
                    {new Date(ad.startDate).toLocaleDateString("tr-TR")} - {new Date(ad.endDate).toLocaleDateString("tr-TR")}
                  </div>
                </div>
              )}

              {ad.guestCount && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Kişi Sayısı</p>
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <i className="pi pi-users text-[#4C226A]"></i>
                    {ad.guestCount}
                  </div>
                </div>
              )}

              {ad.businessType && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">İş Modeli</p>
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <i className="pi pi-briefcase text-[#4C226A]"></i>
                    {ad.businessType === 'part-time' ? 'Part-Time' :
                     ad.businessType === 'full-time' ? 'Full-Time' :
                     ad.businessType === 'project-based' ? 'Proje Bazlı' : ad.businessType}
                  </div>
                </div>
              )}

              {platforms.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Platform Tercihi</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {platforms.map((platform, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-md text-gray-800 font-medium capitalize text-sm">
                        <i className={`pi pi-${platform.toLowerCase()} text-[#4C226A]`}></i>
                        {platform}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {ad.followerRange && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Takipçi Beklentisi</p>
                  <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <i className="pi pi-chart-line text-[#4C226A]"></i>
                    {ad.followerRange}
                  </div>
                </div>
              )}

              {ad.contentType && ad.contentType.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">İçerik Türü</p>
                  <div className="flex items-center gap-2 text-gray-800 font-medium capitalize">
                    <i className="pi pi-video text-[#4C226A]"></i>
                    {Array.isArray(ad.contentType) ? ad.contentType.join(', ') : ad.contentType}
                  </div>
                </div>
              )}
            </div>

            {(ad.description || ad.services) && (
              <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                {ad.description && (
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-2 flex items-center gap-2"><i className="pi pi-align-left text-[#4C226A]"></i> Açıklama</p>
                    <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{ad.description}</p>
                  </div>
                )}
                
                {ad.services && (
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-2 flex items-center gap-2"><i className="pi pi-list text-[#4C226A]"></i> Hizmetler</p>
                    <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{ad.services}</p>
                  </div>
                )}
              </div>
            )}

            {categoryParam !== "hediye_kiti" && categoryParam !== "gift-kit" && ad.address && ad.address.toLowerCase() !== "test" && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 font-medium mb-2 flex items-center gap-2"><i className="pi pi-map text-[#4C226A]"></i> Açık Adres</p>
                <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{ad.address}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Pause/Resume Confirmation Modal */}
      {showPauseConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl transform transition-all">
            <div className="flex flex-col items-center text-center">
              {ad.status === "active" ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    <i className="pi pi-pause text-orange-500 text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">İlanı Durdur</h3>
                  <p className="text-gray-500 mb-6">
                    Bu ilanı durdurmak istediğinize emin misiniz? İlan yayından kaldırılacaktır.
                  </p>
                  <div className="flex w-full gap-3">
                    <button
                      onClick={() => setShowPauseConfirm(false)}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Vazgeç
                    </button>
                    <button
                      onClick={handlePauseAd}
                      className="flex-1 px-4 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <i className="pi pi-pause"></i>
                      Evet, Durdur
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <i className="pi pi-play text-green-500 text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">İlanı Yayınla</h3>
                  <p className="text-gray-500 mb-4">
                    Bu ilanı tekrar yayınlamak istediğinizden emin misiniz? İlan yayına alınacaktır.
                  </p>
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 mb-6">
                    <p className="text-xs text-blue-800 text-left flex gap-2">
                      <i className="pi pi-info-circle mt-0.5"></i>
                      <span>
                        <strong>Uyarı:</strong> Birebir aynı içerikte olan kopyalanmış ilanlar, orijinal ilan aktif durumdayken aktif edilemez. İçerikte değişiklik yapıldıysa aktif edilebilir.
                      </span>
                    </p>
                  </div>
                  <div className="flex w-full gap-3">
                    <button
                      onClick={() => setShowPauseConfirm(false)}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Vazgeç
                    </button>
                    <button
                      onClick={handlePauseAd}
                      className="flex-1 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <i className="pi pi-play"></i>
                      Evet, Yayınla
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Confirmation Modal */}
      {showDuplicateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl transform transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <i className="pi pi-copy text-blue-500 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">İlanı Kopyala</h3>
              <p className="text-gray-500 mb-6">
                Aynı ilan kaydından tekrar oluşturacaksınız. Bu işlemi onaylıyor musunuz?
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setShowDuplicateConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleDuplicateAd}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="pi pi-copy"></i>
                  Evet, Kopyala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toast ref={toastRef} />
    </div>
  );
}
