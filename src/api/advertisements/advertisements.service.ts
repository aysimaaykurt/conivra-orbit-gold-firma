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
      formData.append('image', data.image);
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

    return response.data;
  } catch (error: any) {
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
      formData.append('image', data.image);
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

    return response.data;
  } catch (error: any) {
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
  page?: number,
  pageSize?: number,
  searchTerm?: string
): Promise<GetAdvertisementsListResponse> => {
  try {
    const params: any = {};
    if (page !== undefined) {
      params.page = page;
    }
    if (pageSize !== undefined) {
      params.pageSize = pageSize;
    }
    if (searchTerm !== undefined && searchTerm.trim() !== '') {
      params.searchTerm = searchTerm;
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

