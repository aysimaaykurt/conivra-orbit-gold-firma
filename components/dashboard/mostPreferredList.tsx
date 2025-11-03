"use client";

import { mostPreferred } from "@/src/mocks/dashboard";
import { useTranslations } from "next-intl";
import MostPreferredItemComponent from "./mostPreferredItem";

export default function MostPreferredList() {
  const t = useTranslations("dashboard.mostPreferred");
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-dark mb-1">{t("title")}</h2>
        <p className="text-sm text-lightGray">{t("subtitle")}</p>
      </div>
      <div>
        {mostPreferred.map((item) => (
          <MostPreferredItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

