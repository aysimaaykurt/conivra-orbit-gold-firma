"use client";

import React from "react";
import { Toast as PrimeToast } from "primereact/toast";

export type ToastProps = React.ComponentProps<typeof PrimeToast>;

export const Toast = React.forwardRef<PrimeToast, ToastProps>(
  (props, ref) => {
    return <PrimeToast ref={ref} {...props} />;
  }
);

Toast.displayName = "Toast";

