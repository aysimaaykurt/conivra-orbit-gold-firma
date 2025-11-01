export type AdCategory = "ilan" | "workshop" | "hediye_kiti";

export interface AdEvent {
  id: string;
  category: AdCategory;
  title: string;
  city: string;
  formattedDate: string; // DD.MM.YYYY format
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  coverImageUrl?: string;
  type: string; // "Reklam" gibi
  views: number;
  comments: number;
  month: string; // "Eylül", "Ekim" gibi - Calendar section'ında gösterilecek ay
  dayOfWeek: string; // "Pazartesi", "Salı" gibi
  dayNumber: number; // 7, 8, 9 gibi - Event'in gösterileceği gün
  timeSlots: string[]; // ["09:00", "10:00"] gibi
  calendarRange: {
    // Bu event için gösterilecek takvim aralığı
    startDay: number; // 7
    endDay: number; // 13
    highlightedDay?: number; // Vurgulanacak gün (event'in olduğu gün)
  };
}

export const mockAdEvents: AdEvent[] = [
  {
    id: "evt-1",
    category: "ilan",
    title: "Soiree Menü Tanıtım",
    city: "İzmir",
    formattedDate: "25.08.2025",
    startTime: "09:00",
    endTime: "10:00",
    coverImageUrl: "/images/sample-1.jpg",
    type: "Reklam",
    views: 265,
    comments: 98,
    month: "Eylül",
    dayOfWeek: "Salı",
    dayNumber: 8,
    timeSlots: ["09:00", "10:00"],
    calendarRange: {
      startDay: 7,
      endDay: 13,
      highlightedDay: 8,
    },
  },
  {
    id: "evt-2",
    category: "ilan",
    title: "Soiree Menü Tanıtım",
    city: "İzmir",
    formattedDate: "25.08.2025",
    startTime: "09:00",
    endTime: "10:00",
    coverImageUrl: "/images/sample-1.jpg",
    type: "Reklam",
    views: 265,
    comments: 98,
    month: "Eylül",
    dayOfWeek: "Cumartesi",
    dayNumber: 12,
    timeSlots: ["09:00", "10:00"],
    calendarRange: {
      startDay: 7,
      endDay: 13,
      highlightedDay: 12,
    },
  },
  {
    id: "evt-3",
    category: "ilan",
    title: "Soiree Menü Tanıtım",
    city: "İzmir",
    formattedDate: "25.08.2025",
    startTime: "09:00",
    endTime: "10:00",
    coverImageUrl: "/images/sample-1.jpg",
    type: "Reklam",
    views: 265,
    comments: 98,
    month: "Ekim",
    dayOfWeek: "Çarşamba",
    dayNumber: 9,
    timeSlots: ["09:00", "10:00"],
    calendarRange: {
      startDay: 7,
      endDay: 13,
      highlightedDay: 9,
    },
  },
];
