"use client";

import { pendingReviews } from "@/src/mocks/dashboard";
import { useTranslations } from "next-intl";
import PendingReviewItemComponent from "./pendingReviewItem";

export default function PendingReviewList() {
  const t = useTranslations("dashboard.pendingReviews");
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-dark mb-2">{t("title")}</h2>
        <p className="text-sm text-lightGray">{t("subtitle")}</p>
      </div>
      <div className="space-y-3">
        {pendingReviews.map((item) => (
          <PendingReviewItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

