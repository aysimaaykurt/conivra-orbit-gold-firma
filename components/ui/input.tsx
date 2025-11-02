"use client";

import React from "react";
import { InputText } from "primereact/inputtext";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      containerClassName,
      inputClassName,
      className,
      id,
      ...rest
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
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

    // Check if input has value (filled)
    const hasValue = Boolean(normalizedValue || normalizedDefaultValue);
    
    // Determine border color based on error and value states
    const getBorderColor = () => {
      if (error) return "#E53935"; // error color
      if (hasValue) return "#4C226A"; // primary color
      return "#A5A5A5"; // lightGray
    };

    const borderColor = getBorderColor();
    
    // Determine autocomplete value based on input type
    const getAutoComplete = () => {
      if (rest.type === "password") return "new-password";
      if (rest.type === "email") return "off";
      return "off";
    };
    
    // Generate placeholder from label if not provided
    const getPlaceholder = () => {
      if (rest.placeholder) return rest.placeholder;
      if (label) {
        // Custom placeholders for specific fields
        if (label.toLowerCase().includes("firma") || label.toLowerCase().includes("company")) {
          return "Firma Adı";
        }
        if (label.toLowerCase().includes("sektör") || label.toLowerCase().includes("sector")) {
          return "Sektör Seçiniz";
        }
        if (label.toLowerCase().includes("ad soyad") || label.toLowerCase().includes("name")) {
          return "Ad Soyad";
        }
        if (label.toLowerCase().includes("mail") || label.toLowerCase().includes("email")) {
          return "Mail";
        }
        if (label.toLowerCase().includes("doğum") || label.toLowerCase().includes("birth")) {
          return "gg.aa.yyyy";
        }
        if (label.toLowerCase().includes("cinsiyet") || label.toLowerCase().includes("gender")) {
          return "Cinsiyet";
        }
        if (label.toLowerCase().includes("il") || label.toLowerCase().includes("city")) {
          return "İl Seçiniz";
        }
        if (label.toLowerCase().includes("ilçe") || label.toLowerCase().includes("district")) {
          return "İlçe Seçiniz";
        }
        if (label.toLowerCase().includes("şifre") || label.toLowerCase().includes("password")) {
          return "Şifre";
        }
        if (label.toLowerCase().includes("referans") || label.toLowerCase().includes("referral")) {
          return "Referans Kodu";
        }
        // Default: use label as placeholder
        return label;
      }
      return "";
    };
    
    return (
      <div className={containerClassName}>
        {label ? (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-dark"
          >
            {label}
          </label>
        ) : null}

        <div
          className={[
            "relative flex items-center",
            error ? "[&_.p-inputtext]:ring-1 [&_.p-inputtext]:ring-error" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {leftIcon ? (
            <span className="pointer-events-none absolute left-3 text-lightGray">
              {leftIcon}
            </span>
          ) : null}

          <InputText
            id={inputId}
            ref={ref}
            value={normalizedValue ?? undefined}
            defaultValue={normalizedDefaultValue}
            placeholder={getPlaceholder()}
            autoComplete={getAutoComplete()}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            data-form-type="other"
            className={[
              "w-full",
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              "bg-white text-dark placeholder:text-lightGray",
              "py-1.5 px-3 rounded-md border text-sm h-9",
              error ? "border-error" : hasValue ? "border-primary" : "border-lightGray/40",
              error 
                ? "focus:outline-none focus:border-error focus:ring-2 focus:ring-error/20"
                : "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
              className,
              inputClassName,
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

          {rightIcon ? (
            <span className="pointer-events-none absolute right-3 text-lightGray">
              {rightIcon}
            </span>
          ) : null}
        </div>

        {error ? (
          <p className="mt-1 text-xs" style={{ color: "#E53935" }}>{error}</p>
        ) : null}
      </div>
    );
  }
);

 
 


