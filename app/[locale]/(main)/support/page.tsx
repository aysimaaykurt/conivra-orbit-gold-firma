"use client";

import { useState, useEffect } from "react";
import SupportTabs from "@/components/support/SupportTabs";
import CreateDropdown from "@/components/support/CreateDropdown";
import RequestsTable from "@/components/support/RequestsTable";
import SupportsTable from "@/components/support/SupportsTable";
import RequestModal from "@/components/support/RequestModal";
import SupportModal from "@/components/support/SupportModal";
import Pagination from "@/components/support/Pagination";
import { getRequests, createRequest, updateRequest, deleteRequest } from "@/src/api/company/request/request.service";
import { getSupports, createSupport, updateSupport, deleteSupport } from "@/src/api/company/support/support.service";
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
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; type: 'request' | 'support' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedSupport, setSelectedSupport] = useState<Support | null>(null);
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
          if (response && response.success) {
            const items = Array.isArray(response.data) ? response.data : ((response.data as any)?.items || []);
            setRequests(items);
            setTotalItems((response.data as any)?.totalCount || items.length);
            setTotalPages((response.data as any)?.totalPages || Math.ceil(items.length / itemsPerPage) || 1);
          } else {
            setRequests([]);
          }
        } else {
          const response = await getSupports(currentPage, itemsPerPage);
          if (response && response.success) {
            const items = Array.isArray(response.data) ? response.data : ((response.data as any)?.items || []);
            setSupports(items);
            setTotalItems((response.data as any)?.totalCount || items.length);
            setTotalPages((response.data as any)?.totalPages || Math.ceil(items.length / itemsPerPage) || 1);
          } else {
            setSupports([]);
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
    setSelectedRequest(null);
    setIsRequestModalOpen(true);
  };

  const handleEditRequest = (request: Request) => {
    setSelectedRequest(request);
    setIsRequestModalOpen(true);
  };

  const handleDeleteRequest = (request: Request) => {
    setDeleteModal({ isOpen: true, id: request.id, type: 'request' });
  };

  const handleCreateSupport = () => {
    setSelectedSupport(null);
    setIsSupportModalOpen(true);
  };

  const handleEditSupport = (support: Support) => {
    setSelectedSupport(support);
    setIsSupportModalOpen(true);
  };

  const handleDeleteSupport = (support: Support) => {
    setDeleteModal({ isOpen: true, id: support.id, type: 'support' });
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    setIsDeleting(true);
    try {
      if (deleteModal.type === 'request') {
        const response = await deleteRequest(deleteModal.id);
        if (response.success) {
          toastRef.current?.show({
            severity: "success",
            summary: "Başarılı",
            detail: response.message || "Talep başarıyla silindi",
            life: 3000,
          });
          const refreshResponse = await getRequests(currentPage, itemsPerPage);
          if (refreshResponse.success && refreshResponse.data) {
            const dataArray = Array.isArray(refreshResponse.data) 
              ? refreshResponse.data 
              : ((refreshResponse.data as any).items || []);
            setRequests(dataArray);
          }
        }
      } else {
        const response = await deleteSupport(deleteModal.id);
        if (response.success) {
          toastRef.current?.show({
            severity: "success",
            summary: "Başarılı",
            detail: response.message || "Destek başarıyla silindi",
            life: 3000,
          });
          const refreshResponse = await getSupports(currentPage, itemsPerPage);
          if (refreshResponse.success && refreshResponse.data) {
            const dataArray = Array.isArray(refreshResponse.data) 
              ? refreshResponse.data 
              : ((refreshResponse.data as any).items || []);
            setSupports(dataArray);
          }
        }
      }
      setDeleteModal(null);
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Hata",
        detail: error.message || "Silinirken bir hata oluştu",
        life: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRequestSubmit = async (values: RequestFormValues) => {
    setIsSubmitting(true);
    try {
      let response;
      if (selectedRequest) {
        response = await updateRequest(selectedRequest.id, {
          title: values.title,
          type: values.type,
          description: values.description,
        });
      } else {
        response = await createRequest({
          title: values.title,
          type: values.type,
          description: values.description,
        });
      }

      if (response.success) {
        toastRef.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: response.message || (selectedRequest ? "Talep başarıyla güncellendi" : "Talep başarıyla oluşturuldu"),
          life: 3000,
        });

        setIsRequestModalOpen(false);
        setActiveTab("taleplerim");
        // Refresh data
        const refreshResponse = await getRequests(currentPage, itemsPerPage);
        if (refreshResponse && refreshResponse.success) {
          const items = Array.isArray(refreshResponse.data) ? refreshResponse.data : ((refreshResponse.data as any)?.items || []);
          setRequests(items);
          setTotalItems((refreshResponse.data as any)?.totalCount || items.length);
          setTotalPages((refreshResponse.data as any)?.totalPages || Math.ceil(items.length / itemsPerPage) || 1);
        }
      }
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Hata",
        detail: error.message || (selectedRequest ? "Talep güncellenirken bir hata oluştu" : "Talep oluşturulurken bir hata oluştu"),
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupportSubmit = async (values: SupportFormValues) => {
    setIsSubmitting(true);
    try {
      let response;
      if (selectedSupport) {
        response = await updateSupport(selectedSupport.id, {
          title: values.title,
          type: values.type,
          description: values.description,
        });
      } else {
        response = await createSupport({
          title: values.title,
          type: values.type,
          description: values.description,
        });
      }

      if (response.success) {
        toastRef.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: response.message || (selectedSupport ? "Destek başarıyla güncellendi" : "Destek başarıyla oluşturuldu"),
          life: 3000,
        });

        setIsSupportModalOpen(false);
        setActiveTab("desteklerim");
        // Refresh data
        const refreshResponse = await getSupports(currentPage, itemsPerPage);
        if (refreshResponse && refreshResponse.success) {
          const items = Array.isArray(refreshResponse.data) ? refreshResponse.data : ((refreshResponse.data as any)?.items || []);
          setSupports(items);
          setTotalItems((refreshResponse.data as any)?.totalCount || items.length);
          setTotalPages((refreshResponse.data as any)?.totalPages || Math.ceil(items.length / itemsPerPage) || 1);
        }
      }
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Hata",
        detail: error.message || (selectedSupport ? "Destek güncellenirken bir hata oluştu" : "Destek oluşturulurken bir hata oluştu"),
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
            <RequestsTable 
              requests={requests} 
              isLoading={isLoading} 
              onEdit={handleEditRequest}
              onDelete={handleDeleteRequest}
            />
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
            <SupportsTable 
              supports={supports} 
              isLoading={isLoading} 
              onEdit={handleEditSupport}
              onDelete={handleDeleteSupport}
            />
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
          onClose={() => {
            setIsRequestModalOpen(false);
            setSelectedRequest(null);
          }}
          onSubmit={handleRequestSubmit}
          isLoading={isSubmitting}
          initialData={selectedRequest ? {
            title: selectedRequest.title,
            type: selectedRequest.type,
            description: selectedRequest.description
          } : undefined}
        />

        <SupportModal
          isOpen={isSupportModalOpen}
          onClose={() => {
            setIsSupportModalOpen(false);
            setSelectedSupport(null);
          }}
          onSubmit={handleSupportSubmit}
          isLoading={isSubmitting}
          initialData={selectedSupport ? {
            title: selectedSupport.title,
            type: selectedSupport.type,
            description: selectedSupport.description
          } : undefined}
        />
      </div>

      {/* Delete Modal */}
      {deleteModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl transform transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <i className="pi pi-exclamation-triangle text-red-500 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Silmek İstediğinize Emin Misiniz?</h3>
              <p className="text-gray-500 mb-6">
                Bu kaydı silmek üzeresiniz. Bu işlem geri alınamaz. Onaylıyor musunuz?
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  İptal Et
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? <i className="pi pi-spinner pi-spin"></i> : <i className="pi pi-trash"></i>}
                  {isDeleting ? "Siliniyor..." : "Evet, Sil"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

