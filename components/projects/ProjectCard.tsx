"use client";

import { Project } from "@/src/mocks/projects";
import { useTranslations } from "next-intl";
import React from "react";
 
interface ProjectCardProps {
  project: Project;
  colorIndex?: number;
  onEvaluateClick?: () => void;
  onClick?: () => void;
}

export default function ProjectCard({ project, colorIndex = 0, onEvaluateClick, onClick }: ProjectCardProps) {
  const cardColors = ["#E3D2EC", "#D2ABC7", "#C9B7C1"];
  const t = useTranslations("projects");
  const {
    imageSrc,
    title,
    location,
    date,
    startDate,
    endDate,
    type,
    sector,
    platforms,
    assignee,
    socialMediaLink,
    showCheckmark,
    overlayText,
    overlayIcon,
    applicationCount,
  } = project;

  const cardColor = cardColors[colorIndex % cardColors.length];
  
  // Translate overlay text based on overlayAction
  const translatedOverlayText = overlayText && project.overlayAction 
    ? t(`overlayText.${project.overlayAction}`)
    : overlayText;

  const getOverlayIconClass = () => {
    if (overlayIcon === "star-yellow") return "pi pi-star text-yellow-500";
    if (overlayIcon === "star-green") return "pi pi-star text-green-500";
    return "";
  };

  return (
    <div 
      className="rounded-lg p-2 flex gap-2 relative cursor-pointer hover:shadow-md transition-shadow" 
      style={{ backgroundColor: cardColor }}
      onClick={onClick}
    >
      {/* Checkmark for completed projects - outside card */}
      {showCheckmark && (
        <div className="absolute -top-2 -right-2 z-20">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-md">
            <i className="pi pi-check text-white text-xs font-bold" />
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
        {/* Overlay for completed projects */}
        {overlayText && (
          <div
            className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-black/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              if (onEvaluateClick) onEvaluateClick();
            }}
            style={{ backgroundColor: "rgba(76, 34, 106, 0.7)" }}
          >
            <i className={`${getOverlayIconClass()} text-3xl mb-2`} />
            <p className="text-white text-xs text-center font-medium leading-tight">
              {translatedOverlayText}
            </p>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        {/* Title */}
        <h3 className="font-bold text-dark mb-3 text-base line-clamp-1">{title}</h3>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          {/* Row 1 - Left: Location */}
          {location && (
            <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1 min-w-0">
              <i className="pi pi-map-marker text-xs flex-shrink-0" style={{ color: "#4C226A" }} />
              <span className="text-[11px] text-gray-800 font-medium truncate">{location}</span>
            </div>
          )}
          
          {/* Row 1 - Right: Date / Date Range */}
          {(startDate || date) && (
            <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1 min-w-0">
              <i className="pi pi-calendar text-xs flex-shrink-0" style={{ color: "#4C226A" }} />
              <span className="text-[11px] text-gray-800 font-medium truncate">
                {startDate && endDate ? `${startDate} - ${endDate}` : startDate || date}
              </span>
            </div>
          )}

          {/* Row 2 - Left: Type & Sector */}
          {(type || sector) && (
            <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1 min-w-0" title={sector ? `${type} - ${sector}` : type}>
              <i className="pi pi-tag text-xs flex-shrink-0" style={{ color: "#4C226A" }} />
              <span className="text-[11px] text-gray-800 font-medium truncate capitalize">
                {type === "campaign" ? "Kampanya" : type === "giftkit" ? "Hediye Kiti" : type} {sector ? `(${sector})` : ""}
              </span>
            </div>
          )}

          {/* Row 2 - Right: Assignee or Application Count */}
          {applicationCount !== undefined ? (
            <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1 min-w-0">
              <i className="pi pi-users text-xs flex-shrink-0" style={{ color: "#4C226A" }} />
              <span className="text-[11px] text-gray-800 font-medium truncate">{applicationCount} Başvuru</span>
            </div>
          ) : assignee && assignee !== "-" && (
            <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1 min-w-0">
              <i className="pi pi-user text-xs flex-shrink-0" style={{ color: "#4C226A" }} />
              <span className="text-[11px] text-gray-800 font-medium truncate">{assignee}</span>
            </div>
          )}
          
          {/* Row 3 - Platforms */}
          {platforms && (
             <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1 min-w-0 sm:col-span-2">
               <i className="pi pi-share-alt text-xs flex-shrink-0" style={{ color: "#4C226A" }} />
               <span className="text-[11px] text-gray-800 font-medium truncate capitalize">{platforms}</span>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}

