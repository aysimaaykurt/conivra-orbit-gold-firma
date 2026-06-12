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
    <div className="flex w-full gap-2 overflow-hidden rounded-lg">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange?.(t.key)}
            className={`flex-1 text-[13px] sm:text-sm md:text-base py-2.5 px-2 transition-colors font-medium whitespace-nowrap ${
              isActive
                ? "bg-primary text-white shadow-md rounded-lg"
                : "bg-white text-dark hover:bg-gray-50 border border-gray-200 rounded-lg"
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
