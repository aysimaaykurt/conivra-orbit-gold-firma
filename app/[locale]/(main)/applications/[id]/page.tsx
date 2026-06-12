"use client";

import React from "react";
import { useRouter } from "@/src/navigation";
import { useState, useEffect } from "react";
import { getApplicationDetail } from "@/src/api/applications/applications.service";
import ProfileCard from "@/components/applications/ProfileCard";
import ContactInfo from "@/components/applications/ContactInfo";
import AboutSection from "@/components/applications/AboutSection";
import SocialMediaSection from "@/components/applications/SocialMediaSection";
import PortfolioSection from "@/components/applications/PortfolioSection";
import EvaluationsSection from "@/components/applications/EvaluationsSection";
import {
  mockApplicationDetail,
  mockContactInfo,
  mockSocialMediaLinks,
  mockPortfolio,
  mockEvaluations,
} from "@/src/mocks/applicationDetail";

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [detailData, setDetailData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await getApplicationDetail(resolvedParams.id);
        if (res && res.success) {
          setDetailData(res.data);
        }
      } catch (err: any) {
        setError(err.message || "Başvuru detayı yüklenemedi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [resolvedParams.id]);

  // Mock data fallback if API doesn't return full structure yet
  const aboutText = detailData?.about ||
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  if (isLoading) {
    return (
      <div className="p-6 bg-[#F7F6F9] min-h-screen flex items-center justify-center">
        <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-[#F7F6F9] min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  const appDetail = { ...mockApplicationDetail, ...detailData };

  return (
    <div className="p-6 bg-[#F7F6F9] min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-gray-700 hover:text-purple-600 transition-colors"
      >
        <i className="pi pi-arrow-left" />
        <span className="font-semibold">Başvuru Listesi</span>
      </button>

      {/* Main Content - Two Equal Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Card with Contact Info - Top Left */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <ProfileCard application={appDetail} />
            <ContactInfo contact={appDetail.contactInfo || mockContactInfo} />
          </div>

          {/* About Section - Bottom Left */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <AboutSection about={aboutText} name={mockApplicationDetail.fullName.split(" ")[0]} />
          </div>

          {/* Social Media - Bottom Left */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <SocialMediaSection socialMedia={mockSocialMediaLinks} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Evaluations - Top Right */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <EvaluationsSection
              overallRating={5}
              totalEvaluations={456}
              evaluations={mockEvaluations}
            />
          </div>

          {/* Portfolio - Bottom Right (below Evaluations) */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <PortfolioSection portfolio={mockPortfolio} />
          </div>
        </div>
      </div>
    </div>
  );
}

