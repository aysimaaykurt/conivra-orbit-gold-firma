"use client";

import React, { useMemo } from "react";
import { Button as PrimeButton } from "primereact/button";

export type ButtonProps = React.ComponentProps<typeof PrimeButton> & {
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Button = React.forwardRef<any, ButtonProps>(
  (
    {
      containerClassName,
      leftIcon,
      rightIcon,
      className,
      label,
      children,
      style,
      ...rest
    },
    ref
  ) => {
    const computedLabel = label ?? (typeof children === "string" ? children : undefined);
    const icon = leftIcon ?? rightIcon ?? (rest as any).icon;
    const iconPos = rightIcon ? "right" : "left";

    // Extract bg-primary and border-primary from className and apply as inline styles
    const { processedClassName, buttonStyle } = useMemo(() => {
      const classArray = className?.split(" ") || [];
      const hasBgPrimary = classArray.some(cls => cls.includes("bg-primary"));
      const hasBorderPrimary = classArray.some(cls => cls.includes("border-primary"));
      
      const newStyle: React.CSSProperties = {
        ...style,
      };

      if (hasBgPrimary) {
        newStyle.backgroundColor = "#4C226A";
        newStyle.color = "white";
      }

      if (hasBorderPrimary) {
        newStyle.borderColor = "#4C226A";
        newStyle.borderWidth = "1px";
        newStyle.borderStyle = "solid";
      }

      // Remove bg-primary and border-primary variants from className as we handle them via style
      const processedClass = classArray
        .filter(cls => !cls.includes("bg-primary") && !cls.includes("border-primary"))
        .join(" ");

      return {
        processedClassName: processedClass,
        buttonStyle: newStyle,
      };
    }, [className, style]);

    return (
      <div className={containerClassName}>
        <PrimeButton
          ref={ref}
          label={computedLabel}
          icon={icon as any}
          iconPos={icon ? (iconPos as any) : undefined}
          className={[
            "inline-flex items-center",
            processedClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          style={buttonStyle}
          {...(rest as Record<string, unknown>)}
        >
          {computedLabel ? null : children}
        </PrimeButton>
      </div>
    );
  }
);


