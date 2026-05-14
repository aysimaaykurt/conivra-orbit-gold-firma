import apiClient from '../../axios';
import type {
  CreateRequestRequest,
  CreateRequestResponse,
  GetRequestsListResponse,
  ApiErrorResponse,
} from './request.models';

/**
 * Create Request Service
 * POST /api/v1/company/request
 */
export const createRequest = async (
  data: CreateRequestRequest
): Promise<CreateRequestResponse> => {
  try {
    const response = await apiClient.post<CreateRequestResponse>(
      '/api/v1/company/request',
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Talep oluşturulurken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Get Requests List Service
 * GET /api/v1/company/request
 * @param page - Sayfa numarası (opsiyonel)
 * @param pageSize - Sayfa başına kayıt sayısı (opsiyonel)
 * @param searchTerm - Arama terimi (opsiyonel)
 */
export const getRequests = async (
  page?: number,
  pageSize?: number,
  searchTerm?: string
): Promise<GetRequestsListResponse> => {
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

    const response = await apiClient.get<GetRequestsListResponse>(
      '/api/v1/company/request',
      { params }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Talepler alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

