"use client";

import React from "react";
import { useTranslations } from "next-intl";
import EventCard from "./EventCard";
import { AdEvent } from "@/src/mocks/adManagement";

interface EventCalendarSectionProps {
  event: AdEvent;
  onEdit?: (id: string, category: string) => void;
  onDelete?: (id: string, category: string) => void;
}

export default function EventCalendarSection({ event, onEdit, onDelete }: EventCalendarSectionProps) {
  const t = useTranslations("adManagement");
  
  const getMonthKey = (monthIndex: number) => {
    const keys = ["ocak", "şubat", "mart", "nisan", "mayıs", "haziran", "temmuz", "ağustos", "eylül", "ekim", "kasım", "aralık"];
    return keys[monthIndex];
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

  // Calculate actual event dates
  const eventStartDate = event.startDateIso ? new Date(event.startDateIso) : new Date();
  eventStartDate.setHours(0, 0, 0, 0);

  const eventEndDate = event.endDateIso ? new Date(event.endDateIso) : new Date(eventStartDate);
  eventEndDate.setHours(0, 0, 0, 0);

  const actualSpanCount = Math.round((eventEndDate.getTime() - eventStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  let displayStartDate = new Date(eventStartDate);
  let displayEndDate = new Date(eventEndDate);

  // If event is less than 7 days, pad days so it's centered in a 7-day grid
  if (actualSpanCount < 7) {
    const padTotal = 7 - actualSpanCount;
    const padBefore = Math.floor(padTotal / 2); // 3 güne kadar olanlarda günleri ortaya almak için
    
    displayStartDate.setDate(eventStartDate.getDate() - padBefore);
    displayEndDate = new Date(displayStartDate);
    displayEndDate.setDate(displayStartDate.getDate() + 6);
  }

  // Generate days from displayStartDate to displayEndDate
  const totalDays = Math.round((displayEndDate.getTime() - displayStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const safeTotalDays = Math.max(7, Math.min(totalDays, 60)); // min 7 days
  
  const weekDays = Array.from({ length: safeTotalDays }, (_, i) => {
    const currentDay = new Date(displayStartDate);
    currentDay.setDate(displayStartDate.getDate() + i);
    currentDay.setHours(0, 0, 0, 0);
    
    // getDay() returns 0 for Sunday, 1 for Monday. Map to 0-6 array.
    const dayIndex = currentDay.getDay() === 0 ? 6 : currentDay.getDay() - 1;

    return {
      dateObj: currentDay,
      dateString: currentDay.toISOString().split("T")[0],
      dayNumber: currentDay.getDate(),
      monthIndex: currentDay.getMonth(),
      year: currentDay.getFullYear(),
      dayName: dayNames[dayIndex],
    };
  });

  const startIndex = Math.round((eventStartDate.getTime() - displayStartDate.getTime()) / (1000 * 60 * 60 * 24));
  const spanCount = Math.round((eventEndDate.getTime() - eventStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Calculate month title
  const startMonth = t(`months.${getMonthKey(weekDays[0].monthIndex)}`);
  const endMonth = t(`months.${getMonthKey(weekDays[weekDays.length - 1].monthIndex)}`);
  const year = weekDays[0].year;
  const monthTitle = startMonth === endMonth ? `${startMonth} ${year}` : `${startMonth} - ${endMonth} ${year}`;

  const timeSlot = event.startTime || "00:00";

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
      {/* Month Header */}
      <div className="p-3 border-b border-gray-200 bg-gray-50/50">
        <h3 className="text-lg font-bold text-dark">{monthTitle}</h3>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${Math.max(100, safeTotalDays * 120)}px` }}>
          {/* Header Row - Days */}
          <div 
            className="grid border-b border-gray-300"
            style={{ gridTemplateColumns: `repeat(${safeTotalDays}, minmax(0, 1fr))` }}
          >
            {/* Day headers */}
            {weekDays.map((d) => {
              const isHighlight = d.dateObj >= eventStartDate && d.dateObj <= eventEndDate;
              return (
                <div
                  key={d.dateString}
                  className={`p-3 border-r border-gray-200 last:border-r-0 text-center ${
                    isHighlight ? "bg-[#4C226A]/5" : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className={`text-xl font-bold leading-none mb-1 ${isHighlight ? "text-[#4C226A]" : "text-gray-700"}`}>
                      {d.dayNumber.toString().padStart(2, "0")}
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isHighlight ? "text-[#4C226A]" : "text-gray-400"}`}>
                      {d.dayName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendar Row */}
          <div 
            className="grid min-h-[90px]"
            style={{ gridTemplateColumns: `repeat(${safeTotalDays}, minmax(0, 1fr))` }}
          >

            {/* Background Day columns */}
            {weekDays.map((d, i) => {
              return (
                <div
                  key={d.dateString}
                  className="border-r border-gray-100 last:border-r-0 bg-[#4C226A]/[0.02]"
                  style={{ gridRow: 1, gridColumn: i + 1 }}
                ></div>
              );
            })}

            {/* Overlay Event Card */}
            <div
              className="z-10 py-2 px-2 flex"
              style={{
                gridRow: 1,
                gridColumnStart: startIndex + 1,
                gridColumnEnd: startIndex + 1 + spanCount,
              }}
            >
              <EventCard 
                event={event} 
                onEdit={onEdit} 
                onDelete={onDelete} 
                spanCount={spanCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
