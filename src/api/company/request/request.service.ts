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
  try {
    const response = await apiClient.post<CreateRequestResponse>('company/request', data);
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

export const getRequests = async (
  page?: number,
  pageSize?: number,
  searchTerm?: string
): Promise<GetRequestsListResponse> => {
  try {
    const params: any = {};
    if (page) params.page = page;
    if (pageSize) params.pageSize = pageSize;
    if (searchTerm) params.searchTerm = searchTerm;

    const response = await apiClient.get<GetRequestsListResponse>('company/request', { params });
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

