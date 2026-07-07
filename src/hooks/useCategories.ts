import { useState, useEffect } from 'react';
import { getCategories, getCategoriesBySector, Category } from '../api/categories/categories.service';

export interface FormattedCategory {
  value: string;
  label: string;
}

export const useCategories = (sectorId?: string | number) => {
  const [categories, setCategories] = useState<FormattedCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        
        let data: Category[];
        if (sectorId !== undefined && sectorId !== null && sectorId !== "") {
          data = await getCategoriesBySector(sectorId);
        } else {
          data = await getCategories();
        }
        
        if (mounted) {
          const normalizedCategories = data.map(cat => ({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value: String(cat.value ?? cat.id ?? (cat as any).categoryId ?? ''),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label: String(cat.label || cat.name || (cat as any).categoryName || '')
          }));
          
          // Fallback if data is empty or invalid
          if (normalizedCategories.length === 0) {
            setCategories([]);
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setCategories(normalizedCategories as any);
          }
        }
      } catch (err) {
        if (mounted) {
          console.error("Error fetching categories:", err);
          setError("Kategoriler yüklenemedi.");
          setCategories([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, [sectorId]);

  return { categories, isLoading, error };
};
