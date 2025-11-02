"use client";

import React, { useState, useRef } from "react";
import { useFormik } from "formik";
import { useRouter } from "@/src/navigation";
import { Calendar } from "primereact/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";

interface AddAdFormProps {
  onClose?: () => void;
}

interface FormValues {
  // Step 1: İlan Bilgileri
  title: string;
  description: string;
  dateRange: Date[] | null;
  city: string;
  district: string;
  address: string;
  sector: string;
  category: string;
  
  // Step 2: Özel Alanlar
  services: string;
  guestCount: string;
  platformPreference: string;
  followerRange: string;
  contentType: string;
  businessType: string;
  
  // Step 3: İlan Görseli
  image: File | null;
  imagePreview: string;
}

const steps = [
  { id: 1, label: "İlan Bilgileri" },
  { id: 2, label: "Özel Alanlar" },
  { id: 3, label: "İlan Görseli" },
];

 const cityOptions = [
  { label: "İstanbul", value: "istanbul" },
  { label: "Ankara", value: "ankara" },
  { label: "İzmir", value: "izmir" },
  { label: "Bursa", value: "bursa" },
  { label: "Antalya", value: "antalya" },
];

const districtOptions = {
  izmir: [
    { label: "Konak", value: "konak" },
    { label: "Karşıyaka", value: "karsiyaka" },
    { label: "Bornova", value: "bornova" },
  ],
  istanbul: [
    { label: "Kadıköy", value: "kadikoy" },
    { label: "Beşiktaş", value: "besiktas" },
    { label: "Şişli", value: "sisli" },
  ],
  ankara: [
    { label: "Çankaya", value: "cankaya" },
    { label: "Keçiören", value: "kecioren" },
  ],
  bursa: [
    { label: "Osmangazi", value: "osmangazi" },
    { label: "Nilüfer", value: "nilufer" },
  ],
  antalya: [
    { label: "Muratpaşa", value: "muratpasa" },
    { label: "Konyaaltı", value: "konyaalti" },
  ],
};

const sectorOptions = [
  { label: "Restoran / Cafe / Bar / Beach", value: "restaurant" },
  { label: "Teknoloji", value: "technology" },
  { label: "Sağlık", value: "healthcare" },
  { label: "Eğitim", value: "education" },
  { label: "Moda", value: "fashion" },
  { label: "Turizm", value: "tourism" },
];

const categoryOptions = [
  { label: "Restorant / Cafe", value: "restaurant-cafe" },
  { label: "Bar", value: "bar" },
  { label: "Beach", value: "beach" },
  { label: "Fast Food", value: "fast-food" },
];

const guestCountOptions = [
  { label: "1-2 Kişi", value: "1-2" },
  { label: "3-5 Kişi", value: "3-5" },
  { label: "6-10 Kişi", value: "6-10" },
  { label: "10+ Kişi", value: "10+" },
];

const platformOptions = [
  { label: "Instagram", value: "instagram" },
  { label: "TikTok", value: "tiktok" },
  { label: "YouTube", value: "youtube" },
  { label: "Twitter", value: "twitter" },
];

const followerRangeOptions = [
  { label: "1K - 10K", value: "1k-10k" },
  { label: "10K - 50K", value: "10k-50k" },
  { label: "50K - 100K", value: "50k-100k" },
  { label: "100K+", value: "100k+" },
];

const contentTypeOptions = [
  { label: "Fotoğraf", value: "photo" },
  { label: "Video", value: "video" },
  { label: "Reels", value: "reels" },
  { label: "Story", value: "story" },
];

const businessTypeOptions = [
  { label: "Part-Time", value: "part-time" },
  { label: "Full-Time", value: "full-time" },
  { label: "Proje Bazlı", value: "project-based" },
];

