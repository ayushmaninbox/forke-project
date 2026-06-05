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
  getCurrentAdminAction,
  getAdmins,
  inviteAdmin,
  deleteAdmin,
  updateAdminProfile,
  toggleAdminDisabledAction,
  resetAdminPasswordAction,
  changeAdminPasswordAction,
  logSubscribersExportAction
} from '@/lib/admin-dashboard-actions'
import { getEnquiries } from '@/lib/actions/support-actions'
import { adminLogout } from '@/lib/admin-actions'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import ToastContainer, { toast } from '@/components/shared/Toast'
import { cn } from '@/lib/utils/cn'
import { 
  LayoutDashboard,
  Users, 
  MessageSquare,
  User,
  KeyRound,
  Shield,
  LogOut,
  ChevronDown,
  ChevronLeft,
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
  Settings,
  UserPlus,
  Terminal,
  Copy,
  Eye,
  EyeOff,
  Database,
  Menu,
  X,
  Activity,
  Table
} from 'lucide-react'
import DatabaseConsole from '@/components/admin/DatabaseConsole'
import DatabaseOverviewPanel from '@/components/admin/DatabaseOverviewPanel'
import DatabaseMonitoringPanel from '@/components/admin/DatabaseMonitoringPanel'
import ActivityFeedPanel from '@/components/admin/ActivityFeedPanel'
import { getActivityLogLiveStatusAction } from '@/lib/actions/audit-actions'


const maskToken = (token: string) => {
  if (!token) return 'N/A'
  if (token.length <= 8) return '••••••••'
  return `${token.slice(0, 8)}••••••••${token.slice(-4)}`
}

