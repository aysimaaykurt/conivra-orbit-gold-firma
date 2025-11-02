"use client";

import { Evaluation } from "@/src/mocks/applicationDetail";
import React from "react";

interface EvaluationsSectionProps {
  overallRating: number;
  totalEvaluations: number;
  evaluations: Evaluation[];
}

export default function EvaluationsSection({
  overallRating,
  totalEvaluations,
  evaluations,
}: EvaluationsSectionProps) {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <i
            key={`full-${index}`}
            className="pi pi-star-fill text-lg"
            style={{ color: "#FFC107" }}
          />
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <i
            className="pi pi-star-fill text-lg"
            style={{ color: "#FFC107" }}
          />
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <i
            key={`empty-${index}`}
            className="pi pi-star text-lg"
            style={{ color: "#D1D5DB" }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-dark">Değerlendirmeleri</h3>
        <span className="text-sm text-dark">{totalEvaluations} değerlendirme</span>
      </div>

      {/* Overall Rating */}
      <div className="flex items-center gap-2">
        {renderStars(overallRating)}
      </div>

      {/* Evaluations List */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {evaluations.map((evaluation) => (
          <div key={evaluation.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
            {/* Reviewer Image */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#E8DAF5" }}
            >
              {evaluation.reviewerImageSrc ? (
                <img
                  src={evaluation.reviewerImageSrc}
                  alt={evaluation.reviewerName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <i className="pi pi-user text-base" style={{ color: "#4C226A" }} />
              )}
            </div>

            {/* Review Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-base font-bold text-dark">
                  {evaluation.reviewerName}
                </span>
                <div className="flex-shrink-0">
                  {renderStars(evaluation.rating)}
                </div>
              </div>
              <p className="text-sm text-dark leading-relaxed mt-1">
                {evaluation.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

