"use client";

import { infoCards, type InfoCard } from "@/src/mocks/dashboard";
import { useTranslations } from "next-intl";

export default function InfoCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {infoCards.map((card) => (
        <InfoCard key={card.id} card={card} />
      ))}
    </div>
  );
}

function InfoCard({ card }: { card: InfoCard }) {
  const t = useTranslations("dashboard.infoCards");
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm h-full">
       <div className="mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
          <i className={`${card.icon} text-2xl text-gray-600`}></i>
        </div>
      </div>

       <div className="flex items-center justify-between gap-2">
         <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-base font-bold text-dark mb-1">{t(`${card.id}.title`)}</h3>
          <p className="text-xs text-lightGray">{t(`${card.id}.description`)}</p>
        </div>

         <div
          className="rounded-lg px-3 py-1.5 min-w-[40px] flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: card.color }}
        >
          <span className="text-white font-bold text-base">{card.value}</span>
        </div>
      </div>
    </div>
  );
}

