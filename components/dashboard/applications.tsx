"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getDashboardApplications } from "@/src/api/applications/applications.service";
import type { Application } from "@/src/api/applications/applications.models";

export default function ApplicationList() {
  const t = useTranslations("dashboard.applications");
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getDashboardApplications();
        if (response.success && response.data) {
          setApplications(response.data);
        } else {
          setError("Başvurular yüklenemedi");
        }
      } catch (error: any) {
        console.error("Applications yüklenirken hata:", error);
        setError(error.message || "Başvurular yüklenirken bir hata oluştu");
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 h-full">
        <h2 className="text-lg font-bold text-dark mb-4">{t("title")}</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0 animate-pulse">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded mb-2 w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mt-1"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <h2 className="text-lg font-bold text-dark mb-4">{t("title")}</h2>
      {error ? (
        <p className="text-sm text-lightGray text-center py-4">
          {error}
        </p>
      ) : applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((application) => (
            <ApplicationItem key={application.id} application={application} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-lightGray text-center py-4">
          {t("noApplications") || "Henüz başvuru bulunmamaktadır."}
        </p>
      )}
    </div>
  );
}

function ApplicationItem({ application }: { application: Application }) {
  const t = useTranslations("dashboard.applications");
  const tTime = useTranslations("dashboard.timeAgo");
  
   const formatTimeAgo = (timeAgo: string) => {
     const minutesMatch = timeAgo.match(/(\d+)\s*dk/);
    const hoursMatch = timeAgo.match(/(\d+)\s*saat/);
    const daysMatch = timeAgo.match(/(\d+)\s*gün/);
    
    if (minutesMatch) {
      return tTime("minutesAgo", { count: parseInt(minutesMatch[1]) });
    } else if (hoursMatch) {
      return tTime("hoursAgo", { count: parseInt(hoursMatch[1]) });
    } else if (daysMatch) {
      return tTime("daysAgo", { count: parseInt(daysMatch[1]) });
    }
    // Fallback to original string if format doesn't match
    return timeAgo;
  };
  
  return (
    <div className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
      
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
          <i className="pi pi-clock text-orange-600 text-xl"></i>
        </div>
      </div>

      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-1">
          <p className="text-sm text-lightGray">
            <span className="font-medium">{application.email}</span> {t("appliedTo")}
          </p>
          <span className="text-sm text-lightGray whitespace-nowrap flex-shrink-0">
            {formatTimeAgo(application.timeAgo)}
          </span>
        </div>
        <h3 className="text-base font-bold text-dark mb-2">{application.title}</h3>
        <p className="text-sm text-lightGray line-clamp-2">{application.description}</p>
      </div>
    </div>
  );
}
