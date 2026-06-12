import { useState, useEffect, useCallback } from 'react';
import { getApplications } from '@/src/api/applications/applications.service';
import type { ApplicationListItem, GetApplicationsParams } from '@/src/api/applications/applications.models';

interface UseApplicationsResult {
  data: ApplicationListItem[];
  totalItems: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useApplications = (filters: GetApplicationsParams = {}): UseApplicationsResult => {
  const [data, setData] = useState<ApplicationListItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getApplications(filters);
      if (response && response.success && Array.isArray(response.data)) {
        setData(response.data);
        setTotalItems(response.totalItems || response.data.length);
        setTotalPages(response.totalPages || 1);
      } else if (response && response.success && response.data && Array.isArray((response.data as any).items)) {
        // Fallback in case they returned pagination object inside data
        setData((response.data as any).items);
        setTotalItems((response.data as any).totalCount || (response.data as any).items.length);
        setTotalPages((response.data as any).totalPages || 1);
      } else {
        setData([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (err: any) {
      setError(err.message || 'Başvurular alınırken beklenmeyen bir hata oluştu.');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    data,
    totalItems,
    totalPages,
    isLoading,
    error,
    refetch: fetchApplications,
  };
};
