import apiClient from '../../axios';
import type {
  MostPreferredResponse,
  ApiErrorResponse,
} from './mostPreferred.models';

/**
 * Get Most Preferred Service
 * GET /api/v1/company/dashboard/mostPreferred
 */
export const getMostPreferred = async (): Promise<MostPreferredResponse> => {
  try {
    const response = await apiClient.get<MostPreferredResponse>(
      '/api/v1/company/dashboard/mostPreferred'
    );

    return response.data;
  } catch (error: any) {
    // Axios error handling
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'En çok tercih edilenler alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

