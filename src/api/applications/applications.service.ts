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
  paramsObj?: import('./applications.models').GetApplicationsParams
): Promise<ApplicationsResponse> => {
  try {
    const params: Record<string, any> = {};
    if (paramsObj) {
      Object.entries(paramsObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params[key] = value;
        }
      });
    }

    const response = await apiClient.get<ApplicationsResponse>('applications', { params });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Başvurular yüklenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Get Dashboard Applications Service (Basit liste için)
 * GET company/dashboard/applications
 */
export const getDashboardApplications = async (): Promise<DashboardApplicationsResponse> => {
  try {
    const response = await apiClient.get<DashboardApplicationsResponse>('company/dashboard/applications');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Başvurular yüklenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
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
    const cleanId = applicationId.replace(/^(app)-/i, '');
    const response = await apiClient.put<UpdateApplicationStatusResponse>(
      `applications/${cleanId}`,
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

/**
 * Get Application Detail Service
 * Uses GET /applications list endpoint and filters by ID client-side,
 * since GET /applications/{id} is not available (405).
 * Searches across all adTypes to find the matching application.
 */
export const getApplicationDetail = async (
  id: string
): Promise<import('./applications.models').ApplicationDetailResponse> => {
  try {
    const response = await apiClient.get<import('./applications.models').ApplicationDetailResponse>(
      `applications/${id}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Başvuru detayı yüklenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Evaluate Application Service
 * POST applications/Evaluation/{id}
 */
export const evaluateApplication = async (
  id: string,
  data: import('./applications.models').EvaluateApplicationRequest
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `applications/Evaluation/${id}`,
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Değerlendirme gönderilirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Bulk Update Application Status Service (PATCH)
 * PATCH applications/bulk-status
 */
export const bulkUpdateApplicationStatus = async (
  data: import('./applications.models').BulkUpdateApplicationStatusRequest
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.patch<{ success: boolean; message: string }>(
      'applications/bulk-status',
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Toplu durum güncellemesi yapılırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Request Revision Service (POST)
 * POST applications/{id}/revision
 */
export const requestApplicationRevision = async (
  id: string,
  data: import('./applications.models').RequestRevisionRequest
): Promise<{ success: boolean; message: string }> => {
  try {
    const cleanId = id.replace(/^(app)-/i, '');
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `applications/${cleanId}/revision`,
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Revizyon istenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Approve Submission Service
 * POST applications/{id}/approve-submission
 */
export const approveSubmission = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const cleanId = id.replace(/^(app)-/i, '');
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `applications/${cleanId}/approve-submission`
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'İş onayı sırasında bir hata oluştu',
    } as ApiErrorResponse;
  }
};
