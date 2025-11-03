"use client";

import { AdEvent } from "@/src/mocks/adManagement";
import { useTranslations } from "next-intl";
import Image from "next/image";
 
export default function EventCard({ event }: { event: AdEvent }) {
  const t = useTranslations("adManagement");
  
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
  return (
    <div className="rounded-lg bg-[#EED7EF] p-3 cursor-pointer hover:shadow-md transition-shadow h-full">
      <div className="flex items-start gap-3 relative">
         <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
          {event.coverImageUrl ? (
            <Image src={event.coverImageUrl} alt={event.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <i className="pi pi-image text-gray-400 text-xl"></i>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-8">
          {/* Title */}
          <h3 className="text-sm font-bold text-dark mb-2">{event.title}</h3>

          {/* Row 1: Location and Date */}
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <div className="flex items-center gap-1 text-xs" style={{ color: "#4C226A" }}>
              <i className="pi pi-map-marker text-xs"></i>
              <span>{event.city}</span>
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: "#4C226A" }}>
              <i className="pi pi-clock text-xs"></i>
              <span>{event.formattedDate}</span>
            </div>
          </div>

          {/* Row 2: Type, Views, Comments */}
          <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: "#4C226A" }}>
            <div className="flex items-center gap-1">
              <i className="pi pi-tag text-xs"></i>
              <span>{t("type.ad")}</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="pi pi-eye text-xs"></i>
              <span>{event.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="pi pi-file text-xs"></i>
              <span>{event.comments}</span>
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
      </div>
    </div>
  );
}
