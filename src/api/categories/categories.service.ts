import apiClient from '../axios';

export interface Category {
  id: string | number;
  name: string;
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

    return [];
  } catch (error) {
    console.error('Kategoriler çekilirken hata oluştu:', error);
    return [];
  }
};
