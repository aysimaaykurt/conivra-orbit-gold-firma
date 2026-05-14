"use client";

import { useState, useEffect } from "react";
import SupportTabs from "@/components/support/SupportTabs";
import CreateDropdown from "@/components/support/CreateDropdown";
import RequestsTable from "@/components/support/RequestsTable";
import SupportsTable from "@/components/support/SupportsTable";
import RequestModal from "@/components/support/RequestModal";
import SupportModal from "@/components/support/SupportModal";
import Pagination from "@/components/support/Pagination";
import { getRequests, createRequest } from "@/src/api/company/request/request.service";
import { getSupports, createSupport } from "@/src/api/company/support/support.service";
import { Request } from "@/src/api/company/request/request.models";
import { Support } from "@/src/api/company/support/support.models";
import { RequestFormValues } from "@/components/support/CreateRequestForm";
import { SupportFormValues } from "@/components/support/CreateSupportForm";
import { Toast } from "@/components/ui/toast";
import { useRef } from "react";
import type { TabType } from "@/src/mocks/supportRequests";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<TabType>("taleplerim");
  const [requests, setRequests] = useState<Request[]>([]);
  const [supports, setSupports] = useState<Support[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const toastRef = useRef<any>(null);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === "taleplerim") {
          const response = await getRequests(currentPage, itemsPerPage);
          if (response.success && response.data) {
            setRequests(response.data);
            // Backend'den pagination bilgisi gelirse kullan, yoksa hesapla
            setTotalItems(response.data.length);
            setTotalPages(Math.ceil(response.data.length / itemsPerPage));
          }
        } else {
          const response = await getSupports(currentPage, itemsPerPage);
          if (response.success && response.data) {
            setSupports(response.data);
            setTotalItems(response.data.length);
            setTotalPages(Math.ceil(response.data.length / itemsPerPage));
          }
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toastRef.current?.show({
          severity: "error",
          summary: "Hata",
          detail: error.message || "Veriler yüklenirken bir hata oluştu",
          life: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, currentPage]);

  const handleCreateRequest = () => {
    setIsRequestModalOpen(true);
  };

  const handleCreateSupport = () => {
    setIsSupportModalOpen(true);
  };

  const handleRequestSubmit = async (values: RequestFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await createRequest({
        title: values.title,
        type: values.type,
        description: values.description,
      });

      if (response.success) {
        toastRef.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: response.message || "Talep başarıyla oluşturuldu",
          life: 3000,
        });

        setIsRequestModalOpen(false);
        // Refresh data
        const refreshResponse = await getRequests(currentPage, itemsPerPage);
        if (refreshResponse.success && refreshResponse.data) {
          setRequests(refreshResponse.data);
        }
      }
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Hata",
        detail: error.message || "Talep oluşturulurken bir hata oluştu",
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupportSubmit = async (values: SupportFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await createSupport({
        title: values.title,
        type: values.type,
        description: values.description,
      });

      if (response.success) {
        toastRef.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: response.message || "Destek başarıyla oluşturuldu",
          life: 3000,
        });

        setIsSupportModalOpen(false);
        // Refresh data
        const refreshResponse = await getSupports(currentPage, itemsPerPage);
        if (refreshResponse.success && refreshResponse.data) {
          setSupports(refreshResponse.data);
        }
      }
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Hata",
        detail: error.message || "Destek oluşturulurken bir hata oluştu",
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast ref={toastRef} />
      <div className="p-6 bg-[#F7F6F9] min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: "#4C226A" }}>
            Taleplerim / Desteklerim
          </h1>
          <CreateDropdown
            onCreateSupport={handleCreateSupport}
            onCreateRequest={handleCreateRequest}
          />
        </div>

        <div className="mb-4">
          <SupportTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === "taleplerim" ? (
          <>
            <RequestsTable requests={requests} isLoading={isLoading} />
            {!isLoading && requests.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <>
            <SupportsTable supports={supports} isLoading={isLoading} />
            {!isLoading && supports.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        <RequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          onSubmit={handleRequestSubmit}
          isLoading={isSubmitting}
        />

        <SupportModal
          isOpen={isSupportModalOpen}
          onClose={() => setIsSupportModalOpen(false)}
          onSubmit={handleSupportSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </>
  );
}

