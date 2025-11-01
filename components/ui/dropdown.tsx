"use client";

import React from "react";
import { Dropdown as PrimeDropdown } from "primereact/dropdown";

export type DropdownProps = React.ComponentProps<typeof PrimeDropdown> & {
  label?: string;
  error?: string;
  containerClassName?: string;
  dropdownClassName?: string;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
};

export const Dropdown = React.forwardRef<any, DropdownProps>(
  (
    {
      label,
      error,
      containerClassName,
      dropdownClassName,
      className,
      id,
      options = [],
      placeholder,
      value,
      onChange,
      name,
      ...rest
    },
    ref
  ) => {
    // Handle PrimeReact Dropdown onChange to work with Formik
    const handleChange = (e: any) => {
      if (onChange && name) {
        // Create synthetic event for Formik compatibility
        const syntheticEvent = {
          target: {
            name,
            value: e.value,
          },
        };
        onChange(syntheticEvent as any);
      } else if (onChange) {
        onChange(e);
      }
    };
    const dropdownId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    
    // Check if dropdown has value (selected)
    const hasValue = value !== null && value !== undefined && value !== "";
    
    // Determine border color based on error and value states
    const getBorderColor = () => {
      if (error) return "#E53935"; // error color
      if (hasValue) return "#4C226A"; // primary color
      return "#A5A5A5"; // lightGray
    };

    const borderColor = getBorderColor();
    
    // Generate placeholder from label if not provided
    const getPlaceholder = () => {
      if (placeholder) return placeholder;
      if (label) {
        if (label.toLowerCase().includes("sektör") || label.toLowerCase().includes("sector")) {
          return "Sektör Seçiniz";
        }
        if (label.toLowerCase().includes("il") || label.toLowerCase().includes("city")) {
          return "İl Seçiniz";
        }
        if (label.toLowerCase().includes("ilçe") || label.toLowerCase().includes("district")) {
          return "İlçe Seçiniz";
        }
        if (label.toLowerCase().includes("cinsiyet") || label.toLowerCase().includes("gender")) {
          return "Cinsiyet";
        }
        return label;
      }
      return "";
    };

    return (
      <div className={containerClassName}>
        {label ? (
          <label
            htmlFor={dropdownId}
            className="mb-1 block text-sm font-medium text-dark"
          >
            {label}
          </label>
        ) : null}

        <div className="relative">
          <PrimeDropdown
            id={dropdownId}
            ref={ref}
            name={name}
            value={value}
            options={options}
            placeholder={getPlaceholder()}
            onChange={handleChange}
            optionLabel="label"
            optionValue="value"
            className={[
              "w-full",
              "bg-white text-dark",
              "py-2 px-3 rounded-md border text-sm",
              error ? "border-error" : hasValue ? "border-primary" : "border-lightGray/40",
              error 
                ? "focus:outline-none focus:border-error focus:ring-2 focus:ring-error/20"
                : "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
              className,
              dropdownClassName,
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              backgroundColor: "white",
              background: "white",
              borderColor: borderColor,
            }}
            {...(rest as Record<string, unknown>)}
          />
        </div>

        {error ? (
          <p className="mt-1 text-xs" style={{ color: "#E53935" }}>{error}</p>
        ) : null}
      </div>
    );
  }
);

