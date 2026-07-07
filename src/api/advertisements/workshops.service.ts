import apiClient from '../axios';
import type {
  AddWorkshopRequest,
  UpdateWorkshopRequest,
  AddWorkshopResponse,
  UpdateWorkshopResponse,
  GetWorkshopResponse,
  GetWorkshopsListResponse,
  ApiErrorResponse,
} from './workshops.models';

/**
 * Add Workshop Service
 * POST Advertisements/addWorkshop
 */
export const addWorkshop = async (
  data: AddWorkshopRequest
): Promise<AddWorkshopResponse> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();

    // Add all text fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);
    formData.append('duration', data.duration);
    formData.append('city', data.city);
    formData.append('district', data.district);
    formData.append('address', data.address);
    formData.append('category', data.category);
    formData.append('targetAudience', data.targetAudience);
    formData.append('participantCount', data.participantCount);
    formData.append('participationCondition', data.participationCondition);
    formData.append('fee', data.fee);
    if (data.sector) {
      formData.append('sector', data.sector);
    }
    // Append array fields properly
    if (Array.isArray(data.contentType)) {
      data.contentType.forEach(c => formData.append('contentType', c));
    } else if (data.contentType) {
      formData.append('contentType', data.contentType);
    }
    
    formData.append('workshopGoal', data.workshopGoal);
    formData.append('workshopContent', data.workshopContent);
    
    if (data.latitude) {
      formData.append('latitude', data.latitude.toString().replace('.', ','));
    }
    if (data.longitude) {
      formData.append('longitude', data.longitude.toString().replace('.', ','));
    }

    // Add images if provided
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const response = await apiClient.post<AddWorkshopResponse>(
      'Advertisements/addWorkshop',
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
      message: error.message || 'Workshop eklenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Update Workshop Service
 * PUT Advertisements/addWorkshop/:id
 */
export const updateWorkshop = async (
  id: string,
  data: UpdateWorkshopRequest
): Promise<UpdateWorkshopResponse> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();

    // Add all text fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);
    formData.append('duration', data.duration);
    formData.append('city', data.city);
    formData.append('district', data.district);
    formData.append('address', data.address);
    formData.append('category', data.category);
    formData.append('targetAudience', data.targetAudience);
    formData.append('participantCount', data.participantCount);
    formData.append('participationCondition', data.participationCondition);
    formData.append('fee', data.fee);
    if (data.sector) {
      formData.append('sector', data.sector);
    }
    
    // Append array fields properly
    if (Array.isArray(data.contentType)) {
      data.contentType.forEach(c => formData.append('contentType', c));
    } else if (data.contentType) {
      formData.append('contentType', data.contentType);
    }
    
    formData.append('workshopGoal', data.workshopGoal);
    formData.append('workshopContent', data.workshopContent);
    
    if (data.latitude) {
      formData.append('latitude', data.latitude.toString().replace('.', ','));
    }
    if (data.longitude) {
      formData.append('longitude', data.longitude.toString().replace('.', ','));
    }

    // Add images if provided
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        console.log('--- UPLOADING IMAGE (Update Workshop) ---', image.name, image.type, image.size);
        formData.append('images', image);
      });
    } else {
      console.log('--- NO IMAGES PROVIDED (Update Workshop) ---');
    }

    const cleanId = id.replace(/^(ad|workshop|gift-kit|gift_kit|app)-/i, '');
    const response = await apiClient.put<UpdateWorkshopResponse>(
      `Advertisements/addWorkshop/${cleanId}`,
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
      message: error.message || 'Workshop güncellenirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Get Workshop Service (Single)
 * GET Advertisements/addWorkshop/:id
 */
export const getWorkshop = async (
  id: string
): Promise<GetWorkshopResponse> => {
  try {
    const cleanId = id.replace(/^(ad|workshop|gift-kit|gift_kit|app)-/i, '');
    const response = await apiClient.get<GetWorkshopResponse>(
      `Advertisements/addWorkshop/${cleanId}`
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Workshop alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Get Workshops List Service
 * GET Advertisements/addWorkshop
 * @param page - Sayfa numarası (opsiyonel)
 * @param pageSize - Sayfa başına kayıt sayısı (opsiyonel)
 * @param searchTerm - Arama terimi (opsiyonel)
 */
export const getWorkshops = async (
  paramsObj?: import('./workshops.models').GetWorkshopsParams
): Promise<GetWorkshopsListResponse> => {
  try {
    const params: Record<string, any> = {};
    if (paramsObj) {
      Object.entries(paramsObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params[key] = value;
        }
      });
    }

    const response = await apiClient.get<GetWorkshopsListResponse>(
      'Advertisements/addWorkshop',
      { params }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Workshoplar alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Delete Workshop Service
 * DELETE Advertisements/deleteWorkshop/:id
 */
export const deleteWorkshop = async (id: string): Promise<any> => {
  try {
    const cleanId = id.replace(/^(ad|workshop|gift-kit|gift_kit|app)-/i, '');
    const response = await apiClient.delete(`Advertisements/deleteWorkshop/${cleanId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Workshop silinirken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

