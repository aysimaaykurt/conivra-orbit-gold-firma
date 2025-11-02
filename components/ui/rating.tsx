"use client";

import React from "react";

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  label?: string;
  showDot?: boolean;
  readOnly?: boolean;
}

export default function Rating({
  value,
  onChange,
  label,
  showDot = true,
  readOnly = false,
}: RatingProps) {
  return (
    <div className="flex items-start gap-3">
      {showDot && (
        <div className="flex-shrink-0 mt-0.5">
          <img src="/images/dot.png" alt="" className="w-2 h-2" />
        </div>
      )}
      <div className="flex-1">
        {label && (
          <label className="block text-base font-medium text-dark mb-2">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          <span className="text-base text-gray-600">1-</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => !readOnly && onChange?.(star)}
                disabled={readOnly}
                className={`focus:outline-none transition-colors ${readOnly ? "cursor-default" : "cursor-pointer"}`}
              >
                <i
                  className={`pi ${
                    star <= value ? "pi-star-fill" : "pi-star"
                  } text-2xl`}
                  style={{
                    color: star <= value ? "#4C226A" : "#D1D5DB",
                  }}
                />
              </button>
            ))}
          </div>
          <span className="text-base text-gray-600">-5</span>
        </div>
      </div>
    </div>
  );
}

