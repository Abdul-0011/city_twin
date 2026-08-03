'use client';

import React, { useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CityEntity, ENTITY_TYPE_CONFIG } from '../../types/entity';

interface BaseMapProps {
  entities: CityEntity[];
}

export default function BaseMap({ entities }: BaseMapProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [selectedEntity, setSelectedEntity] = useState<CityEntity | null>(null);

  // If mapboxToken is missing, render a friendly inline alert/guide
  if (!mapboxToken) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center shadow-inner">
        <div className="w-14 h-14 mb-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-100 mb-2">
          Mapbox Token Required
        </h3>
        <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
          The Mapbox access token is missing. Please add your access token to{' '}
          <code className="px-2 py-1 rounded bg-zinc-800 text-amber-300 font-mono text-xs">
            .env.local
          </code>{' '}
          in the frontend directory to enable map tiles.
        </p>
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300 text-left w-full max-w-md overflow-x-auto">
          <span className="text-zinc-500"># .env.local</span>
          <br />
          <span className="text-amber-400">NEXT_PUBLIC_MAPBOX_TOKEN</span>=
          <span className="text-emerald-400">pk.eyJ1Ijo...</span>
        </div>
      </div>
    );
  }

  // Calculate default viewport center from entities or default to SF coordinates
  const initialLongitude =
    entities.length > 0
      ? entities.reduce((sum, e) => sum + e.longitude, 0) / entities.length
      : -122.4194;

  const initialLatitude =
    entities.length > 0
      ? entities.reduce((sum, e) => sum + e.latitude, 0) / entities.length
      : 37.7749;

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
      <Map
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: initialLongitude,
          latitude: initialLatitude,
          zoom: 12,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        <NavigationControl position="top-right" />

        {/* Map Markers for each entity */}
        {entities.map((entity) => {
          const typeConfig = ENTITY_TYPE_CONFIG[entity.type] || {
            label: entity.type,
            color: '#3b82f6',
            badgeBg: 'bg-blue-500/10',
            badgeText: 'text-blue-400',
          };

          return (
            <Marker
              key={entity.id}
              longitude={entity.longitude}
              latitude={entity.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedEntity(entity);
              }}
            >
              <button
                type="button"
                className="group relative flex items-center justify-center transition-transform duration-200 hover:scale-125 focus:outline-none"
                title={`${entity.name} (${typeConfig.label})`}
              >
                {/* Marker Ping Pulse */}
                <span
                  className="absolute inline-flex h-6 w-6 rounded-full opacity-75 animate-ping"
                  style={{ backgroundColor: typeConfig.color }}
                />
                {/* Marker Pin */}
                <span
                  className="relative inline-flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-zinc-900 text-white font-bold text-xs"
                  style={{ backgroundColor: typeConfig.color }}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white/90" />
                </span>
              </button>
            </Marker>
          );
        })}

        {/* Selected Entity Popup */}
        {selectedEntity && (
          <Popup
            longitude={selectedEntity.longitude}
            latitude={selectedEntity.latitude}
            anchor="top"
            onClose={() => setSelectedEntity(null)}
            closeOnClick={false}
            className="city-twin-popup"
          >
            <div className="p-2 min-w-[200px] text-zinc-900">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="font-semibold text-sm text-zinc-900 leading-snug">
                  {selectedEntity.name}
                </h4>
              </div>
              <div className="mb-2">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                    ENTITY_TYPE_CONFIG[selectedEntity.type]?.badgeBg ||
                    'bg-zinc-100'
                  } ${
                    ENTITY_TYPE_CONFIG[selectedEntity.type]?.badgeText ||
                    'text-zinc-800'
                  }`}
                >
                  {ENTITY_TYPE_CONFIG[selectedEntity.type]?.label ||
                    selectedEntity.type}
                </span>
              </div>
              <div className="text-[11px] text-zinc-500 font-mono space-y-0.5 border-t border-zinc-100 pt-1.5">
                <div>Lat: {selectedEntity.latitude.toFixed(5)}</div>
                <div>Lng: {selectedEntity.longitude.toFixed(5)}</div>
                <div className="text-[10px] text-zinc-400 truncate pt-1">
                  ID: {selectedEntity.id}
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
