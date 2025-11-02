"use client";

import { useState } from "react";
import Tabs from "@/components/ad-management/Tabs";
import Toolbar from "@/components/ad-management/Toolbar";
import CalendarGrid from "@/components/ad-management/CalendarGrid";

export default function AdManagementPage() {
  const [active, setActive] = useState("ilan");

  return (
    <div className="p-6 bg-[#F7F6F9] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#4C226A" }}>
          İlan Listesi
        </h1>
        <Toolbar />
      </div>

      <div className="mb-4">
        <Tabs active={active} onChange={setActive} />
      </div>

      <CalendarGrid />
    </div>
  );
}

