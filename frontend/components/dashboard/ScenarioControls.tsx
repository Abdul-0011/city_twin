'use client';

import React, { useState } from 'react';
import { ScenarioParams, SimulationResult } from '../../types/simulation';
import { generateMockResult } from '../../lib/mockSimulation';

// ---------------------------------------------------------------------------
// Default parameter values
// ---------------------------------------------------------------------------
const DEFAULT_PARAMS: ScenarioParams = {
  populationGrowthRate: 1.5,
  transitRouteCount: 20,
  evAdoptionRate: 0.3,
  remoteWorkFraction: 0.25,
  infrastructureInvestmentMultiplier: 1.0,
};

// ---------------------------------------------------------------------------
// Prop types
// ---------------------------------------------------------------------------
interface ScenarioControlsProps {
  onResult: (result: SimulationResult | null) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

// ---------------------------------------------------------------------------
// Small sub-component: a labelled slider row
// ---------------------------------------------------------------------------
interface SliderRowProps {
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  value: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  id: string;
}

function SliderRow({ label, hint, min, max, step, value, format, onChange, id }: SliderRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-medium text-zinc-300">
          {label}
        </label>
        <span className="text-xs font-mono font-semibold text-indigo-400 tabular-nums">
          {format(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                   bg-zinc-700 accent-indigo-500
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900"
        aria-label={`${label}: ${format(value)}`}
      />
      <p className="text-[10px] text-zinc-500 leading-tight">{hint}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function ScenarioControls({ onResult, isLoading, setIsLoading }: ScenarioControlsProps) {
  const [params, setParams] = useState<ScenarioParams>(DEFAULT_PARAMS);

  function setParam<K extends keyof ScenarioParams>(key: K, value: ScenarioParams[K]) {
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  async function handleRunSimulation() {
    setIsLoading(true);
    onResult(null); // clear stale results immediately

    // Artificial latency — mimics a real network round-trip
    await new Promise((resolve) => setTimeout(resolve, 600));

    const result = generateMockResult(params);
    onResult(result);
    setIsLoading(false);
  }

  function handleReset() {
    setParams(DEFAULT_PARAMS);
    onResult(null);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Scenario Controls
          </h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Tune parameters then run a simulation
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase text-indigo-400">Mock</span>
        </div>
      </div>

      {/* Parameter sliders */}
      <div className="space-y-5">
        <SliderRow
          id="param-pop-growth"
          label="Population Growth Rate"
          hint="Annual growth rate fed into demand models"
          min={0}
          max={5}
          step={0.1}
          value={params.populationGrowthRate}
          format={(v) => `${v.toFixed(1)}%`}
          onChange={(v) => setParam('populationGrowthRate', v)}
        />

        <SliderRow
          id="param-transit-routes"
          label="Transit Route Count"
          hint="Active bus, tram, and metro lines in the scenario"
          min={5}
          max={60}
          step={1}
          value={params.transitRouteCount}
          format={(v) => `${v}`}
          onChange={(v) => setParam('transitRouteCount', v)}
        />

        <SliderRow
          id="param-ev-adoption"
          label="EV Fleet Adoption"
          hint="Share of vehicles that are electric"
          min={0}
          max={1}
          step={0.01}
          value={params.evAdoptionRate}
          format={(v) => `${(v * 100).toFixed(0)}%`}
          onChange={(v) => setParam('evAdoptionRate', v)}
        />

        <SliderRow
          id="param-remote-work"
          label="Remote Work Fraction"
          hint="Share of workforce working from home"
          min={0}
          max={0.8}
          step={0.01}
          value={params.remoteWorkFraction}
          format={(v) => `${(v * 100).toFixed(0)}%`}
          onChange={(v) => setParam('remoteWorkFraction', v)}
        />

        <SliderRow
          id="param-infra-invest"
          label="Infrastructure Investment"
          hint="Budget multiplier vs. baseline (1× = no change)"
          min={0.5}
          max={3}
          step={0.1}
          value={params.infrastructureInvestmentMultiplier}
          format={(v) => `${v.toFixed(1)}×`}
          onChange={(v) => setParam('infrastructureInvestmentMultiplier', v)}
        />
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex gap-2">
        <button
          id="btn-run-simulation"
          type="button"
          onClick={handleRunSimulation}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold
                     rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700
                     text-white transition-colors shadow-md shadow-indigo-600/20
                     disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Run simulation with current parameters"
        >
          {isLoading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Running…
            </>
          ) : (
            <>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Run Simulation
            </>
          )}
        </button>

        <button
          id="btn-reset-params"
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="px-3 py-2.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700
                     active:bg-zinc-600 text-zinc-300 transition-colors border border-zinc-700
                     disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Reset parameters to defaults"
          title="Reset to defaults"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Disclaimer */}
      <p className="mt-3 text-[10px] text-zinc-600 leading-relaxed">
        ⚡ Results are generated from mock data. Replace{' '}
        <code className="font-mono text-zinc-500">lib/mockSimulation.ts</code> with a real{' '}
        <code className="font-mono text-zinc-500">POST /simulate</code> call when the backend is ready.
      </p>
    </div>
  );
}
