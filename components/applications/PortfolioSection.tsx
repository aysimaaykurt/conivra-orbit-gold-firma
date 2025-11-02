"use client";

import { PortfolioItem } from "@/src/mocks/applicationDetail";
import React from "react";
 
interface PortfolioSectionProps {
  portfolio: PortfolioItem[];
}

export default function PortfolioSection({ portfolio }: PortfolioSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-dark">Portfolyo</h3>
      <ul className="space-y-2">
        {portfolio.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <div 
              className="w-2 h-2 rounded-full mt-2 flex-shrink-0" 
              style={{ backgroundColor: "#C3B1E1" }}
            ></div>
            <a
              href={`https://${item.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-dark hover:text-primary transition-colors"
              style={{ color: "#4C226A" }}
            >
              {item.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

