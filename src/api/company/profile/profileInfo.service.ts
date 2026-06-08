import apiClient from '../../axios';
import type {
  GetProfileInfoResponse,
  ApiErrorResponse,
} from './profileInfo.models';

/**
 * Get Profile Info Service
 * GET company/profileInfo
 */
export const getProfileInfo = async (): Promise<GetProfileInfoResponse> => {
  try {
    const response = await apiClient.get<GetProfileInfoResponse>(
      'company/profileInfo'
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Profil istatistikleri alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

