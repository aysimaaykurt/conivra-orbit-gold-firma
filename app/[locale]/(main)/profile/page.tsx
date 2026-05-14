"use client";

import { useState, useEffect } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import ImageUploadModal from "@/components/profile/ImageUploadModal";
import { ProfileFormValues } from "@/src/mocks/profile";
import { getProfile, updateProfile } from "@/src/api/company/profile/profile.service";
import { Toast } from "@/components/ui/toast";
import { useRef } from "react";

export default function ProfilePage() {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [initialValues, setInitialValues] = useState<ProfileFormValues>({
    companyName: "",
    aboutCompany: "",
    city: "",
    district: "",
    address: "",
    sector: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const toastRef = useRef<any>(null);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getProfile();
        if (response.success && response.data) {
          const profile = response.data;
          setInitialValues({
            companyName: profile.companyName,
            aboutCompany: profile.aboutCompany || "",
            city: profile.city,
            district: profile.district,
            address: profile.address,
            sector: profile.sector,
          });
          // Stats would come from a separate endpoint or be part of profile
          // For now, keeping mock stats structure
        }
      } catch (error: any) {
        console.error("Profile yüklenirken hata:", error);
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: error.message || "Profil bilgileri yüklenirken bir hata oluştu",
          life: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageSelect = (file: File) => {
    // In a real app, upload to server and get URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (values: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const response = await updateProfile({
        companyName: values.companyName,
        aboutCompany: values.aboutCompany || undefined,
        city: values.city,
        district: values.district,
        address: values.address,
        sector: values.sector,
      });

      if (response.success) {
        toastRef.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: response.message || "Profil başarıyla güncellendi",
          life: 3000,
        });

        // Update initial values to reflect saved data
        setInitialValues(values);
      }
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Hata",
        detail: error.message || "Profil güncellenirken bir hata oluştu",
        life: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-[#F7F6F9] min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast ref={toastRef} />
      <div className="p-6 bg-[#F7F6F9] min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ProfileHeader
            companyName={initialValues.companyName}
            profileImageSrc={profileImage}
            badgeType="gold"
            onImageClick={() => setIsImageModalOpen(true)}
          />

          <ProfileForm
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
            isSaving={isSaving}
          />
        </div>

        <ImageUploadModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          onImageSelect={handleImageSelect}
          currentImageSrc={profileImage}
        />
      </div>
    </>
  );
}

