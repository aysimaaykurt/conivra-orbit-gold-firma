"use client";

import React from "react";
import type { AdEvent } from "@/src/mocks/adManagement";
import EventCard from "./EventCard";

interface EventCalendarSectionProps {
  event: AdEvent;
}

const dayNames = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

export default function EventCalendarSection({ event }: EventCalendarSectionProps) {
  const { calendarRange, month } = event;
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
        <h3 className="text-xl font-bold text-dark">{month}</h3>
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

