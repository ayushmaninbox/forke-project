import { auth } from '@/auth'
import TopBar from '@/components/shared/TopBar'
import { db } from '@/lib/db'
import { users, owners, accounts, subscribers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import SettingsForm from '@/components/settings/SettingsForm'
import { ensureTelemetrySettingsColumns, getSystemSpecs } from '@/app/(app)/settings/actions'

export const maxDuration = 10;

export default async function SettingsPage() {
  const session = await auth()
  const sessionUser = session?.user

  if (!sessionUser) return null

  // Ensure telemetry database columns are present
  await ensureTelemetrySettingsColumns()
  
  // Fetch live system specs with timeout protection
  let systemSpecs = {
    databaseState: 'disconnected',
    dbLatencyMs: 0,
    runtimeVersion: `nextjs v15.5.15`
  }
  
  try {
    systemSpecs = await getSystemSpecs()
  } catch (e) {
    console.error('Failed to get system specs:', e)
  }

  // Fetch full user record
  let dbUser = null
  try {
    dbUser = await db.query.users.findFirst({
      where: eq(users.id, sessionUser.id)
    })
  } catch (e) {
    console.error('Failed to fetch user:', e)
    return <div className="text-white p-4">Failed to load user data</div>
  }

  if (!dbUser) return null

  let ownerDetails = null
  if (sessionUser.role === 'owner') {
    try {
      ownerDetails = await db.query.owners.findFirst({
        where: eq(owners.id, sessionUser.id)
      })
    } catch (e) {
      console.error('Failed to fetch owner details:', e)
    }
  }

  // Fetch connected OAuth accounts
  let connectedAccounts: string[] = []
  try {
    const userAccounts = await db
      .select({ provider: accounts.provider })
      .from(accounts)
      .where(eq(accounts.userId, sessionUser.id))
    connectedAccounts = userAccounts.map(a => a.provider)
  } catch (e) {
    console.error('Failed to fetch connected accounts:', e)
  }

  // Fetch promotional subscription status
  let subscribedToPromotions = false
  try {
    const subscriber = await db.query.subscribers.findFirst({
      where: eq(subscribers.email, dbUser.email)
    })
    subscribedToPromotions = !!subscriber
  } catch (e) {
    console.error('Failed to fetch subscriber status:', e)
  }

  return (
    <div className="flex flex-col h-full bg-transparent text-white font-sans">
      <TopBar title="Settings" />

      <div className="flex-grow overflow-y-auto">
       <div className="mx-auto max-w-4xl px-5 md:px-8 py-6 md:py-8 space-y-6 select-none w-full">
        {/* Header Title */}
        <div className="space-y-1 text-left">
          <h2 className="text-xl md:text-2xl font-medium text-white tracking-tight">
            Site Settings
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] max-w-xl leading-relaxed">
            Notifications, integrations, and system preferences. Looking to edit your
            profile? Head to <span className="text-accent">your profile page</span>.
          </p>
        </div>

        <SettingsForm
          userId={dbUser.id}
          role={dbUser.role}
          initialName={dbUser.name}
          initialBio={dbUser.bio}
          initialGithubUrl={dbUser.githubUrl}
          initialCompanyName={ownerDetails?.companyName}
          initialCompanyWebsite={ownerDetails?.companyWebsite}
          initialDesignation={ownerDetails?.designation}
          initialContactNumber={ownerDetails?.contactNumber}
          initialContactEmail={ownerDetails?.contactEmail}
          initialPersonalLinkedIn={ownerDetails?.personalLinkedIn}
          initialEmailAlerts={dbUser.emailAlerts ?? true}
          initialSlackWebhooks={dbUser.slackWebhooks ?? false}
          systemSpecs={systemSpecs}
          connectedAccounts={connectedAccounts}
          hasPassword={!!dbUser.passwordHash}
          initialSubscribedToPromotions={subscribedToPromotions}
        />
       </div>
      </div>
    </div>
  )
}
