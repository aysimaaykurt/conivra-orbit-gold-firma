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
    formData.append('platformPreference', data.platformPreference);
    formData.append('followerRange', data.followerRange);
    formData.append('contentType', data.contentType);
    formData.append('businessType', data.businessType);

    // Add image if provided
    if (data.image) {
      console.log('--- UPLOADING IMAGE (Add) ---', data.image.name, data.image.type, data.image.size);
      formData.append('image', data.image);
    } else {
      console.log('--- NO IMAGE PROVIDED (Add) ---');
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
    formData.append('platformPreference', data.platformPreference);
    formData.append('followerRange', data.followerRange);
    formData.append('contentType', data.contentType);
    formData.append('businessType', data.businessType);

    // Add image if provided
    if (data.image) {
      console.log('--- UPLOADING IMAGE (Update) ---', data.image.name, data.image.type, data.image.size);
      formData.append('image', data.image);
    } else {
      console.log('--- NO IMAGE PROVIDED (Update) ---');
    }

    console.log('--- FormData Entries (Update) ---');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    const response = await apiClient.put<UpdateAdvertisementResponse>(
      `Advertisements/addAd/${id}`,
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
    const response = await apiClient.get<GetAdvertisementResponse>(
      `Advertisements/addAd/${id}`
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
    const response = await apiClient.delete(`Advertisements/deleteAd/${id}`);
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

