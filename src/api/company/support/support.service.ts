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
  try {
    const response = await apiClient.post<CreateSupportResponse>('company/support', data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Destek talebi oluşturulurken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

export const getSupports = async (
  page?: number,
  pageSize?: number,
  searchTerm?: string
): Promise<GetSupportsListResponse> => {
  try {
    const params: any = {};
    if (page) params.page = page;
    if (pageSize) params.pageSize = pageSize;
    if (searchTerm) params.searchTerm = searchTerm;

    const response = await apiClient.get<GetSupportsListResponse>('company/support', { params });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Destek talepleri alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

