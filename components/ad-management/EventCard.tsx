"use client";

import { AdEvent } from "@/src/mocks/adManagement";
import { useTranslations, useLocale } from "next-intl";
import { useCategories } from "@/src/hooks/useCategories";
import { BASE_URL } from "@/src/api/axios";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: AdEvent;
  onEdit?: (id: string, category: string) => void;
  onDelete?: (id: string, category: string) => void;
  onPause?: (id: string, category: string) => void;
  onDuplicate?: (id: string, category: string) => void;
  spanCount?: number;
}

export default function EventCard({ event, onEdit, onDelete, onPause, onDuplicate, spanCount = 7 }: EventCardProps) {
  const t = useTranslations("adManagement");
  const { categories } = useCategories();
  const router = useRouter();
  const locale = useLocale();

  const translateValue = (key: string, type: 'category' | 'audience' | 'platform') => {
    if (type === 'category') {
      const found = categories.find(c => c.value === key || c.label === key);
      if (found) return found.label;
      return key;
    }
    const maps: Record<string, Record<string, string>> = {
      audience: {
        "adults": "Yetişkinler",
        "teens": "Gençler",
        "children": "Çocuklar",
        "everyone": "Herkes",
        "professionals": "Profesyoneller",
      },
      platform: {
        "instagram": "Instagram",
        "tiktok": "TikTok",
        "youtube": "YouTube",
        "twitter": "Twitter",
      }
    };
    return maps[type]?.[key] || key;
  };

  const getImageUrl = (url?: string) => {
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
      // Fallback
      return `https://viii-standards-violation-requirement.trycloudflare.com/${cleanPath}`;
    }
  };

  const imagesList = event.images?.length ? event.images : (event.coverImageUrl ? [{ imageUrl: event.coverImageUrl }] : []);

  const handleClick = () => {
    router.push(`/${locale}/ad-management/detail/${event.category}/${event.id}`);
  };

  return (
    <>
      <div 
        onClick={handleClick}
        className={`group relative rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 w-full h-full flex overflow-hidden min-h-[80px] ${
          (event.status === "inactive" || event.status === "paused" || event.status === "draft") ? "bg-[#E2DCE4] opacity-85" : "bg-[#D4C5D9]"
        }`}
      >
        
        {/* Left Full Height Image */}
        <div className={`relative flex-shrink-0 bg-white transition-all ${spanCount <= 3 ? 'w-20 md:w-24' : 'w-32'}`}>
          {event.coverImageUrl ? (
            <>
              <img 
                src={getImageUrl(event.coverImageUrl)} 
                alt={event.title} 
                className="absolute inset-0 w-full h-full object-cover" 
                onError={(e) => { 
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/soiree.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <span className="absolute bottom-1 left-2 text-white font-bold text-[10px] uppercase tracking-wider drop-shadow-md">
                {event.title.split(' ')[0]}
              </span>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <i className="pi pi-image text-gray-400 text-xl"></i>
            </div>
          )}
        </div>
        
        {/* Right Content Area */}
        <div className="flex flex-col flex-1 min-w-0 p-3 pl-4 pr-16 justify-center">
          {/* Title */}
          <span className="text-sm font-extrabold text-gray-900 truncate mb-2" title={event.title}>
            {event.title}
          </span>
          
          {/* Capsules Grid */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {/* Status Badge */}
            {event.status && (
              <div className={`flex items-center gap-1 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm font-bold ${
                event.status === "active" 
                  ? "bg-green-100/90 text-green-700 border border-green-200" 
                  : (event.status === "inactive" || event.status === "paused")
                    ? "bg-red-100/90 text-red-700 border border-red-200"
                    : "bg-amber-100/90 text-amber-700 border border-amber-200"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  event.status === "active" 
                    ? "bg-green-500" 
                    : (event.status === "inactive" || event.status === "paused")
                      ? "bg-red-500"
                      : "bg-amber-500"
                }`}></span>
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {event.status === "active" 
                    ? "Aktif" 
                    : (event.status === "inactive" || event.status === "paused") 
                      ? "Durduruldu" 
                      : event.status === "draft" 
                        ? "Taslak" 
                        : event.status}
                </span>
              </div>
            )}

            {event.city && (
              <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm text-gray-700">
                <i className="pi pi-map-marker text-[10px] text-[#4C226A]"></i>
                <span className={`text-[10px] font-semibold truncate ${spanCount <= 3 ? 'max-w-[50px]' : 'max-w-[80px]'}`}>{event.city}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm text-gray-700">
              <i className="pi pi-clock text-[10px] text-[#4C226A]"></i>
              <span className="text-[10px] font-semibold">{event.formattedDate}</span>
            </div>

            <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm text-gray-700">
              <i className="pi pi-tag text-[10px] text-[#4C226A]"></i>
              <span className="text-[10px] font-semibold uppercase">{event.type === 'Reklam' ? 'İlan' : event.type}</span>
            </div>

            {spanCount > 3 && (
              <>
                <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm text-gray-700" title="Görüntülenme">
                  <i className="pi pi-eye text-[10px] text-[#4C226A]"></i>
                  <span className="text-[10px] font-semibold">{event.views || 0}</span>
                </div>

                <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm text-gray-700" title="Yorumlar">
                  <i className="pi pi-file-edit text-[10px] text-[#4C226A]"></i>
                  <span className="text-[10px] font-semibold">{event.comments || 0}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons (Absolute Top Right) */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          {onPause && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPause(event.id, event.category);
              }}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-white/60 hover:bg-white text-[#4C226A] shadow-sm transition-colors cursor-pointer"
              title={event.status === "active" ? "Duraklat" : "Yayınla"}
            >
              <i className={`pi pi-${event.status === "active" ? "pause" : "play"} text-[10px]`} />
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(event.id, event.category);
              }}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-white/60 hover:bg-white text-[#4C226A] shadow-sm transition-colors cursor-pointer"
              title="Kopyala"
            >
              <i className="pi pi-copy text-[10px]" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) onEdit(event.id, event.category);
            }}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-white/60 hover:bg-white text-[#4C226A] shadow-sm transition-colors cursor-pointer"
            title="Düzenle"
          >
            <i className="pi pi-pencil text-[10px]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) onDelete(event.id, event.category);
            }}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-white/60 hover:bg-red-50 text-red-500 shadow-sm transition-colors cursor-pointer"
            title="Sil"
          >
            <i className="pi pi-trash text-[10px]" />
          </button>
        </div>
      </div>
    </>
  );
}
