"use client";

import React, { useState, useRef, useEffect } from "react";

interface CreateDropdownProps {
  onCreateSupport?: () => void;
  onCreateRequest?: () => void;
}

export default function CreateDropdown({
  onCreateSupport,
  onCreateRequest,
}: CreateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCreateSupport = () => {
    onCreateSupport?.();
    setIsOpen(false);
  };

  const handleCreateRequest = () => {
    onCreateRequest?.();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
        style={{ backgroundColor: "#4C226A" }}
      >
        <i className="pi pi-file text-base" />
        <span>Destek / Talep Oluştur</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[200px] z-50"
          style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          <button
            onClick={handleCreateSupport}
            className="w-full px-4 py-3 text-left text-sm text-dark hover:bg-gray-50 transition-colors first:rounded-t-lg"
          >
            Destek Oluştur
          </button>
          <div className="border-t border-gray-200"></div>
          <button
            onClick={handleCreateRequest}
            className="w-full px-4 py-3 text-left text-sm text-dark hover:bg-gray-50 transition-colors last:rounded-b-lg"
          >
            Talep Oluştur
          </button>
        </div>
      )}
    </div>
  );
}

