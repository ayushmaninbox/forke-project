import { auth } from '@/auth'
import TopBar from '@/components/shared/TopBar'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getLevelFromXp, getLevelTitle } from '@/lib/utils/xp'
import { UserCheck } from 'lucide-react'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  )
}

export default async function DevelopersPage() {
  const session = await auth()
  const sessionUser = session?.user

  if (!sessionUser) return null

  // Fetch all users with role 'developer' ordered by level desc, xp desc
  const developersList = await db
    .select()
    .from(users)
    .where(eq(users.role, 'developer'))
    .orderBy(desc(users.level), desc(users.xp))

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg)] text-white font-sans">
      <TopBar title="Developers" />

      <div className="flex-grow overflow-y-auto">
       <div className="mx-auto max-w-6xl px-5 md:px-8 py-6 md:py-8 space-y-6 select-none w-full">
        {/* Title Section */}
        <div className="space-y-1 text-left">
          <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
            Developers
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] max-w-xl leading-relaxed">
            Browse developers on the Forke network, sorted by level and XP.
          </p>
        </div>

        {/* Developers Grid */}
        {developersList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-16">
            {developersList.map((dev) => {
              const devLevel = getLevelFromXp(dev.xp || 0)
              const levelTitle = getLevelTitle(devLevel)

              return (
                <div key={dev.id} className="group rounded-xl border border-[var(--color-border)] bg-white/[0.018] p-5 transition-colors hover:border-white/[0.14] flex flex-col justify-between min-h-[200px] text-left">
                  <div className="space-y-3">
                    {/* Header: Avatar, Name, Level Title */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center text-accent text-base font-medium shrink-0 overflow-hidden">
                        {dev.image ? (
                          <img src={dev.image} alt={dev.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          dev.name?.[0]?.toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0 leading-tight space-y-1.5">
                        <h4 className="text-sm font-medium text-white truncate group-hover:text-accent transition-colors">
                          {dev.name}
                        </h4>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-medium text-[11px] font-mono">
                            Lvl {devLevel}
                          </span>
                          <span className="text-[11px] text-[var(--color-text-muted)]">
                            {levelTitle}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Developer Bio */}
                    <p className="text-[13px] text-white/45 leading-relaxed line-clamp-3">
                      {dev.bio || "No bio provided. Shipping clean code on Forke."}
                    </p>
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="pt-4 mt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[11px] text-[var(--color-text-muted)] block">Reputation</span>
                      <span className="text-[13px] text-white/75 font-medium block mt-0.5 tabular-nums">{dev.xp} XP</span>
                    </div>

                    {/* GitHub Link */}
                    {dev.githubUrl ? (
                      <a
                        href={dev.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 px-3 text-[13px] font-medium ui-btn-secondary rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <GithubIcon className="w-3.5 h-3.5 text-accent" />
                        <span>GitHub</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-[var(--color-text-muted)]">
                        No GitHub
                      </span>
                    )}
                  </div>

                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-10 border border-dashed border-[var(--color-border)] rounded-xl flex flex-col items-center justify-center text-center gap-3 bg-white/[0.01] max-w-md mx-auto">
            <UserCheck className="w-6 h-6 text-[var(--color-text-muted)]" />
            <div className="space-y-1">
              <p className="text-white font-medium text-sm">No developers found</p>
              <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">
                There are currently no registered developers on the network.
              </p>
            </div>
          </div>
        )}

       </div>
      </div>
    </div>
  )
}
