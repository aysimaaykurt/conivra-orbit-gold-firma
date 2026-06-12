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
    formData.append('contentType', data.contentType);
    formData.append('workshopGoal', data.workshopGoal);
    formData.append('workshopContent', data.workshopContent);

    // Add image if provided
    if (data.image) {
      formData.append('image', data.image);
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
    formData.append('contentType', data.contentType);
    formData.append('workshopGoal', data.workshopGoal);
    formData.append('workshopContent', data.workshopContent);

    // Add image if provided
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await apiClient.put<UpdateWorkshopResponse>(
      `Advertisements/addWorkshop/${id}`,
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
    const response = await apiClient.get<GetWorkshopResponse>(
      `Advertisements/addWorkshop/${id}`
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
    const response = await apiClient.delete(`Advertisements/deleteWorkshop/${id}`);
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

