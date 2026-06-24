"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "@/src/navigation";
import { useSearchParams } from "next/navigation";
import { useCategories } from "@/src/hooks/useCategories";
import { useSectors } from "@/src/hooks/useSectors";
import { Calendar } from "primereact/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dropdown } from "@/components/ui/dropdown";
import { MultiSelect } from "@/components/ui/multiselect";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { addAdvertisement, getAdvertisement, updateAdvertisement, deleteAdImage } from "@/src/api/advertisements/advertisements.service";

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
  platformPreference: string[];
  followerRange: string;
  contentType: string[];
  businessType: string;

  images: File[];
  imagePreviews: string[];
}

const steps = [
  { id: 1, label: "İlan Bilgileri" },
  { id: 2, label: "Özel Alanlar" },
  { id: 3, label: "İlan Görseli" },
];

import { useLocations } from "@/src/hooks/useLocations";

// Sector options will now come dynamically from useSectors hook

// Category options will now come dynamically from useCategories hook

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
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { categories: categoryOptions, isLoading: isCategoriesLoading } = useCategories();
  const { sectors: sectorOptions, isLoading: isSectorsLoading } = useSectors();
  const { cities: cityOptions, fetchDistricts } = useLocations();
  const [districtOptions, setDistrictOptions] = useState<{label: string, value: string | number}[]>([]);
  const [existingImagesMap, setExistingImagesMap] = useState<Record<string, string>>({});

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
      platformPreference: [],
      followerRange: "",
      contentType: [],
      businessType: "",
      images: [],
      imagePreviews: [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("İlan başlığı zorunludur"),
      description: Yup.string().required("İlan açıklaması zorunludur"),
      dateRange: Yup.array()
        .min(2, "Geçerli bir tarih aralığı seçiniz")
        .required("Tarih aralığı zorunludur")
        .nullable(),
      city: Yup.string().required("İl seçimi zorunludur"),
      district: Yup.string().required("İlçe seçimi zorunludur"),
      address: Yup.string().required("Adres zorunludur"),
      sector: Yup.string().required("Sektör seçimi zorunludur"),
      category: Yup.string().required("Kategori seçimi zorunludur"),
      services: Yup.string().required("Sunulan hizmetler zorunludur"),
      guestCount: Yup.string().required("Misafir sayısı zorunludur"),
      platformPreference: Yup.array().min(1, "En az bir platform seçmelisiniz").required("Platform tercihi zorunludur"),
      followerRange: Yup.string().required("Takipçi aralığı zorunludur"),
      contentType: Yup.array().min(1, "En az bir içerik türü seçmelisiniz").required("İçerik türü zorunludur"),
      businessType: Yup.string().required("İş tipi zorunludur"),
    }),
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
          city: values.city,
          district: values.district,
          address: values.address,
          sector: values.sector,
          category: values.category,
          services: values.services,
          guestCount: values.guestCount,
          platformPreference: values.platformPreference,
          followerRange: values.followerRange,
          contentType: values.contentType,
          businessType: values.businessType,
          images: values.images || [],
        };

        let response;
        if (editId) {
          response = await updateAdvertisement(editId, requestData);
        } else {
          response = await addAdvertisement(requestData);
        }

        if (response.success) {
          toastRef.current?.show({
            severity: "success",
            summary: "Başarılı",
            detail: response.message || "İlan başarıyla eklendi",
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
        console.error("Save ad error:", error);
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: error.message || "İlan eklenirken bir hata oluştu (Sunucu reddetti)",
          life: 4000,
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
          const response = await getAdvertisement(editId);
          if (response.success && response.data) {
            const ad = response.data;
            const startDate = ad.startDate ? new Date(ad.startDate) : new Date();
            const endDate = ad.endDate ? new Date(ad.endDate) : new Date();

            formik.setValues({
              title: ad.title || "",
              description: ad.description || "",
              dateRange: [startDate, endDate],
              city: ad.city || "",
              district: ad.district || "",
              address: ad.address || "",
              sector: ad.sector || "",
              category: ad.category ? String(ad.category) : "",
              services: ad.services || "",
              guestCount: ad.guestCount || "",
              platformPreference: Array.isArray(ad.platformPreference) ? ad.platformPreference : (ad.platformPreference ? [ad.platformPreference] : []),
              followerRange: ad.followerRange || "",
              contentType: Array.isArray(ad.contentType) ? ad.contentType : (ad.contentType ? [ad.contentType] : []),
              businessType: ad.businessType || "",
              images: [],
              imagePreviews: (() => {
                const previewsMap: Record<string, string> = {};
                const previews = ad.images && ad.images.length > 0 
                  ? ad.images.map(img => {
                      const url = img.imageUrl;
                      if (!url) return '';
                      let finalUrl = url;
                      if (!url.startsWith('/images/')) {
                        const tunnelOrigin = new URL(process.env.NEXT_PUBLIC_API_BASE_URL || 'https://flooring-lets-function-bright.trycloudflare.com/api/v1/').origin;
                        if (url.includes('localhost:5100')) {
                          finalUrl = url.replace(/https?:\/\/localhost:5100/g, tunnelOrigin);
                        } else if (!url.startsWith('http')) {
                          finalUrl = `${tunnelOrigin}/${url.replace(/\\/g, '/').replace(/^\//, '')}`;
                        }
                      }
                      // Backend expects ONLY the GUID (e.g., 1c241dae-d60b-43f3-b2a1-60247333216b)
                      let filename = finalUrl.split('/').pop();
                      if (filename) {
                        filename = filename.split('?')[0]; // Remove query params if any
                        
                        // Remove "ad_" prefix and extension
                        let guid = filename;
                        if (guid.startsWith('ad_')) {
                          guid = guid.substring(3);
                        }
                        const dotIndex = guid.lastIndexOf('.');
                        if (dotIndex !== -1) {
                          guid = guid.substring(0, dotIndex);
                        }
                        
                        previewsMap[finalUrl] = guid;
                      }
                      
                      return finalUrl;
                    })
                  : [];
                setExistingImagesMap(previewsMap);
                return previews;
              })(),
            });
          }
        } catch (error) {
          console.error("İlan detayı alınamadı:", error);
          if (toastRef.current) {
            toastRef.current.show({
              severity: "error",
              summary: "Hata",
              detail: "İlan bilgileri yüklenemedi.",
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

  useEffect(() => {
    if (values.city) {
      fetchDistricts(values.city).then(districts => {
        setDistrictOptions(districts);
      });
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
              {editId ? "İlanı Güncelle" : "İlan Ekle"}
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
                        disabled={!values.city || isLoading}
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

                    <div className="space-y-4">
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
                        placeholder="İş Tipi Seçiniz"
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
                              onClick={async () => {
                                const previewUrl = values.imagePreviews[index];
                                const imageId = existingImagesMap[previewUrl];

                                if (imageId) {
                                  try {
                                    const res = await deleteAdImage(imageId);
                                    if (res && res.success === false) {
                                      throw new Error(res.message || "Görsel silinemedi (Sunucu reddetti)");
                                    }
                                    toastRef.current?.show({
                                      severity: "success",
                                      summary: "Başarılı",
                                      detail: "Görsel silindi",
                                      life: 3000,
                                    });
                                  } catch (error: any) {
                                    toastRef.current?.show({
                                      severity: "error",
                                      summary: "Hata",
                                      detail: error.message || "Görsel silinemedi",
                                      life: 3000,
                                    });
                                    return; // Stop if API call fails
                                  }
                                }

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
                    {isLoading ? (editId ? "Güncelleniyor..." : "Ekleniyor...") : (editId ? "İlanı Güncelle" : "İlan Ekle")}
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
                        alt="Ad preview main"
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
                  {values.title || "İlan Başlığı Girilmedi"}
                </h3>

                {/* Description */}
                <p className={`text-sm line-clamp-4 ${values.description ? 'text-gray-600' : 'text-gray-500/90 italic'}`}>
                  {values.description || "İlan açıklaması girilmedi..."}
                </p>

                {/* Details */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <i className="pi pi-map-marker text-primary" />
                    <span className={values.city || values.district ? 'text-gray-700' : 'text-gray-500/90 italic'}>
                      {[values.district, values.city].filter(Boolean).join("/") || "Lokasyon seçilmedi"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <i className="pi pi-calendar text-primary" />
                    <span className={values.dateRange && formatDateRange(values.dateRange) ? 'text-gray-700' : 'text-gray-500/90 italic'}>
                      {values.dateRange && formatDateRange(values.dateRange) ? formatDateRange(values.dateRange) : "Tarih seçilmedi"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <i className="pi pi-tag text-primary" />
                    <span className={values.category ? 'text-gray-700' : 'text-gray-500/90 italic'}>
                      {values.category
                        ? categoryOptions.find((opt) => opt.value === values.category)?.label || values.category
                        : "Kategori seçilmedi"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <i className="pi pi-home text-primary" />
                    <span className={getFullAddress() ? 'text-gray-700' : 'text-gray-500/90 italic'}>
                      {getFullAddress() || "Adres girilmedi"}
                    </span>
                  </div>

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
              <div className="mt-4 pt-4 border-t border-gray-300 flex-shrink-0">
                <Button
                  type="button"
                  onClick={() => formik.handleSubmit()}
                  disabled={isLoading}
                  className="w-full text-white py-3 rounded-lg"
                  style={{ backgroundColor: "#4C226A" }}
                >
                  {isLoading ? (editId ? "Güncelleniyor..." : "Ekleniyor...") : (editId ? "İlanı Güncelle" : "İlan Ekle")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

