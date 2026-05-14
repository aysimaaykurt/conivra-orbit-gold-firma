"use client";

import { ProfileStats } from "@/src/api/company/profile/profileInfo.models";
import { getProfileInfo } from "@/src/api/company/profile/profileInfo.service";
import React, { useEffect, useState } from "react";
 
interface ProfileHeaderProps {
  companyName: string;
  profileImageSrc?: string;
  badgeType?: "gold" | "silver" | "bronze";
  stats?: ProfileStats; // Optional, will be fetched if not provided
  onImageClick?: () => void;
}

const badgeIcons = {
  gold: "pi-award",
  silver: "pi-award",
  bronze: "pi-award",
};

const badgeColors = {
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
};

export default function ProfileHeader({
  companyName,
  profileImageSrc,
  badgeType,
  stats: propsStats,
  onImageClick,
}: ProfileHeaderProps) {
  const [stats, setStats] = useState<ProfileStats>(
    propsStats || {
      totalJobs: 0,
      completedJobs: 0,
      pendingJobs: 0,
      cancelledJobs: 0,
    }
  );
  const [isLoading, setIsLoading] = useState(!propsStats);

  useEffect(() => {
    // If stats are provided as props, use them
    if (propsStats) {
      setStats(propsStats);
      setIsLoading(false);
      return;
    }

    // Otherwise, fetch from API
    const fetchProfileInfo = async () => {
      try {
        setIsLoading(true);
        const response = await getProfileInfo();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error: any) {
        console.error("Profile info yüklenirken hata:", error);
        // Keep default stats on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileInfo();
  }, [propsStats]);

  return (
    <div className="mb-6">
      {/* Main Section - Profile Picture, Name, Badge and Statistics all in one row */}
      <div className="flex items-center justify-between mb-6">
        {/* Left Side - Profile Picture and Name */}
        <div className="flex items-center gap-4">
          {/* Profile Picture */}
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full border-4 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
              style={{ 
                borderColor: "#4C226A",
                backgroundColor: "#4C226A"
              }}
              onClick={onImageClick}
            >
              {profileImageSrc ? (
                <img
                  src={profileImageSrc}
                  alt={companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="pi pi-user text-4xl text-white" />
              )}
            </div>
            {/* Camera Icon Overlay */}
            <button
              onClick={onImageClick}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border-2 border-primary flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
              style={{ borderColor: "#4C226A" }}
            >
              <i className="pi pi-camera text-sm" style={{ color: "#4C226A" }} />
            </button>
          </div>

          {/* Company Name and Badge */}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold" style={{ color: "#4C226A" }}>
              {companyName}
            </h1>
            {badgeType && (
              <i
                className={`pi ${badgeIcons[badgeType]} text-3xl`}
                style={{ color: badgeColors[badgeType] }}
              />
            )}
          </div>
        </div>

        {/* Right Side - Statistics */}
        {isLoading ? (
          <div className="flex items-center gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-10 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-8">
            {/* Toplam İş */}
            <div className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: "#4C226A" }}>
                {stats.totalJobs}
              </div>
              <div className="text-sm" style={{ color: "#4C226A" }}>
                Toplam İş
              </div>
            </div>

            {/* Tamamlanan İş */}
            <div className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: "#4C226A" }}>
                {stats.completedJobs}
              </div>
              <div className="text-sm" style={{ color: "#4C226A" }}>
                Tamamlanan İş
              </div>
            </div>

            {/* Bekleyen İşler */}
            <div className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: "#4C226A" }}>
                {stats.pendingJobs}
              </div>
              <div className="text-sm" style={{ color: "#4C226A" }}>
                Bekleyen İşler
              </div>
            </div>

            {/* İptal Olan İşler */}
            <div className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: "#4C226A" }}>
                {stats.cancelledJobs}
              </div>
              <div className="text-sm" style={{ color: "#4C226A" }}>
                İptal Olan İşler
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Horizontal Line */}
      <div className="border-t border-gray-300"></div>
    </div>
  );
}

