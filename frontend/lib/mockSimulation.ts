/**
 * lib/mockSimulation.ts
 *
 * Generates deterministic-ish mock SimulationResult data from ScenarioParams.
 * Replace this entire file (or just its call-site in ScenarioControls) when
 * the real /simulate endpoint is live.
 */

import { ScenarioParams, SimulationResult, SimulationSnapshot } from '../types/simulation';

/** Number of hourly snapshots to generate per run (6 h × 24 = one day) */
const TICK_COUNT = 24;

/** Seeded pseudo-random — keeps results reproducible per param set */
function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Generate a mock SimulationResult based on the provided params.
 *
 * Formulas are intentionally simple and non-scientific — just enough to
 * produce visibly responsive output when sliders change.
 */
export function generateMockResult(params: ScenarioParams): SimulationResult {
  const rand = seededRand(
    Math.round(
      params.populationGrowthRate * 1000 +
        params.transitRouteCount * 7 +
        params.evAdoptionRate * 13 +
        params.remoteWorkFraction * 17 +
        params.infrastructureInvestmentMultiplier * 23
    )
  );

  // Derived base values from params  (all placeholder formulas)
  const baseCommute =
    35 +
    params.populationGrowthRate * 4 -
    params.transitRouteCount * 0.8 -
    params.remoteWorkFraction * 10 -
    (params.infrastructureInvestmentMultiplier - 1) * 5;

  const baseEnergy =
    120 +
    params.populationGrowthRate * 6 -
    params.evAdoptionRate * 20 -
    params.remoteWorkFraction * 8;

  const baseCongestion =
    50 +
    params.populationGrowthRate * 8 -
    params.transitRouteCount * 1.2 -
    params.remoteWorkFraction * 12 -
    params.evAdoptionRate * 3 -
    (params.infrastructureInvestmentMultiplier - 1) * 7;

  const baseCO2 =
    200 +
    params.populationGrowthRate * 10 -
    params.evAdoptionRate * 50 -
    params.remoteWorkFraction * 15 -
    params.transitRouteCount * 1.5;

  const snapshots: SimulationSnapshot[] = Array.from({ length: TICK_COUNT }, (_, i) => {
    const hour = i; // 0–23
    // Rush-hour multiplier: peaks at hours 8 and 17
    const rushFactor =
      1 +
      0.4 * Math.exp(-0.5 * ((hour - 8) ** 2) / 4) +
      0.35 * Math.exp(-0.5 * ((hour - 17) ** 2) / 4);

    const noise = () => (rand() - 0.5) * 0.08; // ±4 % noise

    const ts = new Date(`2026-01-15T00:00:00Z`);
    ts.setUTCHours(hour);

    return {
      timestamp: ts.toISOString(),
      avgCommuteTime: Math.max(5, baseCommute * rushFactor * (1 + noise())),
      energyUsePerZone: Math.max(10, baseEnergy * (0.6 + 0.4 * rushFactor) * (1 + noise())),
      congestionIndex: Math.min(100, Math.max(0, baseCongestion * rushFactor * (1 + noise()))),
      co2EmissionsTonnes: Math.max(5, baseCO2 * (0.5 + 0.5 * rushFactor) * (1 + noise())),
    };
  });

  return {
    params,
    snapshots,
    // meta is omitted intentionally — the real backend will supply it
  };
}
