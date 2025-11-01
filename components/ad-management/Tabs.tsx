"use client";

import React from "react";

export type TabsProps = {
  active: string;
  onChange?: (key: string) => void;
  tabs?: { key: string; label: string }[];
};

const defaultTabs = [
  { key: "ilan", label: "İlanlar" },
  { key: "workshop", label: "Workshoplar" },
  { key: "hediye_kiti", label: "Hediye Kitleri" },
];

export default function Tabs({ active, onChange, tabs = defaultTabs }: TabsProps) {
  return (
    <div className="flex gap-2">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange?.(t.key)}
            className={`px-5 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-dark hover:bg-gray-50"
            }`}
            style={
              isActive
                ? {
                    background:
                      "linear-gradient(180deg, #4C226A 0%, rgba(76, 34, 106, 0.8) 100%)",
                  }
                : {}
            }
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
