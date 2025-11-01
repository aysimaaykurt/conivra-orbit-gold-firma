"use client";

import React from "react";
import { mockAdEvents } from "@/src/mocks/adManagement";
import EventCalendarSection from "./EventCalendarSection";

export default function CalendarGrid() {
  return (
    <div className="mt-6 space-y-4">
      {mockAdEvents.map((event) => (
        <EventCalendarSection key={event.id} event={event} />
      ))}
    </div>
  );
}
