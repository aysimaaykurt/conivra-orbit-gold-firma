import apiClient from '../axios';
import type {
  CreateEvaluationRequest,
  CreateEvaluationResponse,
  GetEvaluationResponse,
  ApiErrorResponse,
} from './evaluation.models';

/**
 * Create Evaluation Service
 * POST applications/Evaluation
 */
export const createEvaluation = async (
  data: CreateEvaluationRequest
): Promise<CreateEvaluationResponse> => {
  try {
    const cleanData = {
      ...data,
      applicationId: data.applicationId ? data.applicationId.replace(/^(app)-/i, '') : data.applicationId,
      influencerId: data.influencerId ? data.influencerId.replace(/^(inf)-/i, '') : data.influencerId,
    };
    const response = await apiClient.post<CreateEvaluationResponse>(
      'applications/Evaluation',
      cleanData
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
 * GET applications/Evaluation/:id
 */
export const getEvaluation = async (
  id: string
): Promise<GetEvaluationResponse> => {
  try {
    const cleanId = id.replace(/^(app)-/i, '');
    const response = await apiClient.get<GetEvaluationResponse>(
      `applications/Evaluation/${cleanId}`
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

