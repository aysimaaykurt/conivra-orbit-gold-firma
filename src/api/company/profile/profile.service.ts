import apiClient from '../../axios';
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  GetProfileResponse,
  ApiErrorResponse,
} from './profile.models';

/**
 * Update Profile Service (POST - Create or Update)
 * POST company/profile
 */
export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  try {
    const response = await apiClient.put<UpdateProfileResponse>('company/profile', data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Profil güncellenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Update Profile Service (PUT - Update by ID)
 * PUT company/profile/:id
 */
export const updateProfileById = async (
  id: string,
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  try {
    const response = await apiClient.put<UpdateProfileResponse>(`company/profile/${id}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Profil güncellenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Get Profile Service
 * GET company/profile
 */
export const getProfile = async (): Promise<GetProfileResponse> => {
  try {
    const response = await apiClient.get<GetProfileResponse>('company/profile');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Profil yüklenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};



