"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/src/navigation";

interface ToolbarProps {
  filters?: Record<string, any>;
  setFilters?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export default function Toolbar({ filters, setFilters }: ToolbarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(filters?.searchTerm || "");
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const categories = [
    { value: "", label: "Tüm Kategoriler" },
    { value: "restaurant-cafe", label: "Restoran / Cafe" },
    { value: "food-drink", label: "Yemek & İçecek" },
    { value: "art", label: "Sanat" },
    { value: "music", label: "Müzik" },
    { value: "fashion", label: "Moda" },
    { value: "technology", label: "Teknoloji" },
  ];

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (setFilters) {
        setFilters((prev) => ({ ...prev, searchTerm: query, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query, setFilters]);

  const handleSortToggle = () => {
    if (setFilters) {
      setFilters((prev) => ({
        ...prev,
        sortOrder: prev.sortOrder === "desc" ? "asc" : "desc",
      }));
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 max-w-xl bg-white rounded-full border border-gray-200 px-4 py-2 focus-within:border-primary/50 transition-colors">
        <i className="pi pi-search text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="İlan, workshop veya hediye kiti ara..."
          className="flex-1 outline-none text-sm bg-transparent text-gray-800 placeholder:text-gray-400"
        />
      </div>

      {/* Sort / Newest */}
      <button 
        onClick={handleSortToggle}
        className="px-4 py-2 rounded-full border bg-white text-dark hover:border-primary/40 flex items-center gap-2"
      >
        <i className="pi pi-list" />
        <span className="text-sm whitespace-nowrap min-w-[55px] text-left">
          {filters?.sortOrder === "asc" ? "En Eski" : "En Yeni"}
        </span>
        <i className={`pi pi-sort-alt text-xs ml-1`} />
      </button>

      {/* Category Filter */}
      <div className="relative">
        <button 
          onClick={() => setCategoryOpen((v) => !v)}
          className="px-4 py-2 rounded-full border bg-white text-dark hover:border-primary/40 flex items-center gap-2"
        >
          <i className="pi pi-filter" />
          <span className="text-sm whitespace-nowrap min-w-[80px] text-left">
            {categories.find(c => c.value === filters?.category)?.label || "Kategori"}
          </span>
          <i className="pi pi-chevron-down text-xs ml-1" />
        </button>
        {categoryOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setCategoryOpen(false)}
            />
            <div
              className="absolute right-0 mt-2 w-48 rounded-lg bg-white border border-gray-200 z-20 overflow-hidden shadow-lg"
              style={{ 
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}
            >
              <ul className="py-1 max-h-60 overflow-y-auto">
                {categories.map((cat, idx) => (
                  <li key={cat.value} className={idx !== 0 ? "border-t border-gray-100" : ""}>
                    <button
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${filters?.category === cat.value ? "bg-primary/10 text-primary font-medium" : "text-dark hover:bg-gray-50"}`}
                      onClick={() => {
                        if (setFilters) {
                          setFilters(prev => ({ ...prev, category: cat.value, page: 1 }));
                        }
                        setCategoryOpen(false);
                      }}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

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
