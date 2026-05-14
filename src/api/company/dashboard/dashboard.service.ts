import apiClient from '../../axios';
import type {
  DashboardStatsResponse,
  ApiErrorResponse,
} from './dashboard.models';

/**
 * Get Dashboard Stats Service
 * GET /api/v1/company/dashboard/stats
 */
export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  try {
    const response = await apiClient.get<DashboardStatsResponse>(
      '/api/v1/company/dashboard/stats'
    );

    return response.data;
  } catch (error: any) {
    // Axios error handling
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Dashboard istatistikleri alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

