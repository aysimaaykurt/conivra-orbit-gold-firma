"use client";

import React from "react";
import EventCalendarSection from "./EventCalendarSection";
import { AdEvent } from "@/src/mocks/adManagement";

interface CalendarGridProps {
  events: AdEvent[];
  onEdit?: (id: string, category: string) => void;
  onDelete?: (id: string, category: string) => void;
  onPause?: (id: string, category: string) => void;
  onDuplicate?: (id: string, category: string) => void;
}

export default function CalendarGrid({ events, onEdit, onDelete, onPause, onDuplicate }: CalendarGridProps) {
  return (
    <div className="mt-6 space-y-4">
      {events.map((event) => (
        <EventCalendarSection 
          key={event.id} 
          event={event} 
          onEdit={onEdit}
          onDelete={onDelete}
          onPause={onPause}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
}
