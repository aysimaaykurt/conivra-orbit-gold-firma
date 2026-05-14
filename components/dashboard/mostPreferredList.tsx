"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getMostPreferred } from "@/src/api/company/dashboard/mostPreferred.service";
import type { MostPreferredItem } from "@/src/api/company/dashboard/mostPreferred.models";
import MostPreferredItemComponent from "./mostPreferredItem";

export default function MostPreferredList() {
  const t = useTranslations("dashboard.mostPreferred");
  const [items, setItems] = useState<MostPreferredItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMostPreferred = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getMostPreferred();
        if (response.success && response.data) {
          setItems(response.data);
        } else {
          setError("Veriler yüklenemedi");
        }
      } catch (error: any) {
        console.error("Most preferred yüklenirken hata:", error);
        setError(error.message || "Veriler yüklenirken bir hata oluştu");
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMostPreferred();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 h-full">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-dark mb-1">{t("title")}</h2>
          <p className="text-sm text-lightGray">{t("subtitle")}</p>
        </div>
        <div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 animate-pulse">
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
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
        <h2 className="text-lg font-bold text-dark mb-1">{t("title")}</h2>
        <p className="text-sm text-lightGray">{t("subtitle")}</p>
      </div>
      {error ? (
        <p className="text-sm text-lightGray text-center py-4">
          {error}
        </p>
      ) : items.length > 0 ? (
        <div>
          {items.map((item) => (
            <MostPreferredItemComponent key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-lightGray text-center py-4">
          {t("noItems") || "Henüz veri bulunmamaktadır."}
        </p>
      )}
    </div>
  );
}

