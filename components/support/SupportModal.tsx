"use client";

import React from "react";
import Sidebar from "@/components/ui/sidebar/Sidebar";
import CreateSupportForm, { SupportFormValues } from "./CreateSupportForm";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SupportFormValues) => void;
  isLoading?: boolean;
  initialData?: SupportFormValues;
}

export default function SupportModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialData,
}: SupportModalProps) {
  return (
    <Sidebar
      visible={isOpen}
      onHide={onClose}
      position="right"
      title={initialData ? "Destek Düzenle" : "Destek Ekle"}
    >
      <CreateSupportForm onSubmit={onSubmit} onCancel={onClose} initialData={initialData} />
    </Sidebar>
  );
}

