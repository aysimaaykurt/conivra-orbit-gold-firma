"use client";

import { SocialMediaLinks } from "@/src/mocks/applicationDetail";
import React from "react";
 
interface SocialMediaSectionProps {
  socialMedia: SocialMediaLinks;
}

export default function SocialMediaSection({
  socialMedia,
}: SocialMediaSectionProps) {
  const socialMediaItems = [
    {
      key: "instagram" as const,
      icon: "pi pi-instagram",
      label: "/derya.sevin",
      bgGradient: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
      href: socialMedia.instagram,
    },
    {
      key: "linkedin" as const,
      icon: "pi pi-linkedin",
      label: "/derya.sevin",
      bgColor: "#0077B5",
      href: socialMedia.linkedin,
    },
    {
      key: "tiktok" as const,
      icon: "pi pi-video",
      label: "/derya.sevin",
      bgColor: "#000000",
      href: socialMedia.tiktok,
    },
    {
      key: "youtube" as const,
      icon: "pi pi-youtube",
      label: "/derya.sevin",
      bgColor: "#FF0000",
      href: socialMedia.youtube,
    },
  ].filter((item) => item.href); // Filter out items without href

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-dark">Sosyal Medya</h3>
      <div className="grid grid-cols-2 gap-3">
        {socialMediaItems.map((item) => (
          <a
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={
                item.bgGradient
                  ? { background: item.bgGradient }
                  : { backgroundColor: item.bgColor }
              }
            >
              <i className={`${item.icon} text-white text-sm`} />
            </div>
            <span className="text-base text-dark font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

