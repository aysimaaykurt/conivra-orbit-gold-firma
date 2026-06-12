import apiClient from '../axios';

export interface LocationItem {
  id: number | string;
  name: string;
}

export const getCities = async (): Promise<LocationItem[]> => {
  try {
    const response = await apiClient.get('/Locations/cities');
    const data = response.data?.data || response.data || [];
    return data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

export const getDistricts = async (cityId: number | string): Promise<LocationItem[]> => {
  try {
    if (!cityId) return [];
    const response = await apiClient.get(`/Locations/cities/${cityId}/districts`);
    const data = response.data?.data || response.data || [];
    return data;
  } catch (error) {
    console.error(`Error fetching districts for city ${cityId}:`, error);
    return [];
  }
};
