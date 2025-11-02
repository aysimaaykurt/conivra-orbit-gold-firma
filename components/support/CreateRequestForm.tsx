"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CreateRequestFormProps {
  onSubmit: (values: RequestFormValues) => void;
  onCancel?: () => void;
}

export interface RequestFormValues {
  title: string;
  type: string;
  description: string;
}

const requestTypes = [
  { label: "Reklam Talebi", value: "Reklam Talebi" },
  { label: "Teknik Destek", value: "Teknik Destek" },
  { label: "Genel Talep", value: "Genel Talep" },
  { label: "Ödeme Sorunu", value: "Ödeme Sorunu" },
];

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Talep başlığı gereklidir")
    .min(3, "Talep başlığı en az 3 karakter olmalıdır"),
  type: Yup.string()
    .required("Talep türü seçilmelidir"),
  description: Yup.string()
    .required("Talep açıklaması gereklidir")
    .min(10, "Talep açıklaması en az 10 karakter olmalıdır"),
});

export default function CreateRequestForm({
  onSubmit,
  onCancel,
}: CreateRequestFormProps) {
  const formik = useFormik<RequestFormValues>({
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
      {/* Talep Başlığı */}
      <div>
        <Input
          label="Talep Başlığı"
          name="title"
          id="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}
          placeholder="Talep başlığı giriniz"
        />
      </div>

      {/* Talep Türü */}
      <div>
        <Dropdown
          label="Talep Türü"
          name="type"
          id="type"
          value={formik.values.type}
          onChange={(e) => {
            formik.setFieldValue("type", e.target.value);
          }}
          onBlur={() => formik.setFieldTouched("type", true)}
          error={formik.touched.type && formik.errors.type ? formik.errors.type : undefined}
          options={requestTypes}
          placeholder="Talep türü seçiniz"
        />
      </div>

      {/* Talep Açıklaması */}
      <div>
        <Textarea
          label="Talep Açıklaması"
          name="description"
          id="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}
          placeholder="Talep açıklaması giriniz"
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

