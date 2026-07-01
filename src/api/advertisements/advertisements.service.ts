import apiClient from '../axios';
import type {
  AddAdvertisementRequest,
  UpdateAdvertisementRequest,
  AddAdvertisementResponse,
  UpdateAdvertisementResponse,
  GetAdvertisementResponse,
  GetAdvertisementsListResponse,
  ApiErrorResponse,
} from './advertisements.models';

/**
 * Add Advertisement Service
 * POST Advertisements/addAd
 */
export const addAdvertisement = async (
  data: AddAdvertisementRequest
): Promise<AddAdvertisementResponse> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();

    // Add all text fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);
    formData.append('city', data.city);
    formData.append('district', data.district);
    formData.append('address', data.address);
    formData.append('sector', data.sector);
    formData.append('category', data.category);
    formData.append('services', data.services);
    formData.append('guestCount', data.guestCount);
    // Append array fields properly
    if (Array.isArray(data.platformPreference)) {
      formData.append('platformPreference', data.platformPreference.join(','));
    } else if (data.platformPreference) {
      formData.append('platformPreference', data.platformPreference);
    }

    formData.append('followerRange', data.followerRange);
    formData.append('businessType', data.businessType);
    
    if (data.latitude) {
      formData.append('latitude', data.latitude.toString().replace('.', ','));
    }
    if (data.longitude) {
      formData.append('longitude', data.longitude.toString().replace('.', ','));
    }

    if (Array.isArray(data.contentType)) {
      data.contentType.forEach(c => formData.append('contentType', c));
    } else if (data.contentType) {
      formData.append('contentType', data.contentType);
    }

    // Add images if provided
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        console.log('--- UPLOADING IMAGE (Add) ---', image.name, image.type, image.size);
        formData.append('images', image);
      });
    } else {
      console.log('--- NO IMAGES PROVIDED (Add) ---');
    }

    console.log('--- FormData Entries (Add) ---');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    const response = await apiClient.post<AddAdvertisementResponse>(
      'Advertisements/addAd',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('--- addAd Response ---', response.data);
    return response.data;
  } catch (error: any) {
    console.error('--- addAd ERROR ---', error.response?.data || error.message || error);
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'İlan eklenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Update Advertisement Service
 * PUT Advertisements/addAd/:id
 */
export const updateAdvertisement = async (
  id: string,
  data: UpdateAdvertisementRequest
): Promise<UpdateAdvertisementResponse> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();

    // Add all text fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);
    formData.append('city', data.city);
    formData.append('district', data.district);
    formData.append('address', data.address);
    formData.append('sector', data.sector);
    formData.append('category', data.category);
    formData.append('services', data.services);
    formData.append('guestCount', data.guestCount);
    // Append array fields properly
    if (Array.isArray(data.platformPreference)) {
      formData.append('platformPreference', data.platformPreference.join(','));
    } else if (data.platformPreference) {
      formData.append('platformPreference', data.platformPreference);
    }

    formData.append('followerRange', data.followerRange);
    formData.append('businessType', data.businessType);
    
    if (data.latitude) {
      formData.append('latitude', data.latitude.toString().replace('.', ','));
    }
    if (data.longitude) {
      formData.append('longitude', data.longitude.toString().replace('.', ','));
    }

    if (Array.isArray(data.contentType)) {
      data.contentType.forEach(c => formData.append('contentType', c));
    } else if (data.contentType) {
      formData.append('contentType', data.contentType);
    }

    // Add images if provided
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        console.log('--- UPLOADING IMAGE (Update) ---', image.name, image.type, image.size);
        formData.append('images', image);
      });
    } else {
      console.log('--- NO IMAGES PROVIDED (Update) ---');
    }

    console.log('--- FormData Entries (Update) ---');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    const cleanId = id.replace(/^(ad|workshop|gift-kit|gift_kit|app)-/i, '');
    const response = await apiClient.put<UpdateAdvertisementResponse>(
      `Advertisements/addAd/${cleanId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('--- updateAd Response ---', response.data);
    return response.data;
  } catch (error: any) {
    console.error('--- updateAd ERROR ---', error.response?.data || error.message || error);
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'İlan güncellenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Get Advertisement Service (Single)
 * GET Advertisements/addAd/:id
 */
export const getAdvertisement = async (
  id: string
): Promise<GetAdvertisementResponse> => {
  try {
    const cleanId = id.replace(/^(ad|workshop|gift-kit|gift_kit|app)-/i, '');
    const response = await apiClient.get<GetAdvertisementResponse>(
      `Advertisements/addAd/${cleanId}`
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'İlan alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Get Advertisements List Service
 * GET Advertisements/addAd
 * @param page - Sayfa numarası (opsiyonel)
 * @param pageSize - Sayfa başına kayıt sayısı (opsiyonel)
 * @param searchTerm - Arama terimi (opsiyonel)
 */
export const getAdvertisements = async (
  paramsObj?: import('./advertisements.models').GetAdvertisementsParams
): Promise<GetAdvertisementsListResponse> => {
  try {
    const params: Record<string, any> = {};
    if (paramsObj) {
      Object.entries(paramsObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params[key] = value;
        }
      });
    }

    const response = await apiClient.get<GetAdvertisementsListResponse>(
      'Advertisements/addAd',
      { params }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'İlanlar alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Delete Advertisement Service
 * DELETE Advertisements/deleteAd/:id
 */
export const deleteAdvertisement = async (id: string): Promise<any> => {
  try {
    const cleanId = id.replace(/^(ad|workshop|gift-kit|gift_kit|app)-/i, '');
    const response = await apiClient.delete(`Advertisements/deleteAd/${cleanId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'İlan silinirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Delete Advertisement Image Service
 * DELETE Advertisements/deleteImage/:imageId
 */
export const deleteAdImage = async (imageId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `Advertisements/deleteImage/${imageId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Görsel silinirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Update Advertisement Status Service (PATCH)
 * PATCH Advertisements/:id/status
 */
export const updateAdvertisementStatus = async (
  id: string,
  status: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const cleanId = id.replace(/^(ad|workshop|gift-kit|gift_kit|app)-/i, '');
    const response = await apiClient.patch<{ success: boolean; message: string }>(
      `Advertisements/${cleanId}/status`,
      { status }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'İlan durumu güncellenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Pause Advertisement Service
 * POST advertisements/:id/pause
 */
export const pauseAdvertisement = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const cleanId = id.replace(/^(ad|workshop|gift-kit|gift_kit|app)-/i, '');
    const response = await apiClient.post<{ success: boolean; message: string }>(
      `advertisements/${cleanId}/pause`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'İlan durdurulurken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Duplicate Advertisement Service
 * POST Advertisements/:id/duplicate
 */
export const duplicateAdvertisement = async (
  id: string
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const cleanId = id.replace(/^(ad|workshop|gift-kit|gift_kit|app)-/i, '');
    const response = await apiClient.post<{ success: boolean; message: string; data?: any }>(
      `Advertisements/${cleanId}/duplicate`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'İlan kopyalanırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