export default function AdminDashboard() {
  const router = useRouter()
  
  // Navigation states
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'owner-approval' | 'developer-ban' | 'enquiries' | 'admins' | 'subscribers' | 'activity' | 'database' | 'db-overview' | 'db-monitoring' | 'sql-editor' | null
  >(null)
  const [usersMenuOpen, setUsersMenuOpen] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [activityLive, setActivityLive] = useState(true)

  // Keep the sidebar Activity badge in sync with the global live/paused status
  useEffect(() => {
    let active = true
    const sync = async () => {
      const res = await getActivityLogLiveStatusAction()
      if (active && res.success && typeof res.live === 'boolean') setActivityLive(res.live)
    }
    sync()
    const id = setInterval(sync, 5000)
    return () => { active = false; clearInterval(id) }
  }, [])

  // Synchronize activeTab with URL query parameter on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab')
      const validTabs = [
        'dashboard', 'owner-approval', 'developer-ban', 'enquiries', 
        'admins', 'subscribers', 'activity', 'database', 'db-overview', 'db-monitoring', 'sql-editor'
      ]
      if (tab && validTabs.includes(tab)) {
        setActiveTab(tab as any)
      } else {
        setActiveTab('dashboard')
      }
    }
  }, [])

  // Switch tab and close the mobile drawer
  function selectTab(tab: Exclude<typeof activeTab, null>) {
    setActiveTab(tab)
    setMobileNavOpen(false)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('tab', tab)
      window.history.pushState({}, '', url.pathname + url.search)
    }
  }

  // Modal open states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)

  // Data states
  const [ownersList, setOwnersList] = useState<any[]>([])
  const [developersList, setDevelopersList] = useState<any[]>([])
  const [enquiriesList, setEnquiriesList] = useState<any[]>([])
  const [subscribersList, setSubscribersList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [waitlistEnabled, setWaitlistEnabled] = useState(true)
  const [isTogglingWaitlist, setIsTogglingWaitlist] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Current admin session info
  const [currentAdmin, setCurrentAdmin] = useState<any>(null)
  
  // Profile settings state
  const [profileName, setProfileName] = useState('')
  const [profileUsername, setProfileUsername] = useState('')
  const [profileAltEmail, setProfileAltEmail] = useState('')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Admins state
  const [adminsList, setAdminsList] = useState<any[]>([])
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteAltEmail, setInviteAltEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'super_admin' | 'admin'>('admin')
  const [isInviting, setIsInviting] = useState(false)

  // Password reset modal states
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [resetTargetAdmin, setResetTargetAdmin] = useState<any>(null)
  const [resetNewPassword, setResetNewPassword] = useState('')
  const [isResetting, setIsResetting] = useState(false)

  // Change Password states
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Show/Hide password toggle states
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Waitlist bypass password states
  const [waitlistBypassPassword, setWaitlistBypassPasswordState] = useState('')
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false)
  const [waitlistModalPassword, setWaitlistModalPassword] = useState('')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    if (currentAdmin && currentAdmin.role !== 'super_admin' && activeTab === 'admins') {
      setActiveTab('dashboard')
      return
    }
    fetchData()
  }, [activeTab, currentAdmin])

  async function fetchData() {
    if (activeTab === null) return
    setIsLoading(true)
    
    // Fetch waitlist config
    try {
      const config = await getWaitlistConfig()
      setWaitlistEnabled(config.enabled)
      setWaitlistBypassPasswordState(config.bypassPassword || '')
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
      if (activeTab === 'dashboard' || activeTab === 'admins') {
        const res = await getAdmins()
        if (res.success) setAdminsList(res.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    }
    
    setIsLoading(false)
  }

  async function fetchCurrentAdmin() {
    try {
      const res = await getCurrentAdminAction()
      if (res.success) {
        setCurrentAdmin(res.admin)
      }
    } catch (err) {
      console.error('Failed to fetch current admin:', err)
    }
  }

  useEffect(() => {
    fetchCurrentAdmin()
  }, [])

  useEffect(() => {
    if (currentAdmin) {
      setProfileName(currentAdmin.name || '')
      setProfileAltEmail(currentAdmin.alternativeEmail || '')
      setProfileUsername(currentAdmin.username || '')
    }
  }, [currentAdmin])

  async function handleToggleWaitlist() {
    if (waitlistEnabled) {
      if (confirm('Are you sure you want to disable the waitlist? This will allow open access to the site.')) {
        setIsTogglingWaitlist(true)
        try {
          const res = await updateWaitlistConfig(false)
          if (res.success) {
            setWaitlistEnabled(false)
          }
        } catch (error) {
          console.error('Failed to toggle waitlist:', error)
        } finally {
          setIsTogglingWaitlist(false)
        }
      }
    } else {
      setWaitlistModalPassword(waitlistBypassPassword || 'bypass123')
      setIsWaitlistModalOpen(true)
    }
  }

  async function handleSaveWaitlistConfig(e: React.FormEvent) {
    e.preventDefault()
    if (!waitlistModalPassword.trim()) {
      toast('Bypass password is required.', "error")
      return
    }
    setIsTogglingWaitlist(true)
    try {
      const res = await updateWaitlistConfig(true, waitlistModalPassword.trim())
      if (res.success) {
        setWaitlistEnabled(true)
        setWaitlistBypassPasswordState(waitlistModalPassword.trim())
        setIsWaitlistModalOpen(false)
      }
    } catch (error) {
      console.error('Failed to enable waitlist:', error)
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
          toast('Failed to delete subscriber', "error")
        }
      } catch (err) {
        console.error('Failed to delete subscriber:', err)
      }
    }
  }

  async function handleInviteAdmin(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim()) {
      toast('Please fill in Name and Email address.', "error")
      return
    }
    setIsInviting(true)
    try {
      const res = await inviteAdmin(
        inviteName.trim(),
        inviteEmail.trim().toLowerCase(),
        inviteRole,
        inviteAltEmail.trim() || undefined
      )
      if (res.success) {
        toast('Invitation dispatched successfully!', "success")
        setIsInviteModalOpen(false)
        setInviteName('')
        setInviteEmail('')
        setInviteAltEmail('')
        setInviteRole('admin')
        fetchData()
      } else {
        toast(res.error || 'Failed to send administrative invitation.', "error")
      }
    } catch (err) {
      console.error('Invite error:', err)
      toast('Something went wrong. Please try again.', "error")
    } finally {
      setIsInviting(false)
    }
  }

  async function handleDeleteAdmin(id: string) {
    if (confirm('Are you sure you want to decline and DELETE this administrator?')) {
      try {
        const res = await deleteAdmin(id)
        if (res.success) {
          fetchData()
        } else {
          toast(res.error || 'Failed to delete admin account.', "error")
        }
      } catch (err) {
        console.error('Failed to delete admin:', err)
      }
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!profileName.trim()) {
      toast('Name field cannot be left blank.', "error")
      return
    }
    if (!profileUsername.trim()) {
      toast('Username field cannot be left blank.', "error")
      return
    }
    setIsUpdatingProfile(true)
    try {
      const res = await updateAdminProfile(
        profileName.trim(),
        profileUsername.trim(),
        profileAltEmail.trim() || undefined
      )
      if (res.success) {
        toast('Administrative profile successfully updated!', "success")
        fetchCurrentAdmin()
        setIsProfileModalOpen(false)
      } else {
        toast(res.error || 'Failed to update administrative profile.', "error")
      }
    } catch (err) {
      console.error('Profile update error:', err)
      toast('Something went wrong. Please try again.', "error")
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  async function handleToggleDisabled(adminId: string, currentStatus: boolean) {
    const newStatus = !currentStatus
    const actionLabel = newStatus ? 'DISABLE' : 'ENABLE'
    if (confirm(`Are you sure you want to ${actionLabel} this administrator?`)) {
      try {
        const res = await toggleAdminDisabledAction(adminId, newStatus)
        if (res.success) {
          toast(`Administrator has been successfully ${newStatus ? 'disabled' : 'enabled'}.`, "success")
          fetchData()
        } else {
          toast(res.error || 'Failed to update administrator status.', "error")
        }
      } catch (err) {
        console.error('Toggle status error:', err)
        toast('Something went wrong.', "error")
      }
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!resetTargetAdmin) return
    if (!resetNewPassword || resetNewPassword.trim().length < 6) {
      toast('Password must be at least 6 characters long.', "error")
      return
    }
    setIsResetting(true)
    try {
      const res = await resetAdminPasswordAction(resetTargetAdmin.id, resetNewPassword.trim())
      if (res.success) {
        toast(`Password for ${resetTargetAdmin.name} has been successfully reset!`, "success")
        setIsResetModalOpen(false)
        setResetTargetAdmin(null)
        setResetNewPassword('')
      } else {
        toast(res.error || 'Failed to reset administrator password.', "error")
      }
    } catch (err) {
      console.error('Password reset error:', err)
      toast('Something went wrong.', "error")
    } finally {
      setIsResetting(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast('Please fill in all password fields.', "error")
      return
    }
    if (newPassword !== confirmPassword) {
      toast('New password and password confirmation do not match.', "error")
      return
    }
    if (newPassword.length < 6) {
      toast('New password must be at least 6 characters long.', "error")
      return
    }
    setIsChangingPassword(true)
    try {
      const res = await changeAdminPasswordAction(oldPassword, newPassword)
      if (res.success) {
        toast('Your password has been successfully changed!', "success")
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setIsChangePasswordModalOpen(false)
      } else {
        toast(res.error || 'Failed to change your password.', "error")
      }
    } catch (err) {
      console.error('Change password error:', err)
      toast('Something went wrong. Please try again.', "error")
    } finally {
      setIsChangingPassword(false)
    }
  }

  async function handleExportCSV() {
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

    try {
      await logSubscribersExportAction(filteredSubscribers.length)
    } catch (e) {
      console.error('Failed to log subscriber CSV export:', e)
    }
  }

  // Real-time filtering logic
  const filteredOwners = ownersList.filter(({ owner, user }) => {
    const fullName = `${owner.firstName} ${owner.lastName}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase()) || 
           owner.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           owner.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const filteredDevelopers = developersList.filter((dev) => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true
    return (
      dev.username?.toLowerCase().includes(query) ||
      dev.githubUsername?.toLowerCase().includes(query) ||
      dev.githubId?.toString().includes(query) ||
      dev.name?.toLowerCase().includes(query) ||
      dev.email?.toLowerCase().includes(query)
    )
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

  const filteredAdmins = adminsList.filter((admin) => {
    return admin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (admin.username && admin.username.toLowerCase().includes(searchQuery.toLowerCase()))
  })

  // Pagination logic and slices
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeTab])

  const paginatedOwners = filteredOwners.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const paginatedDevelopers = filteredDevelopers.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const paginatedEnquiries = filteredEnquiries.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const paginatedSubscribers = filteredSubscribers.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const paginatedAdmins = filteredAdmins.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const getActiveListLength = () => {
    switch (activeTab) {
      case 'owner-approval':
        return filteredOwners.length
      case 'developer-ban':
        return filteredDevelopers.length
      case 'enquiries':
        return filteredEnquiries.length
      case 'subscribers':
        return filteredSubscribers.length
      case 'admins':
        return filteredAdmins.length
      default:
        return 0
    }
  }

  const activeListLength = getActiveListLength()
  const totalPages = Math.max(1, Math.ceil(activeListLength / pageSize))

  function renderPagination() {
    if (activeListLength === 0) return null

    return (
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-[var(--color-border)] bg-white/[0.005] text-left">
        {/* Info label */}
        <p className="text-[11px] text-[var(--color-text-muted)] font-medium font-mono">
          Showing <span className="text-white">{(currentPage - 1) * pageSize + 1}</span> – <span className="text-white">{Math.min(currentPage * pageSize, activeListLength)}</span> of <span className="text-white">{activeListLength}</span>
        </p>

        <div className="flex items-center gap-4">
          {/* Rows selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--color-text-muted)] font-medium">Rows</span>
            <Select
              aria-label="Rows per page"
              value={String(pageSize)}
              onChange={(v) => {
                setPageSize(Number(v))
                setCurrentPage(1)
              }}
              size="sm"
              align="right"
              placement="top"
              className="w-16"
              options={[5, 10, 20, 50, 100].map((n) => ({ value: String(n), label: String(n) }))}
            />
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-white/[0.02] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-white hover:border-white/15 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-medium text-white px-2 font-mono select-none">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-white/[0.02] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-white hover:border-white/15 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === null) {
    return (
      <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[var(--color-text-muted)] font-medium font-mono animate-pulse">Loading Admin Panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070709] text-white flex">

      {/* --- MOBILE NAV BACKDROP --- */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={cn(
        "w-64 max-w-[80vw] border-r border-[var(--color-border)] bg-[#070709] shrink-0 flex flex-col justify-between h-screen fixed lg:sticky top-0 left-0 z-50 transition-transform duration-300 select-none",
        mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex-grow flex flex-col overflow-y-auto pt-4 min-h-0">
          
          {/* Logo & Header */}
          <div className="h-14 flex items-center gap-2.5 px-5 border-b border-[var(--color-border)] mb-4 shrink-0">
            <div className="w-6 h-6 relative flex items-center shrink-0">
              <img 
                src="/forke-assets/forke_logo.png" 
                alt="Forke Logo" 
                className="absolute -left-3 -top-3 w-12 h-12 max-w-none object-contain"
              />
            </div>
            <span className="font-bold text-xs uppercase tracking-[0.2em] text-white whitespace-nowrap">
              ADMIN PANEL
            </span>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="lg:hidden p-1.5 -mr-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer ml-auto"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow px-3 space-y-0.5">
            
            {/* Dashboard */}
            <button
              onClick={() => selectTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-[13px] font-medium text-left ${
                activeTab === 'dashboard'
                  ? 'bg-white/[0.05] text-white'
                  : 'text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <LayoutDashboard className={`w-[18px] h-[18px] shrink-0 ${activeTab === 'dashboard' ? 'text-accent' : 'text-[var(--color-text-muted)]'}`} />
              <span>Overview</span>
            </button>

            {/* Users (Nested Sub-menu) */}
            <div className="space-y-0.5">
              <button
                onClick={() => setUsersMenuOpen(!usersMenuOpen)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-[13px] font-medium text-left ${
                  activeTab === 'owner-approval' || activeTab === 'developer-ban'
                    ? 'text-white'
                    : 'text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-[18px] h-[18px] shrink-0 text-[var(--color-text-muted)]" />
                  <span>Users</span>
                </div>
                {usersMenuOpen ? <ChevronDown className="w-4 h-4 text-white/20" /> : <ChevronRight className="w-4 h-4 text-white/20" />}
              </button>

              {usersMenuOpen && (
                <div className="pl-6 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <button
                    onClick={() => selectTab('owner-approval')}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                      activeTab === 'owner-approval'
                        ? 'text-accent font-semibold bg-accent/[0.04]'
                        : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <span>Owner Approval</span>
                  </button>

                  <button
                    onClick={() => selectTab('developer-ban')}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                      activeTab === 'developer-ban'
                        ? 'text-accent font-semibold bg-accent/[0.04]'
                        : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <span>Developers</span>
                  </button>
                </div>
              )}
            </div>

            {/* Enquiries */}
            <button
              onClick={() => selectTab('enquiries')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-[13px] font-medium text-left ${
                activeTab === 'enquiries'
                  ? 'bg-white/[0.05] text-white'
                  : 'text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className={`w-[18px] h-[18px] shrink-0 ${activeTab === 'enquiries' ? 'text-accent' : 'text-[var(--color-text-muted)]'}`} />
                <span>Enquiries</span>
              </div>
              {enquiriesList.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-accent/15 border border-accent/25 text-accent leading-none">
                  {enquiriesList.length}
                </span>
              )}
            </button>

            {/* Subscribers */}
            <button
              onClick={() => selectTab('subscribers')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-[13px] font-medium text-left ${
                activeTab === 'subscribers'
                  ? 'bg-white/[0.05] text-white'
                  : 'text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className={`w-[18px] h-[18px] shrink-0 ${activeTab === 'subscribers' ? 'text-accent' : 'text-[var(--color-text-muted)]'}`} />
                <span>Subscribers</span>
              </div>
              {subscribersList.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-accent/15 border border-accent/25 text-accent leading-none">
                  {subscribersList.length}
                </span>
              )}
            </button>

            {/* Activity / audit log */}
            <button
              onClick={() => selectTab('activity')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-[13px] font-medium text-left ${
                activeTab === 'activity'
                  ? 'bg-white/[0.05] text-white'
                  : 'text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <Terminal className={`w-[18px] h-[18px] shrink-0 ${activeTab === 'activity' ? 'text-accent' : 'text-[var(--color-text-muted)]'}`} />
              <span>Activity</span>
              <span className={`ml-auto px-1.5 py-0.5 text-[9px] font-mono rounded border leading-none ${
                activityLive
                  ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400'
                  : 'bg-white/[0.04] border-white/15 text-white/40'
              }`}>
                {activityLive ? 'Live' : 'Paused'}
              </span>
            </button>

            {/* Database Section */}
            <div className="pt-3 pb-1.5 px-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/35">
                Database Console
              </span>
            </div>

            {/* Overview */}
            <button
              onClick={() => selectTab('db-overview')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-[13px] font-medium text-left ${
                activeTab === 'db-overview'
                  ? 'bg-white/[0.05] text-white'
                  : 'text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <Globe className={`w-[18px] h-[18px] shrink-0 ${activeTab === 'db-overview' ? 'text-accent' : 'text-[var(--color-text-muted)]'}`} />
              <span>Overview</span>
            </button>

            {/* Monitoring */}
            <button
              onClick={() => selectTab('db-monitoring')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-[13px] font-medium text-left ${
                activeTab === 'db-monitoring'
                  ? 'bg-white/[0.05] text-white'
                  : 'text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <Activity className={`w-[18px] h-[18px] shrink-0 ${activeTab === 'db-monitoring' ? 'text-accent' : 'text-[var(--color-text-muted)]'}`} />
              <span>Monitoring</span>
            </button>


            {/* Tables */}
            <button
              onClick={() => selectTab('database')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-[13px] font-medium text-left ${
                activeTab === 'database'
                  ? 'bg-white/[0.05] text-white'
                  : 'text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Table className={`w-[18px] h-[18px] shrink-0 ${activeTab === 'database' ? 'text-accent' : 'text-[var(--color-text-muted)]'}`} />
                <span>Tables</span>
              </div>
              <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-accent/15 border border-accent/25 text-accent leading-none">
                Live DB
              </span>
            </button>

            {/* SQL Editor */}
            {currentAdmin && (
              <button
                onClick={() => selectTab('sql-editor')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-[13px] font-medium text-left ${
                  activeTab === 'sql-editor'
                    ? 'bg-white/[0.05] text-white'
                    : 'text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white'
                }`}
              >
                <Terminal className={`w-[18px] h-[18px] shrink-0 ${activeTab === 'sql-editor' ? 'text-accent' : 'text-[var(--color-text-muted)]'}`} />
                <span>SQL Editor</span>
              </button>
            )}

            {/* Admins */}
            {currentAdmin?.role === 'super_admin' && (
              <button
                onClick={() => selectTab('admins')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-[13px] font-medium text-left ${
                  activeTab === 'admins'
                    ? 'bg-white/[0.05] text-white'
                    : 'text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className={`w-[18px] h-[18px] shrink-0 ${activeTab === 'admins' ? 'text-accent' : 'text-[var(--color-text-muted)]'}`} />
                  <span>Admins</span>
                </div>
                {adminsList.length > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-accent/15 border border-accent/25 text-accent leading-none">
                    {adminsList.length}
                  </span>
                )}
              </button>
            )}

            <div className="h-[1px] bg-[var(--color-border)] my-2" />

            {/* Profile */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white transition-colors text-left cursor-pointer"
            >
              <User className="w-[18px] h-[18px] shrink-0" />
              <span>Profile</span>
            </button>

            {/* Change Password */}
            <button
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white transition-colors text-left cursor-pointer"
            >
              <KeyRound className="w-[18px] h-[18px] shrink-0" />
              <span>Change Password</span>
            </button>

          </nav>
        </div>

        {/* User Card & Logout at bottom */}
        <div className="p-3 border-t border-[var(--color-border)] flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-accent text-xs shrink-0">
              {currentAdmin?.name
                ? currentAdmin.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                : 'SA'}
            </div>
            <div className="flex-grow text-left truncate">
              <h4 className="text-[13px] font-medium text-white truncate leading-none">
                {currentAdmin?.name || 'Super Admin'}
              </h4>
              <p className="text-[11px] text-[var(--color-text-muted)] truncate mt-1">
                {currentAdmin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-2 py-2 text-[11px] font-medium text-[var(--color-text-muted)] hover:text-red-400 transition-colors cursor-pointer w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="flex-grow h-screen overflow-hidden bg-[#0b0b0e] flex flex-col text-left">
        
        {/* --- HEADER (mobile only — desktop uses sidebar for context) --- */}
        <header className="lg:hidden h-14 px-4 sm:px-6 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-1.5 -ml-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-semibold text-white tracking-tight capitalize truncate">
              {activeTab === 'owner-approval'
                ? 'Owner Approval'
                : activeTab === 'developer-ban'
                ? 'Developers'
                : activeTab}
            </h1>
          </div>
        </header>

        {/* --- DYNAMIC BODY VIEWS --- */}
        <div className="flex-grow min-h-0 w-full flex flex-col p-4 sm:p-6 lg:p-8">

          {/* ==================== DASHBOARD PANEL ==================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 overflow-y-auto flex-grow min-h-0 pr-1">
              
              {/* Waitlist Control Card */}
              <div className="p-6 rounded-xl bg-white/[0.018] border border-[var(--color-border)]">
                <div className="flex flex-row items-center justify-between gap-4 border-b border-[var(--color-border)] pb-3">
                  <div className="min-w-0 pr-2">
                    <h3 className="text-sm font-semibold text-white truncate">Waitlist Access Control</h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate sm:not-truncate">Manage signup restrictions and bypass codes</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                    <span className={`w-2 h-2 rounded-full ${
                      waitlistEnabled ? 'bg-accent shadow-[0_0_8px_var(--color-accent)]' : 'bg-white/15'
                    }`} />
                    <span className="text-xs font-medium text-white whitespace-nowrap">{waitlistEnabled ? 'Gate Enabled' : 'Gate Disabled'}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    {waitlistEnabled && waitlistBypassPassword && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--color-text-muted)] font-mono">Bypass Key:</span>
                        <span className="text-white border border-[var(--color-border)] bg-white/[0.02] px-2 py-0.5 rounded font-bold font-mono text-xs">{waitlistBypassPassword}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(waitlistBypassPassword)
                            const btnId = `copied-bypass`
                            const el = document.getElementById(btnId)
                            if (el) {
                              el.classList.remove('opacity-0')
                              el.classList.add('opacity-100')
                              setTimeout(() => {
                                el.classList.remove('opacity-100')
                                el.classList.add('opacity-0')
                              }, 2000)
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white/[0.02] border border-[var(--color-border)] hover:bg-white/[0.06] hover:border-white/10 transition-colors text-white/40 hover:text-white inline-flex items-center justify-center cursor-pointer"
                          title="Copy Bypass Key"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <span id="copied-bypass" className="text-[10px] text-emerald-400 font-mono opacity-0 transition-opacity duration-300">
                          Copied!
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {waitlistEnabled && (
                      <button
                        onClick={() => {
                          setWaitlistModalPassword(waitlistBypassPassword)
                          setIsWaitlistModalOpen(true)
                        }}
                        className="h-8 px-3 rounded-lg text-[13px] transition-colors border border-[var(--color-border)] hover:bg-white/[0.05]"
                      >
                        Change Bypass Key
                      </button>
                    )}
                    <button
                      onClick={handleToggleWaitlist}
                      disabled={isTogglingWaitlist}
                      className={`h-8 px-3 rounded-lg text-[13px] font-medium transition-colors ${
                        waitlistEnabled
                          ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white'
                          : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                      }`}
                    >
                      {isTogglingWaitlist ? 'Saving...' : (waitlistEnabled ? 'Disable Gate' : 'Enable Gate')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Total Owners */}
                <div className="p-4 rounded-xl border border-[var(--color-border)] bg-white/[0.018] flex flex-col justify-between min-h-[100px]">
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-medium">
                    <span>Total Clients</span>
                    <Briefcase className="w-4 h-4 text-[var(--color-text-muted)]" />
                  </div>
                  <div className="text-left mt-3">
                    <h3 className="text-2xl font-semibold text-white tracking-tight font-mono leading-none">
                      {isLoading ? '...' : ownersList.length}
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">Pending & approved owners</p>
                  </div>
                </div>

                {/* Total Devs */}
                <div className="p-4 rounded-xl border border-[var(--color-border)] bg-white/[0.018] flex flex-col justify-between min-h-[100px]">
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-medium">
                    <span>Total Developers</span>
                    <Users className="w-4 h-4 text-[var(--color-text-muted)]" />
                  </div>
                  <div className="text-left mt-3">
                    <h3 className="text-2xl font-semibold text-white tracking-tight font-mono leading-none">
                      {isLoading ? '...' : developersList.length}
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">Registered builders</p>
                  </div>
                </div>

                {/* Total Enquiries */}
                <div className="p-4 rounded-xl border border-[var(--color-border)] bg-white/[0.018] flex flex-col justify-between min-h-[100px]">
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-medium">
                    <span>Pending Support</span>
                    <MessageSquare className="w-4 h-4 text-[var(--color-text-muted)]" />
                  </div>
                  <div className="text-left mt-3">
                    <h3 className="text-2xl font-semibold text-white tracking-tight font-mono leading-none">
                      {isLoading ? '...' : enquiriesList.length}
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">Support & conflict tickets</p>
                  </div>
                </div>

                {/* Total Subscribers */}
                <div className="p-4 rounded-xl border border-[var(--color-border)] bg-white/[0.018] flex flex-col justify-between min-h-[100px]">
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-medium">
                    <span>Total Subscribers</span>
                    <Mail className="w-4 h-4 text-[var(--color-text-muted)]" />
                  </div>
                  <div className="text-left mt-3">
                    <h3 className="text-2xl font-semibold text-white tracking-tight font-mono leading-none">
                      {isLoading ? '...' : subscribersList.length}
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5">Waitlist signups</p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================== OWNER APPROVAL PANEL ==================== */}
          {activeTab === 'owner-approval' && (
            <div className="rounded-xl bg-white/[0.018] border border-[var(--color-border)] overflow-hidden flex flex-col min-h-0 flex-grow">
              
              {/* Search & filters */}
              <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between bg-white/[0.005]">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input 
                    type="text" 
                    placeholder="Search by name, company, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg pl-9 pr-3 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              {/* Table list */}
              <div className="overflow-auto flex-grow min-h-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-white/[0.01]">
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)]">User Details</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)]">Company / Designation</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)]">Status</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]/50">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-[var(--color-text-muted)] text-sm">Loading records...</td>
                      </tr>
                    ) : filteredOwners.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-[var(--color-text-muted)] text-sm">No matching records found</td>
                      </tr>
                    ) : (
                      paginatedOwners.map(({ user, owner }) => (
                        <tr key={user.id} className="group hover:bg-white/[0.005] transition-colors border-b border-[var(--color-border)]/50 last:border-b-0">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white/5 border border-[var(--color-border)] overflow-hidden relative shrink-0">
                                {user.image && <img src={user.image} alt={user.name} className="object-cover w-full h-full" />}
                              </div>
                              <div>
                                <p className="font-medium text-white text-sm">{owner.firstName} {owner.lastName}</p>
                                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mt-1">
                                  <span>{owner.contactEmail}</span>
                                  {owner.contactNumber && <span>&middot; {owner.contactNumber}</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[13px] text-[var(--color-text-muted)]">
                            <div>
                              <p className="font-medium text-white/80">{owner.companyName}</p>
                              <p className="text-xs text-[var(--color-text-muted)] mt-1">{owner.designation}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <a href={owner.personalLinkedIn} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">LinkedIn</a>
                                {owner.companyWebsite && <a href={owner.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">Website</a>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {user.isApproved ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium animate-pulse">
                                <ShieldCheck className="w-3.5 h-3.5" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {!user.isApproved && (
                                <button 
                                  onClick={() => handleApprove(user.id)}
                                  className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                                  title="Approve Owner"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={() => handleDecline(user.id)}
                                className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                                title="Decline & Delete"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {renderPagination()}

            </div>
          )}

          {/* ==================== DEVELOPERS PANEL ==================== */}
          {activeTab === 'developer-ban' && (
            <div className="rounded-xl bg-white/[0.018] border border-[var(--color-border)] overflow-hidden flex flex-col min-h-0 flex-grow">
              
              {/* Search */}
              <div className="p-4 border-b border-[var(--color-border)] bg-white/[0.005]">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input 
                    type="text" 
                    placeholder="Search by username or GitHub ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg pl-9 pr-3 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              {/* Table list */}
              <div className="overflow-auto flex-grow min-h-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-white/[0.01]">
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)]">Developer</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)]">GitHub ID</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)]">Access Token</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)]">Joined Date</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)]">Status</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]/50">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-[var(--color-text-muted)] text-sm">Loading records...</td>
                      </tr>
                    ) : filteredDevelopers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-[var(--color-text-muted)] text-sm">No matching records found</td>
                      </tr>
                    ) : (
                      paginatedDevelopers.map((dev) => (
                        <tr key={dev.id} className="group hover:bg-white/[0.005] transition-colors border-b border-[var(--color-border)]/50 last:border-b-0">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white/5 border border-[var(--color-border)] flex items-center justify-center shrink-0 overflow-hidden relative">
                                {dev.image ? (
                                  <img src={dev.image} alt={dev.name || dev.username} className="object-cover w-full h-full" />
                                ) : (
                                  <Terminal className="w-4 h-4 text-white/60" />
                                )}
                              </div>
                              <div>
                                <a 
                                  href={`https://github.com/${dev.username || ''}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-white hover:text-accent transition-colors block text-sm"
                                >
                                  {dev.username || 'N/A'}
                                </a>
                                <p className="text-xs text-[var(--color-text-muted)] mt-1">{dev.name || 'No Display Name'} &middot; {dev.email || 'No Email Linked'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-[var(--color-text-muted)]">
                            <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-[var(--color-border)]">
                              {dev.githubId || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[13px] text-[var(--color-text-muted)]">
                            {dev.accessToken ? (
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-[var(--color-text-muted)]">
                                  {maskToken(dev.accessToken)}
                                </span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(dev.accessToken)
                                    const btnId = `copied-${dev.id}`
                                    const el = document.getElementById(btnId)
                                    if (el) {
                                      el.classList.remove('opacity-0')
                                      el.classList.add('opacity-100')
                                      setTimeout(() => {
                                        el.classList.remove('opacity-100')
                                        el.classList.add('opacity-0')
                                      }, 2000)
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-white/[0.02] border border-[var(--color-border)] hover:bg-white/[0.06] hover:border-white/10 transition-colors text-white/40 hover:text-white"
                                  title="Copy Access Token"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <span id={`copied-${dev.id}`} className="text-[10px] text-emerald-400 font-mono opacity-0 transition-opacity duration-300">
                                  Copied!
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-white/20 italic">No Access Token</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-[var(--color-text-muted)]">
                            <span>
                              {dev.createdAt ? new Date(dev.createdAt).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              }) : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {!dev.userId ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                                <Terminal className="w-3 h-3" /> Unlinked
                              </span>
                            ) : dev.isBanned ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                                <UserX className="w-3 h-3" /> Banned
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {dev.userId ? (
                              <button 
                                onClick={() => handleToggleBan(dev.userId, dev.isBanned)}
                                className={`h-8 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                                  dev.isBanned 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white' 
                                    : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white'
                                }`}
                              >
                                {dev.isBanned ? 'Unban' : 'Ban'}
                              </button>
                            ) : (
                              <span className="text-xs text-white/20 italic">No Action Needed</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {renderPagination()}

            </div>
          )}

          {/* ==================== ENQUIRIES PANEL ==================== */}
          {activeTab === 'enquiries' && (
            <div className="rounded-xl bg-white/[0.018] border border-[var(--color-border)] overflow-hidden flex flex-col min-h-0 flex-grow">
              
              {/* Search */}
              <div className="p-4 border-b border-[var(--color-border)] bg-white/[0.005]">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input 
                    type="text" 
                    placeholder="Search enquiries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg pl-9 pr-3 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-auto flex-grow min-h-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-white/[0.01]">
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)]">Contact Info</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)]">Message Details</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)]">Issue Category</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)]">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]/50">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-[var(--color-text-muted)] text-sm">Loading records...</td>
                      </tr>
                    ) : filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-[var(--color-text-muted)] text-sm">No matching records found</td>
                      </tr>
                    ) : (
                      paginatedEnquiries.map((enq) => (
                        <tr key={enq.id} className="group hover:bg-white/[0.005] transition-colors border-b border-[var(--color-border)]/50 last:border-b-0">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-white text-sm">{enq.firstName} {enq.lastName}</p>
                              <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mt-1">
                                <span>{enq.contactEmail}</span>
                                <span>&middot; {enq.contactNumber}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-sm">
                            <p className="text-[13px] text-white/70 line-clamp-3 leading-relaxed" title={enq.message}>
                              {enq.message}
                            </p>
                            {enq.relevantLinks && (
                              <a href={enq.relevantLinks} target="_blank" rel="noopener noreferrer" className="text-xs text-accent mt-2 inline-block hover:underline">
                                View Attached Link
                              </a>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/[0.03] border border-[var(--color-border)] text-[var(--color-text-muted)] text-xs font-medium">
                              {enq.errorType === 'AccessDenied' 
                                ? 'USER BAN' 
                                : enq.errorType === 'GitHubIdentityMismatch' 
                                ? 'GITHUB CONFLICT' 
                                : enq.errorType || 'GENERAL'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-[var(--color-text-muted)]">
                            <p>{new Date(enq.createdAt).toLocaleDateString()}</p>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {renderPagination()}

            </div>
          )}

          {/* ==================== SUBSCRIBERS PANEL ==================== */}
          {activeTab === 'subscribers' && (
            <div className="rounded-xl bg-white/[0.018] border border-[var(--color-border)] overflow-hidden flex flex-col min-h-0 flex-grow">
              
              {/* Search & Action Buttons */}
              <div className="p-4 border-b border-[var(--color-border)] flex flex-col md:flex-row md:items-center justify-between bg-white/[0.005] gap-4">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input 
                    type="text" 
                    placeholder="Search subscribers by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg pl-9 pr-3 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleExportCSV}
                    className="h-8 px-3 rounded-lg text-[13px] transition-colors border border-[var(--color-border)] hover:bg-white/[0.05] flex items-center gap-2 cursor-pointer font-medium"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-auto flex-grow min-h-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-white/[0.01]">
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] whitespace-nowrap">Subscriber ID</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] whitespace-nowrap">Email Address</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] whitespace-nowrap">Date & Time Joined</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]/50">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-[var(--color-text-muted)] text-sm">Loading records...</td>
                      </tr>
                    ) : filteredSubscribers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-[var(--color-text-muted)] text-sm">No matching records found</td>
                      </tr>
                    ) : (
                      paginatedSubscribers.map((sub) => (
                        <tr key={sub.id} className="group hover:bg-white/[0.005] transition-colors border-b border-[var(--color-border)]/50 last:border-b-0">
                          <td className="px-6 py-4 text-xs font-mono text-[var(--color-text-muted)] whitespace-nowrap">
                            <p>{sub.id}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm font-medium text-white">{sub.email}</p>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-[var(--color-text-muted)] whitespace-nowrap">
                            <p>{new Date(sub.createdAt).toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => handleDeleteSubscriber(sub.id)}
                              className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
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

              {renderPagination()}

            </div>
          )}

          {/* ==================== ADMINS PANEL ==================== */}
          {activeTab === 'admins' && (
            <div className="rounded-xl bg-white/[0.018] border border-[var(--color-border)] overflow-hidden flex flex-col min-h-0 flex-grow">
              
              {/* Search & Action Buttons */}
              <div className="p-4 border-b border-[var(--color-border)] flex flex-col md:flex-row md:items-center justify-between bg-white/[0.005] gap-4">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input 
                    type="text" 
                    placeholder="Search administrators by name, email or username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg pl-9 pr-3 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3">
                  {currentAdmin?.role === 'super_admin' && (
                    <button 
                      onClick={() => setIsInviteModalOpen(true)}
                      className="h-8 px-3 rounded-lg text-[13px] ui-btn-primary transition-colors flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <UserPlus className="w-4 h-4 text-black" /> Invite Admin
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-auto flex-grow min-h-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-white/[0.01]">
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] whitespace-nowrap">Administrative Profile</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] whitespace-nowrap">Email / Credentials</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] whitespace-nowrap">Access Level</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] whitespace-nowrap">Last Login</th>
                      <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] whitespace-nowrap">Status</th>
                      {currentAdmin?.role === 'super_admin' && (
                        <th className="px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] whitespace-nowrap">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]/50">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-[var(--color-text-muted)] text-sm">Loading records...</td>
                      </tr>
                    ) : filteredAdmins.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-[var(--color-text-muted)] text-sm">No matching records found</td>
                      </tr>
                    ) : (
                      paginatedAdmins.map((adm) => (
                        <tr key={adm.id} className={`group hover:bg-white/[0.005] transition-colors border-b border-[var(--color-border)]/50 last:border-b-0 ${adm.isDisabled ? 'opacity-40' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium text-white text-sm">{adm.name}</p>
                              {adm.alternativeEmail && (
                                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                  Alt: {adm.alternativeEmail}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-mono text-xs text-[var(--color-text-muted)]">{adm.email}</p>
                              {adm.username ? (
                                <p className="text-xs text-accent mt-1">
                                  @{adm.username}
                                </p>
                              ) : (
                                <p className="text-xs text-white/20 mt-1 italic">
                                  No username set yet
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                              adm.role === 'super_admin' 
                                ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400' 
                                : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                            }`}>
                              {adm.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-[var(--color-text-muted)] whitespace-nowrap">
                            {adm.lastLoginAt ? (
                              <p className="whitespace-nowrap">
                                {new Date(adm.lastLoginAt).toLocaleString()}
                              </p>
                            ) : (
                              <p className="text-white/20 italic whitespace-nowrap">
                                Never logged in
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {adm.isDisabled ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                                <UserX className="w-3 h-3" /> Disabled
                              </span>
                            ) : adm.username ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium animate-pulse">
                                <ShieldCheck className="w-3.5 h-3.5" /> Pending Setup
                              </span>
                            )}
                          </td>
                          {currentAdmin?.role === 'super_admin' && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              {currentAdmin.id !== adm.id ? (
                                <div className="flex items-center gap-2">
                                  {/* Toggle Disable/Enable */}
                                  <button
                                    onClick={() => handleToggleDisabled(adm.id, adm.isDisabled)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                                      adm.isDisabled 
                                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white' 
                                        : 'bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white'
                                    }`}
                                    title={adm.isDisabled ? 'Enable Account' : 'Disable Account'}
                                  >
                                    {adm.isDisabled ? <CheckCircle2 className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                                  </button>

                                  {/* Reset Password */}
                                  <button
                                    onClick={() => {
                                      setResetTargetAdmin(adm)
                                      setIsResetModalOpen(true)
                                    }}
                                    className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                                    title="Reset Password Override"
                                  >
                                    <KeyRound className="w-4 h-4" />
                                  </button>

                                  {/* Delete Account */}
                                  <button 
                                    onClick={() => handleDeleteAdmin(adm.id)}
                                    className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                                    title="Delete Account"
                                  >
                                    <UserX className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-white/20 italic whitespace-nowrap">Logged In</span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ==================== ACTIVITY / AUDIT LOG PANEL ==================== */}
          {activeTab === 'activity' && (
            <div className="flex-grow min-h-0 h-full flex flex-col">
              <ActivityFeedPanel currentAdmin={currentAdmin} />
            </div>
          )}

          {/* ==================== DATABASE OVERVIEW PANEL ==================== */}
          {activeTab === 'db-overview' && (
            <div className="flex-grow min-h-0 h-full flex flex-col">
              <DatabaseOverviewPanel />
            </div>
          )}

          {/* ==================== DATABASE MONITORING PANEL ==================== */}
          {activeTab === 'db-monitoring' && (
            <div className="flex-grow min-h-0 h-full flex flex-col">
              <DatabaseMonitoringPanel />
            </div>
          )}



          {/* ==================== DATABASE TABLES PANEL ==================== */}
          {activeTab === 'database' && (
            <div className="flex-grow min-h-0 h-full flex flex-col">
              <DatabaseConsole currentAdmin={currentAdmin} />
            </div>
          )}

          {/* ==================== SQL EDITOR PANEL ==================== */}
          {activeTab === 'sql-editor' && currentAdmin && (
            <div className="flex-grow min-h-0 h-full flex flex-col">
              <DatabaseConsole currentAdmin={currentAdmin} initialTab="sql" />
            </div>
          )}

        </div>

      </main>

      {/* --- INVITE ADMIN GLASS MODAL --- */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#0c0c0e] border border-[var(--color-border)] rounded-xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="space-y-4 text-left">
              <div className="border-b border-[var(--color-border)] pb-3">
                <h3 className="text-base font-semibold text-white">Invite Administrator</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  An invitation email will request them to complete onboarding and select credentials.
                </p>
              </div>

              <form onSubmit={handleInviteAdmin} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-text-muted)]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="E.g., John Doe"
                      className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg px-3 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-text-muted)]">Email Address</label>
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="e.g. john@forke.space"
                      className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg px-3 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-text-muted)]">Alternative Email (Optional)</label>
                    <input
                      type="email"
                      value={inviteAltEmail}
                      onChange={(e) => setInviteAltEmail(e.target.value)}
                      placeholder="Alternate email"
                      className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg px-3 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-text-muted)]">Access Role Level</label>
                    <Select
                      aria-label="Access role level"
                      value={inviteRole}
                      onChange={(v) => setInviteRole(v as 'super_admin' | 'admin')}
                      className="h-9 text-[13px]"
                      options={[
                        { value: 'admin', label: 'Admin (Standard)' },
                        { value: 'super_admin', label: 'Super Admin (All Privileges)' },
                      ]}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsInviteModalOpen(false)
                      setInviteName('')
                      setInviteEmail('')
                      setInviteAltEmail('')
                      setInviteRole('admin')
                    }}
                    className="h-8 px-3 rounded-lg text-xs font-medium transition-colors border border-[var(--color-border)] hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isInviting}
                    className="h-8 px-3 rounded-lg text-xs font-medium bg-accent text-black transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isInviting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        <span>Inviting...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5 text-black" />
                        <span>Send Invitation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- RESET PASSWORD GLASS MODAL --- */}
      {isResetModalOpen && resetTargetAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0c0c0e] border border-[var(--color-border)] rounded-xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="space-y-4 text-left">
              <div className="border-b border-[var(--color-border)] pb-3">
                <h3 className="text-base font-semibold text-white">Reset Password</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Directly override the password for <strong>{resetTargetAdmin.name}</strong> (@{resetTargetAdmin.username || resetTargetAdmin.email}).
                </p>
              </div>

              <form onSubmit={handleResetPassword} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-muted)]">New Password</label>
                  <div className="relative">
                    <input
                      type={showResetPassword ? "text" : "password"}
                      required
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg pl-3 pr-10 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-white transition-colors p-1"
                    >
                      {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetModalOpen(false)
                      setResetTargetAdmin(null)
                      setResetNewPassword('')
                      setShowResetPassword(false)
                    }}
                    className="h-8 px-3 rounded-lg text-xs font-medium transition-colors border border-[var(--color-border)] hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="h-8 px-3 rounded-lg text-xs font-medium bg-accent text-black transition-colors disabled:opacity-50"
                  >
                    {isResetting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        <span>Resetting...</span>
                      </>
                    ) : (
                      <span>Reset Password</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- WAITLIST BYPASS PASSWORD GLASS MODAL --- */}
      {isWaitlistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0c0c0e] border border-[var(--color-border)] rounded-xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="space-y-4 text-left">
              <div className="border-b border-[var(--color-border)] pb-3">
                <h3 className="text-base font-semibold text-white">
                  {waitlistEnabled ? 'Change Waitlist Bypass Key' : 'Enable Waitlist Gate'}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Set the bypass code that bypasses waitlist page.
                </p>
              </div>

              <form onSubmit={handleSaveWaitlistConfig} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-muted)]">Bypass Secret Key</label>
                  <input
                    type="text"
                    required
                    value={waitlistModalPassword}
                    onChange={(e) => setWaitlistModalPassword(e.target.value)}
                    placeholder="e.g., beta_secret_key"
                    className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg px-3 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsWaitlistModalOpen(false)
                      setWaitlistModalPassword('')
                    }}
                    className="h-8 px-3 rounded-lg text-xs font-medium transition-colors border border-[var(--color-border)] hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isTogglingWaitlist}
                    className="h-8 px-3 rounded-lg text-xs font-medium bg-accent text-black transition-colors disabled:opacity-50"
                  >
                    {isTogglingWaitlist ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{waitlistEnabled ? 'Save Key' : 'Enable Gate'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT PROFILE GLASS MODAL --- */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#0c0c0e] border border-[var(--color-border)] rounded-xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="space-y-4 text-left">
              <div className="border-b border-[var(--color-border)] pb-3">
                <h3 className="text-base font-semibold text-white">Edit Profile</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Update your admin account profile parameters.
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-text-muted)]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg px-3 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-text-muted)]">Alternative Email (Optional)</label>
                    <input
                      type="email"
                      value={profileAltEmail}
                      onChange={(e) => setProfileAltEmail(e.target.value)}
                      placeholder="alternate@email.com"
                      className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg px-3 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-text-muted)]">Primary Email (Read-Only)</label>
                    <input
                      type="text"
                      disabled
                      value={currentAdmin?.email || ''}
                      className="w-full h-9 bg-white/[0.01] border border-[var(--color-border)]/50 rounded-lg px-3 text-xs text-white/40 font-mono select-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--color-text-muted)]">Username</label>
                    <input
                      type="text"
                      required
                      value={profileUsername}
                      onChange={(e) => setProfileUsername(e.target.value)}
                      placeholder="Your username"
                      className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg px-3 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileModalOpen(false)
                      if (currentAdmin) {
                        setProfileName(currentAdmin.name || '')
                        setProfileAltEmail(currentAdmin.alternativeEmail || '')
                        setProfileUsername(currentAdmin.username || '')
                      }
                    }}
                    className="h-8 px-3 rounded-lg text-xs font-medium transition-colors border border-[var(--color-border)] hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="h-8 px-3 rounded-lg text-xs font-medium bg-accent text-black transition-colors disabled:opacity-50"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- CHANGE PASSWORD GLASS MODAL --- */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0c0c0e] border border-[var(--color-border)] rounded-xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="space-y-4 text-left">
              <div className="border-b border-[var(--color-border)] pb-3">
                <h3 className="text-base font-semibold text-white">Change Password</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Securely update your administrative password credentials.
                </p>
              </div>

              <form onSubmit={handleChangePassword} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-muted)]">Current Password</label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg pl-3 pr-10 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-white transition-colors p-1"
                    >
                      {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-muted)]">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg pl-3 pr-10 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-white transition-colors p-1"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--color-text-muted)]">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-9 bg-white/[0.02] border border-[var(--color-border)] rounded-lg pl-3 pr-10 text-[13px] text-white focus:outline-none focus:border-accent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-white transition-colors p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangePasswordModalOpen(false)
                      setOldPassword('')
                      setNewPassword('')
                      setConfirmPassword('')
                      setShowOldPassword(false)
                      setShowNewPassword(false)
                      setShowConfirmPassword(false)
                    }}
                    className="h-8 px-3 rounded-lg text-xs font-medium transition-colors border border-[var(--color-border)] hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="h-8 px-3 rounded-lg text-xs font-medium bg-accent text-black transition-colors disabled:opacity-50"
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Update Password</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Themed toast notifications */}
      <ToastContainer />

    </div>
  )
}
