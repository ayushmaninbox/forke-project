'use client'

import React, { useState, useEffect } from 'react'
import { getActiveQueries } from '@/lib/db-client-actions'
import { RefreshCw, Play, ShieldAlert, Cpu, Database, Activity, RefreshCw as LoopIcon } from 'lucide-react'
import { toast } from '@/components/shared/Toast'

interface ActiveQuery {
  pid: number
  query: string
  state: string
  duration: string
  user: string
}

export default function DatabaseMonitoringPanel() {
  const [activeTab, setActiveTab] = useState<'metrics' | 'queries' | 'performance'>('metrics')
  const [queries, setQueries] = useState<ActiveQuery[]>([])
  const [loadingQueries, setLoadingQueries] = useState(false)
  const [timeRange, setTimeRange] = useState<'hour' | 'day'>('hour')

  async function fetchQueries() {
    setLoadingQueries(true)
    const res = await getActiveQueries()
    if (res.success) {
      setQueries(res.queries || [])
    } else {
      toast(res.error || 'Failed to load active queries.', 'error')
    }
    setLoadingQueries(false)
  }

  useEffect(() => {
    if (activeTab === 'queries') {
      fetchQueries()
    }
  }, [activeTab])

  // Mock data paths for the SVG charts
  const ramAllocatedPath = "M 0 100 Q 50 80, 100 90 T 200 60 T 300 70 T 400 80 T 500 50 T 600 70 T 700 90 T 800 80 L 800 150 L 0 150 Z"
  const ramUsedPath = "M 0 130 Q 50 120, 100 115 T 200 125 T 300 110 T 400 120 T 500 105 T 600 115 T 700 125 T 800 130 L 800 150 L 0 150 Z"
  
  const cpuPath = "M 0 120 L 50 110 L 100 125 L 150 70 L 200 80 L 250 130 L 300 60 L 350 75 L 400 120 L 450 115 L 500 40 L 550 55 L 600 120 L 650 90 L 700 110 L 750 65 L 800 125 L 850 150 L 0 150 Z"
  
  return (
    <div className="flex-grow overflow-y-auto p-6 space-y-6 text-left select-none bg-[#070709] text-white font-sans h-full min-h-0">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.04] pb-4 shrink-0">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
            Monitoring
          </h1>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="bg-white/[0.04] border border-white/[0.08] text-white/70 px-2 py-0.5 rounded text-[10px] font-mono">
              production
            </span>
            <span>•</span>
            <span>AWS RDS Serverless Endpoint</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-sans">
          <div className="flex bg-white/[0.03] border border-white/[0.06] p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setTimeRange('hour')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                timeRange === 'hour' ? "bg-white/[0.06] text-white shadow-sm" : "text-white/40 hover:text-white/80"
              }`}
            >
              Last hour
            </button>
            <button
              onClick={() => setTimeRange('day')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                timeRange === 'day' ? "bg-white/[0.06] text-white shadow-sm" : "text-white/40 hover:text-white/80"
              }`}
            >
              Last day
            </button>
          </div>

          <button 
            onClick={activeTab === 'queries' ? fetchQueries : undefined}
            className="p-1.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
            title="Refresh metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        
        <div className="border-b border-white/[0.06] flex items-center gap-5">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`pb-2.5 text-xs font-semibold tracking-wider transition-all relative border-b-2 cursor-pointer ${
              activeTab === 'metrics'
                ? "border-accent text-accent"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            className={`pb-2.5 text-xs font-semibold tracking-wider transition-all relative border-b-2 cursor-pointer ${
              activeTab === 'queries'
                ? "border-accent text-accent"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            Active queries
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`pb-2.5 text-xs font-semibold tracking-wider transition-all relative border-b-2 cursor-pointer ${
              activeTab === 'performance'
                ? "border-accent text-accent"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            Query performance
          </button>
        </div>

        {/* Tab CONTENT: Metrics */}
        {activeTab === 'metrics' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            
            {/* Compute Settings Panel */}
            <div className="lg:col-span-1 border border-white/[0.06] rounded-xl bg-[#0b0b0e] p-4 flex flex-col justify-between min-h-[300px]">
              <div className="space-y-4">
                <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Compute settings</div>
                <div className="space-y-3.5">
                  <div className="space-y-0.5">
                    <div className="text-xs text-white/40">Compute Size</div>
                    <div className="text-sm font-semibold text-white font-mono">0.25 CU ↔ 2 CU</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs text-white/40">Allocated Memory</div>
                    <div className="text-sm font-semibold text-white">~1 GB RAM (up to 8 GB max)</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs text-white/40">Autosuspend delay</div>
                    <div className="text-sm font-semibold text-white">5 minutes (default)</div>
                  </div>
                </div>
              </div>

              <button className="w-full py-1.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer text-center">
                Edit endpoint settings
              </button>
            </div>

            {/* RAM Chart */}
            <div className="lg:col-span-3 border border-white/[0.06] rounded-xl bg-[#0b0b0e] p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white/70">RAM Usage</span>
                <div className="flex gap-4 text-[10px] font-mono">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-emerald-500/80" /> Allocated</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-accent/80" /> Used</span>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="h-44 w-full relative mt-4">
                <svg className="w-full h-full" viewBox="0 0 800 150" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="37" x2="800" y2="37" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="75" x2="800" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="112" x2="800" y2="112" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                  {/* Shaded Area for Allocated */}
                  <path d={ramAllocatedPath} fill="url(#allocatedGrad)" />
                  {/* Shaded Area for Used */}
                  <path d={ramUsedPath} fill="url(#usedGrad)" />

                  <defs>
                    <linearGradient id="allocatedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="usedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/30 font-mono mt-2">
                <span>12:55 PM</span>
                <span>1:10 PM</span>
                <span>1:25 PM</span>
                <span>1:40 PM</span>
                <span>1:55 PM</span>
              </div>
            </div>

            {/* CPU Chart */}
            <div className="lg:col-span-2 border border-white/[0.06] rounded-xl bg-[#0b0b0e] p-4 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white/70 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> CPU Utilization</span>
                <span className="font-mono text-accent text-[10px]">Peak 18.5%</span>
              </div>

              {/* Chart SVG */}
              <div className="h-44 w-full relative mt-4">
                <svg className="w-full h-full" viewBox="0 0 800 150" preserveAspectRatio="none">
                  <line x1="0" y1="37" x2="800" y2="37" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="75" x2="800" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="112" x2="800" y2="112" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                  <path d={cpuPath} fill="url(#cpuGrad)" />
                  <defs>
                    <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/30 font-mono mt-2">
                <span>12:55 PM</span>
                <span>1:20 PM</span>
                <span>1:45 PM</span>
                <span>1:55 PM</span>
              </div>
            </div>

            {/* Deadlocks & Rows metrics */}
            <div className="lg:col-span-2 border border-white/[0.06] rounded-xl bg-[#0b0b0e] p-4 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white/70 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Database Deadlocks</span>
                <span className="font-mono text-emerald-400 text-[10px]">Healthy (0)</span>
              </div>

              <div className="h-44 w-full flex items-center justify-center relative mt-4 border border-dashed border-white/[0.04] rounded-lg bg-white/[0.005]">
                <div className="text-center space-y-1">
                  <div className="text-xl font-bold font-mono text-emerald-400">0</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">Deadlocks detected in time window</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/30 font-mono mt-2">
                <span>12:55 PM</span>
                <span>1:20 PM</span>
                <span>1:45 PM</span>
                <span>1:55 PM</span>
              </div>
            </div>

          </div>
        )}

        {/* Tab CONTENT: Active Queries list */}
        {activeTab === 'queries' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Showing actual running SQL transactions from pg_stat_activity</span>
              <button 
                onClick={fetchQueries}
                disabled={loadingQueries}
                className="px-2.5 py-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] rounded text-[11px] font-semibold text-white/80 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LoopIcon className={`w-3 h-3 ${loadingQueries ? 'animate-spin' : ''}`} />
                Refresh queries
              </button>
            </div>

            <div className="overflow-x-auto border border-white/[0.06] rounded-xl bg-[#0b0b0e]">
              <table className="w-full border-collapse font-sans text-xs text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.01] text-white/40 font-semibold">
                    <th className="px-4 py-3 w-16">PID</th>
                    <th className="px-4 py-3 w-20">User</th>
                    <th className="px-4 py-3 w-24">State</th>
                    <th className="px-4 py-3 w-24">Duration</th>
                    <th className="px-4 py-3">Query</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] font-mono">
                  {queries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-white/30 font-sans">
                        No active custom queries running in the current context.
                      </td>
                    </tr>
                  ) : (
                    queries.map((q, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-4 py-3 text-white/50">{q.pid}</td>
                        <td className="px-4 py-3 text-white/70 font-semibold">{q.user}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            q.state === 'active' 
                              ? "bg-accent/15 text-accent border border-accent/20" 
                              : "bg-white/[0.03] text-white/40 border border-white/[0.06]"
                          }`}>
                            {q.state}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white/60">{q.duration}</td>
                        <td className="px-4 py-3 text-white/80 max-w-lg truncate" title={q.query}>
                          {q.query}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab CONTENT: Query Performance placeholder */}
        {activeTab === 'performance' && (
          <div className="border border-white/[0.06] rounded-xl bg-[#0b0b0e] p-12 text-center space-y-2">
            <Activity className="w-8 h-8 text-accent mx-auto animate-pulse" />
            <div className="text-sm font-semibold text-white">Query Performance Insights</div>
            <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">
              Provides recommendations and indexes optimizer options based on slow query statements profiles. Coming soon in next version.
            </p>
          </div>
        )}

      </div>

    </div>
  )
}
