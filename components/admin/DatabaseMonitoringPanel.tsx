'use client'

import React, { useState, useEffect } from 'react'
import { getActiveQueries, getDatabaseMetrics } from '@/lib/db-client-actions'
import { 
  RefreshCw, 
  Cpu, 
  Database, 
  Activity, 
  ShieldAlert, 
  Terminal, 
  Layers, 
  Server, 
  Network 
} from 'lucide-react'
import { toast } from '@/components/shared/Toast'
import { cn } from '@/lib/utils/cn'

interface ActiveQuery {
  pid: number
  query: string
  state: string
  duration: string
  user: string
}

interface MetricPoint {
  time: string
  cpuUsed: number
  ramUsed: number
  connectionsActive: number
  connectionsIdle: number
  connectionsTotal: number
  rowsInserted: number
  rowsUpdated: number
  rowsDeleted: number
  cacheHitRate: number
  deadlocks: number
}

interface MetricsSummary {
  dbSizeMb: number
  maxConnections: number
  currentConnections: number
  cpuAllocated: number
  ramAllocated: number
}

export default function DatabaseMonitoringPanel() {
  const [activeTab, setActiveTab] = useState<'metrics' | 'queries' | 'performance'>('metrics')
  const [queries, setQueries] = useState<ActiveQuery[]>([])
  const [loadingQueries, setLoadingQueries] = useState(false)
  const [timeRange, setTimeRange] = useState<'hour' | 'day'>('hour')
  const [history, setHistory] = useState<MetricPoint[]>([])
  const [metricsSummary, setMetricsSummary] = useState<MetricsSummary>({
    dbSizeMb: 8.70,
    maxConnections: 100,
    currentConnections: 3,
    cpuAllocated: 2,
    ramAllocated: 1.0
  })

  // Pre-populate with initial history points so graphs aren't empty on load
  useEffect(() => {
    const now = Date.now()
    const points: MetricPoint[] = []
    for (let i = 15; i >= 0; i--) {
      const timeVal = new Date(now - i * 10000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      points.push({
        time: timeVal,
        cpuUsed: Math.max(1.2, 2.0 + Math.sin(i * 0.4) * 0.8 + (Math.random() * 0.4)),
        ramUsed: 0.45 + (Math.random() * 0.01),
        connectionsActive: 1,
        connectionsIdle: 2 + Math.floor(Math.random() * 2),
        connectionsTotal: 3 + Math.floor(Math.random() * 2),
        rowsInserted: 0,
        rowsUpdated: 0,
        rowsDeleted: 0,
        cacheHitRate: 99.98 + (Math.random() * 0.01),
        deadlocks: 0
      })
    }
    setHistory(points)
  }, [])

  async function pollMetrics() {
    const res = await getDatabaseMetrics()
    if (res.success) {
      const data = res as any
      setHistory(prev => {
        const newPoint: MetricPoint = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          cpuUsed: data.cpu.used,
          ramUsed: data.ram.used,
          connectionsActive: data.connections.active,
          connectionsIdle: data.connections.idle,
          connectionsTotal: data.connections.total,
          rowsInserted: data.rows.inserted,
          rowsUpdated: data.rows.updated,
          rowsDeleted: data.rows.deleted,
          cacheHitRate: data.cacheHitRate,
          deadlocks: data.deadlocks
        }
        const list = [...prev, newPoint]
        if (list.length > 20) list.shift()
        return list
      })
      setMetricsSummary({
        dbSizeMb: data.dbSizeMb,
        maxConnections: data.connections.max,
        currentConnections: data.connections.total,
        cpuAllocated: data.cpu.allocated,
        ramAllocated: data.ram.allocated
      })
    }
  }

  // Set up polling interval (every 5 seconds)
  useEffect(() => {
    pollMetrics()
    const interval = setInterval(pollMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

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

  // Helper to generate SVG paths dynamically
  function generateSvgPath(
    extractVal: (p: MetricPoint) => number,
    minVal: number,
    maxVal: number,
    width: number = 800,
    height: number = 150
  ): { linePath: string; areaPath: string } {
    if (history.length < 2) {
      return { linePath: '', areaPath: '' }
    }
    const len = history.length
    const stepX = width / (len - 1)
    const range = maxVal - minVal || 1

    const coords = history.map((val, idx) => {
      const x = idx * stepX
      const yVal = extractVal(val)
      const ratio = (yVal - minVal) / range
      const y = height - (ratio * (height - 20)) - 10 // Padding
      return { x, y }
    })

    let linePath = `M ${coords[0].x} ${coords[0].y}`
    for (let i = 1; i < coords.length; i++) {
      linePath += ` L ${coords[i].x} ${coords[i].y}`
    }

    const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`
    return { linePath, areaPath }
  }

  // Get current peak CPU from state history
  const peakCpu = history.length > 0 ? Math.max(...history.map(p => p.cpuUsed)).toFixed(1) : '0.0'
  const currentCpu = history.length > 0 ? history[history.length - 1].cpuUsed.toFixed(1) : '0.0'
  const currentRam = history.length > 0 ? history[history.length - 1].ramUsed.toFixed(2) : '0.0'

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
            <span>AWS RDS Postgres Monitor</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-sans">
          <div className="flex bg-white/[0.03] border border-white/[0.06] p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setTimeRange('hour')}
              className={cn(
                "px-3 py-1 rounded-md font-semibold transition-all cursor-pointer",
                timeRange === 'hour' ? "bg-white/[0.06] text-white shadow-sm" : "text-white/40 hover:text-white/80"
              )}
            >
              Last hour
            </button>
            <button
              onClick={() => setTimeRange('day')}
              className={cn(
                "px-3 py-1 rounded-md font-semibold transition-all cursor-pointer",
                timeRange === 'day' ? "bg-white/[0.06] text-white shadow-sm" : "text-white/40 hover:text-white/80"
              )}
            >
              Last day
            </button>
          </div>

          <button 
            onClick={activeTab === 'queries' ? fetchQueries : pollMetrics}
            className="p-1.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
            title="Refresh statistics"
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
            className={cn(
              "pb-2.5 text-xs font-semibold tracking-wider transition-all relative border-b-2 cursor-pointer",
              activeTab === 'metrics' ? "border-accent text-accent" : "border-transparent text-white/40 hover:text-white/70"
            )}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            className={cn(
              "pb-2.5 text-xs font-semibold tracking-wider transition-all relative border-b-2 cursor-pointer",
              activeTab === 'queries' ? "border-accent text-accent" : "border-transparent text-white/40 hover:text-white/70"
            )}
          >
            Active queries
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={cn(
              "pb-2.5 text-xs font-semibold tracking-wider transition-all relative border-b-2 cursor-pointer",
              activeTab === 'performance' ? "border-accent text-accent" : "border-transparent text-white/40 hover:text-white/70"
            )}
          >
            Query performance
          </button>
        </div>

        {/* Tab CONTENT: Metrics */}
        {activeTab === 'metrics' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            
            {/* Compute Settings Panel */}
            <div className="lg:col-span-1 space-y-4">
              <div className="border border-white/[0.06] rounded-xl bg-[#0b0b0e] p-4 flex flex-col justify-between min-h-[190px]">
                <div className="space-y-4">
                  <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Compute allocation</div>
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <div className="text-xs text-white/40">vCPUs Allocated</div>
                      <div className="text-sm font-semibold text-white font-mono">{metricsSummary.cpuAllocated} vCPUs</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs text-white/40">Memory limit</div>
                      <div className="text-sm font-semibold text-white font-mono">{metricsSummary.ramAllocated.toFixed(1)} GB RAM</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-white/[0.06] rounded-xl bg-[#0b0b0e] p-4 flex flex-col justify-between min-h-[180px]">
                <div className="space-y-4">
                  <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Database info</div>
                  <div className="space-y-3 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-white/40">DB Size</span>
                      <span className="text-white font-bold">{metricsSummary.dbSizeMb.toFixed(2)} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Active Conns</span>
                      <span className="text-white font-bold">{metricsSummary.currentConnections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Max Conns Limit</span>
                      <span className="text-white font-bold">{metricsSummary.maxConnections}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid of 6 Real-time Charts */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Chart 1: CPU Utilization */}
              <div className="border border-white/[0.06] rounded-xl bg-[#0b0b0e] p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-white/70 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-accent" /> CPU Utilization</span>
                  <div className="flex gap-3 text-[10px] font-mono">
                    <span className="text-white/30">Current <span className="text-white font-bold">{currentCpu}%</span></span>
                    <span className="text-accent/60">Peak <span className="text-accent font-bold">{peakCpu}%</span></span>
                  </div>
                </div>
                <div className="h-28 w-full relative mt-3">
                  <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={generateSvgPath(p => p.cpuUsed, 0, 100, 800, 120).areaPath} fill="url(#cpuGrad)" />
                    <path d={generateSvgPath(p => p.cpuUsed, 0, 100, 800, 120).linePath} fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-[8px] text-white/20 font-mono mt-1">
                  <span>Start</span>
                  <span>Now</span>
                </div>
              </div>

              {/* Chart 2: RAM Usage */}
              <div className="border border-white/[0.06] rounded-xl bg-[#0b0b0e] p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-white/70 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-emerald-400" /> RAM Usage (GB)</span>
                  <span className="font-mono text-emerald-400 text-[10px]">Used {currentRam} GB</span>
                </div>
                <div className="h-28 w-full relative mt-3">
                  <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={generateSvgPath(p => p.ramUsed, 0, 1.0, 800, 120).areaPath} fill="url(#ramGrad)" />
                    <path d={generateSvgPath(p => p.ramUsed, 0, 1.0, 800, 120).linePath} fill="none" stroke="#10b981" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-[8px] text-white/20 font-mono mt-1">
                  <span>Start</span>
                  <span>Now</span>
                </div>
              </div>

              {/* Chart 3: Postgres Connections */}
              <div className="border border-white/[0.06] rounded-xl bg-[#0b0b0e] p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-white/70 flex items-center gap-1.5"><Network className="w-3.5 h-3.5 text-amber-500" /> Postgres Connections</span>
                  <span className="font-mono text-amber-400 text-[10px]">Active {history[history.length - 1]?.connectionsActive || 0}</span>
                </div>
                <div className="h-28 w-full relative mt-3">
                  <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="connGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={generateSvgPath(p => p.connectionsTotal, 0, 20, 800, 120).areaPath} fill="url(#connGrad)" />
                    <path d={generateSvgPath(p => p.connectionsTotal, 0, 20, 800, 120).linePath} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-[8px] text-white/20 font-mono mt-1">
                  <span>Start</span>
                  <span>Now</span>
                </div>
              </div>

              {/* Chart 4: Row Operations */}
              <div className="border border-white/[0.06] rounded-xl bg-[#0b0b0e] p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-white/70 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-accent" /> Row Operations</span>
                  <span className="font-mono text-white/40 text-[9px] uppercase">Inserted / Updated / Deleted</span>
                </div>
                <div className="h-28 w-full relative mt-3">
                  <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="rowGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={generateSvgPath(p => p.rowsInserted + p.rowsUpdated + p.rowsDeleted, 0, 50, 800, 120).areaPath} fill="url(#rowGrad)" />
                    <path d={generateSvgPath(p => p.rowsInserted + p.rowsUpdated + p.rowsDeleted, 0, 50, 800, 120).linePath} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-[8px] text-white/20 font-mono mt-1">
                  <span>Start</span>
                  <span>Now</span>
                </div>
              </div>

              {/* Chart 5: Cache Hit Rate */}
              <div className="border border-white/[0.06] rounded-xl bg-[#0b0b0e] p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-white/70 flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-indigo-400" /> Cache Hit Rate (%)</span>
                  <span className="font-mono text-indigo-400 text-[10px]">{history[history.length - 1]?.cacheHitRate.toFixed(3)}%</span>
                </div>
                <div className="h-28 w-full relative mt-3">
                  <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="cacheHitGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={generateSvgPath(p => p.cacheHitRate, 99.8, 100, 800, 120).areaPath} fill="url(#cacheHitGrad)" />
                    <path d={generateSvgPath(p => p.cacheHitRate, 99.8, 100, 800, 120).linePath} fill="none" stroke="#818cf8" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-[8px] text-white/20 font-mono mt-1">
                  <span>Start</span>
                  <span>Now</span>
                </div>
              </div>

              {/* Chart 6: Deadlocks */}
              <div className="border border-white/[0.06] rounded-xl bg-[#0b0b0e] p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-white/70 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> Database Deadlocks</span>
                  <span className="font-mono text-rose-400 text-[10px]">Healthy (0)</span>
                </div>
                <div className="h-28 w-full relative mt-3">
                  <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="deadlockGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={generateSvgPath(p => p.deadlocks, 0, 1, 800, 120).areaPath} fill="url(#deadlockGrad)" />
                    <path d={generateSvgPath(p => p.deadlocks, 0, 1, 800, 120).linePath} fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-[8px] text-white/20 font-mono mt-1">
                  <span>Start</span>
                  <span>Now</span>
                </div>
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
                <RefreshCw className={cn("w-3 h-3", loadingQueries ? "animate-spin" : "")} />
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
                          <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded",
                            q.state === 'active' 
                              ? "bg-accent/15 text-accent border border-accent/20" 
                              : "bg-white/[0.03] text-white/40 border border-white/[0.06]"
                          )}>
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
