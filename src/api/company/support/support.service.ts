import apiClient from '../../axios';
import type {
  CreateSupportRequest,
  CreateSupportResponse,
  GetSupportsListResponse,
  ApiErrorResponse,
} from './support.models';

/**
 * Create Support Service
 * POST company/support
 */
import { SupportStatus } from './supportStatus.enum';

export const createSupport = async (
  data: CreateSupportRequest
): Promise<CreateSupportResponse> => {
  // Şimdilik API bağlantısı iptal edildi
  return {
    success: true,
    message: "Destek talebi başarıyla oluşturuldu (Kontrol Modu)",
    data: { id: "sup-mock", title: data.title, type: data.type },
  };
};

export const getSupports = async (
  page?: number,
  pageSize?: number,
  searchTerm?: string
): Promise<GetSupportsListResponse> => {
  const mockSupports = [
    {
      id: "sup-1",
      title: "Gold Statü Avantajları Nelerdir?",
      type: "Genel Soru",
      description: "Gold pakete geçiş yaptık, influencer aramalarında öne çıkma kuralı nasıl işliyor?",
      status: SupportStatus.ANSWERED,
      createDate: "2026-05-11T11:20:00Z",
    },
    {
      id: "sup-2",
      title: "Hediye Kiti Kargo Entegrasyonu",
      type: "Entegrasyon",
      description: "Tanımladığımız hediye kitleri için otomatik kargo barkodu veriliyor mu?",
      status: SupportStatus.PENDING,
      createDate: "2026-05-13T08:45:00Z",
    },
  ];

  return {
    success: true,
    data: mockSupports,
    message: "Başarılı",
  };
};

