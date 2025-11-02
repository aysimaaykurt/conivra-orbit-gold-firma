"use client";

import { RequestStatus } from "@/src/mocks/supportRequests";
import React from "react";
 
interface StatusBadgeProps {
  status: RequestStatus;
}

const statusConfig: Record<RequestStatus, { label: string; bgColor: string }> = {
  çözüldü: {
    label: "Çözüldü",
    bgColor: "#10B981", // light green
  },
  beklemede: {
    label: "Beklemede",
    bgColor: "#F59E0B", // amber
  },
  işlemde: {
    label: "İşlemde",
    bgColor: "#3B82F6", // blue
  },
  iptal: {
    label: "İptal",
    bgColor: "#EF4444", // red
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: config.bgColor }}
    >
      {config.label}
    </span>
  );
}

