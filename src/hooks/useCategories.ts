import { useState, useEffect } from 'react';
import { getCategories, Category } from '../api/categories/categories.service';

export interface FormattedCategory {
  value: string;
  label: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<FormattedCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getCategories();
        if (mounted) {
          // Normalize category data whether it comes as {id, name} or {value, label}
          const normalizedCategories = data.map(cat => ({
            value: String(cat.value || cat.id || (cat as any).categoryId || ''),
            label: String(cat.label || cat.name || (cat as any).categoryName || '')
          }));
          
          // Fallback if data is empty or invalid
          if (normalizedCategories.length === 0) {
            setCategories([]);
          } else {
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
  }, []);

  return { categories, isLoading, error };
};
