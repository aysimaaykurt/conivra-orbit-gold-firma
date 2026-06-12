import apiClient from '../../axios';
import type {
  CreateSupportRequest,
  CreateSupportResponse,
  GetSupportsListResponse,
  UpdateSupportRequest,
  BasicResponse,
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

/**
 * Update Support Service
 * PUT company/support/{id}
 */
export const updateSupport = async (
  id: string,
  data: UpdateSupportRequest
): Promise<BasicResponse> => {
  try {
    const numericId = id.replace(/^(req-|sup-)/, '');
    const response = await apiClient.put<BasicResponse>(`company/support/${numericId}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Destek talebi güncellenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Delete Support Service
 * DELETE company/support/{id}
 */
export const deleteSupport = async (
  id: string
): Promise<BasicResponse> => {
  try {
    const numericId = id.replace(/^(req-|sup-)/, '');
    const response = await apiClient.delete<BasicResponse>(`company/support/${numericId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Destek talebi silinirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