export default function AddAdForm({ onClose }: AddAdFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      title: "",
      description: "",
      dateRange: null,
      city: "",
      district: "",
      address: "",
      sector: "",
      category: "",
      services: "",
      guestCount: "",
      platformPreference: "",
      followerRange: "",
      contentType: "",
      businessType: "",
      image: null,
      imagePreview: "",
    },
    onSubmit: (values) => {
      console.log("Form submitted:", values);
      // API call will be here
    },
  });

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
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("Dosya boyutu 5MB'dan büyük olamaz");
        return;
      }
      // Check file type
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

  // Get district options based on selected city
  const getDistrictOptions = () => {
    if (!values.city) return [];
    return districtOptions[values.city as keyof typeof districtOptions] || [];
  };

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
            İlan Ekle
          </h1>
        </div>

        {/* Step Title - Outside form div */}
        <div className="mb-2">
          <h2 className="text-lg font-semibold" style={{ color: "#4C226A" }}>
            {steps.find((s) => s.id === currentStep)?.label}
          </h2>
        </div>

      <div className="flex gap-6">
        {/* Left Section - Form */}
        <div className="flex-1 bg-[#F5F2F1] rounded-lg p-6 min-h-[600px] max-h-[800px] overflow-y-auto flex flex-col">
          {/* Form Steps */}
          <div className="mb-6 flex-1">
            {/* Step 1: İlan Bilgileri */}
            {currentStep === 1 && (
              <div className="space-y-2">
                <Input
                  label="İlan Başlığı"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.title ? errors.title : undefined}
                  placeholder="İlan başlığı giriniz"
                />

                <Textarea
                  label="İlan Açıklaması"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description ? errors.description : undefined}
                  placeholder="İlan açıklaması giriniz"
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
                      inputClassName={`w-full py-1.5 px-3 rounded-l-md border text-sm h-9 ${
                        touched.dateRange && errors.dateRange
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

                <div className="grid grid-cols-2 gap-4">
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
                    options={getDistrictOptions()}
                    placeholder="İlçe Seçiniz"
                    disabled={!values.city}
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

                <div className="grid grid-cols-2 gap-4">
                  <Dropdown
                    label="Sektör"
                    name="sector"
                    value={values.sector}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.sector ? errors.sector : undefined}
                    options={sectorOptions}
                    placeholder="Bir sektör seçiniz"
                  />

                  <Dropdown
                    label="Kategori"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.category ? errors.category : undefined}
                    options={categoryOptions}
                    placeholder="Bir kategori seçiniz"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Özel Alanlar */}
            {currentStep === 2 && (
              <div className="space-y-4">
                {values.sector && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-dark">
                      {sectorOptions.find((opt) => opt.value === values.sector)?.label || values.sector}
                    </p>
                  </div>
                )}

                <Textarea
                  label="Sunulan Hizmetler / İkramlar"
                  name="services"
                  value={values.services}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.services ? errors.services : undefined}
                  placeholder="İlan açıklaması giriniz"
                  rows={4}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Dropdown
                    label="Misafir Sayısı"
                    name="guestCount"
                    value={values.guestCount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.guestCount ? errors.guestCount : undefined}
                    options={guestCountOptions}
                    placeholder="Misafir Sayısı seçiniz"
                  />

                  <Dropdown
                    label="Platform Tercihi"
                    name="platformPreference"
                    value={values.platformPreference}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.platformPreference ? errors.platformPreference : undefined}
                    options={platformOptions}
                    placeholder="Bir kategori seçiniz"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Dropdown
                    label="Takipçi Aralığı"
                    name="followerRange"
                    value={values.followerRange}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.followerRange ? errors.followerRange : undefined}
                    options={followerRangeOptions}
                    placeholder="Takipçi sayısı aralığı seçiniz"
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
                </div>

                <Dropdown
                  label="İş Tipi Seçiniz"
                  name="businessType"
                  value={values.businessType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.businessType ? errors.businessType : undefined}
                  options={businessTypeOptions}
                  placeholder="İş Tipi Seçiniz"
                />
              </div>
            )}

            {/* Step 3: İlan Görseli */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-dark">
                    İlan Görseli
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
                  <div className="mt-4">
                    <img
                      src={values.imagePreview}
                      alt="Preview"
                      className="rounded-lg object-cover w-64 h-64"
                    />
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
              className={`flex items-center gap-2 text-sm text-dark ${
                currentStep === 1 ? "opacity-50 cursor-not-allowed" : "hover:text-primary"
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
                className="bg-primary text-white"
                style={{ backgroundColor: "#4C226A" }}
              >
                İlan Ekle
              </Button>
            )}
          </div>

          {/* Step Indicators (Bottom) */}
          <div className="flex flex-row items-center justify-between mt-2 pt-2 border-t border-gray-300">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`flex items-center gap-2 ${
                  currentStep === step.id ? "font-semibold" : ""
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                    currentStep === step.id
                      ? "border-primary bg-primary"
                      : currentStep > step.id
                      ? "border-primary bg-primary"
                      : "border-gray-300 bg-transparent"
                  }`}
                />
                <span
                  className={`text-sm ${
                    currentStep === step.id
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
        <div className="w-[400px] bg-[#F5F2F1] rounded-lg p-6 sticky top-6 min-h-[600px] max-h-[800px] overflow-y-auto flex flex-col">
          <h2 className="text-xl font-bold mb-4" style={{ color: "#4C226A" }}>
            İlan Özeti
          </h2>

          <div className="space-y-4 flex-1">
            {/* Image */}
            <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {values.imagePreview ? (
                <img
                  src={values.imagePreview}
                  alt="Ad preview"
                  className="w-full h-full object-cover"
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

              <div className="flex items-center gap-2 text-sm">
                <i className="pi pi-tag text-primary" />
                <span className="text-gray-700">
                  {values.category 
                    ? categoryOptions.find((opt) => opt.value === values.category)?.label || values.category
                    : "Reklam"}
                </span>
              </div>


              {getFullAddress() && (
                <div className="flex items-center gap-2 text-sm">
                  <i className="pi pi-map-marker text-primary" />
                  <span className="text-gray-700">{getFullAddress()}</span>
                </div>
              )}

              {values.services && (
                <div className="flex items-start gap-2 text-sm mt-4 pt-4 border-t">
                  <i className="pi pi-info-circle text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Sunulan Hizmetler:</p>
                    <p className="text-gray-600">{values.services}</p>
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
              className="w-full text-white py-3 rounded-lg"
              style={{ backgroundColor: "#4C226A" }}
            >
              İlan Ekle
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

