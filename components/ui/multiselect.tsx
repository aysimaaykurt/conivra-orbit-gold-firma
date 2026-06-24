"use client";

import React from "react";
import { MultiSelect as PrimeMultiSelect } from "primereact/multiselect";

export type MultiSelectProps = React.ComponentProps<typeof PrimeMultiSelect> & {
  label?: string;
  error?: string;
  containerClassName?: string;
  dropdownClassName?: string;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
};

export const MultiSelect = React.forwardRef<any, MultiSelectProps>(
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
      onBlur,
      name,
      ...rest
    },
    ref
  ) => {
    // Handle PrimeReact MultiSelect onChange to work with Formik
    const handleChange = (e: any) => {
      let val = e.value;
      // PrimeReact workaround: Select All sometimes returns objects instead of values despite optionValue
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object" && val[0] !== null && "value" in val[0]) {
        val = val.map((v: any) => v.value);
      }

      if (onChange && name) {
        // Create synthetic event for Formik compatibility
        const syntheticEvent = {
          target: {
            name,
            value: val,
          },
        };
        onChange(syntheticEvent as any);
      } else if (onChange) {
        // Also fix for direct onChange
        onChange({ ...e, value: val });
      }
    };

    const handleBlur = (e: any) => {
      if (onBlur && name) {
        const syntheticEvent = {
          target: {
            name,
          },
        };
        onBlur(syntheticEvent as any);
      } else if (onBlur) {
        onBlur(e);
      }
    };
    const dropdownId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    
    // Check if dropdown has value (selected)
    const hasValue = value && Array.isArray(value) && value.length > 0;
    
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
          <PrimeMultiSelect
            id={dropdownId}
            ref={ref}
            name={name}
            value={value}
            options={options}
            placeholder={getPlaceholder()}
            onChange={handleChange}
            onBlur={handleBlur}
            optionLabel="label"
            optionValue="value"
            display="chip"
            className={[
              "w-full",
              "bg-white text-dark",
              "rounded-md border text-sm min-h-[42px]",
              "[&_.p-multiselect-label]:py-2 [&_.p-multiselect-label]:px-3",
              "[&_.p-multiselect-token]:bg-[#4C226A] [&_.p-multiselect-token]:text-white [&_.p-multiselect-token]:rounded-md [&_.p-multiselect-token]:px-2 [&_.p-multiselect-token]:py-0.5 [&_.p-multiselect-token]:mr-1 [&_.p-multiselect-token]:mt-1 [&_.p-multiselect-token]:mb-1",
              "[&_.p-multiselect-token-label]:text-xs",
              "[&_.p-multiselect-token-icon]:text-white/80 [&_.p-multiselect-token-icon:hover]:text-white [&_.p-multiselect-token-icon]:w-3 [&_.p-multiselect-token-icon]:h-3 [&_.p-multiselect-token-icon]:ml-1",
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
              minWidth: "100%",
            }}
            panelStyle={{
              minWidth: "100%",
            }}
            panelClassName="[&_.p-multiselect-header]:flex [&_.p-multiselect-header]:items-center [&_.p-multiselect-header]:gap-3 [&_.p-multiselect-header]:p-3 [&_.p-multiselect-header_.p-checkbox]:flex-shrink-0 [&_.p-multiselect-header_.p-checkbox]:min-w-[20px] [&_.p-multiselect-header_.p-checkbox]:min-h-[20px] [&_.p-multiselect-header_.p-checkbox-box]:min-w-[20px] [&_.p-multiselect-header_.p-checkbox-box]:min-h-[20px] [&_.p-multiselect-header_.p-checkbox-box]:border-2 [&_.p-multiselect-header_.p-checkbox-box]:rounded [&_.p-multiselect-item.p-highlight]:bg-[#4C226A]/10 [&_.p-multiselect-item.p-highlight]:text-[#4C226A] [&_.p-checkbox.p-highlight_.p-checkbox-box]:border-[#4C226A] [&_.p-checkbox.p-highlight_.p-checkbox-box]:bg-[#4C226A] [&_.p-multiselect-header-text]:translate-y-[3px] [&_.p-multiselect-header-text]:font-medium"
            appendTo="self"
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
