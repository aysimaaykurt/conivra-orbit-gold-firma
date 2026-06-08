import apiClient from '../../axios';
import type {
  CreateRequestRequest,
  CreateRequestResponse,
  GetRequestsListResponse,
  ApiErrorResponse,
} from './request.models';

/**
 * Create Request Service
 * POST company/request
 */
import { RequestStatus } from './requestStatus.enum';

export const createRequest = async (
  data: CreateRequestRequest
): Promise<CreateRequestResponse> => {
  // Şimdilik API bağlantısı iptal edildi
  return {
    success: true,
    message: "Talep başarıyla oluşturuldu (Kontrol Modu)",
    data: { id: "req-mock", title: data.title, type: data.type },
  };
};

export const getRequests = async (
  page?: number,
  pageSize?: number,
  searchTerm?: string
): Promise<GetRequestsListResponse> => {
  const mockRequests = [
    {
      id: "req-1",
      title: "Mekan İçi Ekran Arızası",
      type: "Teknik Destek",
      description: "Ana salondaki dijital menü ekranında bağlantı kopukluğu var.",
      status: RequestStatus.PENDING,
      createDate: "2026-05-10T10:00:00Z",
    },
    {
      id: "req-2",
      title: "İçerik Üreticisi Ödeme Teyidi",
      type: "Finans",
      description: "Geçen haftaki lansman etkinliği ödemesi hakkında bilgi.",
      status: RequestStatus.IN_PROGRESS,
      createDate: "2026-05-12T14:30:00Z",
    },
    {
      id: "req-3",
      title: "Yeni Menü Fotoğraf Çekimi Talebi",
      type: "Pazarlama",
      description: "Yaz menüsü görselleri için profesyonel çekim ekibi talebi.",
      status: RequestStatus.RESOLVED,
      createDate: "2026-05-01T09:15:00Z",
    },
  ];

  return {
    success: true,
    data: mockRequests,
    message: "Başarılı",
  };
};

