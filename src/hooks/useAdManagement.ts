import { useState, useEffect, useCallback } from 'react';
import { getAdvertisements } from '@/src/api/advertisements/advertisements.service';
import { getWorkshops } from '@/src/api/advertisements/workshops.service';
import { getGiftKits } from '@/src/api/advertisements/giftKits.service';
import type { Advertisement } from '@/src/api/advertisements/advertisements.models';
import type { Workshop } from '@/src/api/advertisements/workshops.models';
import type { GiftKit } from '@/src/api/advertisements/giftKits.models';
import { AdCategory } from '@/src/mocks/adManagement';

type AdItem = Advertisement | Workshop | GiftKit;

interface UseAdManagementResult {
  data: AdItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAdManagement = (activeTab: AdCategory, filters: Record<string, any> = {}): UseAdManagementResult => {
  const [data, setData] = useState<AdItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAds = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response: any;
      if (activeTab === 'ilan') {
        response = await getAdvertisements(filters);
      } else if (activeTab === 'workshop') {
        response = await getWorkshops(filters);
      } else if (activeTab === 'hediye_kiti') {
        response = await getGiftKits(filters);
      }

      if (response && response.success && response.data) {
        setData(response.data);
      } else {
        setError(response?.message || 'İlanlar yüklenemedi');
        setData([]);
      }
    } catch (err: any) {
      setError(err.message || 'İlanlar alınırken beklenmeyen bir hata oluştu.');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, JSON.stringify(filters)]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchAds,
  };
};
