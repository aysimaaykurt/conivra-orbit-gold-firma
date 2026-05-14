"use client";

import { useState, useEffect } from "react";
import Tabs from "@/components/ad-management/Tabs";
import Toolbar from "@/components/ad-management/Toolbar";
import CalendarGrid from "@/components/ad-management/CalendarGrid";
import { getAdvertisements } from "@/src/api/advertisements/advertisements.service";
import { getWorkshops } from "@/src/api/advertisements/workshops.service";
import { getGiftKits } from "@/src/api/advertisements/giftKits.service";
import type { Advertisement } from "@/src/api/advertisements/advertisements.models";
import type { Workshop } from "@/src/api/advertisements/workshops.models";
import type { GiftKit } from "@/src/api/advertisements/giftKits.models";
import { AdEvent, AdCategory } from "@/src/mocks/adManagement";

export default function AdManagementPage() {
  const [active, setActive] = useState<AdCategory>("ilan");
  const [events, setEvents] = useState<AdEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        startDate = new Date(item.startDate);
        endDate = new Date(item.endDate);
      } else if ("createDate" in item) {
        // GiftKit - use createDate as startDate, and add 1 day for endDate
        startDate = new Date(item.createDate);
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
      startOfWeek.setDate(startDate.getDate() - startDate.getDay() + 1); // Monday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

      const startDay = startOfWeek.getDate();
      const endDay = endOfWeek.getDate();

      // Generate time slots (simplified - you may want to calculate based on start/end times)
      const timeSlots = [startTime, endTime];

      return {
        id: item.id,
        category,
        title: item.title,
        city: "city" in item ? item.city : "",
        formattedDate,
        startTime,
        endTime,
        coverImageUrl: item.imageUrl,
        type: category === "ilan" ? "Reklam" : category === "workshop" ? "Workshop" : "Hediye Kiti",
        views: 0, // API'den gelmiyorsa varsayılan değer
        comments: 0, // API'den gelmiyorsa varsayılan değer
        month,
        dayOfWeek,
        dayNumber,
        timeSlots,
        calendarRange: {
          startDay,
          endDay,
          highlightedDay: dayNumber,
        },
      };
    } catch (error) {
      console.error("Error converting to AdEvent:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let response;
        let category: AdCategory;

        switch (active) {
          case "ilan":
            response = await getAdvertisements();
            if (response.success && response.data) {
              const adEvents = response.data
                .map((item) => convertToAdEvent(item, "ilan"))
                .filter((event): event is AdEvent => event !== null);
              setEvents(adEvents);
            }
            break;
          case "workshop":
            response = await getWorkshops();
            if (response.success && response.data) {
              const adEvents = response.data
                .map((item) => convertToAdEvent(item, "workshop"))
                .filter((event): event is AdEvent => event !== null);
              setEvents(adEvents);
            }
            break;
          case "hediye_kiti":
            response = await getGiftKits();
            if (response.success && response.data) {
              const adEvents = response.data
                .map((item) => convertToAdEvent(item, "hediye_kiti"))
                .filter((event): event is AdEvent => event !== null);
              setEvents(adEvents);
            }
            break;
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Veriler yüklenirken bir hata oluştu");
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [active]);

  return (
    <div className="p-6 bg-[#F7F6F9] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#4C226A" }}>
          İlan Listesi
        </h1>
        <Toolbar />
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
      ) : (
        <CalendarGrid events={events} />
      )}
    </div>
  );
}

