"use client";

import { useState, useEffect } from "react";
import Tabs from "@/components/ad-management/Tabs";
import Toolbar from "@/components/ad-management/Toolbar";
import CalendarGrid from "@/components/ad-management/CalendarGrid";
import EventCard from "@/components/ad-management/EventCard";
import { getAdvertisements } from "@/src/api/advertisements/advertisements.service";
import { getWorkshops } from "@/src/api/advertisements/workshops.service";
import { getGiftKits } from "@/src/api/advertisements/giftKits.service";
import type { Advertisement } from "@/src/api/advertisements/advertisements.models";
import type { Workshop } from "@/src/api/advertisements/workshops.models";
import type { GiftKit } from "@/src/api/advertisements/giftKits.models";
import { AdEvent, AdCategory } from "@/src/mocks/adManagement";
import { useAdManagement } from "@/src/hooks/useAdManagement";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function AdManagementPage() {
  const router = useRouter();
  const locale = useLocale();
  const [active, setActive] = useState<AdCategory>("ilan");
  const [filters, setFilters] = useState<Record<string, any>>({
    page: 1,
    pageSize: 10,
    searchTerm: "",
    sortBy: "createDate",
    sortOrder: "desc"
  });
  const { data: rawData, isLoading, error } = useAdManagement(active, filters);
  const [events, setEvents] = useState<AdEvent[]>([]);

  // Helper function to convert API data to AdEvent format
  const convertToAdEvent = (
    item: Advertisement | Workshop | GiftKit,
    category: AdCategory
  ): AdEvent | null => {
    try {
      // Parse dates
      let startDate: Date;
      let endDate: Date;

      if ("startDate" in item && "endDate" in item) {
        // Advertisement or Workshop
        startDate = new Date(item.startDate as string);
        endDate = new Date(item.endDate as string);
      } else if (category === "hediye_kiti") {
        // GiftKit - try createDate or fallback to current date
        const anyItem = item as any;
        const kitDate = anyItem.createDate || anyItem.createdAt || new Date().toISOString();
        startDate = new Date(kitDate);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
      } else {
        return null;
      }

      // Format date as DD.MM.YYYY
      const formattedDate = `${String(startDate.getDate()).padStart(2, "0")}.${String(startDate.getMonth() + 1).padStart(2, "0")}.${startDate.getFullYear()}`;

      // Extract time from startDate
      const startTime = `${String(startDate.getHours()).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}`;
      const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;

      // Get month name in Turkish
      const monthNames = [
        "Ocak",
        "Şubat",
        "Mart",
        "Nisan",
        "Mayıs",
        "Haziran",
        "Temmuz",
        "Ağustos",
        "Eylül",
        "Ekim",
        "Kasım",
        "Aralık",
      ];
      const month = monthNames[startDate.getMonth()];

      // Get day of week in Turkish
      const dayNames = [
        "Pazar",
        "Pazartesi",
        "Salı",
        "Çarşamba",
        "Perşembe",
        "Cuma",
        "Cumartesi",
      ];
      const dayOfWeek = dayNames[startDate.getDay()];
      const dayNumber = startDate.getDate();

      // Calculate calendar range (week containing the event)
      const startOfWeek = new Date(startDate);
      const dayOfWeekIndex = startDate.getDay() || 7; // Convert 0 (Sunday) to 7
      startOfWeek.setDate(startDate.getDate() - dayOfWeekIndex + 1); // Monday

      // Generate time slots
      const timeSlots = [startTime, endTime];

      return {
        id: item.id,
        category,
        title: item.title,
        city: "city" in item ? item.city : "",
        formattedDate,
        startTime,
        endTime,
        coverImageUrl: item.imageUrl || "/images/sample-1.jpg",
        type: category === "ilan" ? "Reklam" : category === "workshop" ? "Workshop" : "Hediye Kiti",
        views: 0, // API'den gelmiyorsa varsayılan değer
        comments: 0, // API'den gelmiyorsa varsayılan değer
        subCategory: (item as any).category || "",
        platform: (item as any).platformPreference || "",
        targetAudience: (item as any).targetAudience || "",
        month,
        dayOfWeek,
        dayNumber,
        timeSlots,
        calendarRange: {
          startOfWeekIso: startOfWeek.toISOString(),
          highlightedDay: dayNumber,
        },
      };
    } catch (error) {
      console.error("Error converting to AdEvent:", error);
      return null;
    }
  };

  useEffect(() => {
    if (rawData) {
      // Backend sometimes wraps arrays in objects or pagination data
      const dataArray = Array.isArray(rawData) ? rawData : (rawData as any).items || (rawData as any).data || [];

      if (Array.isArray(dataArray)) {
        const parsedEvents = dataArray
          .map((item) => convertToAdEvent(item, active))
          .filter((evt): evt is AdEvent => evt !== null);
        setEvents(parsedEvents);
      } else {
        console.error('Expected an array but got:', rawData);
      }
    }
  }, [rawData, active]);

  const handleEdit = (id: string, category: string) => {
    // Navigate to the correct form page with editId query parameter
    let route = `/${locale}/ad-management/add?editId=${id}`;
    if (category === "workshop") {
      route = `/${locale}/ad-management/workshop/add?editId=${id}`;
    } else if (category === "hediye_kiti") {
      route = `/${locale}/ad-management/gift-kit/add?editId=${id}`;
    }
    router.push(route);
  };

  const handleDelete = async (id: string, category: string) => {
    if (window.confirm("Bu kaydı silmek istediğinize emin misiniz? (Pasif duruma çekilecektir)")) {
      try {
        // TODO: Backend DELETE veya status inactive PUT isteği atılacak
        // Geçici olarak listeden siliyoruz
        setEvents((prev) => prev.filter((e) => e.id !== id));
        alert("Kayıt başarıyla silindi (pasif yapıldı). Lütfen backend DELETE/PUT endpoint'i gelince gerçek bağlamayı yapın.");
      } catch (error) {
        console.error("Silme hatası:", error);
        alert("Silinirken bir hata oluştu.");
      }
    }
  };

  return (
    <div className="p-6 bg-[#F7F6F9] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#4C226A" }}>
          İlan Listesi
        </h1>
        <Toolbar filters={filters} setFilters={setFilters} />
      </div>

      <div className="mb-4">
        <Tabs active={active} onChange={(key) => setActive(key as AdCategory)} />
      </div>

      {isLoading ? (
        <div className="mt-6 space-y-4">
          <div className="bg-white rounded-lg p-6 animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : error ? (
        <div className="mt-6 bg-white rounded-lg p-6">
          <p className="text-sm text-lightGray text-center py-4">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="mt-6 bg-white rounded-lg p-6">
          <p className="text-sm text-lightGray text-center py-4">
            Henüz {active === "ilan" ? "ilan" : active === "workshop" ? "workshop" : "hediye kiti"} bulunmamaktadır.
          </p>
        </div>
      ) : active === "hediye_kiti" ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <CalendarGrid events={events} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}

