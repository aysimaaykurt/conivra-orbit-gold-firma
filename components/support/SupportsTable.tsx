"use client";

import React from "react";
import { Support } from "@/src/api/company/support/support.models";
import { SupportStatus } from "@/src/api/company/support/supportStatus.enum";
import StatusBadge from "./StatusBadge";

interface SupportsTableProps {
  supports: Support[];
  isLoading?: boolean;
}

export default function SupportsTable({ supports, isLoading }: SupportsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (supports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-sm text-lightGray text-center py-8">
          Henüz destek bulunmamaktadır.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Destek Başlığı
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Destek Türü
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Destek Açıklaması
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Durum
              </th>
            </tr>
          </thead>
          <tbody>
            {supports.map((support) => (
              <tr key={support.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-dark">{support.title}</td>
                <td className="py-3 px-4 text-sm text-dark">{support.type}</td>
                <td className="py-3 px-4 text-sm text-dark max-w-md truncate">
                  {support.description}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={support.status as SupportStatus} type="support" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

