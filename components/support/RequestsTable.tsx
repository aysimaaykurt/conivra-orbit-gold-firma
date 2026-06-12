"use client";

import React from "react";
import { Request } from "@/src/api/company/request/request.models";
import { RequestStatus } from "@/src/api/company/request/requestStatus.enum";
import StatusBadge from "./StatusBadge";

interface RequestsTableProps {
  requests: Request[];
  isLoading?: boolean;
  onEdit?: (request: Request) => void;
  onDelete?: (request: Request) => void;
}

export default function RequestsTable({ requests, isLoading, onEdit, onDelete }: RequestsTableProps) {
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

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-sm text-lightGray text-center py-8">
          Henüz talep bulunmamaktadır.
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
                Talep Başlığı
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Talep Türü
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Talep Açıklaması
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Durum
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 w-24">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-dark">{request.title}</td>
                <td className="py-3 px-4 text-sm text-dark">{request.type}</td>
                <td className="py-3 px-4 text-sm text-dark max-w-md truncate">
                  {request.description}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={request.status as RequestStatus} type="request" />
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(request)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Düzenle"
                      >
                        <i className="pi pi-pencil" style={{ fontSize: '1rem' }}></i>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(request)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Sil"
                      >
                        <i className="pi pi-trash" style={{ fontSize: '1rem' }}></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

