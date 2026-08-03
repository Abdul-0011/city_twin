'use client';

import React, { useState } from 'react';
import { CityEntity, ENTITY_TYPE_CONFIG, EntityType } from '../../types/entity';
import { SimulationResult } from '../../types/simulation';
import ScenarioControls from './ScenarioControls';
import AnalyticsPanel from './AnalyticsPanel';

interface SidebarPanelProps {
  entities: CityEntity[];
}

export default function SidebarPanel({ entities }: SidebarPanelProps) {
  // Shared simulation state — lifted here so ScenarioControls and
  // AnalyticsPanel stay in sync without an external context.
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Count entities by type for the legend card
  const counts = entities.reduce<Record<EntityType, number>>(
    (acc, entity) => {
      acc[entity.type] = (acc[entity.type] || 0) + 1;
      return acc;
    },
    {
      ROAD_SEGMENT: 0,
      INTERSECTION: 0,
      SENSOR: 0,
      BUILDING: 0,
      TRANSIT_STOP: 0,
    }
  );

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex flex-col gap-6 flex-shrink-0">
      {/* Entity Summary & Legend Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Entity Breakdown
          </h3>
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {entities.length} Total
          </span>
        </div>

        <div className="space-y-2.5">
          {(Object.keys(ENTITY_TYPE_CONFIG) as EntityType[]).map((type) => {
            const config = ENTITY_TYPE_CONFIG[type];
            const count = counts[type] || 0;

            return (
              <div
                key={type}
                className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-xs font-medium text-zinc-200">
                    {config.label}
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-zinc-400">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scenario Controls */}
      <ScenarioControls
        onResult={setSimulationResult}
        isLoading={isSimulating}
        setIsLoading={setIsSimulating}
      />

      {/* Analytics Panel */}
      <AnalyticsPanel
        result={simulationResult}
        isLoading={isSimulating}
      />
    </aside>
  );
}
