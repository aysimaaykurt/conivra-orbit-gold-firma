import { useState, useEffect } from 'react';
import { getCities, getDistricts, type LocationItem } from '@/src/api/locations/locations.service';

export const useLocations = () => {
  const [cities, setCities] = useState<{ label: string; value: string; id: string | number }[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        const data = await getCities();
        setCities(data.map(city => ({
          label: city.name,
          value: city.name, // Use name as value for backend compatibility
          id: city.id
        })));
      } catch (error) {
        console.error("Failed to load cities", error);
      } finally {
        setIsLoadingCities(false);
      }
    };
    
    fetchCities();
  }, []);

  const fetchDistricts = async (cityNameOrId: string | number) => {
    try {
      if (!cityNameOrId) return [];
      
      let cityId = cityNameOrId;
      let currentCities = cities;

      // If cities are not loaded yet (e.g., during edit mode initialization), fetch them
      if (currentCities.length === 0) {
        const data = await getCities();
        currentCities = data.map(city => ({
          label: city.name,
          value: city.name,
          id: city.id
        }));
      }

      // If we pass a name, find its corresponding ID from the loaded cities
      if (currentCities.length > 0) {
        const foundCity = currentCities.find(c => c.value === cityNameOrId || c.id === cityNameOrId);
        if (foundCity) {
          cityId = foundCity.id;
        }
      }

      const data = await getDistricts(cityId);
      return data.map(district => ({
        label: district.name,
        value: district.name, // Use name as value for backend compatibility
        id: district.id
      }));
    } catch (error) {
      console.error("Failed to load districts", error);
      return [];
    }
  };

  return {
    cities,
    isLoadingCities,
    fetchDistricts
  };
};
