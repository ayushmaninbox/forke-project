'use client'

import React, { useState, useEffect } from 'react'
import { 
  getDatabaseTables, 
  getTableDetails, 
  getTableData, 
  insertTableRecord, 
  updateTableRecord, 
  deleteTableRecords 
} from '@/lib/db-client-actions'
import { 
  Database, 
  Search, 
  Plus, 
  Trash2, 
  ArrowUpDown, 
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Check, 
  X, 
  RefreshCw, 
  Layers, 
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { toast } from '@/components/shared/Toast'
import { cn } from '@/lib/utils/cn'

interface DatabaseConsoleProps {
  currentAdmin: {
    id: string
    name: string
    role: 'super_admin' | 'admin'
  } | null
}

export default function DatabaseConsole({ currentAdmin }: DatabaseConsoleProps) {
  const isSuperAdmin = currentAdmin?.role === 'super_admin'

  // Tables state
  const [tablesList, setTablesList] = useState<string[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('')
  const [isLoadingTables, setIsLoadingTables] = useState<boolean>(true)

  // Current table state
  const [columns, setColumns] = useState<any[]>([])
  const [primaryKeys, setPrimaryKeys] = useState<string[]>([])
  const [rows, setRows] = useState<any[]>([])
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false)
  const [activeSubTab, setActiveSubTab] = useState<'data' | 'structure'>('data')

  // Pagination & Sorting & Filters
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(15)
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filterColumn, setFilterColumn] = useState<string>('')
  const [filterValue, setFilterValue] = useState<string>('')

  const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 1024
  const shouldScrollVertically = isMobileViewport ? pageSize > 10 : pageSize > 15

  // Row Selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])

  // Cell Editing
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; colName: string } | null>(null)
  const [editingValue, setEditingValue] = useState<any>('')
  const [updatingCellProgress, setUpdatingCellProgress] = useState<boolean>(false)
  const [successFlashCell, setSuccessFlashCell] = useState<{ rowIndex: number; colName: string } | null>(null)

  // Add Record Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [newRecordData, setNewRecordData] = useState<Record<string, any>>({})
  const [isSubmittingRecord, setIsSubmittingRecord] = useState<boolean>(false)

  // Fetch all tables on mount
  useEffect(() => {
    fetchTables()
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setPageSize(10)
    } else {
      setPageSize(15)
    }
  }, [])

  // Refetch data when table or query parameters change
  useEffect(() => {
    if (selectedTable) {
      fetchTableMetadataAndData()
    }
  }, [selectedTable, currentPage, pageSize, sortBy, sortOrder, filterColumn, filterValue])

  async function fetchTables() {
    setIsLoadingTables(true)
    const res = await getDatabaseTables()
    if (res.success && res.tables) {
      setTablesList(res.tables)
      if (res.tables.length > 0 && !selectedTable) {
        setSelectedTable(res.tables[0])
      }
    }
    setIsLoadingTables(false)
  }

  async function fetchTableMetadataAndData() {
    setIsLoadingData(true)
    setSelectedRowKeys([])
    setEditingCell(null)

    // Parallel fetch metadata & table rows
    const [metaRes, dataRes] = await Promise.all([
      getTableDetails(selectedTable),
      getTableData(selectedTable, {
        page: currentPage,
        limit: pageSize,
        sortBy: sortBy || undefined,
        sortOrder,
        filterColumn: filterColumn || undefined,
        filterValue: filterValue || undefined
      })
    ])

    if (metaRes.success && metaRes.columns) {
      setColumns(metaRes.columns)
      setPrimaryKeys(metaRes.primaryKeys || [])
    }
    if (dataRes.success && dataRes.rows) {
      setRows(dataRes.rows)
      setTotalRecords(dataRes.totalRecords || 0)
    }
    setIsLoadingData(false)
  }

  // Handle pagination reset on search/filter changes
  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCurrentPage(1)
  }

  function handleClearFilter() {
    setFilterColumn('')
    setFilterValue('')
    setCurrentPage(1)
  }

  // Select a table and reset view state (page, sort, filters, selection)
  function handleSelectTable(tableName: string) {
    setSelectedTable(tableName)
    setCurrentPage(1)
    setSortBy('')
    setFilterColumn('')
    setFilterValue('')
    setSelectedRowKeys([])
  }

  // Toggle sorting direction or column
  function handleSort(colName: string) {
    if (sortBy === colName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(colName)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  // Row selection helpers
  const primaryKeyCol = primaryKeys[0] || 'id' // Default to id if no PK found

  function handleSelectAllRows(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      const keys = rows.map(r => r[primaryKeyCol])
      setSelectedRowKeys(keys)
    } else {
      setSelectedRowKeys([])
    }
  }

  function handleSelectRow(keyVal: any, checked: boolean) {
    if (checked) {
      setSelectedRowKeys(prev => [...prev, keyVal])
    } else {
      setSelectedRowKeys(prev => prev.filter(k => k !== keyVal))
    }
  }

  // cell inline edit actions
  function handleStartEdit(rowIndex: number, colName: string, currentValue: any) {
    if (!isSuperAdmin) return
    // Don't allow editing primary key columns directly to avoid breaking constraint integrity
    if (primaryKeys.includes(colName)) return

    setEditingCell({ rowIndex, colName })
    setEditingValue(currentValue === null ? '' : currentValue)
  }

  async function handleSaveCellEdit(row: any, colName: string, rowIndex: number) {
    if (!isSuperAdmin || !editingCell) return

    setUpdatingCellProgress(true)
    const pkVal = row[primaryKeyCol]

    const updatedFields = {
      [colName]: editingValue
    }

    const res = await updateTableRecord(selectedTable, primaryKeyCol, pkVal, updatedFields)
    if (res.success && res.record) {
      // Update local rows state
      setRows(prev => prev.map((r, idx) => idx === rowIndex ? { ...r, [colName]: res.record[colName] } : r))
      
      // Trigger a green flashing animation
      setSuccessFlashCell({ rowIndex, colName })
      setTimeout(() => setSuccessFlashCell(null), 1000)
    } else {
      toast(res.error || 'Failed to update field value.', 'error')
    }
    setEditingCell(null)
    setUpdatingCellProgress(false)
  }

  // Delete selected rows
  async function handleDeleteSelectedRecords() {
    if (!isSuperAdmin) return
    if (selectedRowKeys.length === 0) return

    const confirmMsg = `Are you sure you want to delete ${selectedRowKeys.length} selected record(s) from "${selectedTable}"?`
    if (confirm(confirmMsg)) {
      setIsLoadingData(true)
      const res = await deleteTableRecords(selectedTable, primaryKeyCol, selectedRowKeys)
      if (res.success) {
        toast('Records successfully deleted!', 'success')
        fetchTableMetadataAndData()
      } else {
        toast(res.error || 'Failed to delete records.', 'error')
        setIsLoadingData(false)
      }
      setSelectedRowKeys([])
    }
  }

  // Add Record submit
  async function handleAddRecord(e: React.FormEvent) {
    e.preventDefault()
    if (!isSuperAdmin) return

    setIsSubmittingRecord(true)
    const res = await insertTableRecord(selectedTable, newRecordData)
    if (res.success) {
      toast('Record added successfully!', 'success')
      setIsAddModalOpen(false)
      setNewRecordData({})
      fetchTableMetadataAndData()
    } else {
      toast(res.error || 'Failed to insert new record.', 'error')
    }
    setIsSubmittingRecord(false)
  }

  // Filter tables by tableSearchQuery
  const filteredTables = tablesList.filter(t => t.toLowerCase().includes(tableSearchQuery.toLowerCase()))

  // Total pages calculation
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))

  return (
    <div className="flex h-full min-h-0 border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.005] select-none text-left">

      {/* --- LEFT SIDEBAR: TABLES LIST (desktop only) --- */}
      <aside className="hidden lg:flex w-60 border-r border-white/[0.06] flex-col shrink-0 bg-white/[0.005]">
        
        {/* Sidebar Header & Search */}
        <div className="p-3 border-b border-white/[0.06] space-y-2 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
            <Database className="w-3.5 h-3.5 text-accent" />
            <span>Tables ({tablesList.length})</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search tables..."
              value={tableSearchQuery}
              onChange={(e) => setTableSearchQuery(e.target.value)}
              className="w-full h-8 bg-white/[0.02] border border-white/[0.06] rounded-md pl-8 pr-2 text-xs text-white focus:outline-none focus:border-accent/40"
            />
          </div>
        </div>

        {/* Scrollable table name links */}
        <div className="flex-grow overflow-y-auto p-1.5 space-y-0.5">
          {isLoadingTables ? (
            <div className="text-center py-6 text-xs text-white/30">Loading tables...</div>
          ) : filteredTables.length === 0 ? (
            <div className="text-center py-6 text-xs text-white/30">No tables found</div>
          ) : (
            filteredTables.map((t) => {
              const isSelected = selectedTable === t
              return (
                <button
                  key={t}
                  onClick={() => handleSelectTable(t)}
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer",
                    isSelected
                      ? "bg-accent/10 text-accent font-semibold border border-accent/20"
                      : "text-white/60 hover:text-white hover:bg-white/[0.02] border border-transparent"
                  )}
                >
                  {t}
                </button>
              )
            })
          )}
        </div>
      </aside>

      {/* --- RIGHT SIDEBAR: CONSOLE VIEW --- */}
      <main className="flex-grow flex flex-col min-w-0 bg-[#070709]/20">

        {/* Mobile table selector (replaces the desktop sidebar on small screens) */}
        <div className="lg:hidden flex items-center gap-2 p-2 border-b border-white/[0.06] shrink-0 bg-white/[0.005]">
          <Database className="w-4 h-4 text-accent shrink-0" />
          <div className="flex-grow min-w-0">
            <Select
              aria-label="Select table"
              value={selectedTable}
              onChange={handleSelectTable}
              options={tablesList.map((t) => ({ value: t, label: t }))}
              placeholder={isLoadingTables ? 'Loading tables…' : 'Select a table'}
              className="font-mono"
            />
          </div>
          <span className="text-[10px] font-mono text-white/30 shrink-0">{tablesList.length} tables</span>
        </div>

        {/* Main Tabbar & Actions */}
        <div className="min-h-12 border-b border-white/[0.06] flex items-center justify-between gap-2 px-2 sm:px-4 shrink-0 bg-white/[0.005] overflow-x-auto">

          {/* Sub-Tabs Selector */}
          <div className="flex gap-2 sm:gap-4 h-12 shrink-0">
            <button
              onClick={() => setActiveSubTab('data')}
              className={cn(
                "h-full flex items-center gap-1.5 px-3 border-b-2 text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer",
                activeSubTab === 'data'
                  ? "border-accent text-accent text-glow"
                  : "border-transparent text-white/40 hover:text-white"
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>DATA</span>
            </button>
            <button
              onClick={() => setActiveSubTab('structure')}
              className={cn(
                "h-full flex items-center gap-1.5 px-3 border-b-2 text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer",
                activeSubTab === 'structure'
                  ? "border-accent text-accent text-glow"
                  : "border-transparent text-white/40 hover:text-white"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>STRUCTURE</span>
            </button>
          </div>

          {/* Table level Action Buttons */}
          {selectedTable && activeSubTab === 'data' && (
            <div className="flex items-center gap-2">
              
              {/* Deletion action */}
              {isSuperAdmin && selectedRowKeys.length > 0 && (
                <button
                  onClick={handleDeleteSelectedRecords}
                  className="h-7 px-2.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-semibold flex items-center gap-1.5 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete ({selectedRowKeys.length})</span>
                </button>
              )}

              {/* Insertion action */}
              {isSuperAdmin && (
                <button
                  onClick={() => {
                    setNewRecordData({})
                    setIsAddModalOpen(true)
                  }}
                  className="h-7 px-2.5 rounded bg-accent/10 border border-accent/20 text-accent text-[11px] font-semibold flex items-center gap-1.5 hover:bg-accent hover:text-[#0a0a0a] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add record</span>
                </button>
              )}

              <button
                onClick={fetchTableMetadataAndData}
                disabled={isLoadingData}
                className="w-7 h-7 rounded border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-white/60 hover:text-white hover:border-white/12 transition-colors disabled:opacity-30 cursor-pointer"
                title="Refresh table data"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isLoadingData ? "animate-spin" : "")} />
              </button>
            </div>
          )}
        </div>

        {/* --- DYNAMIC RENDER OF VIEW --- */}
        <div className="flex-grow min-h-0 overflow-auto p-2 sm:p-4 relative">
          
          {!selectedTable ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 space-y-2">
              <Database className="w-8 h-8 text-white/10" />
              <p className="text-sm">Select a table in the sidebar to begin</p>
            </div>
          ) : isLoadingData && rows.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 space-y-2 bg-[#060608]/40">
              <RefreshCw className="w-6 h-6 animate-spin text-accent" />
              <p className="text-xs font-medium">Loading database table data...</p>
            </div>
          ) : activeSubTab === 'structure' ? (
            
            /* ==================== TABLE STRUCTURE VIEW ==================== */
            <div className="border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.005]">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/[0.06] text-white/50">
                    <th className="px-5 py-3 font-semibold">Column</th>
                    <th className="px-5 py-3 font-semibold">Type</th>
                    <th className="px-5 py-3 font-semibold">Nullable</th>
                    <th className="px-5 py-3 font-semibold">Default</th>
                    <th className="px-5 py-3 font-semibold text-center">Key</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {columns.map((col) => (
                    <tr key={col.name} className="hover:bg-white/[0.005] text-white/80">
                      <td className="px-5 py-3 font-semibold text-white">{col.name}</td>
                      <td className="px-5 py-3 text-white/60">{col.type}</td>
                      <td className="px-5 py-3">{col.nullable ? 'YES' : 'NO'}</td>
                      <td className="px-5 py-3 text-white/40">{col.defaultVal || 'NULL'}</td>
                      <td className="px-5 py-3 text-center">
                        {col.isPrimaryKey && (
                          <span className="px-1.5 py-0.5 rounded bg-accent/15 border border-accent/25 text-accent text-[9px] font-semibold leading-none">
                            PK
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
          ) : (
            
            /* ==================== TABLE DATA VIEW ==================== */
            <div className={cn("flex flex-col gap-4", shouldScrollVertically ? "h-full" : "h-auto min-h-full")}>
              
              {/* Row filters bar */}
              <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg border border-white/[0.05] bg-white/[0.005] shrink-0 text-xs">
                <span className="text-white/40 font-semibold uppercase tracking-wider text-[10px]">Filter:</span>
                <Select
                  aria-label="Filter column"
                  value={filterColumn}
                  onChange={setFilterColumn}
                  size="sm"
                  className="w-44"
                  placeholder="Choose column"
                  options={[
                    { value: '', label: 'Choose column' },
                    ...columns.map((col) => ({ value: col.name, label: col.name })),
                  ]}
                />
                <input
                  type="text"
                  placeholder="Contains text..."
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="bg-white/[0.02] border border-white/[0.06] rounded px-2.5 py-1 focus:outline-none focus:border-accent text-white w-full sm:w-48 min-w-0"
                  disabled={!filterColumn}
                />
                <Button type="submit" size="sm" disabled={!filterColumn || !filterValue}>
                  Apply
                </Button>
                {(filterColumn || filterValue) && (
                  <button
                    type="button"
                    onClick={handleClearFilter}
                    className="p-1 text-white/40 hover:text-white rounded hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Grid block */}
              <div className={cn(
                "border border-white/[0.06] rounded-xl bg-white/[0.005] flex-grow min-h-0",
                shouldScrollVertically ? "overflow-auto" : "overflow-x-auto overflow-y-visible"
              )}>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/[0.06] text-white/50 select-none">
                      
                      {/* Checkbox select-all */}
                      {isSuperAdmin && (
                        <th className="px-4 py-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={rows.length > 0 && selectedRowKeys.length === rows.length}
                            onChange={handleSelectAllRows}
                            className="rounded accent-accent cursor-pointer"
                          />
                        </th>
                      )}

                      {columns.map((col) => {
                        const isSorted = sortBy === col.name
                        return (
                          <th
                            key={col.name}
                            onClick={() => handleSort(col.name)}
                            className={cn(
                              "px-4 py-3 font-semibold font-mono tracking-tight cursor-pointer hover:bg-white/[0.01] transition-colors whitespace-nowrap",
                              isSorted ? "text-accent" : "text-white/60"
                            )}
                          >
                            <div className="flex items-center gap-1.5">
                              <span>{col.name}</span>
                              {isSorted ? (
                                sortOrder === 'asc' ? (
                                  <ArrowUp className="w-3.5 h-3.5 text-accent opacity-100" />
                                ) : (
                                  <ArrowDown className="w-3.5 h-3.5 text-accent opacity-100" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 opacity-20" />
                              )}
                            </div>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-white/[0.04]">
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length + (isSuperAdmin ? 1 : 0)} className="px-5 py-12 text-center text-white/30">
                          {filterColumn && filterValue ? 'No records matching the filter filters found' : 'Table is currently empty.'}
                        </td>
                      </tr>
                    ) : (
                      rows.map((row, rIdx) => {
                        const pkVal = row[primaryKeyCol]
                        const isRowSelected = selectedRowKeys.includes(pkVal)

                        return (
                          <tr 
                            key={pkVal || rIdx} 
                            className={cn(
                              "group hover:bg-white/[0.005] transition-colors border-b border-white/[0.04] last:border-b-0",
                              isRowSelected ? "bg-accent/[0.01] hover:bg-accent/[0.015]" : ""
                            )}
                          >
                            
                            {/* Checkbox row select */}
                            {isSuperAdmin && (
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isRowSelected}
                                  onChange={(e) => handleSelectRow(pkVal, e.target.checked)}
                                  className="rounded accent-accent cursor-pointer"
                                />
                              </td>
                            )}

                            {columns.map((col) => {
                              const isPk = col.isPrimaryKey
                              const isEditing = editingCell?.rowIndex === rIdx && editingCell?.colName === col.name
                              const isFlashing = successFlashCell?.rowIndex === rIdx && successFlashCell?.colName === col.name
                              
                              const val = row[col.name]
                              let displayVal = val
                              if (val === null) {
                                displayVal = <span className="text-white/20 italic">NULL</span>
                              } else if (typeof val === 'object') {
                                displayVal = <span className="text-white/40 truncate block max-w-xs">{JSON.stringify(val)}</span>
                              } else if (typeof val === 'boolean') {
                                displayVal = val ? <span className="text-emerald-400 font-bold">TRUE</span> : <span className="text-white/30">FALSE</span>
                              }

                              return (
                                <td
                                  key={col.name}
                                  onDoubleClick={() => handleStartEdit(rIdx, col.name, val)}
                                  className={cn(
                                    "px-4 py-3 font-mono text-[11px] max-w-xs truncate transition-all duration-300",
                                    isPk ? "text-accent font-semibold" : "text-white/80",
                                    isFlashing ? "bg-emerald-500/10 text-emerald-400 font-bold" : "",
                                    isSuperAdmin && !isPk ? "cursor-cell group-hover:border-white/[0.02]" : ""
                                  )}
                                  title={isSuperAdmin && !isPk ? "Double-click to inline edit cell" : ""}
                                >
                                  {isEditing ? (
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="text"
                                        value={editingValue}
                                        onChange={(e) => setEditingValue(e.target.value)}
                                        className="h-6 w-full bg-white/[0.04] border border-accent/40 rounded px-1.5 text-xs text-white focus:outline-none"
                                        autoFocus
                                        disabled={updatingCellProgress}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') handleSaveCellEdit(row, col.name, rIdx)
                                          if (e.key === 'Escape') setEditingCell(null)
                                        }}
                                      />
                                      <button
                                        onClick={() => handleSaveCellEdit(row, col.name, rIdx)}
                                        disabled={updatingCellProgress}
                                        className="p-1 rounded bg-accent/15 border border-accent/25 text-accent hover:bg-accent hover:text-[#0a0a0a] transition-colors cursor-pointer"
                                      >
                                        <Check className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => setEditingCell(null)}
                                        disabled={updatingCellProgress}
                                        className="p-1 rounded bg-white/[0.02] border border-white/[0.06] text-white/50 hover:text-white transition-colors cursor-pointer"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    displayVal
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination footer bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-3 sm:px-4 py-3 border-t border-white/[0.06] bg-white/[0.005] rounded-xl shrink-0">
                <p className="text-[11px] text-[var(--color-text-muted)] font-medium font-mono">
                  Showing <span className="text-white">{rows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> – <span className="text-white">{Math.min(currentPage * pageSize, totalRecords)}</span> of <span className="text-white">{totalRecords}</span>
                </p>

                <div className="flex items-center gap-4">
                  {/* Rows selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[var(--color-text-muted)] font-medium">Rows</span>
                    <Select
                      aria-label="Rows per page"
                      value={String(pageSize)}
                      onChange={(v) => {
                        setPageSize(Number(v))
                        setCurrentPage(1)
                      }}
                      size="sm"
                      align="right"
                      placement="top"
                      className="w-16"
                      options={[5, 10, 15, 20, 50].map((n) => ({ value: String(n), label: String(n) }))}
                    />
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1 || isLoadingData}
                      className="w-7 h-7 flex items-center justify-center rounded-md bg-white/[0.02] border border-white/[0.06] text-white/50 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] font-medium text-white px-2 font-mono select-none">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || isLoadingData}
                      className="w-7 h-7 flex items-center justify-center rounded-md bg-white/[0.02] border border-white/[0.06] text-white/50 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ==================== INSERT RECORD MODAL ==================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0a0a0c] border border-white/[0.06] rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden text-left shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-white/[0.005]">
              <h3 className="text-sm font-semibold text-white">Add new row in "{selectedTable}"</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleAddRecord} noValidate className="flex-grow overflow-y-auto p-6 space-y-4">
              <div className="space-y-4">
                {columns.map((col) => {
                  const isPk = col.isPrimaryKey
                  // Auto-generating fields like default gen_random_uuid() or default now() can be left empty
                  const hasDefault = !!col.defaultVal || isPk
                  const labelHint = isPk ? '(Primary Key - Auto)' : hasDefault ? `(Optional - Default: ${col.defaultVal || 'Auto'})` : col.nullable ? '(Optional)' : '(Required)'

                  return (
                    <div key={col.name} className="space-y-1.5 text-xs">
                      <label className="flex items-center justify-between font-mono font-semibold text-white/70">
                        <span>{col.name}</span>
                        <span className="text-[10px] text-white/30 normal-case font-sans">{labelHint}</span>
                      </label>
                      <input
                        type="text"
                        placeholder={col.type}
                        value={newRecordData[col.name] || ''}
                        onChange={(e) => setNewRecordData(prev => ({ ...prev, [col.name]: e.target.value }))}
                        className="w-full h-9 bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 text-xs text-white focus:outline-none focus:border-accent transition-colors"
                        required={!col.nullable && !hasDefault}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Form Footer Buttons */}
              <div className="pt-4 flex justify-end gap-2 border-t border-white/[0.04] mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-9 px-4 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-white/60 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <Button type="submit" disabled={isSubmittingRecord}>
                  {isSubmittingRecord ? 'Inserting...' : 'Insert row'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
