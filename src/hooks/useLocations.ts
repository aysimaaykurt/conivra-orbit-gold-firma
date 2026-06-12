import { useState, useEffect } from 'react';
import { getCities, getDistricts, type LocationItem } from '@/src/api/locations/locations.service';

export const useLocations = () => {
  const [cities, setCities] = useState<{ label: string; value: string | number }[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        const data = await getCities();
        setCities(data.map(city => ({
          label: city.name,
          value: city.id
        })));
      } catch (error) {
        console.error("Failed to load cities", error);
      } finally {
        setIsLoadingCities(false);
      }
    };
    
    fetchCities();
  }, []);

  const fetchDistricts = async (cityId: string | number) => {
    try {
      const data = await getDistricts(cityId);
      return data.map(district => ({
        label: district.name,
        value: district.id
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
