"use client";

import React, { useState } from "react";
import { useRouter } from "@/src/navigation";

export default function Toolbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 max-w-xl bg-white rounded-full border border-gray-200 px-4 py-2">
        <i className="pi pi-search text-lightGray" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ara"
          className="flex-1 outline-none text-sm bg-transparent"
        />
      </div>

      {/* Sort / Newest */}
      <button className="px-4 py-2 rounded-full border bg-white text-dark hover:border-primary/40 flex items-center gap-2">
        <i className="pi pi-list" />
        En Yeni
        <i className="pi pi-chevron-down text-xs" />
      </button>

      {/* Grid/List Icon Button (placeholder) */}
      <button className="p-2 rounded-full border bg-white text-dark hover:border-primary/40">
        <i className="pi pi-th-large" />
      </button>

      {/* Create */}
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="px-4 py-2 rounded-full bg-primary text-white flex items-center gap-2 hover:bg-primary/90 transition-colors"
          style={{ backgroundColor: "#4C226A" }}
        >
          <i className="pi pi-plus" />
          + İlan Oluştur
        </button>
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <div
              className="absolute right-0 mt-2 w-56 rounded-lg bg-white border border-gray-200 z-20 overflow-hidden shadow-lg"
              style={{ 
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}
            >
              <ul className="py-2">
                <li>
                  <button
                    className="w-full text-left px-4 py-3 text-sm text-dark hover:bg-primary/10 transition-colors"
                    onClick={() => {
                      setOpen(false);
                      router.push("/ad-management/add");
                    }}
                  >
                    İlan Ekle
                  </button>
                </li>
                <li className="border-t border-primary/20">
                  <button
                    className="w-full text-left px-4 py-3 text-sm text-dark hover:bg-primary/10 transition-colors"
                    onClick={() => {
                      setOpen(false);
                      router.push("/ad-management/workshop/add");
                    }}
                  >
                    WorkShop Ekle
                  </button>
                </li>
                <li className="border-t border-primary/20">
                  <button
                    className="w-full text-left px-4 py-3 text-sm text-dark hover:bg-primary/10 transition-colors"
                    onClick={() => {
                      setOpen(false);
                      router.push("/ad-management/gift-kit/add");
                    }}
                  >
                    Hediye Kiti Ekle
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
