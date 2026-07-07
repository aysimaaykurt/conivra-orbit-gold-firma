"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "@/src/navigation";
import { useSearchParams } from "next/navigation";
import { useCategories } from "@/src/hooks/useCategories";
import { useSectors } from "@/src/hooks/useSectors";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dropdown } from "@/components/ui/dropdown";
import { MultiSelect } from "@/components/ui/multiselect";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { addGiftKit, getGiftKit, updateGiftKit } from "@/src/api/advertisements/giftKits.service";

interface AddGiftKitFormProps {
  onClose?: () => void;
}

interface FormValues {
  // Step 1: Hediye Kiti Bilgileri
  title: string;
  content: string;
  category: string;
  sector: string;
  targetAudience: string;
  followerRange: string;
  platformPreference: string[];
  businessType: string;
  contentType: string[];

  images: File[];
  imagePreviews: string[];
}

const steps = [
  { id: 1, label: "Hediye Kiti Bilgileri" },
  { id: 2, label: "Hediye Kiti Görseli" },
];

// Mock options
// Category options will now come dynamically from useCategories hook

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
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const duplicateId = searchParams.get("duplicateId");
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { sectors: sectorOptions, isLoading: isSectorsLoading } = useSectors();

  const formik = useFormik<FormValues>({
    initialValues: {
      title: "",
      content: "",
      category: "",
      sector: "",
      targetAudience: "",
      followerRange: "",
      platformPreference: [],
      businessType: "",
      contentType: [],
      images: [],
      imagePreviews: [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Hediye kiti başlığı zorunludur"),
      content: Yup.string().required("Hediye kiti içeriği zorunludur"),
      category: Yup.string().required("Kategori seçimi zorunludur"),
      sector: Yup.string(),
      targetAudience: Yup.string().required("Hedef kitle zorunludur"),
      followerRange: Yup.string().required("Takipçi aralığı zorunludur"),
      platformPreference: Yup.array().min(1, "En az bir platform seçmelisiniz").required("Platform tercihi zorunludur"),
      businessType: Yup.string().required("İş tipi zorunludur"),
      contentType: Yup.array().min(1, "En az bir içerik türü seçmelisiniz").required("İçerik türü zorunludur"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const requestData = {
          title: values.title,
          content: values.content,
          category: values.category,
          sector: values.sector,
          targetAudience: values.targetAudience,
          followerRange: values.followerRange,
          platformPreference: values.platformPreference,
          businessType: values.businessType,
          contentType: values.contentType,
          images: values.images || [],
        };

        let response;
        if (editId) {
          response = await updateGiftKit(editId, requestData);
        } else {
          response = await addGiftKit(requestData);
        }

        if (response.success) {
          toastRef.current?.show({
            severity: "success",
            summary: "Başarılı",
            detail: response.message || "Hediye kiti başarıyla eklendi",
            life: 3000,
          });

          // Redirect after success
          setTimeout(() => {
            if (onClose) {
              onClose();
            } else {
              router.push("/ad-management?tab=hediye_kiti");
            }
          }, 1500);
        }
      } catch (error: any) {
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: error.message || (editId ? "Hediye kiti güncellenirken bir hata oluştu" : "Hediye kiti eklenirken bir hata oluştu"),
          life: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const { categories: categoryOptions, isLoading: isCategoriesLoading } = useCategories(formik.values.sector);

  useEffect(() => {
    const targetId = editId || duplicateId;
    if (targetId) {
      const fetchAd = async () => {
        setIsLoading(true);
        try {
          const response = await getGiftKit(targetId);
          if (response.success && response.data) {
            const ad = response.data;

            let duplicatedFiles: File[] = [];
            let duplicatedPreviews: string[] = [];

            if (duplicateId && ad.images && ad.images.length > 0) {
              const filePromises = ad.images.map(async (img) => {
                const url = img.imageUrl;
                if (!url) return null;
                let finalUrl = url;
                if (!url.startsWith('/images/')) {
                  const tunnelOrigin = new URL(process.env.NEXT_PUBLIC_API_BASE_URL || 'https://flooring-lets-function-bright.trycloudflare.com/api/v1/').origin;
                  if (url.includes('localhost:5100')) {
                    finalUrl = url.replace(/https?:\/\/localhost:5100/g, tunnelOrigin);
                  } else {
                    finalUrl = `${tunnelOrigin}/${url.replace(/\\/g, '/').replace(/^\//, '')}`;
                  }
                }
                try {
                  const res = await fetch(finalUrl);
                  const blob = await res.blob();
                  let filename = finalUrl.split('/').pop() || 'image.jpg';
                  filename = filename.split('?')[0];
                  const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
                  return { file, preview: finalUrl };
                } catch (e) {
                  console.error("Failed to fetch image file for duplication:", e);
                  return null;
                }
              });
              const results = await Promise.all(filePromises);
              results.forEach((res) => {
                if (res) {
                  duplicatedFiles.push(res.file);
                  duplicatedPreviews.push(res.preview);
                }
              });
            }

            formik.setValues({
              title: ad.title || "",
              content: ad.content || "",
              category: ad.category ? String(ad.category) : "",
              sector: ad.sector || "",
              targetAudience: ad.targetAudience || "",
              followerRange: ad.followerRange || "",
              platformPreference: typeof (ad as any).platformPreference === 'string' ? ((ad as any).platformPreference as string).split(',').map((p: string) => p.trim()) : (Array.isArray((ad as any).platformPreference) ? (ad as any).platformPreference : []),
              businessType: ad.businessType || "",
              contentType: Array.isArray(ad.contentType) ? ad.contentType : (ad.contentType ? [ad.contentType] : []),
              images: duplicateId ? duplicatedFiles : [],
              imagePreviews: duplicateId ? duplicatedPreviews : (ad.images && ad.images.length > 0 
                ? ad.images.map(img => {
                    const url = img.imageUrl;
                    if (!url) return '';
                    if (url.startsWith('/images/')) return url;
                    
                    const tunnelOrigin = new URL(process.env.NEXT_PUBLIC_API_BASE_URL || 'https://flooring-lets-function-bright.trycloudflare.com/api/v1/').origin;
                    
                    if (url.includes('localhost:5100')) {
                      return url.replace(/https?:\/\/localhost:5100/g, tunnelOrigin);
                    }
                    if (url.startsWith('http')) return url;
                    return `${tunnelOrigin}/${url.replace(/\\/g, '/').replace(/^\//, '')}`;
                  })
                : []),
            });
          }
        } catch (error) {
          console.error("Hediye kiti detayı alınamadı:", error);
          if (toastRef.current) {
            toastRef.current.show({
              severity: "error",
              summary: "Hata",
              detail: "Hediye kiti bilgileri yüklenemedi.",
            });
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchAd();
    }
  }, [editId, duplicateId]);

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
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const validFiles = files.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} boyutu 5MB'dan büyük olamaz`);
          return false;
        }
        if (!file.type.startsWith("image/")) {
          alert(`${file.name} geçerli bir resim dosyası değil`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setFieldValue("images", [...values.images, ...validFiles]);
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setFieldValue("imagePreviews", [...values.imagePreviews, ...newPreviews]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const validFiles = files.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} boyutu 5MB'dan büyük olamaz`);
          return false;
        }
        if (!file.type.startsWith("image/")) {
          alert(`${file.name} geçerli bir resim dosyası değil`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setFieldValue("images", [...values.images, ...validFiles]);
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setFieldValue("imagePreviews", [...values.imagePreviews, ...newPreviews]);
      }
    }
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
              {editId ? "Hediye Kiti Güncelle" : "Hediye Kiti Ekle"}
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
                      placeholder="Hediye kiti başlığı giriniz"
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
                        label="Sektör (İsteğe Bağlı)"
                        name="sector"
                        value={values.sector}
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue("category", "");
                        }}
                        onBlur={handleBlur}
                        error={touched.sector ? errors.sector : undefined}
                        options={sectorOptions}
                        placeholder="Bir Sektör seçiniz"
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

                    <div className="space-y-4">
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
                        label="İş Tipi Seçiniz"
                        name="businessType"
                        value={values.businessType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.businessType ? errors.businessType : undefined}
                        options={businessTypeOptions}
                        placeholder="Takipçi sayısı aralığı seçiniz"
                      />

                      <MultiSelect
                        label="Platform Tercihi"
                        name="platformPreference"
                        value={values.platformPreference}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.platformPreference ? (errors.platformPreference as string) : undefined}
                        options={platformOptions}
                        placeholder="Platform seçiniz"
                      />

                      <MultiSelect
                        label="İstenen İçerik Türü"
                        name="contentType"
                        value={values.contentType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.contentType ? (errors.contentType as string) : undefined}
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
                        multiple
                      />
                    </div>

                    {values.imagePreviews && values.imagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {values.imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group inline-block border rounded-lg p-1 bg-white shadow-sm">
                            {index === 0 && (
                              <span className="absolute -top-2 left-2 bg-[#4C226A] text-white text-[10px] px-2 py-0.5 rounded-full z-10 shadow-sm">
                                Ana Görsel
                              </span>
                            )}
                            <img
                              src={preview}
                              alt={`Preview ${index}`}
                              className="rounded-md object-contain w-full h-32 bg-gray-50"
                            />
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newImages = [...values.images];
                                  const newPreviews = [...values.imagePreviews];
                                  
                                  const selectedImage = newImages.splice(index, 1)[0];
                                  newImages.unshift(selectedImage);
                                  
                                  const selectedPreview = newPreviews.splice(index, 1)[0];
                                  newPreviews.unshift(selectedPreview);
                                  
                                  formik.setFieldValue("images", newImages);
                                  formik.setFieldValue("imagePreviews", newPreviews);
                                }}
                                className="absolute bottom-2 left-2 right-2 bg-black/70 hover:bg-black/90 text-white text-xs py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-1 z-10"
                                title="Ana Görsel Yap"
                              >
                                <i className="pi pi-star text-[10px]" /> Kapak Yap
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...values.images];
                                newImages.splice(index, 1);
                                formik.setFieldValue("images", newImages);

                                const newPreviews = [...values.imagePreviews];
                                newPreviews.splice(index, 1);
                                formik.setFieldValue("imagePreviews", newPreviews);
                                
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }
                              }}
                              className="absolute -top-2 -right-2 bg-white text-red-500 border border-gray-100 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-50 hover:text-red-600 shadow-md z-10 transition-colors cursor-pointer"
                              title="Görseli Kaldır"
                            >
                              <i className="pi pi-times text-xs"></i>
                            </button>
                          </div>
                        ))}
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
                    onClick={() => {
                      if (!formik.isValid) {
                        console.log("Formik validation errors:", formik.errors);
                        const errorMessages = Object.entries(formik.errors)
                          .map(([field, err]) => `${field}: ${err}`)
                          .join(", ");
                        toastRef.current?.show({
                          severity: "error",
                          summary: "Form Hatalı",
                          detail: `Lütfen tüm zorunlu alanları doldurun: ${errorMessages}`,
                          life: 6000,
                        });
                      }
                      formik.handleSubmit();
                    }}
                    disabled={isLoading}
                    className="bg-primary text-white"
                    style={{ backgroundColor: "#4C226A" }}
                  >
                    {isLoading ? (editId ? "Güncelleniyor..." : "Ekleniyor...") : (editId ? "Hediye Kiti Güncelle" : "Hediye Kiti Ekle")}
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
            <div className="w-full lg:w-[400px] bg-[#F5F2F1] rounded-lg p-4 md:p-6 lg:sticky lg:top-6 min-h-0 lg:h-[calc(100vh-3rem)] lg:max-h-[800px] flex flex-col">
              <h2 className="text-xl font-bold mb-4 flex-shrink-0" style={{ color: "#4C226A" }}>
                İlan Özeti
              </h2>

              <div className="space-y-4 flex-1 overflow-y-auto pr-2 pb-2">
                {/* Image */}
                <div className="w-full aspect-square bg-[#EBE7EC] border-2 border-dashed border-[#D1C9D6] rounded-lg overflow-hidden relative">
                  {values.imagePreviews && values.imagePreviews.length > 0 ? (
                    <>
                      <img
                        src={values.imagePreviews[0]}
                        alt="Gift Kit preview main"
                        className="w-full h-full object-contain bg-gray-50"
                      />
                      {values.imagePreviews.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                          +{values.imagePreviews.length - 1} Görsel
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                      <i className="pi pi-image text-5xl opacity-40 mb-2" />
                      <span className="text-sm font-medium opacity-60">Görsel Yüklenmedi</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className={`text-lg font-bold ${values.title ? 'text-dark' : 'text-gray-500/90 italic'}`}>
                  {values.title || "Hediye Kiti Başlığı Girilmedi"}
                </h3>

                {/* Content/Description */}
                <p className={`text-sm line-clamp-4 ${values.content ? 'text-gray-600' : 'text-gray-500/90 italic'}`}>
                  {values.content || "Hediye kiti açıklaması girilmedi..."}
                </p>

                {/* Details */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <i className="pi pi-tag text-primary" />
                    <span className={values.category ? 'text-gray-700' : 'text-gray-500/90 italic'}>
                      {values.category
                        ? categoryOptions.find((opt) => opt.value === values.category)?.label || values.category
                        : "Kategori seçilmedi"}
                    </span>
                  </div>
                  
                  {values.sector && (
                    <div className="flex items-center gap-2 text-sm">
                      <i className="pi pi-briefcase text-primary" />
                      <span className="text-gray-700">
                        {sectorOptions.find((opt) => opt.value === values.sector)?.label || values.sector}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <i className="pi pi-users text-primary" />
                    <span className={values.targetAudience ? 'text-gray-700' : 'text-gray-500/90 italic'}>
                      {values.targetAudience 
                        ? targetAudienceOptions.find((opt) => opt.value === values.targetAudience)?.label || values.targetAudience
                        : "Hedef kitle seçilmedi"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <i className="pi pi-users text-primary" />
                    <span className={values.followerRange ? 'text-gray-700' : 'text-gray-500/90 italic'}>
                      {values.followerRange
                        ? followerRangeOptions.find((opt) => opt.value === values.followerRange)?.label || values.followerRange
                        : "Takipçi aralığı seçilmedi"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <i className="pi pi-share-alt text-primary" />
                    <span className={values.platformPreference && values.platformPreference.length > 0 ? 'text-gray-700' : 'text-gray-500/90 italic'}>
                      {values.platformPreference && values.platformPreference.length > 0
                        ? values.platformPreference.map(val => platformOptions.find((opt) => opt.value === val)?.label || val).join(', ')
                        : "Platform seçilmedi"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <i className="pi pi-briefcase text-primary" />
                    <span className={values.businessType ? 'text-gray-700' : 'text-gray-500/90 italic'}>
                      {values.businessType
                        ? businessTypeOptions.find((opt) => opt.value === values.businessType)?.label || values.businessType
                        : "İş tipi seçilmedi"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <i className="pi pi-image text-primary" />
                    <span className={values.contentType && values.contentType.length > 0 ? 'text-gray-700' : 'text-gray-500/90 italic'}>
                      {values.contentType && values.contentType.length > 0
                        ? values.contentType.map(val => contentTypeOptions.find((opt) => opt.value === val)?.label || val).join(', ')
                        : "İçerik türü seçilmedi"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button at Bottom */}
              <div className="mt-4 pt-4 border-t border-gray-300 flex-shrink-0">
                <Button
                  type="button"
                  onClick={() => {
                    if (!formik.isValid) {
                      console.log("Formik validation errors:", formik.errors);
                      const errorMessages = Object.entries(formik.errors)
                        .map(([field, err]) => `${field}: ${err}`)
                        .join(", ");
                      toastRef.current?.show({
                        severity: "error",
                        summary: "Form Hatalı",
                        detail: `Lütfen tüm zorunlu alanları doldurun: ${errorMessages}`,
                        life: 6000,
                      });
                    }
                    formik.handleSubmit();
                  }}
                  disabled={isLoading}
                  className="w-full text-white py-3 rounded-lg"
                  style={{ backgroundColor: "#4C226A" }}
                >
                  {isLoading ? (editId ? "Güncelleniyor..." : "Ekleniyor...") : (editId ? "Hediye Kiti Güncelle" : "Hediye Kiti Ekle")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

