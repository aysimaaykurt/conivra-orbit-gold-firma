"use client";

import { Application, applications } from "@/src/mocks/dashboard";
import { useTranslations } from "next-intl";

 
 
export default function ApplicationList() {
  const t = useTranslations("dashboard.applications");
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <h2 className="text-lg font-bold text-dark mb-4">{t("title")}</h2>
      <div className="space-y-3">
        {applications.map((application) => (
          <ApplicationItem key={application.id} application={application} />
        ))}
      </div>
    </div>
  );
}

function ApplicationItem({ application }: { application: Application }) {
  const t = useTranslations("dashboard.applications");
  const tTime = useTranslations("dashboard.timeAgo");
  
  // Parse timeAgo string and format it
  const formatTimeAgo = (timeAgo: string) => {
    // Parse formats like "24 dk önce", "1 saat önce", "2 saat önce"
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
      {/* Left: Icon */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
          <i className="pi pi-clock text-orange-600 text-xl"></i>
        </div>
      </div>

      {/* Middle: Content */}
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

