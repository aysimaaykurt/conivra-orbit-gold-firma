"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import { useRouter } from "@/src/navigation";
import { useSearchParams } from "next/navigation";
import { useCategories } from "@/src/hooks/useCategories";
import { Calendar } from "primereact/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { addWorkshop, getWorkshop, updateWorkshop } from "@/src/api/advertisements/workshops.service";

interface AddWorkshopFormProps {
  onClose?: () => void;
}

interface FormValues {
  // Step 1: Workshop Bilgileri
  title: string;
  description: string;
  dateRange: Date[] | null;
  duration: string;
  city: string;
  district: string;
  address: string;
  category: string;
  targetAudience: string;

  // Step 2: Özel Alanlar
  participantCount: string;
  participationCondition: string;
  fee: string;
  contentType: string;
  workshopGoal: string;
  workshopContent: string;

  // Step 3: Workshop Görseli
  image: File | null;
  imagePreview: string;
}

const steps = [
  { id: 1, label: "Workshop Bilgileri" },
  { id: 2, label: "Özel Alanlar" },
  { id: 3, label: "Workshop Görseli" },
];

import { useLocations } from "@/src/hooks/useLocations";

const durationOptions = [
  { label: "1 Saat", value: "1" },
  { label: "2 Saat", value: "2" },
  { label: "3 Saat", value: "3" },
  { label: "4 Saat", value: "4" },
  { label: "Yarım Gün", value: "half-day" },
  { label: "Tam Gün", value: "full-day" },
];

// Category options will now come dynamically from useCategories hook

const targetAudienceOptions = [
  { label: "Yetişkinler", value: "adults" },
  { label: "Gençler", value: "teens" },
  { label: "Çocuklar", value: "children" },
  { label: "Herkes", value: "everyone" },
  { label: "Profesyoneller", value: "professionals" },
];

const participantCountOptions = [
  { label: "5-10 Kişi", value: "5-10" },
  { label: "10-15 Kişi", value: "10-15" },
  { label: "15-20 Kişi", value: "15-20" },
  { label: "20-30 Kişi", value: "20-30" },
  { label: "30+ Kişi", value: "30+" },
];

const participationConditionOptions = [
  { label: "Kayıt Gerekli", value: "registration-required" },
  { label: "Ücretli", value: "paid" },
  { label: "Ücretsiz", value: "free" },
  { label: "Ön Kayıt Gerekli", value: "preregistration-required" },
];

const contentTypeOptions = [
  { label: "Fotoğraf", value: "photo" },
  { label: "Video", value: "video" },
  { label: "Reels", value: "reels" },
  { label: "Story", value: "story" },
];

