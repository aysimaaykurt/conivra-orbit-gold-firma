"use client";

import React, { useEffect } from "react";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";

interface SidebarProps {
  visible: boolean;
  onHide: () => void;
  title?: string;
  children: React.ReactNode;
  position?: "left" | "right" | "top" | "bottom";
  className?: string;
}

export default function Sidebar({
  visible,
  onHide,
  title,
  children,
  position = "right",
  className = "",
}: SidebarProps) {
  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [visible]);

  return (
    <PrimeSidebar
      visible={visible}
      onHide={onHide}
      position={position}
      className={`${className}`}
      style={{
        width: "500px",
        backgroundColor: "white",
      }}
    >
      {/* Header */}
      {title && (
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold" style={{ color: "#4C226A" }}>
            {title}
          </h2>
        </div>
      )}

      {/* Content */}
      <div>{children}</div>
    </PrimeSidebar>
  );
}

