"use client";

import { RequestStatus } from "@/src/api/company/request/requestStatus.enum";
import { SupportStatus } from "@/src/api/company/support/supportStatus.enum";
import { useTranslations } from "next-intl";
import React from "react";
 
interface StatusBadgeProps {
  status: RequestStatus | SupportStatus | number;
  type?: "request" | "support";
  isEdited?: boolean;
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

const requestStatusMap: Record<number, RequestStatus> = {
  1: RequestStatus.PENDING,
  2: RequestStatus.IN_PROGRESS,
  3: RequestStatus.RESOLVED,
  4: RequestStatus.CANCELLED,
};

const supportStatusMap: Record<number, SupportStatus> = {
  1: SupportStatus.PENDING,
  2: SupportStatus.IN_PROGRESS,
  3: SupportStatus.ANSWERED,
  4: SupportStatus.RESOLVED,
  5: SupportStatus.CANCELLED,
};

export default function StatusBadge({ status, type = "request", isEdited }: StatusBadgeProps) {
  const t = useTranslations("supportRequests.status");

  let normalizedStatus = status as string;
  if (typeof status === 'number') {
    normalizedStatus = type === 'request'
      ? requestStatusMap[status] || RequestStatus.PENDING
      : supportStatusMap[status] || SupportStatus.PENDING;
  }

  const bgColor = type === "request" 
    ? requestStatusColors[normalizedStatus as RequestStatus]
    : supportStatusColors[normalizedStatus as SupportStatus];
  
  const label = t(normalizedStatus);

  return (
    <div className="flex items-center gap-2">
      <span
        className="px-3 py-1 rounded-full text-xs font-medium text-white"
        style={{ backgroundColor: bgColor || "#9CA3AF" }}
      >
        {label || normalizedStatus}
      </span>
      {isEdited && (
        <span className="px-3 py-1 rounded-full text-xs font-medium text-white bg-blue-500">
          Düzenlendi
        </span>
      )}
    </div>
  );
}

