import apiClient from '../../axios';
import type {
  CreateSupportRequest,
  CreateSupportResponse,
  GetSupportsListResponse,
  ApiErrorResponse,
} from './support.models';

/**
 * Create Support Service
 * POST /api/v1/company/support
 */
export const createSupport = async (
  data: CreateSupportRequest
): Promise<CreateSupportResponse> => {
  try {
    const response = await apiClient.post<CreateSupportResponse>(
      '/api/v1/company/support',
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Destek oluşturulurken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Get Supports List Service
 * GET /api/v1/company/support
 * @param page - Sayfa numarası (opsiyonel)
 * @param pageSize - Sayfa başına kayıt sayısı (opsiyonel)
 * @param searchTerm - Arama terimi (opsiyonel)
 */
export const getSupports = async (
  page?: number,
  pageSize?: number,
  searchTerm?: string
): Promise<GetSupportsListResponse> => {
  try {
    const params: any = {};
    if (page !== undefined) {
      params.page = page;
    }
    if (pageSize !== undefined) {
      params.pageSize = pageSize;
    }
    if (searchTerm !== undefined && searchTerm.trim() !== '') {
      params.searchTerm = searchTerm;
    }

    const response = await apiClient.get<GetSupportsListResponse>(
      '/api/v1/company/support',
      { params }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Destekler alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

