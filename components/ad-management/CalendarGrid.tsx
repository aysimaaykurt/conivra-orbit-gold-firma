"use client";

import React from "react";
import EventCalendarSection from "./EventCalendarSection";
import { AdEvent } from "@/src/mocks/adManagement";

interface CalendarGridProps {
  events: AdEvent[];
}

export default function CalendarGrid({ events }: CalendarGridProps) {
  return (
    <div className="mt-6 space-y-4">
      {events.map((event) => (
        <EventCalendarSection key={event.id} event={event} />
      ))}
    </div>
  );
}
