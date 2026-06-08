import apiClient from '../../axios';
import type {
  MostPreferredResponse,
  ApiErrorResponse,
} from './mostPreferred.models';

/**
 * Get Most Preferred Service
 * GET company/dashboard/mostPreferred
 */
import { mostPreferred } from '@/src/mocks/dashboard';

export const getMostPreferred = async (): Promise<MostPreferredResponse> => {
  // Geliştirme/kontrol için doğrudan mock dönülüyor
  return {
    success: true,
    data: mostPreferred,
    message: "Başarılı",
  };
};

