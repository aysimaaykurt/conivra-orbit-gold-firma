"use client";

import React from "react";
 import EventCalendarSection from "./EventCalendarSection";
import { mockAdEvents } from "@/src/mocks/adManagement";
 
export default function CalendarGrid() {
  return (
    <div className="mt-6 space-y-4">
      {mockAdEvents.map((event) => (
        <EventCalendarSection key={event.id} event={event} />
      ))}
    </div>
  );
}
