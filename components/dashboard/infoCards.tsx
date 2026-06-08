"use client";

import { useTranslations } from "next-intl";
import { useDashboardStats } from "@/src/hooks/useDashboardStats";
import type { DashboardStatsItem } from "@/src/api/company/dashboard/dashboard.models";

export default function InfoCards() {
  const { data: cards, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm h-full animate-pulse">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="w-12 h-8 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-3 bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-lightGray text-center py-4">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-3 bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-lightGray text-center py-4">
            Henüz istatistik bulunmamaktadır.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <InfoCard key={card.id} card={card} />
      ))}
    </div>
  );
}

function InfoCard({ card }: { card: DashboardStatsItem }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm h-full">
       <div className="mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
          <i className={`${card.icon} text-2xl text-gray-600`}></i>
        </div>
      </div>

       <div className="flex items-center justify-between gap-2">
         <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-base font-bold text-dark mb-1">{card.title}</h3>
          <p className="text-xs text-lightGray">{card.description}</p>
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

