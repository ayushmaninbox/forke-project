'use client'

import React, { useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { SKILL_TAGS } from '@/constants'
import { createTask, CreateTaskState } from '@/lib/actions/tasks'
import { Button } from '@/components/ui/Button'
import { IndianRupee, Calendar, Tag, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const initialState: CreateTaskState = {
  message: null,
  errors: {},
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className={cn(
        "w-full md:w-auto min-w-[200px] h-12 text-lg font-serif",
        pending && "opacity-80"
      )}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Posting...
        </span>
      ) : (
        'Post Task'
      )}
    </Button>
  )
}

export default function PostTaskForm() {
  const [state, formAction] = useActionState(createTask, initialState)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      <form action={formAction} className="lg:col-span-2 space-y-8">
        {state.message && (
          <div className="p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 bg-red-50 text-red-700 border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium text-sm">{state.message}</p>
          </div>
        )}

        {/* Task Title */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label htmlFor="title" className="text-sm font-bold text-[var(--color-text-primary)]">
              Task Title
            </label>
            <span className={cn(
              "text-[10px] tabular-nums font-mono",
              title.length > 90 ? "text-red-500" : "text-muted"
            )}>
              {title.length}/100
            </span>
          </div>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Build a landing page with Tailwind"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={cn(
              "w-full h-12 px-4 rounded-lg bg-white border transition-all outline-none",
              state.errors?.title ? "border-red-300 focus:ring-1 focus:ring-red-500" : "border-[var(--color-border)] focus:border-accent focus:ring-1 focus:ring-accent"
            )}
          />
          {state.errors?.title && (
            <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {state.errors.title[0]}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label htmlFor="description" className="text-sm font-bold text-[var(--color-text-primary)]">
              Description
            </label>
            <span className={cn(
              "text-[10px] tabular-nums font-mono",
              description.length > 900 ? "text-red-500" : "text-muted"
            )}>
              {description.length}/1000
            </span>
          </div>
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            placeholder="Describe the task, requirements, and deliverables..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={cn(
              "w-full px-4 py-3 rounded-lg bg-white border transition-all outline-none resize-none min-h-[120px]",
              state.errors?.description ? "border-red-300 focus:ring-1 focus:ring-red-500" : "border-[var(--color-border)] focus:border-accent focus:ring-1 focus:ring-accent"
            )}
          />
          {state.errors?.description && (
            <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {state.errors.description[0]}
            </p>
          )}
        </div>

        {/* Skill Tags */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-accent" />
            <label className="text-sm font-bold text-[var(--color-text-primary)]">
              Skill Tags (1-5)
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {SKILL_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                disabled={!selectedTags.includes(tag) && selectedTags.length >= 5}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  selectedTags.includes(tag)
                    ? "bg-accent border-accent text-white shadow-sm"
                    : "bg-white border-[var(--color-border)] text-muted hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
          {/* Hidden Inputs for Form Submission */}
          {selectedTags.map((tag) => (
            <input key={tag} type="hidden" name="skillTags" value={tag} />
          ))}
          {state.errors?.skillTags && (
            <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {state.errors.skillTags[0]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget */}
          <div className="space-y-2">
            <label htmlFor="budget" className="text-sm font-bold text-[var(--color-text-primary)]">
              Budget (Rupees)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                <IndianRupee className="w-4 h-4" />
              </div>
              <input
                id="budget"
                name="budget"
                type="number"
                required
                min={100}
                max={5000}
                placeholder="500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className={cn(
                  "w-full h-12 pl-10 pr-4 rounded-lg bg-white border transition-all outline-none",
                  state.errors?.budget ? "border-red-300 focus:ring-1 focus:ring-red-500" : "border-[var(--color-border)] focus:border-accent focus:ring-1 focus:ring-accent"
                )}
              />
            </div>
            <p className="text-[10px] text-muted">Minimum ₹100 · Maximum ₹5,000</p>
            {state.errors?.budget && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {state.errors.budget[0]}
              </p>
            )}
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <label htmlFor="deadline" className="text-sm font-bold text-[var(--color-text-primary)]">
              Deadline (Optional)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="deadline"
                name="deadline"
                type="date"
                className="w-full h-12 pl-10 pr-4 rounded-lg bg-white border border-[var(--color-border)] focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
            {state.errors?.deadline && (
              <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {state.errors.deadline[0]}
              </p>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--color-border)]">
          <SubmitButton />
        </div>
      </form>

      {/* Live Preview */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest pl-1">Live Preview</h3>
          <div className="bg-white border-2 border-accent/20 rounded-xl p-6 shadow-sm space-y-4 relative overflow-hidden group">
            {/* Gloss Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-start gap-4 relative">
              <h4 className="font-serif text-xl text-[var(--color-text-primary)] break-words min-h-[1.5em] leading-tight">
                {title || 'Your Task Title'}
              </h4>
              <div className="bg-accent-light px-3 py-1 rounded text-accent font-mono font-bold text-sm whitespace-nowrap shadow-sm">
                ₹{budget || '0'}
              </div>
            </div>
            
            <p className="text-sm text-muted line-clamp-3 min-h-[4.5em] relative">
              {description || 'Your task description will appear here as you type...'}
            </p>

            <div className="flex flex-wrap gap-1.5 relative">
              {selectedTags.length > 0 ? (
                selectedTags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-[var(--color-bg-surface)] text-[10px] font-bold text-[var(--color-text-primary)] rounded uppercase tracking-tight border border-[var(--color-border)]">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-muted italic">No tags selected yet</span>
              )}
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] relative">
              <span className="text-muted uppercase font-bold tabular-nums tracking-widest leading-none">STATUS: OPEN</span>
              <div className="flex items-center gap-1 text-muted">
                <Calendar className="w-3 h-3" />
                <span>Expires soon</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
            <div className="flex gap-3">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed">
                <span className="font-bold">Pro Tip:</span> Clear instructions attract better quality workers. Be specific about your deliverables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
