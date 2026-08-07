'use client';

import React from 'react';
import { useEntities } from '../hooks/useEntities';
import BaseMap from '../components/map/BaseMap';
import SidebarPanel from '../components/dashboard/SidebarPanel';

export default function DashboardPage() {
  const { data: entities = [], isLoading, isError, error, refetch } = useEntities();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black tracking-wider text-sm shadow-md shadow-indigo-600/30">
              CT
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-100 tracking-tight">
                City Twin
              </h1>
              <p className="text-xs text-zinc-400">
                Urban Infrastructure Simulator & Digital Twin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>API:</span>
              <span className="text-zinc-200 truncate max-w-[180px]">
                {apiUrl}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400">
              <span>Entities:</span>
              <span className="text-indigo-400 font-bold">
                {isLoading ? '...' : entities.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
        {/* Map Area */}
        <div className="flex-1 flex flex-col min-h-[500px] lg:min-h-[600px] h-full">
          {isLoading ? (
            <div className="w-full h-full min-h-[500px] rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center gap-3 p-6 text-center shadow-inner">
              <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-zinc-400">
                Fetching city entities from backend...
              </p>
            </div>
          ) : isError ? (
            <div className="w-full h-full min-h-[500px] rounded-xl border border-rose-900/50 bg-rose-950/20 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 mb-3 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-rose-200 mb-1">
                Failed to Load Entities
              </h3>
              <p className="text-xs text-rose-300/80 max-w-md mb-4 font-mono">
                {error?.message || 'Unable to connect to backend REST API.'}
              </p>
              <p className="text-xs text-zinc-400 max-w-md mb-6 leading-relaxed">
                Ensure your Spring Boot backend is running on{' '}
                <code className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-200 font-mono">
                  {apiUrl}
                </code>{' '}
                and permits CORS requests.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors border border-zinc-700"
              >
                Retry Request
              </button>
            </div>
          ) : entities.length === 0 ? (
            <div className="flex-1 flex flex-col">
              <div className="mb-3 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
                <span>
                  No entities found in backend database yet. Map rendering in default view.
                </span>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="underline hover:text-amber-200 font-medium"
                >
                  Refresh
                </button>
              </div>
              <BaseMap entities={entities} />
            </div>
          ) : (
            <BaseMap entities={entities} />
          )}
        </div>

        {/* Sidebar Controls & Legend */}
        <SidebarPanel entities={entities} />
      </main>
    </div>
  );
}
