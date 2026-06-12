import apiClient from '../../axios';
import type {
  DashboardStatsResponse,
  ApiErrorResponse,
} from './dashboard.models';

/**
 * Get Dashboard Stats Service
 * GET company/dashboard/stats
 */
export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  try {
    const response = await apiClient.get<DashboardStatsResponse>('company/dashboard/stats');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Dashboard istatistikleri yüklenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Get Pending Reviews Service
 * GET company/dashboard/pending-review
 */
export const getPendingReviews = async (): Promise<any> => {
  try {
    const response = await apiClient.get<any>('company/dashboard/pending-review');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Bekleyen değerlendirmeler yüklenirken bir hata oluştu',
    };
  }
};

