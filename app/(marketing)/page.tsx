import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="font-serif text-5xl text-[var(--color-text-primary)]">
        Fork<span className="text-accent">e</span>
      </h1>
      <p className="font-sans text-muted text-base">scaffold ready</p>
      
      <div className="flex gap-4">
        <Button variant="primary">Claim Task</Button>
        <Button variant="secondary">Browse Work</Button>
        <Button variant="ghost">Learn More</Button>
      </div>

      <code className="font-mono text-sm text-accent bg-accent-light px-3 py-1 rounded">
        forke.dev
      </code>
    </main>
  )
}
