import React from 'react'

const STEPS = [
  {
    number: '01',
    title: 'Post a Task',
    description: 'Clients post scoped coding tasks with a clear brief and escrow-held budget.',
  },
  {
    number: '02',
    title: 'Claim & Submit',
    description: 'Developers claim tasks based on their level and submit work via GitHub PR.',
  },
  {
    number: '03',
    title: 'Get Paid',
    description: 'Once approved, payment releases automatically via UPI in minutes.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl text-center mb-16 text-[var(--color-text-primary)]">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {STEPS.map((step, index) => (
            <div key={index} className="flex flex-col space-y-4">
              <span className="text-5xl font-mono font-bold text-accent">
                {step.number}
              </span>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                {step.title}
              </h3>
              <p className="text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
