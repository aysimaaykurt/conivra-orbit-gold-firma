"use client";

import { RequestStatus } from "@/src/mocks/supportRequests";
import { useTranslations } from "next-intl";
import React from "react";
 
interface StatusBadgeProps {
  status: RequestStatus;
}

const statusColors: Record<RequestStatus, string> = {
  çözüldü: "#10B981", // light green
  beklemede: "#F59E0B", // amber
  işlemde: "#3B82F6", // blue
  iptal: "#EF4444", // red
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations("supportRequests.status");
  const bgColor = statusColors[status];
  const label = t(status);

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: bgColor }}
    >
      {label}
    </span>
  );
}

