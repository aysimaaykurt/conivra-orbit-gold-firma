import apiClient from '../axios';
import type {
  CreateEvaluationRequest,
  CreateEvaluationResponse,
  GetEvaluationResponse,
  ApiErrorResponse,
} from './evaluation.models';

/**
 * Create Evaluation Service
 * POST /api/v1/applications/Evaluation
 */
export const createEvaluation = async (
  data: CreateEvaluationRequest
): Promise<CreateEvaluationResponse> => {
  try {
    const response = await apiClient.post<CreateEvaluationResponse>(
      '/api/v1/applications/Evaluation',
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Değerlendirme oluşturulurken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

/**
 * Get Evaluation Service
 * GET /api/v1/applications/Evaluation/:id
 */
export const getEvaluation = async (
  id: string
): Promise<GetEvaluationResponse> => {
  try {
    const response = await apiClient.get<GetEvaluationResponse>(
      `/api/v1/applications/Evaluation/${id}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data as ApiErrorResponse;
    }
    throw {
      success: false,
      message: error.message || 'Değerlendirme alınırken bir hata oluştu',
    } as ApiErrorResponse;
  }
};

