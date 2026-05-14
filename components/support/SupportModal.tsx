"use client";

import React from "react";
import Sidebar from "@/components/ui/sidebar/Sidebar";
import CreateSupportForm, { SupportFormValues } from "./CreateSupportForm";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SupportFormValues) => void;
  isLoading?: boolean;
}

export default function SupportModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: SupportModalProps) {
  return (
    <Sidebar
      visible={isOpen}
      onHide={onClose}
      position="right"
      title="Destek Ekle"
    >
      <CreateSupportForm onSubmit={onSubmit} onCancel={onClose} />
    </Sidebar>
  );
}

