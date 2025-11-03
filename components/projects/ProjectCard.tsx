"use client";

import { Project } from "@/src/mocks/projects";
import { useTranslations } from "next-intl";
import React from "react";
 
interface ProjectCardProps {
  project: Project;
  colorIndex?: number;
  onEvaluateClick?: () => void;
}

const cardColors = ["#E3D2EC", "#D2ABC7", "#C9B7C1"];

export default function ProjectCard({ project, colorIndex = 0, onEvaluateClick }: ProjectCardProps) {
  const t = useTranslations("projects");
  const {
    imageSrc,
    title,
    location,
    date,
    type,
    assignee,
    socialMediaLink,
    showCheckmark,
    overlayText,
    overlayIcon,
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
    <div className="rounded-lg p-2 flex gap-2 relative" style={{ backgroundColor: cardColor }}>
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
            onClick={onEvaluateClick}
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
        {/* Title */}image.png
        <h3 className="font-bold text-dark mb-3 text-base line-clamp-1">{title}</h3>

        {/* Details Grid (2x2) */}
        <div className="grid grid-cols-2 gap-2">
          {/* Row 1 - Left: Location */}
          <div className="flex items-center gap-2 bg-white rounded-lg px-2.5 py-1">
            <i className="pi pi-map-marker text-sm" style={{ color: "#4C226A" }} />
            <span className="text-xs text-gray-800 font-medium">{location}</span>
          </div>
          
          {/* Row 1 - Right: Date */}
          <div className="flex items-center gap-2 bg-white rounded-lg px-2.5 py-1">
            <i className="pi pi-calendar text-sm" style={{ color: "#4C226A" }} />
            <span className="text-xs text-gray-800 font-medium">{date}</span>
          </div>

          {/* Row 2 - Left: Type */}
          <div className="flex items-center gap-2 bg-white rounded-lg px-2.5 py-1">
            <i className="pi pi-tag text-sm" style={{ color: "#4C226A" }} />
            <span className="text-xs text-gray-800 font-medium">{t("type.ad")}</span>
          </div>

          {/* Row 2 - Right: Assignee */}
          {assignee && (
            <div className="flex items-center gap-2 bg-white rounded-lg px-2.5 py-1">
              <i className="pi pi-user text-sm" style={{ color: "#4C226A" }} />
              <span className="text-xs text-gray-800 font-medium">{assignee}</span>
            </div>
          )}
        </div>

        {/* Social Media Icon - Bottom Right */}
        <div className="flex justify-end mt-auto">
          <a
            href={socialMediaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <i className="pi pi-instagram text-base" style={{ color: "#4C226A" }} />
          </a>
        </div>
      </div>
    </div>
  );
}

