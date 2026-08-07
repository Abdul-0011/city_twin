import { CityEntity } from '../types/entity';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchCityEntities(): Promise<CityEntity[]> {
  const response = await fetch(`${API_BASE_URL}/api/entities`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch entities: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}
