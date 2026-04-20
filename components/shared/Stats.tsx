import React from 'react'

const STATS = [
  { label: 'Tasks Completed', value: '1,240+' },
  { label: 'Total Paid Out', value: '₹4.8L+' },
  { label: 'Active Developers', value: '850+' },
  { label: 'Colleges Reached', value: '12+' },
]

export default function Stats() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat, index) => (
            <div key={index} className="flex flex-col items-center md:items-start space-y-2">
              <span className="font-serif text-5xl md:text-6xl text-[var(--color-text-primary)]">
                {stat.value}
              </span>
              <span className="text-muted text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
