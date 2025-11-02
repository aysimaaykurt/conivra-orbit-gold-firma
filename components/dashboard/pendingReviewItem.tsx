"use client";

import { PendingReviewItem } from "@/src/mocks/dashboard";

 
interface PendingReviewItemProps {
  item: PendingReviewItem;
}

export default function PendingReviewItemComponent({ item }: PendingReviewItemProps) {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm flex items-start gap-3 relative border border-gray-100">
      {/* Star Icon - Top Right */}
      <i 
        className="pi pi-star-fill text-sm absolute top-3 right-3"
        style={{ color: "#FFD700" }}
      ></i>

      {/* Left: Avatar Placeholder */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
          {/* Avatar placeholder */}
        </div>
      </div>

      {/* Middle: Content */}
      <div className="flex-1 min-w-0 pr-20">
        <h4 className="text-base font-bold text-dark mb-1">{item.reviewerName}</h4>
        <p className="text-sm text-lightGray mb-2">{item.reviewerRole}</p>
        <p className="text-xs text-dark">{item.serviceDescription}</p>
      </div>

      {/* Right: Evaluate Button */}
      <button className="absolute bottom-4 right-4 flex items-center gap-1 text-dark text-sm font-semibold hover:opacity-80 transition-opacity">
        <span>Değerlendir</span>
        <i className="pi pi-arrow-right text-xs"></i>
      </button>
    </div>
  );
}

