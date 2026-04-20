'use client'

import React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SKILL_TAGS } from '@/constants'
import { cn } from '@/lib/utils/cn'
import { X } from 'lucide-react'

const BUDGET_OPTIONS = [
  { label: 'Any budget', value: '' },
  { label: 'Under ₹300', value: '30000' },
  { label: 'Under ₹600', value: '60000' },
  { label: 'Under ₹1,000', value: '100000' },
  { label: 'Under ₹2,500', value: '250000' },
]

export default function TaskFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentTags = searchParams.getAll('tag')
  const currentMaxBudget = searchParams.get('maxBudget') || ''

  const updateFilters = (newTags: string[], newMaxBudget: string) => {
    const params = new URLSearchParams()
    newTags.forEach(tag => params.append('tag', tag))
    if (newMaxBudget) params.set('maxBudget', newMaxBudget)
    
    // Using simple router push to trigger server-side re-fetch
    router.push(`${pathname}?${params.toString()}`)
  }

  const toggleTag = (tag: string) => {
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]
    updateFilters(newTags, currentMaxBudget)
  }

  const clearFilters = () => {
    router.push(pathname)
  }

  const hasFilters = currentTags.length > 0 || currentMaxBudget !== ''

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-[var(--color-border)] shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Skill Tags */}
        <div className="flex-grow space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Filter by Skill</h4>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="lg:hidden flex items-center gap-1 text-[10px] font-bold text-accent hover:underline mb-1"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 cursor-pointer">
            {SKILL_TAGS.map((tag) => {
              const isActive = currentTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-bold border transition-all duration-200",
                    isActive
                      ? "bg-accent border-accent text-white shadow-md shadow-accent/20"
                      : "bg-[var(--color-bg-surface)] border-[var(--color-border)] text-muted hover:border-accent/40 hover:text-[var(--color-text-primary)]"
                  )}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>

        {/* Budget & Clear */}
        <div className="flex items-end gap-3 shrink-0">
          <div className="space-y-3 w-full sm:w-48">
            <h4 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Max Budget</h4>
            <div className="relative">
              <select
                value={currentMaxBudget}
                onChange={(e) => updateFilters(currentTags, e.target.value)}
                className="w-full h-10 pl-3 pr-8 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-lg text-xs font-bold outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none cursor-pointer"
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="hidden lg:flex items-center gap-1.5 text-[10px] font-bold text-accent hover:text-amber-700 transition-colors h-10 px-2"
            >
              <X className="w-3.5 h-3.5" />
              CLEAR
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
