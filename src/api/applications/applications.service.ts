import apiClient from '../axios';
import type {
  ApplicationsResponse,
  DashboardApplicationsResponse,
  UpdateApplicationStatusRequest,
  UpdateApplicationStatusResponse,
  ApiErrorResponse,
} from './applications.models';

/**
 * Get Applications Service (Detaylı liste için)
 * GET /api/v1/applications
 * @param page - Sayfa numarası (opsiyonel, varsayılan: 1)
 * @param pageSize - Sayfa başına kayıt sayısı (opsiyonel, varsayılan: tümü)
 */
export const getApplications = async (
  page?: number,
  pageSize?: number
): Promise<ApplicationsResponse> => {
  try {
    const params: any = {};
    if (page !== undefined) {
      params.page = page;
    }
    if (pageSize !== undefined) {
      params.pageSize = pageSize;
    }

    const response = await apiClient.get<ApplicationsResponse>(
      '/api/v1/applications',
      { params }
    );

    return response.data;
  } catch (error: any) {
    // Axios error handling
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Başvurular alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Get Dashboard Applications Service (Basit liste için)
 * GET /api/v1/company/dashboard/applications
 */
export const getDashboardApplications = async (): Promise<DashboardApplicationsResponse> => {
  try {
    const response = await apiClient.get<DashboardApplicationsResponse>(
      '/api/v1/company/dashboard/applications'
    );

    return response.data;
  } catch (error: any) {
    // Axios error handling
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Dashboard başvuruları alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Update Application Status Service
 * PUT /api/v1/applications/:id
 */
export const updateApplicationStatus = async (
  applicationId: string,
  status: UpdateApplicationStatusRequest
): Promise<UpdateApplicationStatusResponse> => {
  try {
    const response = await apiClient.put<UpdateApplicationStatusResponse>(
      `/api/v1/applications/${applicationId}`,
      status
    );

    return response.data;
  } catch (error: any) {
    // Axios error handling
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Başvuru durumu güncellenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

