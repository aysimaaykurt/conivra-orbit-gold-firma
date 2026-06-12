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

    return [];
  } catch (error) {
    console.error('Sektörler çekilirken hata oluştu:', error);
    return [];
  }
};
