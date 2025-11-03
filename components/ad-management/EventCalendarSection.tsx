"use client";

import React from "react";
import { useTranslations } from "next-intl";
import EventCard from "./EventCard";
import { AdEvent } from "@/src/mocks/adManagement";

interface EventCalendarSectionProps {
  event: AdEvent;
}

export default function EventCalendarSection({ event }: EventCalendarSectionProps) {
  const t = useTranslations("adManagement");
  const { calendarRange, month } = event;
  
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

  const dayNames = [
    t("daysOfWeek.pazartesi"),
    t("daysOfWeek.salı"),
    t("daysOfWeek.çarşamba"),
    t("daysOfWeek.perşembe"),
    t("daysOfWeek.cuma"),
    t("daysOfWeek.cumartesi"),
    t("daysOfWeek.pazar"),
  ];
  
  // Get translated month
  const translatedMonth = t(`months.${getMonthKey(month)}`);
  const timeSlots = ["09:00", "10:00"];

  // Generate day headers based on range
  // Assuming startDay (7) = Pazartesi (index 0)
  const weekDays = Array.from(
    { length: calendarRange.endDay - calendarRange.startDay + 1 },
    (_, i) => {
      const dayNumber = calendarRange.startDay + i;
      const dayIndex = (dayNumber - calendarRange.startDay) % 7;
      return {
        key: `day-${dayNumber}`,
        labelTop: dayNumber.toString().padStart(2, "0"),
        day: dayNames[dayIndex],
        dayNumber,
      };
    }
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
      {/* Month Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-dark">{translatedMonth}</h3>
      </div>

      {/* Calendar Grid */}
      <div>
        {/* Header Row - Days */}
        <div className="grid grid-cols-[120px_repeat(7,1fr)] border-b-2 border-gray-300">
          {/* Empty corner */}
          <div className="p-4 border-r border-gray-200 bg-gray-50"></div>
          {/* Day headers */}
          {weekDays.map((d) => (
            <div
              key={d.key}
              className={`p-4 border-r border-gray-200 last:border-r-0 text-center ${
                d.dayNumber === calendarRange.highlightedDay
                  ? "border-b-4 border-b-primary"
                  : "border-b border-gray-200"
              }`}
            >
              <div
                className={`font-bold ${
                  d.dayNumber === calendarRange.highlightedDay ? "text-primary" : "text-primary"
                }`}
              >
                {d.labelTop}
              </div>
              <div className="text-sm text-dark">{d.day}</div>
            </div>
          ))}
        </div>

        {/* Calendar Rows - Time Slots */}
        {timeSlots.map((timeSlot, timeIndex) => (
          <div
            key={timeSlot}
            className="grid grid-cols-[120px_repeat(7,1fr)] border-b border-gray-200 last:border-b-0"
          >
            {/* Left side: Time slot */}
            <div className="p-4 border-r border-gray-200 bg-gray-50">
              <div className="text-sm text-lightGray">{timeSlot}</div>
            </div>

            {/* Day columns */}
            {weekDays.map((d) => {
              const hasEvent =
                d.dayNumber === event.dayNumber && timeSlot === event.startTime;
              const isHighlightedDay = d.dayNumber === calendarRange.highlightedDay;

              return (
                <div
                  key={d.key}
                  className={`p-2 border-r border-gray-200 last:border-r-0 min-h-[120px] relative ${
                    isHighlightedDay ? "border-l-4 border-l-primary" : ""
                  }`}
                >
                  {hasEvent && <EventCard event={event} />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

