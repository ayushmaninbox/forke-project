'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  getPendingOwners, 
  getApprovedOwners, 
  getDevelopers, 
  approveOwner, 
  declineOwner, 
  toggleDeveloperBan,
  getWaitlistConfig,
  updateWaitlistConfig,
  getSubscribers,
  deleteSubscriber,
  broadcastEmail
} from '@/lib/admin-dashboard-actions'
import { getEnquiries } from '@/lib/actions/support-actions'
import { adminLogout } from '@/lib/admin-actions'
import { Button } from '@/components/ui/Button'
import { 
  LayoutDashboard,
  Users, 
  MessageSquare,
  User,
  KeyRound,
  Shield,
  LogOut,
  ChevronDown,
  ChevronRight,
  ShieldCheck, 
  UserX, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter,
  Mail,
  Phone,
  Briefcase,
  ChevronRightSquare,
  Globe,
  Settings
} from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  
  // Navigation states
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'owner-approval' | 'developer-ban' | 'enquiries' | 'profile' | 'change-password' | 'admins' | 'subscribers'
  >('dashboard')
  const [usersMenuOpen, setUsersMenuOpen] = useState(true)

  // Data states
  const [ownersList, setOwnersList] = useState<any[]>([])
  const [developersList, setDevelopersList] = useState<any[]>([])
  const [enquiriesList, setEnquiriesList] = useState<any[]>([])
  const [subscribersList, setSubscribersList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [waitlistEnabled, setWaitlistEnabled] = useState(true)
  const [isTogglingWaitlist, setIsTogglingWaitlist] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Broadcast Email Modal state
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false)
  const [broadcastSubject, setBroadcastSubject] = useState('')
  const [broadcastBody, setBroadcastBody] = useState('')
  const [isBroadcasting, setIsBroadcasting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  async function fetchData() {
    setIsLoading(true)
    
    // Fetch waitlist config
    try {
      const config = await getWaitlistConfig()
      setWaitlistEnabled(config.enabled)
    } catch (e) {
      console.error('Failed to fetch waitlist status:', e)
    }

    // Fetch lists
    try {
      if (activeTab === 'dashboard' || activeTab === 'owner-approval') {
        const pending = await getPendingOwners()
        const approved = await getApprovedOwners()
        setOwnersList([...pending, ...approved])
      }
      if (activeTab === 'dashboard' || activeTab === 'developer-ban') {
        const devs = await getDevelopers()
        setDevelopersList(devs)
      }
      if (activeTab === 'dashboard' || activeTab === 'enquiries') {
        const res = await getEnquiries()
        if (res.success) setEnquiriesList(res.data || [])
      }
      if (activeTab === 'dashboard' || activeTab === 'subscribers') {
        const res = await getSubscribers()
        if (res.success) setSubscribersList(res.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    }
    
    setIsLoading(false)
  }

  async function handleToggleWaitlist() {
    setIsTogglingWaitlist(true)
    try {
      const newStatus = !waitlistEnabled
      const res = await updateWaitlistConfig(newStatus)
      if (res.success) {
        setWaitlistEnabled(newStatus)
      }
    } catch (error) {
      console.error('Failed to toggle waitlist:', error)
    } finally {
      setIsTogglingWaitlist(false)
    }
  }

  async function handleApprove(userId: string) {
    try {
      await approveOwner(userId)
      fetchData()
    } catch (err) {
      console.error('Failed to approve owner:', err)
    }
  }

  async function handleDecline(userId: string) {
    if (confirm('Are you sure you want to decline and DELETE this user?')) {
      try {
        await declineOwner(userId)
        fetchData()
      } catch (err) {
        console.error('Failed to decline owner:', err)
      }
    }
  }

  async function handleToggleBan(userId: string, isBanned: boolean) {
    try {
      await toggleDeveloperBan(userId, !isBanned)
      fetchData()
    } catch (err) {
      console.error('Failed to toggle developer ban:', err)
    }
  }

  async function handleLogout() {
    try {
      await adminLogout()
      router.push('/admin/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  async function handleDeleteSubscriber(id: string) {
    if (confirm('Are you sure you want to delete this subscriber?')) {
      try {
        const res = await deleteSubscriber(id)
        if (res.success) {
          fetchData()
        } else {
          alert('Failed to delete subscriber')
        }
      } catch (err) {
        console.error('Failed to delete subscriber:', err)
      }
    }
  }

  async function handleBroadcastEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!broadcastSubject.trim() || !broadcastBody.trim()) {
      alert('Please fill in both subject and body')
      return
    }
    setIsBroadcasting(true)
    try {
      const res = await broadcastEmail(broadcastSubject, broadcastBody)
      if (res.success) {
        alert(`Successfully sent broadcast email to ${res.sentCount} subscribers!`)
        setIsBroadcastModalOpen(false)
        setBroadcastSubject('')
        setBroadcastBody('')
        fetchData()
      } else {
        alert(res.error || 'Failed to send broadcast email')
      }
    } catch (err) {
      console.error('Failed to broadcast email:', err)
      alert('Something went wrong')
    } finally {
      setIsBroadcasting(false)
    }
  }

  function handleExportCSV() {
    const headers = ['ID', 'Email', 'Created At']
    const rows = filteredSubscribers.map((sub) => [
      sub.id,
      sub.email,
      new Date(sub.createdAt).toLocaleString()
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((e) => e.map((val) => `"${val}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `forke_subscribers_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Real-time filtering logic
  const filteredOwners = ownersList.filter(({ owner, user }) => {
    const fullName = `${owner.firstName} ${owner.lastName}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase()) || 
           owner.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           owner.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const filteredDevelopers = developersList.filter((user) => {
    return user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           user.email.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const filteredEnquiries = enquiriesList.filter((enq) => {
    const fullName = `${enq.firstName} ${enq.lastName}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase()) || 
           enq.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
           enq.message.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const filteredSubscribers = subscribersList.filter((sub) => {
    return sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      
      {/* --- FLOATING LEFT SIDEBAR --- */}
      <aside className="w-72 fixed left-6 top-6 bottom-6 rounded-[2.5rem] bg-[#0c0c0c]/85 border border-white/[0.05] backdrop-blur-3xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-40 p-6 flex flex-col justify-between">
        <div className="space-y-8">
          
          {/* Logo & Header */}
          <div className="flex items-center gap-3.5 px-3 pt-2">
            <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center text-accent shadow-[0_0_15px_rgba(255,122,0,0.1)]">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="font-serif text-xl font-bold leading-none tracking-tight">Forke Nexus</h2>
              <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mt-1.5">Control Terminal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            
            {/* Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 text-left ${
                activeTab === 'dashboard'
                  ? 'bg-accent text-bg shadow-[0_4px_12px_rgba(217,119,6,0.3)]'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* Users (Nested Sub-menu) */}
            <div className="space-y-1">
              <button
                onClick={() => setUsersMenuOpen(!usersMenuOpen)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 text-left ${
                  activeTab === 'owner-approval' || activeTab === 'developer-ban'
                    ? 'text-accent bg-accent/5 border border-accent/10'
                    : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Users className="w-4 h-4" />
                  <span>Users</span>
                </div>
                {usersMenuOpen ? <ChevronDown className="w-4 h-4 text-white/20" /> : <ChevronRight className="w-4 h-4 text-white/20" />}
              </button>

              {usersMenuOpen && (
                <div className="pl-6 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => setActiveTab('owner-approval')}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-200 text-left ${
                      activeTab === 'owner-approval'
                        ? 'text-accent font-black'
                        : 'text-white/30 hover:text-white/80'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'owner-approval' ? 'bg-accent shadow-[0_0_8px_rgba(255,122,0,0.5)]' : 'bg-white/10'}`} />
                    <span>Owner Approval</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('developer-ban')}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-200 text-left ${
                      activeTab === 'developer-ban'
                        ? 'text-accent font-black'
                        : 'text-white/30 hover:text-white/80'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'developer-ban' ? 'bg-accent shadow-[0_0_8px_rgba(255,122,0,0.5)]' : 'bg-white/10'}`} />
                    <span>Developers Ban</span>
                  </button>
                </div>
              )}
            </div>

            {/* Enquiries */}
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 text-left ${
                activeTab === 'enquiries'
                  ? 'bg-accent text-bg shadow-[0_4px_12px_rgba(217,119,6,0.3)]'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <MessageSquare className="w-4 h-4" />
                <span>Enquiries</span>
              </div>
              {enquiriesList.length > 0 && (
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                  activeTab === 'enquiries' ? 'bg-bg text-accent' : 'bg-accent/10 text-accent border border-accent/20'
                }`}>
                  {enquiriesList.length}
                </span>
              )}
            </button>

            {/* Subscribers */}
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 text-left ${
                activeTab === 'subscribers'
                  ? 'bg-accent text-bg shadow-[0_4px_12px_rgba(217,119,6,0.3)]'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Mail className="w-4 h-4" />
                <span>Subscribers</span>
              </div>
              {subscribersList.length > 0 && (
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                  activeTab === 'subscribers' ? 'bg-bg text-accent' : 'bg-accent/10 text-accent border border-accent/20'
                }`}>
                  {subscribersList.length}
                </span>
              )}
            </button>

            {/* Admins */}
            <button
              onClick={() => setActiveTab('admins')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 text-left ${
                activeTab === 'admins'
                  ? 'bg-accent text-bg shadow-[0_4px_12px_rgba(217,119,6,0.3)]'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admins</span>
            </button>

            {/* Profile */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 text-left ${
                activeTab === 'profile'
                  ? 'bg-accent text-bg shadow-[0_4px_12px_rgba(217,119,6,0.3)]'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>

            {/* Change Password */}
            <button
              onClick={() => setActiveTab('change-password')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 text-left ${
                activeTab === 'change-password'
                  ? 'bg-accent text-bg shadow-[0_4px_12px_rgba(217,119,6,0.3)]'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Change Password</span>
            </button>

          </nav>
        </div>

        {/* User Card & Logout at bottom */}
        <div className="p-3.5 rounded-3xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-accent text-xs">
            SA
          </div>
          <div className="flex-grow text-left">
            <h4 className="text-xs font-bold text-white tracking-tight leading-none">Super Admin</h4>
            <p className="text-[9px] text-white/40 uppercase tracking-[0.1em] font-black mt-1">Nexus Access</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-white/20 hover:text-red-400 transition-colors p-1"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </aside>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="flex-grow pl-[21rem] pr-6 py-6 min-h-screen flex flex-col relative z-10 text-left">
        
        {/* --- HEADER --- */}
        <header className="h-20 mb-8 border-b border-white/[0.04] flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif text-white tracking-tight capitalize">
              {activeTab === 'owner-approval' 
                ? 'Owner Approval' 
                : activeTab === 'developer-ban' 
                ? 'Developers Ban' 
                : activeTab}
            </h1>
            <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">
              SYSTEM CONTROL PANEL
            </p>
          </div>
        </header>

        {/* --- DYNAMIC BODY VIEWS --- */}
        <div className="flex-grow space-y-8">

          {/* ==================== DASHBOARD PANEL ==================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Waitlist Control Card (Visual Perfect Match) */}
              <div className="p-8 md:p-10 rounded-[2rem] bg-[#0c0c0c] border border-white/[0.04] relative overflow-hidden group shadow-2xl">
                {/* Subtle top-border glow */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent pointer-events-none" />

                {/* Top Row: Title on Left, Glowing indicator on Right */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] font-mono select-none">
                    Waitlist Gate Mode
                  </span>
                  
                  {/* Glowing Indicator Dot */}
                  <span className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    waitlistEnabled 
                      ? 'bg-orange-500 shadow-[0_0_15px_#f97316,0_0_5px_#f97316]' 
                      : 'bg-white/10 shadow-none'
                  }`} />
                </div>

                {/* Bottom Row: Text content on Left, Action button on Right */}
                <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div className="text-left space-y-1">
                    <h3 className="text-3xl font-serif text-white tracking-wide font-normal">
                      {waitlistEnabled ? 'Active / Enabled' : 'Inactive / Disabled'}
                    </h3>
                    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.15em] font-mono">
                      {waitlistEnabled ? 'Redirecting all guests' : 'Open access active'}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={handleToggleWaitlist}
                      disabled={isTogglingWaitlist}
                      className={`px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl border transition-all duration-300 active:scale-[0.97] cursor-pointer ${
                        waitlistEnabled 
                          ? 'border-[#3a1a1a] bg-[#1a0c0c] text-[#ff6a6a] hover:bg-[#3a1a1a] hover:text-white hover:shadow-[0_0_15px_rgba(255,106,106,0.15)]' 
                          : 'border-[#1a3a21] bg-[#0c1a0e] text-[#6aff87] hover:bg-[#1a3a21] hover:text-white hover:shadow-[0_0_15px_rgba(106,255,135,0.15)]'
                      }`}
                    >
                      {isTogglingWaitlist ? 'Toggling...' : (waitlistEnabled ? 'Disable' : 'Enable')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Owners */}
                <div className="p-6 rounded-[2rem] bg-[#0c0c0c] border border-white/[0.04] flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Total Clients</span>
                    <Briefcase className="w-4 h-4 text-accent/60" />
                  </div>
                  <div className="text-left mt-4">
                    <h3 className="text-4xl font-serif">{isLoading ? '...' : ownersList.length}</h3>
                    <p className="text-[9px] text-white/20 font-black uppercase tracking-wider mt-1">Pending & Approved Owners</p>
                  </div>
                </div>

                {/* Total Devs */}
                <div className="p-6 rounded-[2rem] bg-[#0c0c0c] border border-white/[0.04] flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Total Developers</span>
                    <Users className="w-4 h-4 text-accent/60" />
                  </div>
                  <div className="text-left mt-4">
                    <h3 className="text-4xl font-serif">{isLoading ? '...' : developersList.length}</h3>
                    <p className="text-[9px] text-white/20 font-black uppercase tracking-wider mt-1">Registered Builders</p>
                  </div>
                </div>

                {/* Total Enquiries */}
                <div className="p-6 rounded-[2rem] bg-[#0c0c0c] border border-white/[0.04] flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Pending Support</span>
                    <MessageSquare className="w-4 h-4 text-accent/60" />
                  </div>
                  <div className="text-left mt-4">
                    <h3 className="text-4xl font-serif">{isLoading ? '...' : enquiriesList.length}</h3>
                    <p className="text-[9px] text-white/20 font-black uppercase tracking-wider mt-1">Support & Conflict Enquiries</p>
                  </div>
                </div>

                {/* Total Subscribers */}
                <div className="p-6 rounded-[2rem] bg-[#0c0c0c] border border-white/[0.04] flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Total Subscribers</span>
                    <Mail className="w-4 h-4 text-accent/60" />
                  </div>
                  <div className="text-left mt-4">
                    <h3 className="text-4xl font-serif">{isLoading ? '...' : subscribersList.length}</h3>
                    <p className="text-[9px] text-white/20 font-black uppercase tracking-wider mt-1">Waitlist Signups</p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================== OWNER APPROVAL PANEL ==================== */}
          {activeTab === 'owner-approval' && (
            <div className="rounded-[2.5rem] bg-[#0c0c0c] border border-white/[0.04] overflow-hidden">
              
              {/* Search & filters */}
              <div className="p-6 border-b border-white/[0.04] flex items-center justify-between bg-white/[0.01]">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Search owners by name, company, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-6 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="gap-2 border-white/5 text-[10px] font-black uppercase rounded-xl h-11 bg-transparent">
                    <Filter className="w-3 h-3" /> Filter
                  </Button>
                </div>
              </div>

              {/* Table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">User Details</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Company / Designation</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-white/20 uppercase font-black tracking-widest font-mono">Loading Records...</td>
                      </tr>
                    ) : filteredOwners.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-white/20 uppercase font-black tracking-widest font-mono">No matching records found</td>
                      </tr>
                    ) : (
                      filteredOwners.map(({ user, owner }) => (
                        <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 overflow-hidden relative shrink-0">
                                {user.image && <img src={user.image} alt={user.name} className="object-cover w-full h-full" />}
                              </div>
                              <div>
                                <p className="font-bold text-white leading-none">{owner.firstName} {owner.lastName}</p>
                                <div className="flex items-center gap-3 text-[11px] text-white/30 mt-2 font-mono">
                                  <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {owner.contactEmail}</span>
                                  {owner.contactNumber && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {owner.contactNumber}</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-left">
                              <p className="text-sm font-semibold text-white/80 leading-none">{owner.companyName}</p>
                              <p className="text-[10px] text-accent/70 font-black uppercase tracking-widest mt-2 flex items-center gap-1.5 font-mono">
                                <Briefcase className="w-3.5 h-3.5" /> {owner.designation}
                              </p>
                              <div className="flex items-center gap-3 mt-3">
                                <a href={owner.personalLinkedIn} target="_blank" className="text-[9px] text-white/25 hover:text-white transition-colors underline uppercase tracking-widest font-bold">LinkedIn</a>
                                {owner.companyWebsite && <a href={owner.companyWebsite} target="_blank" className="text-[9px] text-white/25 hover:text-white transition-colors underline uppercase tracking-widest font-bold">Website</a>}
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            {user.isApproved ? (
                              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase flex items-center gap-1.5 w-fit font-mono">
                                <CheckCircle2 className="w-3 h-3" /> Approved
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-black uppercase flex items-center gap-1.5 w-fit font-mono animate-pulse">
                                <ShieldCheck className="w-3 h-3" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              {!user.isApproved && (
                                <button 
                                  onClick={() => handleApprove(user.id)}
                                  className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                  title="Approve Owner"
                                >
                                  <CheckCircle2 className="w-5 h-5" />
                                </button>
                              )}
                              <button 
                                onClick={() => handleDecline(user.id)}
                                className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                title="Decline & Delete"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ==================== DEVELOPER BAN PANEL ==================== */}
          {activeTab === 'developer-ban' && (
            <div className="rounded-[2.5rem] bg-[#0c0c0c] border border-white/[0.04] overflow-hidden">
              
              {/* Search */}
              <div className="p-6 border-b border-white/[0.04] bg-white/[0.01]">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Search developers by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-6 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">User Details</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {isLoading ? (
                      <tr>
                        <td colSpan={3} className="px-8 py-20 text-center text-white/20 uppercase font-black tracking-widest font-mono">Loading Records...</td>
                      </tr>
                    ) : filteredDevelopers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-8 py-20 text-center text-white/20 uppercase font-black tracking-widest font-mono">No matching records found</td>
                      </tr>
                    ) : (
                      filteredDevelopers.map((user) => (
                        <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 overflow-hidden relative shrink-0">
                                {user.image && <img src={user.image} alt={user.name} className="object-cover w-full h-full" />}
                              </div>
                              <div>
                                <p className="font-bold text-white leading-none">{user.name}</p>
                                <p className="text-[11px] text-white/30 mt-2 flex items-center gap-1.5 font-mono"><Mail className="w-3.5 h-3.5" /> {user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            {user.isBanned ? (
                              <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase flex items-center gap-1.5 w-fit font-mono">
                                <UserX className="w-3 h-3" /> Banned
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase flex items-center gap-1.5 w-fit font-mono">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-6">
                            <button 
                              onClick={() => handleToggleBan(user.id, user.isBanned)}
                              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                user.isBanned 
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]' 
                                  : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                              }`}
                            >
                              {user.isBanned ? 'Unban User' : 'Ban User'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ==================== ENQUIRIES PANEL ==================== */}
          {activeTab === 'enquiries' && (
            <div className="rounded-[2.5rem] bg-[#0c0c0c] border border-white/[0.04] overflow-hidden">
              
              {/* Search */}
              <div className="p-6 border-b border-white/[0.04] bg-white/[0.01]">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Search enquiries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-6 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Contact Info</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Message Details</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Issue Category</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-white/20 uppercase font-black tracking-widest font-mono">Loading Records...</td>
                      </tr>
                    ) : filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-white/20 uppercase font-black tracking-widest font-mono">No matching records found</td>
                      </tr>
                    ) : (
                      filteredEnquiries.map((enq) => (
                        <tr key={enq.id} className="group hover:bg-white/[0.01] transition-colors">
                          <td className="px-8 py-6">
                            <div>
                              <p className="font-bold text-white leading-none">{enq.firstName} {enq.lastName}</p>
                              <div className="flex items-center gap-3 text-[11px] text-white/30 mt-2 font-mono">
                                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {enq.contactEmail}</span>
                                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {enq.contactNumber}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 max-w-sm">
                            <p className="text-sm text-white/70 line-clamp-3 leading-relaxed font-sans" title={enq.message}>
                              {enq.message}
                            </p>
                            {enq.relevantLinks && (
                              <a href={enq.relevantLinks} target="_blank" className="text-[9px] text-accent mt-3.5 inline-block uppercase tracking-widest font-black hover:underline font-mono">
                                View Attached Link
                              </a>
                            )}
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[9px] font-black uppercase font-mono">
                              {enq.errorType === 'AccessDenied' 
                                ? 'USER BAN' 
                                : enq.errorType === 'GitHubIdentityMismatch' 
                                ? 'GITHUB CONFLICT' 
                                : enq.errorType || 'GENERAL'}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-[11px] text-white/40 font-mono">{new Date(enq.createdAt).toLocaleDateString()}</p>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ==================== SUBSCRIBERS PANEL ==================== */}
          {activeTab === 'subscribers' && (
            <div className="rounded-[2.5rem] bg-[#0c0c0c] border border-white/[0.04] overflow-hidden">
              
              {/* Search & Action Buttons */}
              <div className="p-6 border-b border-white/[0.04] flex flex-col md:flex-row md:items-center justify-between bg-white/[0.01] gap-4">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Search subscribers by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-6 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsBroadcastModalOpen(true)}
                    className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-gradient-to-b from-accent to-[#d97706] hover:translate-y-[1px] hover:shadow-[0_0_15px_rgba(255,122,0,0.25)] active:translate-y-[2px] transition-all text-[#050505] flex items-center gap-2 cursor-pointer font-bold h-11"
                  >
                    <Mail className="w-4 h-4 text-black" /> Broadcast Email
                  </button>
                  <button 
                    onClick={handleExportCSV}
                    className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 bg-white/[0.02] text-white hover:bg-white/[0.05] hover:border-white/10 hover:translate-y-[1px] active:translate-y-[2px] transition-all flex items-center gap-2 cursor-pointer font-bold h-11"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Subscriber ID</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Email Address</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Date & Time Joined</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-white/20 uppercase font-black tracking-widest font-mono">Loading Records...</td>
                      </tr>
                    ) : filteredSubscribers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-white/20 uppercase font-black tracking-widest font-mono">No matching records found</td>
                      </tr>
                    ) : (
                      filteredSubscribers.map((sub) => (
                        <tr key={sub.id} className="group hover:bg-white/[0.01] transition-colors">
                          <td className="px-8 py-6">
                            <p className="text-xs text-white/40 font-mono font-bold">{sub.id}</p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="font-bold text-white font-sans">{sub.email}</p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-[11px] text-white/50 font-mono">{new Date(sub.createdAt).toLocaleString()}</p>
                          </td>
                          <td className="px-8 py-6">
                            <button 
                              onClick={() => handleDeleteSubscriber(sub.id)}
                              className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer"
                              title="Delete Subscriber"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ==================== ADMINS PANEL (Placeholder) ==================== */}
          {activeTab === 'admins' && (
            <div className="p-12 rounded-[2.5rem] bg-[#0c0c0c] border border-white/[0.04] text-center min-h-[300px] flex flex-col items-center justify-center">
              <Shield className="w-12 h-12 text-white/15 mb-4" />
              <h3 className="text-xl font-serif text-white tracking-tight">Nexus Admins Control</h3>
              <p className="text-xs text-white/40 leading-relaxed font-light max-w-sm mt-2">
                This section manages administrative credentials, security roles, and system permission overrides.
              </p>
            </div>
          )}

          {/* ==================== PROFILE PANEL (Placeholder) ==================== */}
          {activeTab === 'profile' && (
            <div className="p-12 rounded-[2.5rem] bg-[#0c0c0c] border border-white/[0.04] text-center min-h-[300px] flex flex-col items-center justify-center">
              <User className="w-12 h-12 text-white/15 mb-4" />
              <h3 className="text-xl font-serif text-white tracking-tight">Admin Profile Settings</h3>
              <p className="text-xs text-white/40 leading-relaxed font-light max-w-sm mt-2">
                Configure your system nickname, profile avatar, support signature, and administrative notification email here.
              </p>
            </div>
          )}

          {/* ==================== CHANGE PASSWORD PANEL (Placeholder) ==================== */}
          {activeTab === 'change-password' && (
            <div className="p-12 rounded-[2.5rem] bg-[#0c0c0c] border border-white/[0.04] text-center min-h-[300px] flex flex-col items-center justify-center">
              <KeyRound className="w-12 h-12 text-white/15 mb-4" />
              <h3 className="text-xl font-serif text-white tracking-tight">Change Password Credentials</h3>
              <p className="text-xs text-white/40 leading-relaxed font-light max-w-sm mt-2">
                Securely update your terminal access password. Double factor validation will be requested to proceed.
              </p>
            </div>
          )}

        </div>

      </main>

      {/* --- BROADCAST EMAIL GLASS MODAL --- */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-[#0c0c0c]/90 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.85)] relative overflow-hidden group">
            {/* Ambient top border glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-6 text-left">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-serif text-white tracking-wide">Broadcast Message</h3>
                <p className="text-xs text-white/40 leading-relaxed font-light">
                  Send a beautiful wrapped HTML announcement to all waitlist subscribers. Use standard paragraphs and spacing.
                </p>
              </div>

              <form onSubmit={handleBroadcastEmail} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Subject Title</label>
                  <input
                    type="text"
                    required
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    placeholder="E.g., Early Access Invites or Big Product Update!"
                    className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-xl px-4 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-accent/40 transition-all font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Email Body Content</label>
                  <textarea
                    required
                    rows={8}
                    value={broadcastBody}
                    onChange={(e) => setBroadcastBody(e.target.value)}
                    placeholder="Type your message content here. New lines will automatically convert to line breaks in the HTML format..."
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-accent/40 transition-all font-sans resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsBroadcastModalOpen(false)
                      setBroadcastSubject('')
                      setBroadcastBody('')
                    }}
                    className="px-6 h-12 text-xs font-black uppercase tracking-widest rounded-xl border border-white/5 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBroadcasting}
                    className="px-8 h-12 text-xs font-black uppercase tracking-widest rounded-xl bg-gradient-to-b from-accent to-[#d97706] text-[#050505] flex items-center justify-center gap-2 cursor-pointer font-bold hover:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBroadcasting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        <span>Broadcasting...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 text-black fill-current" />
                        <span>Send Broadcast</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
