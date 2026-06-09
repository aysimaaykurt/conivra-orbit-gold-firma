import apiClient from '../axios';
import type {
  AddGiftKitRequest,
  UpdateGiftKitRequest,
  AddGiftKitResponse,
  UpdateGiftKitResponse,
  GetGiftKitResponse,
  GetGiftKitsListResponse,
  ApiErrorResponse,
} from './giftKits.models';

/**
 * Add Gift Kit Service
 * POST Advertisements/addGiftKit
 */
export const addGiftKit = async (
  data: AddGiftKitRequest
): Promise<AddGiftKitResponse> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();

    // Add all text fields
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category', data.category);
    formData.append('targetAudience', data.targetAudience);
    formData.append('followerRange', data.followerRange);
    formData.append('platformPreference', data.platformPreference);
    formData.append('businessType', data.businessType);
    formData.append('contentType', data.contentType);

    // Add image if provided
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await apiClient.post<AddGiftKitResponse>(
      'Advertisements/addGiftKit',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Hediye kiti eklenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Update Gift Kit Service
 * PUT Advertisements/addGiftKit/:id
 */
export const updateGiftKit = async (
  id: string,
  data: UpdateGiftKitRequest
): Promise<UpdateGiftKitResponse> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();

    // Add all text fields
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category', data.category);
    formData.append('targetAudience', data.targetAudience);
    formData.append('followerRange', data.followerRange);
    formData.append('platformPreference', data.platformPreference);
    formData.append('businessType', data.businessType);
    formData.append('contentType', data.contentType);

    // Add image if provided
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await apiClient.put<UpdateGiftKitResponse>(
      `Advertisements/addGiftKit/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Hediye kiti güncellenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Get Gift Kit Service (Single)
 * GET Advertisements/addGiftKit/:id
 */
export const getGiftKit = async (
  id: string
): Promise<GetGiftKitResponse> => {
  try {
    const response = await apiClient.get<GetGiftKitResponse>(
      `Advertisements/addGiftKit/${id}`
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Hediye kiti alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Get Gift Kits List Service
 * GET Advertisements/addGiftKit
 * @param page - Sayfa numarası (opsiyonel)
 * @param pageSize - Sayfa başına kayıt sayısı (opsiyonel)
 * @param searchTerm - Arama terimi (opsiyonel)
 */
export const getGiftKits = async (
  paramsObj?: import('./giftKits.models').GetGiftKitsParams
): Promise<GetGiftKitsListResponse> => {
  try {
    const params: Record<string, any> = {};
    if (paramsObj) {
      Object.entries(paramsObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params[key] = value;
        }
      });
    }

    const response = await apiClient.get<GetGiftKitsListResponse>(
      'Advertisements/addGiftKit',
      { params }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Hediye kitleri alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

