"use client";

import { AdEvent } from "@/src/mocks/adManagement";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface EventCardProps {
  event: AdEvent;
  onEdit?: (id: string, category: string) => void;
  onDelete?: (id: string, category: string) => void;
}

export default function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const t = useTranslations("adManagement");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  // Helper function to get month translation key
  const getMonthKey = (month: string) => {
    const monthMap: Record<string, string> = {
      "Ocak": "ocak",
      "Şubat": "şubat",
      "Mart": "mart",
      "Nisan": "nisan",
      "Mayıs": "mayıs",
      "Haziran": "haziran",
      "Temmuz": "temmuz",
      "Ağustos": "ağustos",
      "Eylül": "eylül",
      "Ekim": "ekim",
      "Kasım": "kasım",
      "Aralık": "aralık",
    };
    return monthMap[month] || month.toLowerCase();
  };

  // Helper function to get day translation key
  const getDayKey = (day: string) => {
    const dayMap: Record<string, string> = {
      "Pazartesi": "pazartesi",
      "Salı": "salı",
      "Çarşamba": "çarşamba",
      "Perşembe": "perşembe",
      "Cuma": "cuma",
      "Cumartesi": "cumartesi",
      "Pazar": "pazar",
    };
    return dayMap[day] || day.toLowerCase();
  };

  const translateValue = (key: string, type: 'category' | 'audience' | 'platform') => {
    const maps: Record<string, Record<string, string>> = {
      category: {
        "restaurant-cafe": "Restoran / Cafe",
        "food-drink": "Yemek & İçecek",
        "art": "Sanat",
        "music": "Müzik",
        "fashion": "Moda",
        "technology": "Teknoloji",
      },
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
    return maps[type][key] || key;
  };

  return (
    <div className="rounded-lg bg-[#EED7EF] p-3 cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="flex items-start gap-3 relative flex-1">
         <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
          {event.coverImageUrl ? (
            <img 
              src={event.coverImageUrl.startsWith('http') || event.coverImageUrl.startsWith('/images/') ? event.coverImageUrl : `https://song-cartridges-missile-amplifier.trycloudflare.com/${event.coverImageUrl.replace(/^\//, '')}`} 
              alt={event.title} 
              className="w-full h-full object-cover" 
              onError={(e) => { e.currentTarget.src = "/images/sample-1.jpg"; }}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <i className="pi pi-image text-gray-400 text-xl"></i>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-8 flex flex-col justify-center">
          {/* Title */}
          <h3 className="text-sm font-bold text-dark mb-2 line-clamp-1">{event.title}</h3>

          <div className="flex flex-col gap-1.5">
            {/* Row 1: Location/Date OR Target Audience */}
            <div className="flex items-center gap-3">
              {event.category === "hediye_kiti" ? (
                event.targetAudience && (
                  <div className="flex items-center gap-1 text-xs whitespace-nowrap" style={{ color: "#4C226A" }}>
                    <i className="pi pi-users text-xs"></i>
                    <span>{translateValue(event.targetAudience, 'audience')}</span>
                  </div>
                )
              ) : (
                <>
                  <div className="flex items-center gap-1 text-xs whitespace-nowrap" style={{ color: "#4C226A" }}>
                    <i className="pi pi-map-marker text-xs"></i>
                    <span className="truncate max-w-[100px]">{event.city}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs whitespace-nowrap" style={{ color: "#4C226A" }}>
                    <i className="pi pi-clock text-xs"></i>
                    <span>{event.formattedDate}</span>
                  </div>
                </>
              )}
            </div>

            {/* Row 2: Type and Category/Views */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs whitespace-nowrap" style={{ color: "#4C226A" }}>
                <i className="pi pi-tag text-xs"></i>
                <span>{event.type}</span>
              </div>
              {event.subCategory ? (
                <div className="flex items-center gap-1 text-xs whitespace-nowrap" style={{ color: "#4C226A" }}>
                  <i className="pi pi-bookmark text-xs"></i>
                  <span className="truncate max-w-[120px]">{translateValue(event.subCategory, 'category')}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs whitespace-nowrap" style={{ color: "#4C226A" }}>
                  <i className="pi pi-eye text-xs"></i>
                  <span>{event.views}</span>
                </div>
              )}
            </div>

            {/* Row 3: Platform / Comments */}
            <div className="flex items-center gap-3">
              {event.platform ? (
                <div className="flex items-center gap-1 text-xs whitespace-nowrap" style={{ color: "#4C226A" }}>
                  <i className={`pi pi-${event.platform.toLowerCase()} text-xs`}></i>
                  <span>{translateValue(event.platform, 'platform')}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs whitespace-nowrap" style={{ color: "#4C226A" }}>
                  <i className="pi pi-file text-xs"></i>
                  <span>{event.comments}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instagram Icon - Absolute positioned bottom right */}
        <div
          className="absolute bottom-0 right-0 w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
          }}
        >
          <i className="pi pi-instagram text-white text-xs"></i>
        </div>

        {/* Options Menu Button - Top Right */}
        <div className="absolute top-0 right-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-gray-500 hover:bg-white/50 rounded transition-colors"
          >
            <i className="pi pi-ellipsis-v text-sm"></i>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  if (onEdit) onEdit(event.id, event.category);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <i className="pi pi-pencil text-primary text-xs"></i>
                Düzenle
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  if (onDelete) onDelete(event.id, event.category);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
              >
                <i className="pi pi-trash text-xs"></i>
                Sil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
