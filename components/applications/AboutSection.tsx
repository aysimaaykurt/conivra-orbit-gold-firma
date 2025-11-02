"use client";

import React from "react";

interface AboutSectionProps {
  about: string;
  name?: string;
}

export default function AboutSection({ about, name = "Derya" }: AboutSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-dark">{name} Hakkında</h3>
      <p className="text-base text-dark leading-relaxed">{about}</p>
    </div>
  );
}

