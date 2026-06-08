import { useState, useEffect, useCallback } from 'react';
import { getDashboardStats } from '@/src/api/company/dashboard/dashboard.service';
import type { DashboardStatsItem } from '@/src/api/company/dashboard/dashboard.models';

interface UseDashboardStatsResult {
  data: DashboardStatsItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardStats = (): UseDashboardStatsResult => {
  const [data, setData] = useState<DashboardStatsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getDashboardStats();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Veriler yüklenemedi');
      }
    } catch (err: any) {
      setError(err.message || 'İstatistikler alınırken beklenmeyen bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchStats,
  };
};
