"use client";

import { ApplicationDetail, StatusType } from "@/src/mocks/applicationDetail";
import React from "react";
 
interface ProfileCardProps {
  application: ApplicationDetail;
}

const statusLabels: Record<StatusType, string> = {
  bronz: "Bronz",
  gümüş: "Gümüş",
  altın: "Altın",
  platin: "Platin",
};

export default function ProfileCard({ application }: ProfileCardProps) {
  const { profileImageSrc, fullName, category, rating, status } = application;

  return (
    <div className="flex items-start gap-6">
      {/* Profile Image - Circular */}
      <div
        className="w-32 h-32 rounded-full flex items-center justify-center flex-shrink-0 border-4"
        style={{ 
          borderColor: "#4C226A", 
          backgroundColor: "#E8DAF5" 
        }}
      >
        {profileImageSrc ? (
          <img
            src={profileImageSrc}
            alt={fullName}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <i className="pi pi-user text-6xl text-white" />
        )}
      </div>

      {/* Profile Info */}
      <div className="flex flex-col gap-2">
        {/* Name */}
        <h2 className="text-2xl font-bold" style={{ color: "#4C226A" }}>
          {fullName}
        </h2>

        {/* Category */}
        <p className="text-dark text-base">{category}</p>

        {/* Rating - 5 full stars based on image */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <i
              key={star}
              className="pi pi-star-fill text-lg"
              style={{ color: "#FFC107" }}
            />
          ))}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 mt-1">
          <i className="pi pi-award text-xl" style={{ color: "#CD7F32" }} />
          <span className="text-sm text-dark">Statü: {statusLabels[status]}</span>
        </div>
      </div>
    </div>
  );
}

