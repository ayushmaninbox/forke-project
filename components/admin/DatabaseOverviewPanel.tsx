'use client'

import React, { useState, useEffect } from 'react'
import { getDatabaseOverview } from '@/lib/db-client-actions'
import { 
  RefreshCw, 
  Copy, 
  Check, 
  Database, 
  Shield, 
  Layers, 
  Server, 
  Cpu, 
  Clock, 
  Activity 
} from 'lucide-react'
import { toast } from '@/components/shared/Toast'

interface OverviewData {
  dbName: string
  dbSize: string
  activeConnections: number
  tablesCount: number
  version: string
  tableDetails: Array<{
    name: string
    totalSize: string
    tableSize: string
    indexSize: string
    rowCount: number
  }>
  rolesList: string[]
  dbList: string[]
}

export default function DatabaseOverviewPanel() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(false)
  const [copiedUri, setCopiedUri] = useState<string | null>(null)
  const [activeSubTab, setActiveSubTab] = useState<'computes' | 'roles_databases' | 'child_branches'>('computes')

  const branchId = 'br-broad-bird-aoyvmoml'
  const connectionUri = 'postgresql://neondb_owner:MASKED_PASSWORD@ep-masked-endpoint-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'

  async function loadData() {
    setLoading(true)
    const res = await getDatabaseOverview()
    if (res.success) {
      setData(res as any)
    } else {
      toast(res.error || 'Failed to load database overview.', 'error')
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  function handleCopy(text: string, type: 'id' | 'uri') {
    navigator.clipboard.writeText(text)
    if (type === 'id') {
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    } else {
      setCopiedUri(text)
      setTimeout(() => setCopiedUri(null), 2000)
    }
    toast('Copied to clipboard!', 'success')
  }

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[400px] bg-[#070709]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-accent" />
          <span className="text-xs text-white/40 font-mono">Querying database metadata...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-grow overflow-y-auto p-6 space-y-6 text-left select-none bg-[#070709] text-white font-sans h-full min-h-0">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.04] pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
            Branch overview
          </h1>
          <div className="flex items-center gap-2">
            <span className="bg-white/[0.04] border border-white/[0.08] text-white/70 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              production
            </span>
            <span className="bg-accent/10 border border-accent/20 text-accent px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider">
              Default
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={loadData}
            className="px-3 py-1.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh stats
          </button>
          <button className="px-3 py-1.5 bg-white text-[#0a0a0a] hover:bg-white/95 rounded-lg text-xs font-semibold transition-colors cursor-default opacity-50">
            Create child branch
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        
        {/* Card 1 */}
        <div className="bg-[#0b0b0e] border border-white/[0.06] rounded-xl p-4 space-y-2">
          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center justify-between">
            <span>Compute</span>
            <Cpu className="w-3.5 h-3.5 text-accent/60" />
          </div>
          <div className="text-lg font-mono font-bold text-white">7.4 CU-hrs</div>
          <div className="text-[9px] text-white/30 leading-snug">Usage since Jun 1, 2026.</div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0b0b0e] border border-white/[0.06] rounded-xl p-4 space-y-2">
          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center justify-between">
            <span>Storage size</span>
            <Database className="w-3.5 h-3.5 text-accent/60" />
          </div>
          <div className="text-lg font-mono font-bold text-white">{data?.dbSize || 'N/A'}</div>
          <div className="text-[9px] text-white/30 leading-snug">Actual volume on AWS disk.</div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0b0b0e] border border-white/[0.06] rounded-xl p-4 space-y-2">
          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center justify-between">
            <span>Active Conns</span>
            <Activity className="w-3.5 h-3.5 text-accent/60" />
          </div>
          <div className="text-lg font-mono font-bold text-white">{data?.activeConnections || 0}</div>
          <div className="text-[9px] text-white/30 leading-snug">Open client connections.</div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#0b0b0e] border border-white/[0.06] rounded-xl p-4 space-y-2">
          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center justify-between">
            <span>History size</span>
            <Clock className="w-3.5 h-3.5 text-accent/60" />
          </div>
          <div className="text-lg font-mono font-bold text-white">2.0 MB</div>
          <div className="text-[9px] text-white/30 leading-snug">WAL journal records size.</div>
        </div>

        {/* Card 5 */}
        <div className="bg-[#0b0b0e] border border-white/[0.06] rounded-xl p-4 space-y-2 col-span-2 sm:col-span-1">
          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center justify-between">
            <span>Network transfer</span>
            <Server className="w-3.5 h-3.5 text-accent/60" />
          </div>
          <div className="text-lg font-mono font-bold text-white">7.91 MB</div>
          <div className="text-[9px] text-white/30 leading-snug">Transferred data this month.</div>
        </div>

      </div>

      {/* Database Metadata Card */}
      <div className="bg-[#0b0b0e] border border-white/[0.06] rounded-xl p-5 space-y-4 font-mono text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-white/40 uppercase font-sans font-semibold tracking-wider block">Branch ID</span>
            <div className="flex items-center gap-2">
              <span className="text-white/80 truncate block max-w-[200px]">{branchId}</span>
              <button 
                onClick={() => handleCopy(branchId, 'id')}
                className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-white/40 uppercase font-sans font-semibold tracking-wider block">Created on</span>
            <span className="text-white/80 block">2026-05-23 10:56:33 +05:30</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-white/40 uppercase font-sans font-semibold tracking-wider block">Created by</span>
            <span className="text-white/80 block">Forke Admin</span>
          </div>
        </div>
      </div>

      {/* Tabs list (Computes / Roles & Databases / Table sizes) */}
      <div className="space-y-4">
        
        <div className="border-b border-white/[0.06] flex items-center gap-5">
          <button
            onClick={() => setActiveSubTab('computes')}
            className={`pb-2.5 text-xs font-semibold tracking-wider transition-all relative border-b-2 cursor-pointer ${
              activeSubTab === 'computes'
                ? "border-accent text-accent"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            Computes
          </button>
          <button
            onClick={() => setActiveSubTab('roles_databases')}
            className={`pb-2.5 text-xs font-semibold tracking-wider transition-all relative border-b-2 cursor-pointer ${
              activeSubTab === 'roles_databases'
                ? "border-accent text-accent"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            Roles & Databases ({data?.rolesList.length || 0})
          </button>
          <button
            onClick={() => setActiveSubTab('child_branches')}
            className={`pb-2.5 text-xs font-semibold tracking-wider transition-all relative border-b-2 cursor-pointer ${
              activeSubTab === 'child_branches'
                ? "border-accent text-accent"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            Table Sizes ({data?.tableDetails.length || 0})
          </button>
        </div>

        {/* Tab 1: Computes */}
        {activeSubTab === 'computes' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-white/[0.06] rounded-xl bg-[#0b0b0e]">
              <table className="w-full border-collapse font-sans text-xs text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.01] text-white/40 font-semibold">
                    <th className="px-4 py-3">Endpoint</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Started</th>
                    <th className="px-4 py-3">Compute size</th>
                    <th className="px-4 py-3 text-right">Connection URI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  <tr className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-4 py-4 font-mono font-bold text-accent">ep-masked-endpoint</td>
                    <td className="px-4 py-4">
                      <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5 w-max">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ACTIVE
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white/60">25 minutes ago</td>
                    <td className="px-4 py-4 text-white/80 font-mono">0.25 ↔ 2 CU</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleCopy(connectionUri, 'uri')}
                        className="px-2.5 py-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] rounded text-[11px] font-mono text-white/80 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        {copiedUri === connectionUri ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy URL</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-accent/[0.02] border border-accent/20 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5 text-left">
                <div className="text-xs font-semibold text-accent flex items-center gap-2">
                  <span>⚡</span> Read Replicas
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed max-w-xl">
                  Scale your application by offloading your read workload to a read-only instance of your database.
                </p>
              </div>
              <button className="px-3 py-1.5 bg-accent text-[#0a0a0a] hover:bg-accent/80 rounded-lg text-xs font-semibold transition-colors cursor-default opacity-50">
                Add Read Replica
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Roles & Databases */}
        {activeSubTab === 'roles_databases' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Roles list */}
            <div className="border border-white/[0.06] rounded-xl bg-[#0b0b0e] p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <Shield className="w-4 h-4 text-accent" />
                <span>Database Roles ({data?.rolesList.length || 0})</span>
              </div>
              <div className="divide-y divide-white/[0.04] max-h-60 overflow-y-auto pr-1">
                {data?.rolesList.map(role => (
                  <div key={role} className="py-2.5 flex items-center justify-between text-xs font-mono">
                    <span className="text-white/80 font-bold">{role}</span>
                    <span className="text-[9px] bg-white/[0.03] border border-white/[0.06] text-white/40 px-1.5 py-0.5 rounded">
                      can login
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Databases list */}
            <div className="border border-white/[0.06] rounded-xl bg-[#0b0b0e] p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <Database className="w-4 h-4 text-accent" />
                <span>Databases list ({data?.dbList.length || 0})</span>
              </div>
              <div className="divide-y divide-white/[0.04] max-h-60 overflow-y-auto pr-1">
                {data?.dbList.map(dbname => (
                  <div key={dbname} className="py-2.5 flex items-center justify-between text-xs font-mono">
                    <span className="text-white/85 font-bold">{dbname}</span>
                    <span className="text-[9px] bg-accent/15 border border-accent/20 text-accent px-1.5 py-0.5 rounded">
                      active
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Table Sizes */}
        {activeSubTab === 'child_branches' && (
          <div className="overflow-x-auto border border-white/[0.06] rounded-xl bg-[#0b0b0e]">
            <table className="w-full border-collapse font-sans text-xs text-left">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.01] text-white/40 font-semibold">
                  <th className="px-4 py-3">Table Name</th>
                  <th className="px-4 py-3">Row Count</th>
                  <th className="px-4 py-3">Table Size</th>
                  <th className="px-4 py-3">Index Size</th>
                  <th className="px-4 py-3 text-right">Total Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-mono">
                {data?.tableDetails.map(t => (
                  <tr key={t.name} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-4 py-3.5 text-white/80 font-bold">{t.name}</td>
                    <td className="px-4 py-3.5 text-white/60 font-sans">{t.rowCount}</td>
                    <td className="px-4 py-3.5 text-white/50">{t.tableSize}</td>
                    <td className="px-4 py-3.5 text-white/50">{t.indexSize}</td>
                    <td className="px-4 py-3.5 text-white/85 text-right font-bold text-accent">{t.totalSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  )
}
