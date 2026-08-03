'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { SimulationResult } from '../../types/simulation';

// Register all required Chart.js components once at module level
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ---------------------------------------------------------------------------
// Shared chart theme helpers (dark palette matching zinc-900 shell)
// ---------------------------------------------------------------------------
const CHART_COLORS = {
  indigo: 'rgb(99, 102, 241)',
  indigoAlpha: 'rgba(99, 102, 241, 0.15)',
  amber: 'rgb(245, 158, 11)',
  amberAlpha: 'rgba(245, 158, 11, 0.15)',
  emerald: 'rgb(16, 185, 129)',
  emeraldAlpha: 'rgba(16, 185, 129, 0.15)',
  rose: 'rgb(244, 63, 94)',
  roseAlpha: 'rgba(244, 63, 94, 0.15)',
  zinc400: 'rgb(161, 161, 170)',
  zinc700: 'rgb(63, 63, 70)',
  zinc800: 'rgb(39, 39, 42)',
} as const;

const SHARED_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 400 },
  plugins: {
    legend: {
      labels: {
        color: CHART_COLORS.zinc400,
        font: { size: 10, family: 'var(--font-geist-sans, ui-sans-serif)' },
        boxWidth: 10,
        padding: 12,
      },
    },
    tooltip: {
      backgroundColor: 'rgb(24, 24, 27)',
      borderColor: CHART_COLORS.zinc700,
      borderWidth: 1,
      titleColor: CHART_COLORS.zinc400,
      bodyColor: '#ffffff',
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      ticks: { color: CHART_COLORS.zinc400, font: { size: 9 }, maxRotation: 0 },
      grid: { color: CHART_COLORS.zinc800 },
      border: { color: CHART_COLORS.zinc700 },
    },
    y: {
      ticks: { color: CHART_COLORS.zinc400, font: { size: 9 } },
      grid: { color: CHART_COLORS.zinc800 },
      border: { color: CHART_COLORS.zinc700 },
    },
  },
} as const;

// ---------------------------------------------------------------------------
// KPI card component
// ---------------------------------------------------------------------------
interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: React.ReactNode;
}

function KpiCard({ label, value, sub, color, icon }: KpiCardProps) {
  return (
    <div
      className="flex-1 min-w-0 rounded-xl p-3.5 border border-zinc-800 bg-zinc-950/60
                  hover:border-zinc-700 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
          {label}
        </span>
        <span style={{ color }} className="opacity-70">
          {icon}
        </span>
      </div>
      <p className="text-lg font-bold font-mono tabular-nums" style={{ color }}>
        {value}
      </p>
      <p className="text-[10px] text-zinc-500 mt-0.5">{sub}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="w-12 h-12 mb-3 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <p className="text-xs font-semibold text-zinc-400 mb-1">No simulation data yet</p>
      <p className="text-[11px] text-zinc-600 max-w-[200px] leading-relaxed">
        Adjust the parameters above and click{' '}
        <span className="text-indigo-400 font-medium">Run Simulation</span> to see analytics.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------
function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-label="Loading simulation results">
      <div className="flex gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-16 rounded-xl bg-zinc-800" />
        ))}
      </div>
      <div className="h-40 rounded-xl bg-zinc-800" />
      <div className="h-36 rounded-xl bg-zinc-800" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component props
