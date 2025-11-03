"use client";

import { TabType } from "@/src/mocks/supportRequests";
import { useTranslations } from "next-intl";
import React from "react";
 
interface SupportTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function SupportTabs({ activeTab, onTabChange }: SupportTabsProps) {
  const t = useTranslations("supportRequests.tabs");
  
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onTabChange("taleplerim")}
        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          activeTab === "taleplerim"
            ? "text-white"
            : "text-primary"
        }`}
        style={{
          backgroundColor: activeTab === "taleplerim" ? "#4C226A" : "#E8DAF5",
        }}
      >
        {t("taleplerim")}
      </button>
      <button
        onClick={() => onTabChange("desteklerim")}
        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          activeTab === "desteklerim"
            ? "text-white"
            : "text-primary"
        }`}
        style={{
          backgroundColor: activeTab === "desteklerim" ? "#4C226A" : "#E8DAF5",
        }}
      >
        {t("desteklerim")}
      </button>
    </div>
  );
}

