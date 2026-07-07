"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getSupportTypes } from "@/src/api/company/support/support.service";

interface CreateRequestFormProps {
  onSubmit: (values: RequestFormValues) => void;
  onCancel?: () => void;
  initialData?: RequestFormValues;
}

export interface RequestFormValues {
  supportTypeId: number | string;
  title: string;
  description: string;
  categoryName?: string;
}

// Types will be fetched from API
const validationSchema = Yup.object({
  title: Yup.string()
    .required("Talep başlığı gereklidir")
    .min(3, "Talep başlığı en az 3 karakter olmalıdır")
    .max(100, "Talep başlığı en fazla 100 karakter olabilir"),
  supportTypeId: Yup.number()
    .required("Talep türü seçilmelidir"),
  description: Yup.string()
    .required("Talep açıklaması gereklidir")
    .min(10, "Talep açıklaması en az 10 karakter olmalıdır")
    .max(500, "Talep açıklaması en fazla 500 karakter olabilir"),
});

export default function CreateRequestForm({
  onSubmit,
  onCancel,
  initialData,
}: CreateRequestFormProps) {
  const [requestTypes, setRequestTypes] = React.useState<{label: string, value: number}[]>([]);

  React.useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await getSupportTypes('Talep');
        if (response.success && response.data) {
          const fetchedTypes = response.data.map((type) => ({ label: type.name, value: type.id }));
          setRequestTypes(fetchedTypes);

          // Eğer ID yoksa, ancak kategori adı varsa eşleşen ID'yi bul ve seç
          if (initialData?.categoryName && !initialData.supportTypeId) {
            const matched = fetchedTypes.find(t => t.label === initialData.categoryName);
            if (matched) {
              formik.setFieldValue("supportTypeId", matched.value);
            }
          }
        }
      } catch (error) {
        console.error("Talep türleri alınamadı:", error);
      }
    };
    fetchTypes();
  }, [initialData]);

  const formik = useFormik<RequestFormValues>({
    initialValues: {
      title: initialData?.title || "",
      supportTypeId: initialData?.supportTypeId || "",
      description: initialData?.description || "",
      categoryName: initialData?.categoryName || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
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
          name="supportTypeId"
          id="supportTypeId"
          value={formik.values.supportTypeId}
          onChange={(e) => {
            formik.setFieldValue("supportTypeId", Number(e.target.value));
          }}
          onBlur={() => formik.setFieldTouched("supportTypeId", true)}
          error={formik.touched.supportTypeId && formik.errors.supportTypeId ? formik.errors.supportTypeId as string : undefined}
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
          maxLength={500}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 text-white py-3 rounded-lg font-medium"
          style={{ backgroundColor: "#4C226A" }}
        >
          {initialData ? "Güncelle" : "Gönder"}
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

