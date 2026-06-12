import { useState, useEffect } from 'react';
import { getSectors, Sector } from '../api/sectors/sectors.service';

export interface FormattedSector {
  value: string;
  label: string;
}

export const useSectors = () => {
  const [sectors, setSectors] = useState<FormattedSector[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchSectors = async () => {
      try {
        setIsLoading(true);
        const data = await getSectors();
        if (mounted) {
          const normalizedSectors = data.map(sec => ({
            value: String(sec.value ?? sec.id ?? (sec as any).sectorId ?? ''),
            label: String(sec.label || sec.name || (sec as any).sectorName || '')
          }));
          
          if (normalizedSectors.length === 0) {
            setSectors([]);
          } else {
            setSectors(normalizedSectors as any);
          }
        }
      } catch (err) {
        if (mounted) {
          console.error("Error fetching sectors:", err);
          setError("Sektörler yüklenemedi.");
          setSectors([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSectors();

    return () => {
      mounted = false;
    };
  }, []);

  return { sectors, isLoading, error };
};
