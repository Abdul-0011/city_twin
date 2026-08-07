/**
 * simulation.ts — PLACEHOLDER TYPES for City Twin scenario simulation.
 *
 * ⚠️  THESE ARE MOCK SHAPES — not yet confirmed against the real backend.
 *     Once the `/simulate` endpoint is defined, update these types to match
 *     the actual API contract and remove this notice.
 *
 * Conventions:
 *  - Add/remove fields on ScenarioParams freely; controls in ScenarioControls.tsx
 *    should follow suit.
 *  - SimulationResult mirrors what a POST /simulate response body might look like.
 */

// ---------------------------------------------------------------------------
// Request: parameters the user sends TO the simulation engine
// ---------------------------------------------------------------------------

/**
 * ScenarioParams — the knobs a planner can tweak before running a simulation.
 *
 * Placeholder fields are representative; swap/extend once the real API spec
 * is confirmed.
 */
export interface ScenarioParams {
  /** Projected annual population growth rate, e.g. 1.5 = 1.5 % */
  populationGrowthRate: number;

  /** Number of active transit routes in the scenario (buses, trams, metro lines) */
  transitRouteCount: number;

  /** Ratio of electric vehicles in the vehicle fleet, 0–1 */
  evAdoptionRate: number;

  /** Fraction of the workforce working from home, 0–1 */
  remoteWorkFraction: number;

  /** Placeholder: road-network investment budget multiplier (1 = baseline) */
  infrastructureInvestmentMultiplier: number;
}

// ---------------------------------------------------------------------------
// Response: what the simulation engine sends BACK
// ---------------------------------------------------------------------------

/**
 * A single snapshot in time for one simulation tick.
 *
 * Placeholder metrics — replace / extend once the real API contract is known.
 */
export interface SimulationSnapshot {
  /** ISO-8601 timestamp for this tick, e.g. "2026-01-01T06:00:00Z" */
  timestamp: string;

  /** Average door-to-door commute time across the city, in minutes */
  avgCommuteTime: number;

  /** Mean energy consumed per zone per day, in MWh */
  energyUsePerZone: number;

  /**
   * Dimensionless congestion index — higher = worse.
   * Rough range: 0 (free-flow) to 100 (gridlock).
   */
  congestionIndex: number;

  /** Estimated CO₂ emissions across the city, tonnes/day (placeholder unit) */
  co2EmissionsTonnes: number;
}

/**
 * SimulationResult — the full response from a POST /simulate call.
 *
 * Currently modelled as a time-series array of snapshots.
 * The backend may add a top-level summary envelope around this — adjust as needed.
 */
export interface SimulationResult {
  /** Echoed-back params that produced this run (handy for diff / history) */
  params: ScenarioParams;

  /** Ordered array of time-series snapshots, earliest to latest */
  snapshots: SimulationSnapshot[];

  /**
   * Optional server-side run metadata.
   * Leave undefined in mock data; populate once the API returns it.
   */
  meta?: {
    runId: string;
    durationMs: number;
    generatedAt: string;
  };
}
