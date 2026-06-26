"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { getAdvertisement } from "@/src/api/advertisements/advertisements.service";
import { getWorkshop } from "@/src/api/advertisements/workshops.service";
import { getGiftKit } from "@/src/api/advertisements/giftKits.service";
import { Advertisement } from "@/src/api/advertisements/advertisements.models";
import { BASE_URL } from "@/src/api/axios";
import { useCategories } from "@/src/hooks/useCategories";
import { useSectors } from "@/src/hooks/useSectors";

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
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
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
                  <span className={`w-2.5 h-2.5 rounded-full ${ad.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  <p className="font-semibold text-gray-800 capitalize">{ad.status}</p>
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

              <div>
                <p className="text-sm text-gray-500 mb-1">Lokasyon</p>
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  <i className="pi pi-map-marker text-[#4C226A]"></i>
                  {ad.city} {ad.district ? `/ ${ad.district}` : ''}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Tarih Aralığı</p>
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  <i className="pi pi-calendar text-[#4C226A]"></i>
                  {new Date(ad.startDate).toLocaleDateString("tr-TR")} - {new Date(ad.endDate).toLocaleDateString("tr-TR")}
                </div>
              </div>

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

            {ad.address && ad.address.toLowerCase() !== "test" && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 font-medium mb-2 flex items-center gap-2"><i className="pi pi-map text-[#4C226A]"></i> Açık Adres</p>
                <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{ad.address}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
