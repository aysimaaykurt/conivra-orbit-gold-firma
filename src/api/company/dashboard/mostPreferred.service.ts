import apiClient from '../../axios';
import type {
  MostPreferredResponse,
  ApiErrorResponse,
} from './mostPreferred.models';

/**
 * Get Most Preferred Service
 * GET company/dashboard/mostPreferred
 */
export const getMostPreferred = async (): Promise<any> => {
  try {
    const response = await apiClient.get<any>('company/dashboard/mostPreferred');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Veriler yüklenirken bir hata oluştu',
    };
  }
};

