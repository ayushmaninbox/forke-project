import { auth } from '@/auth'
import { getSubmissionsByDeveloper } from '@/lib/db/queries/tasks'
import TopBar from '@/components/shared/TopBar'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Clock, GitPullRequest, ChevronRight, CheckCircle2, AlertCircle, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type SubmissionItem = Awaited<ReturnType<typeof getSubmissionsByDeveloper>>[number]

function SubmissionRow({ item }: { item: SubmissionItem }) {
  return (
    <div className="bg-white border-2 border-[var(--color-border)] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-accent/30 transition-all shadow-sm">
      <div className="flex-1 space-y-3 min-w-0">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-serif text-[var(--color-text-primary)] truncate">
            {item.taskTitle}
          </h4>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-muted/60">
          <div className="flex items-center gap-1.5 text-accent font-bold font-mono">
            ₹ {Math.floor(item.taskBudget / 100)}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {new Date(item.submission.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
          <div className="flex items-center gap-1.5 truncate max-w-[200px]">
            <GitPullRequest className="w-3.5 h-3.5" />
            {item.submission.githubLink.replace('https://github.com/', '')}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          href={`/tasks/${item.submission.taskId}`}
          className="px-4 py-2 text-[10px] font-bold text-accent uppercase tracking-widest border-2 border-accent/10 rounded-xl hover:bg-accent hover:text-white transition-all flex items-center gap-2"
        >
          View Task <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}

function Section({ title, items, icon: Icon, colorClass, statusLabel }: { title: string, items: SubmissionItem[], icon: React.ElementType, colorClass: string, statusLabel: string }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner", colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-baseline gap-3">
          <h3 className="text-2xl font-serif text-[var(--color-text-primary)] tracking-tight">{title}</h3>
          <span className="text-xs font-mono font-bold text-muted/40 tracking-wider">({items.length})</span>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {items.map((s) => <SubmissionRow key={s.submission.id} item={s} />)}
        </div>
      ) : (
        <div className="p-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center text-center gap-2 grayscale opacity-40">
           <Inbox className="w-5 h-5" />
           <p className="text-[10px] font-bold uppercase tracking-[0.2em]">No {statusLabel} submissions</p>
        </div>
      )}
    </section>
  )
}

export default async function SubmissionsPage() {
  const session = await auth()
  const user = session?.user as { id: string; role: 'developer' | 'owner' } | undefined

  if (!user || user.role === 'owner') {
    redirect('/dashboard')
  }

  const submissions = await getSubmissionsByDeveloper(user.id)

  const pending = submissions.filter(s => s.submission.status === 'pending')
  const approved = submissions.filter(s => s.submission.status === 'approved')
  const rejected = submissions.filter(s => s.submission.status === 'rejected')

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] font-sans">
      <TopBar title="My Submissions" />
      <div className="flex-grow p-8 overflow-y-auto space-y-16 pb-20">
        <div className="max-w-4xl space-y-2">
          <h2 className="font-serif text-5xl text-[var(--color-text-primary)] tracking-tight">
            Submission History
          </h2>
          <p className="text-muted text-lg font-medium">
            Track the status of your work across all claimed tasks.
          </p>
        </div>

        <div className="max-w-5xl space-y-16">
          <Section 
            title="Active Reviews" 
            items={pending} 
            icon={Clock} 
            colorClass="bg-amber-100 text-amber-600"
            statusLabel="pending"
          />

          <Section 
            title="Revision Requested" 
            items={rejected} 
            icon={AlertCircle} 
            colorClass="bg-red-100 text-red-600"
            statusLabel="rejected"
          />

          <Section 
            title="Completed Work" 
            items={approved} 
            icon={CheckCircle2} 
            colorClass="bg-green-100 text-green-600"
            statusLabel="approved"
          />
        </div>
      </div>
    </div>
  )
}