export default function AddWorkshopForm({ onClose }: AddWorkshopFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { categories: categoryOptions, isLoading: isCategoriesLoading } = useCategories();
  const { cities: cityOptions, fetchDistricts } = useLocations();
  const [districtOptions, setDistrictOptions] = useState<{label: string, value: string | number}[]>([]);

  const formik = useFormik<FormValues>({
    initialValues: {
      title: "",
      description: "",
      dateRange: null,
      duration: "",
      city: "",
      district: "",
      address: "",
      category: "",
      targetAudience: "",
      participantCount: "",
      participationCondition: "",
      fee: "",
      contentType: "",
      workshopGoal: "",
      workshopContent: "",
      image: null,
      imagePreview: "",
    },
    onSubmit: async (values) => {
      // Validate dateRange
      if (!values.dateRange || !Array.isArray(values.dateRange) || values.dateRange.length < 2 || !values.dateRange[1]) {
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: "Lütfen geçerli bir tarih aralığı seçiniz",
          life: 3000,
        });
        return;
      }

      setIsLoading(true);
      try {
        // Convert dateRange to startDate and endDate in local time to prevent timezone shifting to the previous day
        const formatLocalISO = (d: Date) => {
          return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, -1);
        };
        const startDate = formatLocalISO(values.dateRange[0]);
        const endDate = formatLocalISO(values.dateRange[1]);

        const requestData = {
          title: values.title,
          description: values.description,
          startDate,
          endDate,
          duration: values.duration,
          city: values.city,
          district: values.district,
          address: values.address,
          category: values.category,
          targetAudience: values.targetAudience,
          participantCount: values.participantCount,
          participationCondition: values.participationCondition,
          fee: values.fee,
          contentType: values.contentType,
          workshopGoal: values.workshopGoal,
          workshopContent: values.workshopContent,
          image: values.image || undefined,
        };

        let response;
        if (editId) {
          response = await updateWorkshop(editId, requestData);
        } else {
          response = await addWorkshop(requestData);
        }

        if (response.success) {
          toastRef.current?.show({
            severity: "success",
            summary: "Başarılı",
            detail: response.message || "Workshop başarıyla eklendi",
            life: 3000,
          });

          // Redirect after success
          setTimeout(() => {
            if (onClose) {
              onClose();
            } else {
              router.push("/ad-management");
            }
          }, 1500);
        }
      } catch (error: any) {
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: error.message || (editId ? "Workshop güncellenirken bir hata oluştu" : "Workshop eklenirken bir hata oluştu"),
          life: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (editId) {
      const fetchAd = async () => {
        setIsLoading(true);
        try {
          const response = await getWorkshop(editId);
          if (response.success && response.data) {
            const ad = response.data;
            const startDate = ad.startDate ? new Date(ad.startDate) : new Date();
            const endDate = ad.endDate ? new Date(ad.endDate) : new Date();

            formik.setValues({
              title: ad.title || "",
              description: ad.description || "",
              dateRange: [startDate, endDate],
              duration: ad.duration || "",
              city: ad.city || "",
              district: ad.district || "",
              address: ad.address || "",
              category: ad.category ? String(ad.category) : "",
              targetAudience: ad.targetAudience || "",
              participantCount: ad.participantCount || "",
              participationCondition: ad.participationCondition || "",
              fee: ad.fee || "",
              contentType: Array.isArray(ad.contentType as any) ? (ad.contentType as any)[0] : (ad.contentType || ""),
              workshopGoal: ad.workshopGoal || "",
              workshopContent: ad.workshopContent || "",
              image: null,
              imagePreview: ad.imageUrl ? (ad.imageUrl.startsWith('http') || ad.imageUrl.startsWith('/images/') ? ad.imageUrl : `${new URL(process.env.NEXT_PUBLIC_API_BASE_URL || 'https://complexity-cloud-awarded-mug.trycloudflare.com').origin}/${ad.imageUrl.replace(/\\/g, '/').replace(/^\//, '')}`) : "",
            });
          }
        } catch (error) {
          console.error("Workshop detayı alınamadı:", error);
          if (toastRef.current) {
            toastRef.current.show({
              severity: "error",
              summary: "Hata",
              detail: "Workshop bilgileri yüklenemedi.",
            });
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchAd();
    }
  }, [editId]);

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Dosya boyutu 5MB'dan büyük olamaz");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Sadece resim dosyaları yüklenebilir");
        return;
      }

      setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue("imagePreview", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Dosya boyutu 5MB'dan büyük olamaz");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Sadece resim dosyaları yüklenebilir");
        return;
      }

      setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue("imagePreview", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (values.city) {
      fetchDistricts(values.city).then(setDistrictOptions);
    } else {
      setDistrictOptions([]);
      if (values.district) {
        setFieldValue("district", "");
      }
    }
  }, [values.city]);

  // Format date range for preview
  const formatDateRange = (dateRange: Date[] | null) => {
    if (!dateRange || !Array.isArray(dateRange) || dateRange.length === 0) return "";
    if (dateRange.length === 1) {
      return dateRange[0].toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
    if (dateRange.length === 2 && dateRange[1]) {
      const start = dateRange[0].toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const end = dateRange[1].toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return `${start} - ${end}`;
    }
    return "";
  };

  // Format full address
  const getFullAddress = () => {
    const parts = [values.district, values.city, values.address].filter(Boolean);
    return parts.join(", ") || "";
  };

  return (
    <>
      <Toast ref={toastRef} />
      <div className="bg-white min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header - Outside form div */}
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  router.back();
                }
              }}
              className="text-primary hover:text-primary/80"
            >
              <i className="pi pi-arrow-left text-xl" />
            </button>
            <h1 className="text-2xl font-bold" style={{ color: "#4C226A" }}>
              Workshop Ekle
            </h1>
          </div>

          {/* Step Title - Outside form div */}
          <div className="mb-2">
            <h2 className="text-lg font-semibold" style={{ color: "#4C226A" }}>
              {steps.find((s) => s.id === currentStep)?.label}
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Section - Form */}
            <div className="flex-1 w-full bg-[#F5F2F1] rounded-lg p-4 md:p-6 min-h-0 lg:min-h-[600px] lg:max-h-[800px] overflow-y-auto flex flex-col">
              {/* Form Steps */}
              <div className="mb-6 flex-1">
                {/* Step 1: Workshop Bilgileri */}
                {currentStep === 1 && (
                  <div className="space-y-2">
                    <Input
                      label="Workshop Başlığı"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.title ? errors.title : undefined}
                      placeholder="Workshop başlığı giriniz"
                    />

                    <Textarea
                      label="Workshop Açıklaması"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.description ? errors.description : undefined}
                      placeholder="Workshop açıklaması giriniz"
                      rows={3}
                    />

                    <div>
                      <label className="mb-1 block text-sm font-medium text-dark">
                        Tarih Aralığı
                      </label>
                      <div className="relative flex items-center">
                        <Calendar
                          value={values.dateRange}
                          onChange={(e) => setFieldValue("dateRange", e.value)}
                          selectionMode="range"
                          dateFormat="dd.mm.yy"
                          placeholder="Tarih Aralığı seçiniz"
                          showIcon
                          className="w-full [&_.p-inputtext]:rounded-r-none [&_.p-inputtext]:border-r-0 [&_.p-inputtext]:h-9 [&_.p-datepicker-trigger]:rounded-l-none [&_.p-datepicker-trigger]:ml-0 [&_.p-datepicker-trigger]:h-9 [&_.p-datepicker-trigger]:py-0 [&_.p-datepicker-trigger]:px-3"
                          inputClassName={`w-full py-1.5 px-3 rounded-l-md border text-sm h-9 ${touched.dateRange && errors.dateRange
                            ? "border-error"
                            : values.dateRange
                              ? "border-primary"
                              : "border-lightGray/40"
                            }`}
                        />
                      </div>
                      {touched.dateRange && errors.dateRange && (
                        <p className="mt-1 text-xs" style={{ color: "#E53935" }}>
                          {errors.dateRange as string}
                        </p>
                      )}
                    </div>

                    <Dropdown
                      label="Süre"
                      name="duration"
                      value={values.duration}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.duration ? errors.duration : undefined}
                      options={durationOptions}
                      placeholder="Süre bilgisi seçiniz"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Dropdown
                        label="İl"
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.city ? errors.city : undefined}
                        options={cityOptions}
                        placeholder="İl Seçiniz"
                      />

                        <Dropdown
                        label="İlçe"
                        name="district"
                        value={values.district}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.district ? errors.district : undefined}
                        options={districtOptions}
                        placeholder="İlçe Seçiniz"
                        disabled={!values.city || districtOptions.length === 0}
                      />
                    </div>

                    <Input
                      label="Adres"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.address ? errors.address : undefined}
                      placeholder="Adres giriniz"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Dropdown
                        label="Kategori"
                        name="category"
                        value={values.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.category ? errors.category : undefined}
                        options={categoryOptions}
                        placeholder="Bir Kategori seçiniz"
                      />

                      <Dropdown
                        label="Hedef Kitle"
                        name="targetAudience"
                        value={values.targetAudience}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.targetAudience ? errors.targetAudience : undefined}
                        options={targetAudienceOptions}
                        placeholder="Hedef Kitle seçiniz"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Özel Alanlar */}
                {currentStep === 2 && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Dropdown
                        label="Katılımcı Sayısı"
                        name="participantCount"
                        value={values.participantCount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.participantCount ? errors.participantCount : undefined}
                        options={participantCountOptions}
                        placeholder="Katılımcı Sayısı seçiniz"
                      />

                      <Dropdown
                        label="Katılım Şartı"
                        name="participationCondition"
                        value={values.participationCondition}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.participationCondition ? errors.participationCondition : undefined}
                        options={participationConditionOptions}
                        placeholder="Katılım Şartı seçiniz"
                      />
                    </div>

                    <Input
                      label="Ücret Bilgisi"
                      name="fee"
                      value={values.fee}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.fee ? errors.fee : undefined}
                      placeholder="Ücret yoksa boş bırakınız"
                    />

                    <Dropdown
                      label="İstenen İçerik Türü"
                      name="contentType"
                      value={values.contentType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.contentType ? errors.contentType : undefined}
                      options={contentTypeOptions}
                      placeholder="İçerik Türü seçiniz"
                    />

                    <Textarea
                      label="Workshop Hedefi"
                      name="workshopGoal"
                      value={values.workshopGoal}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.workshopGoal ? errors.workshopGoal : undefined}
                      placeholder="Hedef bilgisi, katılımcıya sağlayacağı fayda"
                      rows={3}
                    />

                    <Textarea
                      label="Workshop İçerği"
                      name="workshopContent"
                      value={values.workshopContent}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.workshopContent ? errors.workshopContent : undefined}
                      placeholder="Workshop süreci, detay bilgiler"
                      rows={3}
                    />
                  </div>
                )}

                {/* Step 3: Workshop Görseli */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-dark">
                        Workshop Görseli
                      </label>
                      <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                      >
                        <i className="pi pi-cloud-upload text-4xl mb-4" style={{ color: "#4C226A" }} />
                        <p className="text-sm text-gray-600 mb-2">
                          Resim dosyalarını buraya sürükleyip bırakın veya göz atmak için tıklayın.
                        </p>
                        <p className="text-xs text-gray-500">
                          Desteklenen formatlar: JPG, PNG (Maksimum 5MB)
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>

                    {values.imagePreview && (
                      <div className="mt-4 relative inline-block">
                        <img
                          src={values.imagePreview}
                          alt="Preview"
                          className="rounded-lg object-contain w-64 h-64 bg-gray-50"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFieldValue("image", null);
                            setFieldValue("imagePreview", "");
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="absolute -top-2 -right-1 bg-white text-red-500 border border-gray-100 rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-50 hover:text-red-600 shadow-md z-10 transition-colors"
                          title="Görseli Kaldır"
                        >
                          <i className="pi pi-trash text-xs"></i>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 text-sm text-dark ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : "hover:text-primary"
                    }`}
                >
                  <i className="pi pi-arrow-left" />
                  Önceki Adım
                </button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-primary text-white"
                    style={{ backgroundColor: "#4C226A" }}
                    rightIcon={<i className="pi pi-arrow-right" />}
                  >
                    Sonraki Adım
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => formik.handleSubmit()}
                    disabled={isLoading}
                    className="bg-primary text-white"
                    style={{ backgroundColor: "#4C226A" }}
                  >
                    {isLoading ? "Ekleniyor..." : "Workshop Ekle"}
                  </Button>
                )}
              </div>

              {/* Step Indicators (Bottom) */}
              <div className="flex flex-row items-center justify-between mt-2 pt-2 border-t border-gray-300">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-2 ${currentStep === step.id ? "font-semibold" : ""
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${currentStep === step.id
                        ? "border-primary bg-primary"
                        : currentStep > step.id
                          ? "border-primary bg-primary"
                          : "border-gray-300 bg-transparent"
                        }`}
                    />
                    <span
                      className={`text-sm ${currentStep === step.id
                        ? "font-semibold text-dark"
                        : currentStep > step.id
                          ? "font-medium text-dark"
                          : "text-gray-500"
                        }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section - Preview */}
            <div className="w-full lg:w-[400px] bg-[#F5F2F1] rounded-lg p-4 md:p-6 lg:sticky lg:top-6 min-h-0 lg:min-h-[600px] lg:max-h-[800px] overflow-y-auto flex flex-col">
              <h2 className="text-xl font-bold mb-4" style={{ color: "#4C226A" }}>
                İlan Özeti
              </h2>

              <div className="space-y-4 flex-1">
                {/* Image */}
                <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {values.imagePreview ? (
                    <img
                      src={values.imagePreview}
                      alt="Workshop preview"
                      className="w-full h-full object-contain bg-gray-50"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <i className="pi pi-image text-4xl" />
                    </div>
                  )}
                </div>

                {/* Title */}
                {values.title && (
                  <h3 className="text-lg font-bold text-dark">{values.title}</h3>
                )}

                {/* Description */}
                {values.description && (
                  <p className="text-sm text-gray-600 line-clamp-4">{values.description}</p>
                )}

                {/* Details */}
                <div className="space-y-2 pt-2">
                  {(values.city || values.district) && (
                    <div className="flex items-center gap-2 text-sm">
                      <i className="pi pi-map-marker text-primary" />
                      <span className="text-gray-700">
                        {[values.district, values.city].filter(Boolean).join("/") || "Lokasyon seçilmedi"}
                      </span>
                    </div>
                  )}

                  {values.dateRange && formatDateRange(values.dateRange) && (
                    <div className="flex items-center gap-2 text-sm">
                      <i className="pi pi-calendar text-primary" />
                      <span className="text-gray-700">{formatDateRange(values.dateRange)}</span>
                    </div>
                  )}

                  {values.duration && (
                    <div className="flex items-center gap-2 text-sm">
                      <i className="pi pi-clock text-primary" />
                      <span className="text-gray-700">
                        {durationOptions.find((opt) => opt.value === values.duration)?.label || values.duration}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <i className="pi pi-tag text-primary" />
                    <span className="text-gray-700">
                      {values.category
                        ? categoryOptions.find((opt) => opt.value === values.category)?.label || values.category
                        : "Workshop"}
                    </span>
                  </div>

                  {values.targetAudience && (
                    <div className="flex items-center gap-2 text-sm">
                      <i className="pi pi-users text-primary" />
                      <span className="text-gray-700">
                        {targetAudienceOptions.find((opt) => opt.value === values.targetAudience)?.label || values.targetAudience}
                      </span>
                    </div>
                  )}

                  {getFullAddress() && (
                    <div className="flex items-center gap-2 text-sm">
                      <i className="pi pi-map-marker text-primary" />
                      <span className="text-gray-700">{getFullAddress()}</span>
                    </div>
                  )}

                  {values.participantCount && (
                    <div className="flex items-center gap-2 text-sm">
                      <i className="pi pi-users text-primary" />
                      <span className="text-gray-700">
                        {participantCountOptions.find((opt) => opt.value === values.participantCount)?.label || values.participantCount}
                      </span>
                    </div>
                  )}

                  {values.fee && (
                    <div className="flex items-center gap-2 text-sm">
                      <i className="pi pi-money-bill text-primary" />
                      <span className="text-gray-700">{values.fee} TL</span>
                    </div>
                  )}

                  {values.workshopGoal && (
                    <div className="flex items-start gap-2 text-sm mt-4 pt-4 border-t">
                      <i className="pi pi-info-circle text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-800 mb-1">Workshop Hedefi:</p>
                        <p className="text-gray-600">{values.workshopGoal}</p>
                      </div>
                    </div>
                  )}

                  {values.workshopContent && (
                    <div className="flex items-start gap-2 text-sm mt-4 pt-4 border-t">
                      <i className="pi pi-file text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-800 mb-1">Workshop İçerği:</p>
                        <p className="text-gray-600">{values.workshopContent}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button at Bottom */}
              <div className="mt-auto pt-6 border-t border-gray-300">
                <Button
                  type="button"
                  onClick={() => formik.handleSubmit()}
                  disabled={isLoading}
                  className="w-full text-white py-3 rounded-lg"
                  style={{ backgroundColor: "#4C226A" }}
                >
                  {isLoading ? "Ekleniyor..." : "Workshop Ekle"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

