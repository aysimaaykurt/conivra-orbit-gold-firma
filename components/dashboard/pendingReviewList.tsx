"use client";

import { pendingReviews } from "@/src/mocks/dashboard";
import PendingReviewItemComponent from "./pendingReviewItem";

export default function PendingReviewList() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-dark mb-2">Bekleyen Değerlendirmeler</h2>
        <p className="text-sm text-lightGray">Aldığınız hizmeti değerlendirin</p>
      </div>
      <div className="space-y-3">
        {pendingReviews.map((item) => (
          <PendingReviewItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

