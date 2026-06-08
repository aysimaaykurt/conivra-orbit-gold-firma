import apiClient from '../axios';
import type {
  ApplicationsResponse,
  DashboardApplicationsResponse,
  UpdateApplicationStatusRequest,
  UpdateApplicationStatusResponse,
  ApiErrorResponse,
} from './applications.models';

import { applicationsList } from '@/src/mocks/applications';

/**
 * Get Applications Service (Detaylı liste için)
 * GET applications
 * @param page - Sayfa numarası (opsiyonel, varsayılan: 1)
 * @param pageSize - Sayfa başına kayıt sayısı (opsiyonel, varsayılan: tümü)
 */
export const getApplications = async (
  page?: number,
  pageSize?: number
): Promise<ApplicationsResponse> => {
  // Geliştirme ve arayüz kontrolü için doğrudan mock dönülüyor
  let resData = applicationsList;
  if (page && pageSize) {
    const start = (page - 1) * pageSize;
    resData = applicationsList.slice(start, start + pageSize);
  }

  return {
    success: true,
    data: resData,
    message: "Başarılı",
  };
};

import { applications } from '@/src/mocks/dashboard';

/**
 * Get Dashboard Applications Service (Basit liste için)
 * GET company/dashboard/applications
 */
export const getDashboardApplications = async (): Promise<DashboardApplicationsResponse> => {
  // Geliştirme ve kontrol için doğrudan mock dönülüyor
  return {
    success: true,
    data: applications,
    message: "Başarılı",
  };
};

/**
 * Update Application Status Service
 * PUT applications/:id
 */
export const updateApplicationStatus = async (
  applicationId: string,
  status: UpdateApplicationStatusRequest
): Promise<UpdateApplicationStatusResponse> => {
  try {
    const response = await apiClient.put<UpdateApplicationStatusResponse>(
      `applications/${applicationId}`,
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