// ---------------------------------------------------------------------------
interface AnalyticsPanelProps {
  result: SimulationResult | null;
  isLoading: boolean;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function AnalyticsPanel({ result, isLoading }: AnalyticsPanelProps) {
  // Derive chart data only when result changes
  const charts = useMemo(() => {
    if (!result) return null;

    const { snapshots } = result;

    // X-axis labels — hour of day
    const labels = snapshots.map((s) => {
      const h = new Date(s.timestamp).getUTCHours();
      return `${String(h).padStart(2, '0')}:00`;
    });

    // Chart 1: Commute time + congestion (dual-metric line)
    const commuteLineData = {
      labels,
      datasets: [
        {
          label: 'Avg Commute (min)',
          data: snapshots.map((s) => +s.avgCommuteTime.toFixed(1)),
          borderColor: CHART_COLORS.indigo,
          backgroundColor: CHART_COLORS.indigoAlpha,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
          yAxisID: 'yLeft',
        },
        {
          label: 'Congestion Index',
          data: snapshots.map((s) => +s.congestionIndex.toFixed(1)),
          borderColor: CHART_COLORS.rose,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [4, 3],
          pointRadius: 0,
          tension: 0.4,
          fill: false,
          yAxisID: 'yRight',
        },
      ],
    };

    // Chart 2: Energy use bar chart (every 3 h for readability)
    const energyBars = snapshots.filter((_, i) => i % 3 === 0);
    const energyBarData = {
      labels: energyBars.map((s) => {
        const h = new Date(s.timestamp).getUTCHours();
        return `${String(h).padStart(2, '0')}:00`;
      }),
      datasets: [
        {
          label: 'Energy Use / Zone (MWh)',
          data: energyBars.map((s) => +s.energyUsePerZone.toFixed(1)),
          backgroundColor: CHART_COLORS.amberAlpha,
          borderColor: CHART_COLORS.amber,
          borderWidth: 1.5,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'CO₂ Emissions (t)',
          data: energyBars.map((s) => +s.co2EmissionsTonnes.toFixed(1)),
          backgroundColor: CHART_COLORS.emeraldAlpha,
          borderColor: CHART_COLORS.emerald,
          borderWidth: 1.5,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };

    // KPI values — use peak and end-of-day snapshots
    const peak = snapshots.reduce((best, s) =>
      s.congestionIndex > best.congestionIndex ? s : best
    );
    const latest = snapshots[snapshots.length - 1];
    const avgCommute =
      snapshots.reduce((sum, s) => sum + s.avgCommuteTime, 0) / snapshots.length;

    return { commuteLineData, energyBarData, peak, latest, avgCommute };
  }, [result]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Analytics &amp; Metrics
          </h3>
          {result && (
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Scenario run — 24-hour snapshot
            </p>
          )}
        </div>
        {result && (
          <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Ready
          </span>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : !charts ? (
        <EmptyState />
      ) : (
        <div className="space-y-5">
          {/* KPI row */}
          <div className="flex gap-2 flex-wrap">
            <KpiCard
              label="Peak Congestion"
              value={charts.peak.congestionIndex.toFixed(0)}
              sub={`at ${new Date(charts.peak.timestamp).getUTCHours()}:00`}
              color={CHART_COLORS.rose}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
            <KpiCard
              label="Avg Commute"
              value={`${charts.avgCommute.toFixed(0)} min`}
              sub="daily average"
              color={CHART_COLORS.indigo}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <KpiCard
              label="End-Day Energy"
              value={`${charts.latest.energyUsePerZone.toFixed(0)} MWh`}
              sub="per zone at 23:00"
              color={CHART_COLORS.amber}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
            <KpiCard
              label="CO₂ Today"
              value={`${charts.latest.co2EmissionsTonnes.toFixed(0)} t`}
              sub="end-of-day estimate"
              color={CHART_COLORS.emerald}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              }
            />
          </div>

          {/* Line chart: commute time + congestion overlay */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Commute &amp; Congestion — 24 h
            </p>
            <div className="h-40">
              <Line
                data={charts.commuteLineData}
                options={{
                  ...SHARED_CHART_OPTIONS,
                  plugins: {
                    ...SHARED_CHART_OPTIONS.plugins,
                    legend: {
                      ...SHARED_CHART_OPTIONS.plugins.legend,
                      position: 'bottom' as const,
                    },
                  },
                  scales: {
                    x: SHARED_CHART_OPTIONS.scales.x,
                    yLeft: {
                      ...SHARED_CHART_OPTIONS.scales.y,
                      position: 'left' as const,
                      title: {
                        display: false,
                      },
                    },
                    yRight: {
                      ...SHARED_CHART_OPTIONS.scales.y,
                      position: 'right' as const,
                      grid: { drawOnChartArea: false, color: CHART_COLORS.zinc800 },
                      border: { color: CHART_COLORS.zinc700 },
                      ticks: { color: CHART_COLORS.zinc400, font: { size: 9 } },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Bar chart: energy + CO2 */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Energy &amp; Emissions — Sampled
            </p>
            <div className="h-36">
              <Bar
                data={charts.energyBarData}
                options={{
                  ...SHARED_CHART_OPTIONS,
                  plugins: {
                    ...SHARED_CHART_OPTIONS.plugins,
                    legend: {
                      ...SHARED_CHART_OPTIONS.plugins.legend,
                      position: 'bottom' as const,
                    },
                  },
                  scales: {
                    x: SHARED_CHART_OPTIONS.scales.x,
                    y: SHARED_CHART_OPTIONS.scales.y,
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
