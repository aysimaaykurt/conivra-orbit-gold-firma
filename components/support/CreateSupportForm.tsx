"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CreateSupportFormProps {
  onSubmit: (values: SupportFormValues) => void;
  onCancel?: () => void;
}

export interface SupportFormValues {
  title: string;
  type: string;
  description: string;
}

const supportTypes = [
  { label: "Teknik Destek", value: "Teknik Destek" },
  { label: "Hesap Sorunu", value: "Hesap Sorunu" },
  { label: "Özellik İsteği", value: "Özellik İsteği" },
  { label: "Geri Bildirim", value: "Geri Bildirim" },
];

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Destek başlığı gereklidir")
    .min(3, "Destek başlığı en az 3 karakter olmalıdır"),
  type: Yup.string()
    .required("Destek türü seçilmelidir"),
  description: Yup.string()
    .required("Destek açıklaması gereklidir")
    .min(10, "Destek açıklaması en az 10 karakter olmalıdır"),
});

export default function CreateSupportForm({
  onSubmit,
  onCancel,
}: CreateSupportFormProps) {
  const formik = useFormik<SupportFormValues>({
    initialValues: {
      title: "",
      type: "",
      description: "",
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Destek Başlığı */}
      <div>
        <Input
          label="Destek Başlığı"
          name="title"
          id="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}
          placeholder="Destek başlığı giriniz"
        />
      </div>

      {/* Destek Türü */}
      <div>
        <Dropdown
          label="Destek Türü"
          name="type"
          id="type"
          value={formik.values.type}
          onChange={(e) => {
            formik.setFieldValue("type", e.target.value);
          }}
          onBlur={() => formik.setFieldTouched("type", true)}
          error={formik.touched.type && formik.errors.type ? formik.errors.type : undefined}
          options={supportTypes}
          placeholder="Destek türü seçiniz"
        />
      </div>

      {/* Destek Açıklaması */}
      <div>
        <Textarea
          label="Destek Açıklaması"
          name="description"
          id="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}
          placeholder="Destek açıklaması giriniz"
          rows={5}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 text-white py-3 rounded-lg font-medium"
          style={{ backgroundColor: "#4C226A" }}
        >
          Gönder
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#3B82F6" }}
          >
            İptal
          </Button>
        )}
      </div>
    </form>
  );
}

