"use client";

import React, { useState, useRef } from "react";
import { useFormik } from "formik";
import { useRouter } from "@/src/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";

interface AddGiftKitFormProps {
  onClose?: () => void;
}

interface FormValues {
  // Step 1: Hediye Kiti Bilgileri
  title: string;
  content: string;
  category: string;
  targetAudience: string;
  followerRange: string;
  platformPreference: string;
  businessType: string;
  contentType: string;
  
  // Step 2: Hediye Kiti Görseli
  image: File | null;
  imagePreview: string;
}

const steps = [
  { id: 1, label: "Hediye Kiti Bilgileri" },
  { id: 2, label: "Hediye Kiti Görseli" },
];

// Mock options
const categoryOptions = [
  { label: "Restorant / Cafe", value: "restaurant-cafe" },
  { label: "Yemek & İçecek", value: "food-drink" },
  { label: "Sanat", value: "art" },
  { label: "Müzik", value: "music" },
  { label: "Moda", value: "fashion" },
  { label: "Teknoloji", value: "technology" },
];

const targetAudienceOptions = [
  { label: "Yetişkinler", value: "adults" },
  { label: "Gençler", value: "teens" },
  { label: "Çocuklar", value: "children" },
  { label: "Herkes", value: "everyone" },
  { label: "Profesyoneller", value: "professionals" },
];

const followerRangeOptions = [
  { label: "1K - 10K", value: "1k-10k" },
  { label: "10K - 50K", value: "10k-50k" },
  { label: "50K - 100K", value: "50k-100k" },
  { label: "100K+", value: "100k+" },
];

const platformOptions = [
  { label: "Instagram", value: "instagram" },
  { label: "TikTok", value: "tiktok" },
  { label: "YouTube", value: "youtube" },
  { label: "Twitter", value: "twitter" },
];

const businessTypeOptions = [
  { label: "Part-Time", value: "part-time" },
  { label: "Full-Time", value: "full-time" },
  { label: "Proje Bazlı", value: "project-based" },
];

const contentTypeOptions = [
  { label: "Fotoğraf", value: "photo" },
  { label: "Video", value: "video" },
  { label: "Reels", value: "reels" },
  { label: "Story", value: "story" },
];

export default function AddGiftKitForm({ onClose }: AddGiftKitFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      title: "",
      content: "",
      category: "",
      targetAudience: "",
      followerRange: "",
      platformPreference: "",
      businessType: "",
      contentType: "",
      image: null,
      imagePreview: "",
    },
    onSubmit: (values) => {
      console.log("Gift Kit form submitted:", values);
      // API call will be here
    },
  });

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

  const handleNext = () => {
    if (currentStep < 2) {
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
            Hediye Kiti Ekle
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
            {/* Step 1: Hediye Kiti Bilgileri */}
            {currentStep === 1 && (
              <div className="space-y-2">
                <Input
                  label="Hediye Kiti Başlığı"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.title ? errors.title : undefined}
                  placeholder="Workshop başlığı giriniz"
                />

                <Textarea
                  label="Hediye Kiti İçerik Bilgisi"
                  name="content"
                  value={values.content}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.content ? errors.content : undefined}
                  placeholder="Hediye kiti içeriği giriniz"
                  rows={3}
                />

                <div className="grid grid-cols-2 gap-4">
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
                    label="İş Tipi Seçiniz"
                    name="businessType"
                    value={values.businessType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.businessType ? errors.businessType : undefined}
                    options={businessTypeOptions}
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
              </div>
            )}

            {/* Step 2: Hediye Kiti Görseli */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-dark">
                    Hediye Kiti Görseli
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

            {currentStep < 2 ? (
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
                Hediye Kiti Ekle
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
                  alt="Gift Kit preview"
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

            {/* Content/Description */}
            {values.content && (
              <p className="text-sm text-gray-600 line-clamp-4">{values.content}</p>
            )}

            {/* Details */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm">
                <i className="pi pi-tag text-primary" />
                <span className="text-gray-700">
                  {values.category 
                    ? categoryOptions.find((opt) => opt.value === values.category)?.label || values.category
                    : "Hediye Kiti"}
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

              {values.followerRange && (
                <div className="flex items-center gap-2 text-sm">
                  <i className="pi pi-users text-primary" />
                  <span className="text-gray-700">
                    {followerRangeOptions.find((opt) => opt.value === values.followerRange)?.label || values.followerRange}
                  </span>
                </div>
              )}

              {values.platformPreference && (
                <div className="flex items-center gap-2 text-sm">
                  <i className="pi pi-share-alt text-primary" />
                  <span className="text-gray-700">
                    {platformOptions.find((opt) => opt.value === values.platformPreference)?.label || values.platformPreference}
                  </span>
                </div>
              )}

              {values.businessType && (
                <div className="flex items-center gap-2 text-sm">
                  <i className="pi pi-briefcase text-primary" />
                  <span className="text-gray-700">
                    {businessTypeOptions.find((opt) => opt.value === values.businessType)?.label || values.businessType}
                  </span>
                </div>
              )}

              {values.contentType && (
                <div className="flex items-center gap-2 text-sm">
                  <i className="pi pi-image text-primary" />
                  <span className="text-gray-700">
                    {contentTypeOptions.find((opt) => opt.value === values.contentType)?.label || values.contentType}
                  </span>
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
              Hediye Kiti Ekle
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

