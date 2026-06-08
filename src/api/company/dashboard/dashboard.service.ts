import apiClient from '../../axios';
import type {
  DashboardStatsResponse,
  ApiErrorResponse,
} from './dashboard.models';

/**
 * Get Dashboard Stats Service
 * GET company/dashboard/stats
 */
import { infoCards } from '@/src/mocks/dashboard';

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  // Geliştirme/arayüz kontrolü için mock verisi dönülüyor
  return {
    success: true,
    data: infoCards,
    message: "Başarılı",
  };
};

