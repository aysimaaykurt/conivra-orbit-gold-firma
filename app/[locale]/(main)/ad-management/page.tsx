"use client";

import { useState, useEffect } from "react";
import Tabs from "@/components/ad-management/Tabs";
import Toolbar from "@/components/ad-management/Toolbar";
import CalendarGrid from "@/components/ad-management/CalendarGrid";
import EventCard from "@/components/ad-management/EventCard";
import { getAdvertisements, deleteAdvertisement } from "@/src/api/advertisements/advertisements.service";
import { getWorkshops, deleteWorkshop } from "@/src/api/advertisements/workshops.service";
import { getGiftKits, deleteGiftKit } from "@/src/api/advertisements/giftKits.service";
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
  const { data: rawData, isLoading, error, refetch } = useAdManagement(active, filters);
  const [events, setEvents] = useState<AdEvent[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; category: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        startDateIso: startDate.toISOString(),
        endDateIso: endDate.toISOString(),
        coverImageUrl: (item as any).images && (item as any).images.length > 0  
          ? ((item as any).images.find((img: any) => img.isMain)?.imageUrl || (item as any).images[0].imageUrl) 
          : "/images/soiree.png",
        images: (item as any).images || [],
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
    } catch (err) {
      console.error("Error converting to AdEvent:", err);
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

  const handleEdit = (id: string, cat: string) => {
    // Navigate to the correct form page with editId query parameter
    let route = `/${locale}/ad-management/add?editId=${id}`;
    if (cat === "workshop") {
      route = `/${locale}/ad-management/workshop/add?editId=${id}`;
    } else if (cat === "hediye_kiti") {
      route = `/${locale}/ad-management/gift-kit/add?editId=${id}`;
    }
    router.push(route);
  };

  const handleDeleteClick = (id: string, cat: string) => {
    setDeleteModal({ isOpen: true, id, category: cat });
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    setIsDeleting(true);
    try {
      if (deleteModal.category === "ilan") {
        await deleteAdvertisement(deleteModal.id);
      } else if (deleteModal.category === "workshop") {
        await deleteWorkshop(deleteModal.id);
      } else if (deleteModal.category === "hediye_kiti") {
        await deleteGiftKit(deleteModal.id);
      }
      
      setEvents((prev) => prev.filter((e) => e.id !== deleteModal.id));
      setDeleteModal(null);
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Silinirken bir hata oluştu.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 bg-[#F7F6F9] min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold mt-2" style={{ color: "#4C226A" }}>
          İlan Listesi
        </h1>
        <div className="w-full lg:w-auto flex-1">
          <Toolbar filters={filters} setFilters={setFilters} />
        </div>
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
        <div className="mt-8 bg-red-50/50 rounded-2xl p-12 shadow-sm border border-red-100 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <i className="pi pi-exclamation-triangle text-3xl text-red-500"></i>
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-2">
            Bir Hata Oluştu
          </h3>
          <p className="text-red-600 max-w-sm mx-auto mb-6">
            {error}
          </p>
          <button 
            onClick={() => refetch()}
            className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 border border-red-200 font-medium rounded-xl hover:bg-red-50 transition-all shadow-sm"
          >
            <i className="pi pi-refresh"></i>
            <span>Tekrar Dene</span>
          </button>
        </div>
      ) : events.length === 0 ? (
        <div className="mt-8 bg-white rounded-2xl p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
            <i className={`pi ${active === "ilan" ? "pi-megaphone" : active === "workshop" ? "pi-users" : "pi-gift"} text-3xl text-primary`}></i>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Kayıt Bulunamadı
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">
            Henüz herhangi bir {active === "ilan" ? "ilan" : active === "workshop" ? "workshop" : "hediye kiti"} oluşturmamışsınız. Yeni bir tane oluşturarak başlayabilirsiniz.
          </p>
          <button 
            onClick={() => {
              if (active === "workshop") router.push(`/${locale}/ad-management/workshop/add`);
              else if (active === "hediye_kiti") router.push(`/${locale}/ad-management/gift-kit/add`);
              else router.push(`/${locale}/ad-management/add`);
            }}
            className="flex items-center gap-2 px-6 py-3 text-white font-medium rounded-xl hover:opacity-90 transition-all shadow-md"
            style={{ backgroundColor: "#4C226A" }}
          >
            <i className="pi pi-plus"></i>
            <span>Yeni {active === "ilan" ? "İlan" : active === "workshop" ? "Workshop" : "Hediye Kiti"} Oluştur</span>
          </button>
        </div>
      ) : active === "hediye_kiti" ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <CalendarGrid events={events} onEdit={handleEdit} onDelete={handleDeleteClick} />
      )}
      {/* Delete Modal */}
      {deleteModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl transform transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <i className="pi pi-exclamation-triangle text-red-500 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Silmek İstediğinize Emin Misiniz?</h3>
              <p className="text-gray-500 mb-6">
                Bu kaydı silmek üzeresiniz. Bu işlem geri alınamaz. Onaylıyor musunuz?
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  İptal Et
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? <i className="pi pi-spinner pi-spin"></i> : <i className="pi pi-trash"></i>}
                  {isDeleting ? "Siliniyor..." : "Evet, Sil"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

