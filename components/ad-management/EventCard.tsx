"use client";

import { AdEvent } from "@/src/mocks/adManagement";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useCategories } from "@/src/hooks/useCategories";

interface EventCardProps {
  event: AdEvent;
  onEdit?: (id: string, category: string) => void;
  onDelete?: (id: string, category: string) => void;
}

export default function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const t = useTranslations("adManagement");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { categories } = useCategories();

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
    return maps[type][key] || key;
  };

  // Helper to handle backslashes and relative paths from .NET
  const getImageUrl = (url?: string) => {
    if (!url) return '/images/soiree.png';
    if (url.startsWith('http') || url.startsWith('/images/')) return url;
    const cleanPath = url.replace(/\\/g, '/').replace(/^\//, '');
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://complexity-cloud-awarded-mug.trycloudflare.com';
      const origin = new URL(baseUrl).origin;
      return `${origin}/${cleanPath}`;
    } catch {
      return `https://complexity-cloud-awarded-mug.trycloudflare.com/${cleanPath}`;
    }
  };

  return (
    <div className="group relative rounded-xl bg-white p-3 cursor-pointer hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-gray-100 shadow-sm overflow-hidden">
      {/* Subtle accent border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4C226A] to-[#8A3A99]" />
      
      <div className="flex items-start gap-3.5 pl-1 relative flex-1">
        {/* Image Section */}
        <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100/50 shadow-inner flex items-center justify-center">
          {event.coverImageUrl ? (
            <img 
              src={getImageUrl(event.coverImageUrl)} 
              alt={event.title} 
              className="w-full h-full object-contain p-1" 
              onError={(e) => { 
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/soiree.png';
              }}
            />
          ) : (
            <i className="pi pi-image text-gray-300 text-2xl"></i>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6 flex flex-col py-0.5 h-full">
          {/* Badge & Title Row */}
          <div className="flex flex-col mb-2 gap-1.5">
            <div className="flex items-center justify-between">
              <span className="bg-[#4C226A]/10 text-[#4C226A] px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase w-fit">
                {event.type === 'Reklam' ? 'İlan' : event.type}
              </span>
            </div>
            <h3 className="text-sm leading-tight font-bold text-gray-800 line-clamp-2 pr-2">
              {event.title}
            </h3>
          </div>

          <div className="flex flex-col gap-1.5 mt-auto">
            {/* Info rows */}
            {event.category === "hediye_kiti" ? (
              event.targetAudience && (
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <i className="pi pi-users text-gray-400 text-[10px]"></i>
                  <span className="truncate font-medium">{translateValue(event.targetAudience, 'audience')}</span>
                </div>
              )
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <i className="pi pi-map-marker text-gray-400 text-[10px]"></i>
                  <span className="truncate font-medium">{event.city}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <i className="pi pi-calendar text-gray-400 text-[10px]"></i>
                  <span className="truncate font-medium">{event.formattedDate}</span>
                </div>
              </>
            )}

            {/* Views and Comments */}
            <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-1 border-t border-gray-50 mt-1">
              {!event.subCategory && (
                <div className="flex items-center gap-1" title="Görüntülenme">
                  <i className="pi pi-eye text-[10px]"></i>
                  <span className="font-medium">{event.views}</span>
                </div>
              )}
              {!event.platform && (
                <div className="flex items-center gap-1" title="Yorumlar">
                  <i className="pi pi-comment text-[10px]"></i>
                  <span className="font-medium">{event.comments}</span>
                </div>
              )}
              {event.subCategory && (
                <div className="flex items-center gap-1" title="Kategori">
                  <i className="pi pi-tags text-[10px]"></i>
                  <span className="truncate font-medium">{translateValue(event.subCategory, 'category')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Platform Icon - Absolute positioned bottom right */}
        {event.platform && (
          <div
            className={`absolute bottom-0 right-0 w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 shadow-sm ${
              event.platform.toLowerCase() === 'instagram' ? '' : 'bg-gray-100 border border-gray-200'
            }`}
            style={
              event.platform.toLowerCase() === 'instagram'
                ? { background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }
                : {}
            }
            title={translateValue(event.platform, 'platform')}
          >
            <i className={`pi pi-${event.platform.toLowerCase()} ${event.platform.toLowerCase() === 'instagram' ? 'text-white' : 'text-gray-600'} text-xs`}></i>
          </div>
        )}

        {/* Options Menu Button - Top Right */}
        <div className="absolute -top-1 -right-1" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <i className="pi pi-ellipsis-v text-xs"></i>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100 overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  if (onEdit) onEdit(event.id, event.category);
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-[#4C226A]/5 hover:text-[#4C226A] flex items-center gap-2 transition-colors"
              >
                <i className="pi pi-pencil"></i>
                Düzenle
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  if (onDelete) onDelete(event.id, event.category);
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <i className="pi pi-trash"></i>
                Sil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
