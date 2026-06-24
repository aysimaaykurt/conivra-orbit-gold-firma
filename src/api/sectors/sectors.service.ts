import apiClient from '../axios';

export interface Sector {
  id: string | number;
  name: string;
  value?: string;
  label?: string;
}

export const getSectors = async (): Promise<Sector[]> => {
  try {
    const response = await apiClient.get('/company/profile/sectors');
    
    // Support various formats the backend might return
    if (response.data?.success && response.data.data?.sectors && Array.isArray(response.data.data.sectors)) {
      return response.data.data.sectors;
    }
    
    if (response.data?.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }

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
      if (firstArray) return firstArray as Sector[];
    }

    return [];
  } catch (error) {
    console.error('Sektörler çekilirken hata oluştu:', error);
    return [];
  }
};
