export type EntityType =
  | 'ROAD_SEGMENT'
  | 'INTERSECTION'
  | 'SENSOR'
  | 'BUILDING'
  | 'TRANSIT_STOP';

export interface CityEntity {
  id: string; // UUID
  name: string;
  type: EntityType;
  latitude: number;
  longitude: number;
}

export interface EntityTypeMeta {
  label: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  iconSvg?: string;
}

export const ENTITY_TYPE_CONFIG: Record<EntityType, EntityTypeMeta> = {
  ROAD_SEGMENT: {
    label: 'Road Segment',
    color: '#f59e0b', // Amber
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    badgeText: 'text-amber-700 dark:text-amber-400',
  },
  INTERSECTION: {
    label: 'Intersection',
    color: '#6366f1', // Indigo
    badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    badgeText: 'text-indigo-700 dark:text-indigo-400',
  },
  SENSOR: {
    label: 'Sensor',
    color: '#10b981', // Emerald
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    badgeText: 'text-emerald-700 dark:text-emerald-400',
  },
  BUILDING: {
    label: 'Building',
    color: '#f43f5e', // Rose
    badgeBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    badgeText: 'text-rose-700 dark:text-rose-400',
  },
  TRANSIT_STOP: {
    label: 'Transit Stop',
    color: '#a855f7', // Purple
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    badgeText: 'text-purple-700 dark:text-purple-400',
  },
};
