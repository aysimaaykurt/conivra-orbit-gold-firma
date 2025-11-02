"use client";

import React from "react";
import { InputTextarea } from "primereact/inputtextarea";

export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> & {
  label?: string;
  error?: string;
  containerClassName?: string;
  textareaClassName?: string;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      containerClassName,
      textareaClassName,
      className,
      id,
      ...rest
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const {
      value: rawValue,
      defaultValue: rawDefaultValue,
      ...domRest
    } = rest;

    const normalizedValue =
      typeof rawValue === "number"
        ? String(rawValue)
        : Array.isArray(rawValue)
        ? rawValue.join(",")
        : (rawValue as string | undefined);

    const normalizedDefaultValue =
      typeof rawDefaultValue === "number"
        ? String(rawDefaultValue)
        : Array.isArray(rawDefaultValue)
        ? rawDefaultValue.join(",")
        : (rawDefaultValue as string | undefined);

    // Check if textarea has value (filled)
    const hasValue = Boolean(normalizedValue || normalizedDefaultValue);
    
    // Determine border color based on error and value states
    const getBorderColor = () => {
      if (error) return "#E53935"; // error color
      if (hasValue) return "#4C226A"; // primary color
      return "#A5A5A5"; // lightGray
    };

    const borderColor = getBorderColor();
    
    // Generate placeholder from label if not provided
    const getPlaceholder = () => {
      if (rest.placeholder) return rest.placeholder;
      if (label) {
        if (label.toLowerCase().includes("açıklama") || label.toLowerCase().includes("description")) {
          return "İlan açıklaması giriniz";
        }
        return label;
      }
      return "";
    };
    
    return (
      <div className={containerClassName}>
        {label ? (
          <label
            htmlFor={textareaId}
            className="mb-1 block text-sm font-medium text-dark"
          >
            {label}
          </label>
        ) : null}

        <div
          className={[
            "relative",
            error ? "[&_.p-inputtextarea]:ring-1 [&_.p-inputtextarea]:ring-error" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <InputTextarea
            id={textareaId}
            ref={ref}
            value={normalizedValue ?? undefined}
            defaultValue={normalizedDefaultValue}
            placeholder={getPlaceholder()}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className={[
              "w-full",
              "bg-white text-dark placeholder:text-lightGray",
              "py-1.5 px-3 rounded-md border text-sm resize-none min-h-[60px]",
              error ? "border-error" : hasValue ? "border-primary" : "border-lightGray/40",
              error 
                ? "focus:outline-none focus:border-error focus:ring-2 focus:ring-error/20"
                : "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
              className,
              textareaClassName,
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              backgroundColor: "white",
              background: "white",
              borderColor: borderColor,
              ...(typeof rest.style === "object" && rest.style ? rest.style : {}),
            }}
            {...(domRest as Record<string, unknown>)}
          />
        </div>

        {error ? (
          <p className="mt-1 text-xs" style={{ color: "#E53935" }}>{error}</p>
        ) : null}
      </div>
    );
  }
);

