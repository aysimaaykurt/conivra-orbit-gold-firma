"use client";

import type { ApplicationListItem } from "@/src/api/applications/applications.models";
import { useTranslations } from "next-intl";
import { adTypeTabs } from "@/src/mocks/applications";

interface PendingReviewItemProps {
  application: ApplicationListItem;
  onEvaluate: () => void;
}

export default function PendingReviewItemComponent({ application, onEvaluate }: PendingReviewItemProps) {
  const t = useTranslations("dashboard.pendingReviews");
  
  // AdType'a göre label bul
  const adTypeLabel = adTypeTabs.find(tab => tab.id === application.adType)?.label || application.adType;
  
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm flex items-start gap-3 relative border border-gray-100">
      {/* Star Icon - Top Right */}
      <i 
        className="pi pi-star-fill text-sm absolute top-3 right-3"
        style={{ color: "#FFD700" }}
      ></i>

      {/* Left: Avatar */}
      <div className="flex-shrink-0">
        {application.profileImageSrc ? (
          <img 
            src={application.profileImageSrc} 
            alt={application.fullName}
            className="w-16 h-16 rounded-lg object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <i className="pi pi-user text-2xl text-gray-400"></i>
          </div>
        )}
      </div>

      {/* Middle: Content */}
      <div className="flex-1 min-w-0 pr-20">
        <h4 className="text-base font-bold text-dark mb-1">{application.fullName}</h4>
        <p className="text-sm text-lightGray mb-2">{application.location}</p>
        <p className="text-xs text-dark">{adTypeLabel}</p>
      </div>

      {/* Right: Evaluate Button */}
      <button 
        onClick={onEvaluate}
        className="absolute bottom-4 right-4 flex items-center gap-1 text-dark text-sm font-semibold hover:opacity-80 transition-opacity"
      >
        <span>{t("evaluate")}</span>
        <i className="pi pi-arrow-right text-xs"></i>
      </button>
    </div>
  );
}

