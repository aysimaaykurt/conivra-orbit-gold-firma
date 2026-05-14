"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/src/navigation";
import { getApplications } from "@/src/api/applications/applications.service";
import type { ApplicationListItem } from "@/src/api/applications/applications.models";
import PendingReviewItemComponent from "./pendingReviewItem";

export default function PendingReviewList() {
  const t = useTranslations("dashboard.pendingReviews");
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Son 4 başvuruyu çek (page: 1, pageSize: 4)
        const response = await getApplications(1, 4);
        if (response.success && response.data) {
          setApplications(response.data);
        } else {
          setError("Veriler yüklenemedi");
        }
      } catch (error: any) {
        console.error("Pending reviews yüklenirken hata:", error);
        setError(error.message || "Veriler yüklenirken bir hata oluştu");
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingReviews();
  }, []);

  const handleEvaluate = () => {
    router.push("/applications");
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 h-full">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-dark mb-2">{t("title")}</h2>
          <p className="text-sm text-lightGray">{t("subtitle")}</p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg p-3 shadow-sm flex items-start gap-3 relative border border-gray-100 animate-pulse">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="flex-1 min-w-0 pr-20">
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-dark mb-2">{t("title")}</h2>
        <p className="text-sm text-lightGray">{t("subtitle")}</p>
      </div>
      {error ? (
        <p className="text-sm text-lightGray text-center py-4">
          {error}
        </p>
      ) : applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((application) => (
            <PendingReviewItemComponent 
              key={application.id} 
              application={application}
              onEvaluate={handleEvaluate}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-lightGray text-center py-4">
          {t("noItems") || "Henüz bekleyen değerlendirme bulunmamaktadır."}
        </p>
      )}
    </div>
  );
}

