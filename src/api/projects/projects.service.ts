import apiClient from '../axios';
import type { GetProjectsParams, GetProjectsResponse } from './projects.models';

/**
 * Get Projects List Service
 * GET Advertisements/projects-list
 */
export const getProjectsList = async (
  paramsObj?: GetProjectsParams
): Promise<GetProjectsResponse> => {
  try {
    const params: Record<string, any> = {};
    if (paramsObj) {
      Object.entries(paramsObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params[key] = value;
        }
      });
    }

    const response = await apiClient.get<GetProjectsResponse>(
      'Advertisements/projects-list',
      { params }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: error.message || 'Projeler alınırken bir hata oluştu',
    };
  }
};
