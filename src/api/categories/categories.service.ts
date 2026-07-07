import apiClient from '../axios';

export interface Category {
  id: string | number;
  name: string;
  sectorId?: string | number;
  value?: string;
  label?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get('/Categories/list');
    
    // Support various formats the backend might return
    if (response.data?.success && response.data.data?.categories && Array.isArray(response.data.data.categories)) {
      return response.data.data.categories;
    }
    
    if (response.data?.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Direct array response fallback
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // Fallback for wrapped items
    if (response.data?.success && response.data.data?.items && Array.isArray(response.data.data.items)) {
      return response.data.data.items;
    }
    
    // Object values fallback
    if (response.data?.success && typeof response.data.data === 'object' && !Array.isArray(response.data.data)) {
      const firstArray = Object.values(response.data.data).find(val => Array.isArray(val));
      if (firstArray) return firstArray as Category[];
    }

    return [];
  } catch (error) {
    console.error('Kategoriler çekilirken hata oluştu:', error);
    return [];
  }
};

export const getCategoriesBySector = async (sectorId: string | number): Promise<Category[]> => {
  try {
    const response = await apiClient.get(`/sectors/${sectorId}/categories`);
    
    // Support various formats the backend might return
    if (response.data?.success && response.data.data?.categories && Array.isArray(response.data.data.categories)) {
      return response.data.data.categories;
    }
    
    if (response.data?.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Direct array response fallback
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // Fallback for wrapped items
    if (response.data?.success && response.data.data?.items && Array.isArray(response.data.data.items)) {
      return response.data.data.items;
    }
    
    // Object values fallback
    if (response.data?.success && typeof response.data.data === 'object' && !Array.isArray(response.data.data)) {
      const firstArray = Object.values(response.data.data).find(val => Array.isArray(val));
      if (firstArray) return firstArray as Category[];
    }

    return [];
  } catch (error) {
    console.error(`Sektöre (${sectorId}) ait kategoriler çekilirken hata oluştu:`, error);
    return [];
  }
};
