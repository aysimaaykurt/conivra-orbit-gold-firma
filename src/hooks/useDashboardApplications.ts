import { useState, useEffect, useCallback } from 'react';
import { getDashboardApplications } from '@/src/api/applications/applications.service';
import type { Application } from '@/src/api/applications/applications.models';

interface UseDashboardApplicationsResult {
  data: Application[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardApplications = (): UseDashboardApplicationsResult => {
  const [data, setData] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getDashboardApplications();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Başvurular yüklenemedi');
      }
    } catch (err: any) {
      setError(err.message || 'Başvurular alınırken beklenmeyen bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchApplications,
  };
};
