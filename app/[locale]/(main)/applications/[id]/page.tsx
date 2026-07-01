"use client";

import React, { useRef } from "react";
import { useRouter } from "@/src/navigation";
import { useState, useEffect } from "react";
import { getApplicationDetail, requestApplicationRevision } from "@/src/api/applications/applications.service";
import ProfileCard from "@/components/applications/ProfileCard";
import ContactInfo from "@/components/applications/ContactInfo";
import AboutSection from "@/components/applications/AboutSection";
import SocialMediaSection from "@/components/applications/SocialMediaSection";
import PortfolioSection from "@/components/applications/PortfolioSection";
import EvaluationsSection from "@/components/applications/EvaluationsSection";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
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
  
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);
  const toastRef = useRef<any>(null);

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

  const handleSendRevisionRequest = async () => {
    if (!revisionNote.trim()) {
      toastRef.current?.show({
        severity: "warn",
        summary: "Uyarı",
        detail: "Lütfen bir revizyon notu girin.",
        life: 3000,
      });
      return;
    }
    try {
      setIsSubmittingRevision(true);
      const res = await requestApplicationRevision(resolvedParams.id, {
        revisionNote: revisionNote,
      });
      if (res && res.success) {
        toastRef.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: "Revizyon talebi başarıyla iletildi.",
          life: 3000,
        });
        setRevisionModalOpen(false);
        setRevisionNote("");
        const updated = await getApplicationDetail(resolvedParams.id);
        if (updated && updated.success) {
          setDetailData(updated.data);
        }
      }
    } catch (err: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Hata",
        detail: err.message || "Revizyon talebi gönderilirken bir hata oluştu.",
        life: 3000,
      });
    } finally {
      setIsSubmittingRevision(false);
    }
  };

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
      {/* Header Row with Back Button & Action Button */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
        >
          <i className="pi pi-arrow-left" />
          <span className="font-semibold">Başvuru Listesi</span>
        </button>

        {(detailData?.status === 5 || detailData?.status === "Completed" || detailData?.status === "completed") && (
          <button
            onClick={() => setRevisionModalOpen(true)}
            className="px-4 py-2 text-white font-semibold rounded-lg shadow-md transition-opacity hover:opacity-90 flex items-center gap-2 cursor-pointer"
            style={{ backgroundColor: "#4C226A" }}
          >
            <i className="pi pi-file-edit" /> Revizyon İste
          </button>
        )}
      </div>

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

      <Toast ref={toastRef} />

      <Dialog
        header="Revizyon Talebi"
        visible={revisionModalOpen}
        style={{ width: "450px" }}
        modal
        onHide={() => {
          if (!isSubmittingRevision) {
            setRevisionModalOpen(false);
            setRevisionNote("");
          }
        }}
        footer={
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setRevisionModalOpen(false);
                setRevisionNote("");
              }}
              disabled={isSubmittingRevision}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer text-gray-700"
            >
              Vazgeç
            </button>
            <button
              onClick={handleSendRevisionRequest}
              disabled={isSubmittingRevision}
              className="px-4 py-2 rounded-lg text-white font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
              style={{ backgroundColor: "#4C226A" }}
            >
              {isSubmittingRevision && <i className="pi pi-spinner pi-spin" />}
              Talep Et
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-2 pt-2">
          <label htmlFor="revisionNote" className="font-semibold text-gray-700">
            Revizyon Açıklaması
          </label>
          <textarea
            id="revisionNote"
            value={revisionNote}
            onChange={(e) => setRevisionNote(e.target.value)}
            placeholder="Lütfen revizyon notunuzu buraya detaylıca yazın..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            disabled={isSubmittingRevision}
          />
        </div>
      </Dialog>
    </div>
  );
}

