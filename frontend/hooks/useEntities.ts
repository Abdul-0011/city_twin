import { useQuery } from '@tanstack/react-query';
import { fetchCityEntities } from '../lib/api';
import { CityEntity } from '../types/entity';

export function useEntities() {
  return useQuery<CityEntity[], Error>({
    queryKey: ['entities'],
    queryFn: fetchCityEntities,
  });
}
