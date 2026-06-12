"use client";

import React from "react";
import Sidebar from "@/components/ui/sidebar/Sidebar";
import CreateRequestForm, { RequestFormValues } from "./CreateRequestForm";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: RequestFormValues) => void;
  isLoading?: boolean;
  initialData?: RequestFormValues;
}

export default function RequestModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialData,
}: RequestModalProps) {
  return (
    <Sidebar
      visible={isOpen}
      onHide={onClose}
      position="right"
      title={initialData ? "Talep Düzenle" : "Talep Ekle"}
    >
      <CreateRequestForm 
        onSubmit={(values) => {
          onSubmit(values);
        }} 
        onCancel={onClose} 
        initialData={initialData}
      />
    </Sidebar>
  );
}

