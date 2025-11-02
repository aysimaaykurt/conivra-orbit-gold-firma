"use client";

import { useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import ImageUploadModal from "@/components/profile/ImageUploadModal";
import { ProfileStats, ProfileFormValues } from "@/src/mocks/profile";

export default function ProfilePage() {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);

  // Mock data - In a real app, fetch from API
  const mockStats: ProfileStats = {
    totalJobs: 120,
    completedJobs: 115,
    pendingJobs: 4,
    cancelledJobs: 1,
  };

  const mockInitialValues: ProfileFormValues = {
    companyName: "Soiree Konak",
    aboutCompany: "",
    city: "izmir",
    district: "konak",
    address: "Akdeniz, Atatürk Cd. No:19 D:L, 35250 Konak/İzmir",
    sector: "",
  };

  const handleImageSelect = (file: File) => {
    // In a real app, upload to server and get URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (values: ProfileFormValues) => {
    console.log("Profile saved:", values);
    // In a real app, send to API
  };

  return (
    <div className="p-6 bg-[#F7F6F9] min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <ProfileHeader
          companyName={mockInitialValues.companyName}
          profileImageSrc={profileImage}
          badgeType="gold"
          stats={mockStats}
          onImageClick={() => setIsImageModalOpen(true)}
        />

        <ProfileForm
          initialValues={mockInitialValues}
          onSubmit={handleFormSubmit}
        />
      </div>

      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onImageSelect={handleImageSelect}
        currentImageSrc={profileImage}
      />
    </div>
  );
}

