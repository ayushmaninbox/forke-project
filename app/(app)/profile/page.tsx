import TopBar from '@/components/shared/TopBar'

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-full">
      <TopBar title="Profile" />
      <div className="p-8">
        <h1 className="font-serif text-3xl">Profile</h1>
      </div>
    </div>
  )
}
