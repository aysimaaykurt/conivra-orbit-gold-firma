"use client";

import { useTranslations } from "next-intl";
import { BASE_URL } from "@/src/api/axios";

interface PendingReviewItemProps {
  application: {
    id: string;
    title: string;
    description: string;
    timeAgo: string;
    profileImageSrc?: string;
  };
  onEvaluate: () => void;
}

export default function PendingReviewItemComponent({ application, onEvaluate }: PendingReviewItemProps) {
  const t = useTranslations("dashboard.pendingReviews");

  const getProfileImageUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const cleanPath = path.replace(/\\/g, "/").replace(/^\//, "");
    try {
      const origin = new URL(BASE_URL).origin;
      return `${origin}/${cleanPath}`;
    } catch {
      return path;
    }
  };

  const profileImageUrl = getProfileImageUrl(application.profileImageSrc);
  
  return (
    <div 
      onClick={onEvaluate}
      className="bg-white rounded-lg p-3 shadow-sm flex items-start gap-3 relative border border-gray-100 cursor-pointer hover:border-primary/20 hover:shadow-md transition-all duration-200"
    >
      {/* Star Icon - Top Right */}
      <i 
        className="pi pi-star-fill text-sm absolute top-3 right-3"
        style={{ color: "#FFD700" }}
      ></i>

      {/* Left: Avatar / Placeholder */}
      <div className="flex-shrink-0">
        {profileImageUrl ? (
          <img 
            src={profileImageUrl} 
            alt={application.title}
            className="w-16 h-16 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = "none";
              // Display a fallback element on error
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const placeholder = document.createElement("div");
                placeholder.className = "w-16 h-16 bg-[#4C226A]/5 rounded-lg flex items-center justify-center";
                placeholder.innerHTML = `<i class="pi pi-user text-2xl text-[#4C226A]"></i>`;
                parent.appendChild(placeholder);
              }
            }}
          />
        ) : (
          <div className="w-16 h-16 bg-[#4C226A]/5 rounded-lg flex items-center justify-center">
            <i className="pi pi-user text-2xl text-[#4C226A]"></i>
          </div>
        )}
      </div>

      {/* Middle: Content */}
      <div className="flex-1 min-w-0 pr-16">
        <h4 className="text-base font-bold text-dark mb-1">{application.title}</h4>
        <p className="text-sm text-lightGray line-clamp-2 mb-2">{application.description}</p>
        <span className="text-[10px] text-lightGray bg-gray-100 px-2 py-0.5 rounded-full font-medium">
          {application.timeAgo}
        </span>
      </div>

      {/* Right: Evaluate Button */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[#4C226A] text-xs font-bold">
        <span>{t("evaluate") || "Değerlendir"}</span>
        <i className="pi pi-arrow-right text-[10px]"></i>
      </div>
    </div>
  );
}
