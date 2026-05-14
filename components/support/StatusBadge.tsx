"use client";

import { RequestStatus } from "@/src/api/company/request/requestStatus.enum";
import { SupportStatus } from "@/src/api/company/support/supportStatus.enum";
import { useTranslations } from "next-intl";
import React from "react";
 
interface StatusBadgeProps {
  status: RequestStatus | SupportStatus;
  type?: "request" | "support";
}

const requestStatusColors: Record<RequestStatus, string> = {
  [RequestStatus.RESOLVED]: "#10B981", // light green
  [RequestStatus.PENDING]: "#F59E0B", // amber
  [RequestStatus.IN_PROGRESS]: "#3B82F6", // blue
  [RequestStatus.CANCELLED]: "#EF4444", // red
};

const supportStatusColors: Record<SupportStatus, string> = {
  [SupportStatus.RESOLVED]: "#10B981", // light green
  [SupportStatus.PENDING]: "#F59E0B", // amber
  [SupportStatus.IN_PROGRESS]: "#3B82F6", // blue
  [SupportStatus.ANSWERED]: "#8B5CF6", // purple
  [SupportStatus.CANCELLED]: "#EF4444", // red
};

export default function StatusBadge({ status, type = "request" }: StatusBadgeProps) {
  const t = useTranslations("supportRequests.status");
  const bgColor = type === "request" 
    ? requestStatusColors[status as RequestStatus]
    : supportStatusColors[status as SupportStatus];
  
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

