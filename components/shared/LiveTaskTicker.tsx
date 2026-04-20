import React from 'react'

const TASKS = [
  { title: 'Fix navbar overflow on mobile', tag: 'Bug Fix', price: '₹300' },
  { title: 'Convert Figma to React component', tag: 'UI/UX', price: '₹800' },
  { title: 'Write REST endpoint for user profile', tag: 'Node.js', price: '₹500' },
  { title: 'Add dark mode toggle to dashboard', tag: 'React', price: '₹400' },
  { title: 'Optimize LCP for landing page', tag: 'Next.js', price: '₹700' },
  { title: 'Fix SQL injection vulnerability', tag: 'Security', price: '₹1200' },
  { title: 'Setup CI/CD pipeline for staging', tag: 'DevOps', price: '₹600' },
  { title: 'Implement search bar with debouncing', tag: 'JavaScript', price: '₹450' },
]

export default function LiveTaskTicker() {
  const displayTasks = [...TASKS, ...TASKS] // Duplicate for seamless looping

  return (
    <section className="py-12 border-y border-[var(--color-border)] bg-[var(--color-bg-surface)] overflow-hidden">
      <div className="flex animate-ticker w-max">
        {displayTasks.map((task, index) => (
          <div 
            key={index} 
            className="flex items-center gap-4 bg-white border border-[var(--color-border)] rounded-full px-6 py-3 mx-4 shadow-sm min-w-[300px]"
          >
            <span className="text-sm font-medium text-[var(--color-text-primary)] truncate max-w-[180px]">
              {task.title}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-accent-light text-accent-text px-2 py-0.5 rounded">
              {task.tag}
            </span>
            <span className="font-mono text-sm font-semibold text-accent whitespace-nowrap">
              {task.price}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
