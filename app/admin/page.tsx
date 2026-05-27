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
  changeAdminPasswordAction
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
  EyeOff
} from 'lucide-react'

const maskToken = (token: string) => {
  if (!token) return 'N/A'
  if (token.length <= 8) return '••••••••'
  return `${token.slice(0, 8)}••••••••${token.slice(-4)}`
}

export default function AdminDashboard() {
  const router = useRouter()
  
  // Navigation states
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'owner-approval' | 'developer-ban' | 'enquiries' | 'admins' | 'subscribers'
  >('dashboard')
  const [usersMenuOpen, setUsersMenuOpen] = useState(true)

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
      alert('Bypass password is required.')
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
          alert('Failed to delete subscriber')
        }
      } catch (err) {
        console.error('Failed to delete subscriber:', err)
      }
    }
  }

  async function handleInviteAdmin(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim()) {
      alert('Please fill in Name and Email address.')
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
        alert('Invitation dispatched successfully!')
        setIsInviteModalOpen(false)
        setInviteName('')
        setInviteEmail('')
        setInviteAltEmail('')
        setInviteRole('admin')
        fetchData()
      } else {
        alert(res.error || 'Failed to send administrative invitation.')
      }
    } catch (err) {
      console.error('Invite error:', err)
      alert('Something went wrong. Please try again.')
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
          alert(res.error || 'Failed to delete admin account.')
        }
      } catch (err) {
        console.error('Failed to delete admin:', err)
      }
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!profileName.trim()) {
      alert('Name field cannot be left blank.')
      return
    }
    if (!profileUsername.trim()) {
      alert('Username field cannot be left blank.')
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
        alert('Administrative profile successfully updated!')
        fetchCurrentAdmin()
        setIsProfileModalOpen(false)
      } else {
        alert(res.error || 'Failed to update administrative profile.')
      }
    } catch (err) {
      console.error('Profile update error:', err)
      alert('Something went wrong. Please try again.')
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
          alert(`Administrator has been successfully ${newStatus ? 'disabled' : 'enabled'}.`)
          fetchData()
        } else {
          alert(res.error || 'Failed to update administrator status.')
        }
      } catch (err) {
        console.error('Toggle status error:', err)
        alert('Something went wrong.')
      }
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!resetTargetAdmin) return
    if (!resetNewPassword || resetNewPassword.trim().length < 6) {
      alert('Password must be at least 6 characters long.')
      return
    }
    setIsResetting(true)
    try {
      const res = await resetAdminPasswordAction(resetTargetAdmin.id, resetNewPassword.trim())
      if (res.success) {
        alert(`Password for ${resetTargetAdmin.name} has been successfully reset!`)
        setIsResetModalOpen(false)
        setResetTargetAdmin(null)
        setResetNewPassword('')
      } else {
        alert(res.error || 'Failed to reset administrator password.')
      }
    } catch (err) {
      console.error('Password reset error:', err)
      alert('Something went wrong.')
    } finally {
      setIsResetting(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields.')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('New password and password confirmation do not match.')
      return
    }
    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters long.')
      return
    }
    setIsChangingPassword(true)
    try {
      const res = await changeAdminPasswordAction(oldPassword, newPassword)
      if (res.success) {
        alert('Your password has been successfully changed!')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setIsChangePasswordModalOpen(false)
      } else {
        alert(res.error || 'Failed to change your password.')
      }
    } catch (err) {
      console.error('Change password error:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsChangingPassword(false)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-t border-white/[0.04] bg-white/[0.005] text-left">
        {/* Info label */}
        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.15em] font-mono">
          Showing <span className="text-white">{(currentPage - 1) * pageSize + 1}</span> - <span className="text-white">{Math.min(currentPage * pageSize, activeListLength)}</span> of <span className="text-white">{activeListLength}</span> records
        </p>

        <div className="flex items-center gap-6 self-end sm:self-auto">
          {/* Rows selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.15em] font-mono">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="h-8 bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-lg px-2 text-[10px] font-black tracking-wider text-white font-mono focus:outline-none transition-colors cursor-pointer"
            >
              <option value={5} className="bg-[#0c0c0c] text-white">5</option>
              <option value={10} className="bg-[#0c0c0c] text-white">10</option>
              <option value={20} className="bg-[#0c0c0c] text-white">20</option>
              <option value={50} className="bg-[#0c0c0c] text-white">50</option>
              <option value={100} className="bg-[#0c0c0c] text-white">100</option>
            </select>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg border border-white/5 bg-white/[0.02] text-white/40 hover:text-white hover:border-white/10 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="text-[10px] text-white/40 font-mono font-bold tracking-widest px-2 select-none">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg border border-white/5 bg-white/[0.02] text-white/40 hover:text-white hover:border-white/10 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      
      {/* --- FLOATING LEFT SIDEBAR --- */}
      <aside className="w-72 fixed left-6 top-6 bottom-6 rounded-[2.5rem] bg-[#0c0c0c]/85 border border-white/[0.05] backdrop-blur-3xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-40 p-6 flex flex-col justify-between">
        <div className="space-y-8">
          
          {/* Logo & Header */}
          <div className="flex items-center gap-3.5 px-3 pt-2">
            <div className="w-10 h-10 relative flex items-center justify-center shrink-0">
              <img 
                src="/forke-assets/forke_logo.png" 
                alt="Forke Logo" 
                className="absolute -left-3 w-14 h-14 max-w-none object-contain drop-shadow-[0_0_12px_rgba(255,122,0,0.3)] select-none pointer-events-none"
                draggable={false}
              />
            </div>
            <div className="text-left">
              <h2 className="font-serif text-lg font-bold leading-none tracking-tight">Forke Admin Panel</h2>
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
                    <span>Developers</span>
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
            {currentAdmin?.role === 'super_admin' && (
              <button
                onClick={() => setActiveTab('admins')}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 text-left ${
                  activeTab === 'admins'
                    ? 'bg-accent text-bg shadow-[0_4px_12px_rgba(217,119,6,0.3)]'
                    : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Shield className="w-4 h-4" />
                  <span>Admins</span>
                </div>
                {adminsList.length > 0 && (
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                    activeTab === 'admins' ? 'bg-bg text-accent' : 'bg-accent/10 text-accent border border-accent/20'
                  }`}>
                    {adminsList.length}
                  </span>
                )}
              </button>
            )}

            {/* Profile */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white hover:bg-white/[0.02] transition-all duration-200 text-left cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>

            {/* Change Password */}
            <button
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white hover:bg-white/[0.02] transition-all duration-200 text-left cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Change Password</span>
            </button>

          </nav>
        </div>

        {/* User Card & Logout at bottom */}
        <div className="p-3.5 rounded-3xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-accent text-xs">
            {currentAdmin?.name
              ? currentAdmin.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
              : 'SA'}
          </div>
          <div className="flex-grow text-left">
            <h4 className="text-xs font-bold text-white tracking-tight leading-none">
              {currentAdmin?.name || 'Super Admin'}
            </h4>
            <p className="text-[9px] text-white/40 uppercase tracking-[0.1em] font-black mt-1">
              {currentAdmin?.role === 'super_admin' ? 'Super Admin' : 'Admin'} Access
            </p>
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
                ? 'Developers' 
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
                    {waitlistEnabled && waitlistBypassPassword && (
                      <div className="flex items-center gap-2.5 mt-3">
                        <span className="text-xs text-accent/80 font-mono">Bypass Key:</span>
                        <span className="text-white border border-accent/20 bg-accent/5 px-2 py-0.5 rounded font-bold font-mono text-xs">{waitlistBypassPassword}</span>
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
                          className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all text-white/40 hover:text-white inline-flex items-center justify-center cursor-pointer"
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

                  <div className="shrink-0 flex items-center gap-3">
                    {waitlistEnabled && (
                      <button
                        onClick={() => {
                          setWaitlistModalPassword(waitlistBypassPassword)
                          setIsWaitlistModalOpen(true)
                        }}
                        className="px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl border border-white/5 bg-white/[0.02] text-white hover:bg-white/[0.05] transition-all duration-300 cursor-pointer active:scale-[0.97]"
                      >
                        Change Bypass Key
                      </button>
                    )}
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
            <div className="rounded-xl bg-[#0c0c0c] border border-white/[0.04] overflow-hidden">
              
              {/* Search & filters */}
              <div className="p-6 border-b border-white/[0.04] flex items-center justify-between bg-white/[0.01]">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Search owners by name, company, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 bg-white/[0.02] border border-white/5 rounded-xl pl-12 pr-6 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
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
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">User Details</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Company / Designation</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Status</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Actions</th>
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
                      paginatedOwners.map(({ user, owner }) => (
                        <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors">
                          <td className="px-8 py-3.5">
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
                          <td className="px-8 py-3.5">
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
                          <td className="px-8 py-3.5">
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
                          <td className="px-8 py-3.5">
                              {/* Action buttons render here */}
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

              {renderPagination()}

            </div>
          )}

          {/* ==================== DEVELOPERS PANEL ==================== */}
          {activeTab === 'developer-ban' && (
            <div className="rounded-xl bg-[#0c0c0c] border border-white/[0.04] overflow-hidden">
              
              {/* Search */}
              <div className="p-6 border-b border-white/[0.04] bg-white/[0.01]">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Search developers by username or GitHub ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 bg-white/[0.02] border border-white/5 rounded-xl pl-12 pr-6 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Developer</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">GitHub ID</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Access Token</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Joined Date</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Status</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-20 text-center text-white/20 uppercase font-black tracking-widest font-mono">Loading Records...</td>
                      </tr>
                    ) : filteredDevelopers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-20 text-center text-white/20 uppercase font-black tracking-widest font-mono">No matching records found</td>
                      </tr>
                    ) : (
                      paginatedDevelopers.map((dev) => (
                        <tr key={dev.id} className="group hover:bg-white/[0.01] transition-colors">
                          <td className="px-8 py-3.5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative">
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
                                  className="font-bold text-white hover:text-accent transition-colors font-bold block"
                                >
                                  {dev.username || 'N/A'}
                                </a>
                                <p className="text-[11px] text-white/30 mt-1 font-mono">{dev.name || 'No Display Name'} &middot; {dev.email || 'No Email Linked'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-3.5">
                            <span className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/10 text-white/60 text-xs font-mono">
                              {dev.githubId || 'N/A'}
                            </span>
                          </td>
                          <td className="px-8 py-3.5">
                            {dev.accessToken ? (
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-white/40 font-mono">
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
                                  className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all text-white/40 hover:text-white"
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
                          <td className="px-8 py-3.5">
                            <span className="text-xs text-white/40 font-mono">
                              {dev.createdAt ? new Date(dev.createdAt).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              }) : 'N/A'}
                            </span>
                          </td>
                          <td className="px-8 py-3.5">
                            {!dev.userId ? (
                              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase flex items-center gap-1.5 w-fit font-mono">
                                <Terminal className="w-3 h-3" /> Unlinked
                              </span>
                            ) : dev.isBanned ? (
                              <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase flex items-center gap-1.5 w-fit font-mono">
                                <UserX className="w-3 h-3" /> Banned
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase flex items-center gap-1.5 w-fit font-mono">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-3.5">
                            {dev.userId ? (
                              <button 
                                onClick={() => handleToggleBan(dev.userId, dev.isBanned)}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                  dev.isBanned 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]' 
                                    : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]'
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
            <div className="rounded-xl bg-[#0c0c0c] border border-white/[0.04] overflow-hidden">
              
              {/* Search */}
              <div className="p-6 border-b border-white/[0.04] bg-white/[0.01]">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Search enquiries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 bg-white/[0.02] border border-white/5 rounded-xl pl-12 pr-6 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Contact Info</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Message Details</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Issue Category</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Timestamp</th>
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
                      paginatedEnquiries.map((enq) => (
                        <tr key={enq.id} className="group hover:bg-white/[0.01] transition-colors">
                          <td className="px-8 py-3.5">
                            <div>
                              <p className="font-bold text-white leading-none">{enq.firstName} {enq.lastName}</p>
                              <div className="flex items-center gap-3 text-[11px] text-white/30 mt-2 font-mono">
                                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {enq.contactEmail}</span>
                                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {enq.contactNumber}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-3.5 max-w-sm">
                            <p className="text-sm text-white/70 line-clamp-3 leading-relaxed font-sans" title={enq.message}>
                              {enq.message}
                            </p>
                            {enq.relevantLinks && (
                              <a href={enq.relevantLinks} target="_blank" className="text-[9px] text-accent mt-3.5 inline-block uppercase tracking-widest font-black hover:underline font-mono">
                                View Attached Link
                              </a>
                            )}
                          </td>
                          <td className="px-8 py-3.5">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[9px] font-black uppercase font-mono">
                              {enq.errorType === 'AccessDenied' 
                                ? 'USER BAN' 
                                : enq.errorType === 'GitHubIdentityMismatch' 
                                ? 'GITHUB CONFLICT' 
                                : enq.errorType || 'GENERAL'}
                            </span>
                          </td>
                          <td className="px-8 py-3.5">
                            <p className="text-[11px] text-white/40 font-mono">{new Date(enq.createdAt).toLocaleDateString()}</p>
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
            <div className="rounded-xl bg-[#0c0c0c] border border-white/[0.04] overflow-hidden">
              
              {/* Search & Action Buttons */}
              <div className="p-6 border-b border-white/[0.04] flex flex-col md:flex-row md:items-center justify-between bg-white/[0.01] gap-4">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Search subscribers by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 bg-white/[0.02] border border-white/5 rounded-xl pl-12 pr-6 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                  />
                </div>
                <div className="flex items-center gap-3">
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
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Subscriber ID</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Email Address</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Date & Time Joined</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Actions</th>
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
                      paginatedSubscribers.map((sub) => (
                        <tr key={sub.id} className="group hover:bg-white/[0.01] transition-colors">
                          <td className="px-8 py-3.5">
                            <p className="text-xs text-white/40 font-mono font-bold">{sub.id}</p>
                          </td>
                          <td className="px-8 py-3.5">
                            <p className="font-bold text-white font-sans">{sub.email}</p>
                          </td>
                          <td className="px-8 py-3.5">
                            <p className="text-[11px] text-white/50 font-mono">{new Date(sub.createdAt).toLocaleString()}</p>
                          </td>
                          <td className="px-8 py-3.5">
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

              {renderPagination()}

            </div>
          )}

          {/* ==================== ADMINS PANEL ==================== */}
          {activeTab === 'admins' && (
            <div className="rounded-xl bg-[#0c0c0c] border border-white/[0.04] overflow-hidden">
              
              {/* Search & Action Buttons */}
              <div className="p-6 border-b border-white/[0.04] flex flex-col md:flex-row md:items-center justify-between bg-white/[0.01] gap-4">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Search administrators by name, email or username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 bg-white/[0.02] border border-white/5 rounded-xl pl-12 pr-6 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                  />
                </div>
                <div className="flex items-center gap-3">
                  {currentAdmin?.role === 'super_admin' && (
                    <button 
                      onClick={() => setIsInviteModalOpen(true)}
                      className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-gradient-to-b from-accent to-[#d97706] hover:translate-y-[1px] hover:shadow-[0_0_15px_rgba(255,122,0,0.25)] active:translate-y-[2px] transition-all text-[#050505] flex items-center gap-2 cursor-pointer font-bold h-11"
                    >
                      <UserPlus className="w-4 h-4 text-black" /> Invite Admin
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Administrative Profile</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Email / Credentials</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Access Level</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Last Login</th>
                      <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Status</th>
                      {currentAdmin?.role === 'super_admin' && (
                        <th className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/20 font-mono">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-20 text-center text-white/20 uppercase font-black tracking-widest font-mono">Loading Records...</td>
                      </tr>
                    ) : filteredAdmins.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-20 text-center text-white/20 uppercase font-black tracking-widest font-mono">No matching records found</td>
                      </tr>
                    ) : (
                      paginatedAdmins.map((adm) => (
                        <tr key={adm.id} className={`group hover:bg-white/[0.01] transition-colors ${adm.isDisabled ? 'opacity-40' : ''}`}>
                          <td className="px-8 py-3.5">
                            <div>
                              <p className="font-bold text-white font-sans">{adm.name}</p>
                              {adm.alternativeEmail && (
                                <p className="text-[10px] text-white/30 mt-1 font-sans">
                                  Alt: {adm.alternativeEmail}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-3.5">
                            <div>
                              <p className="font-medium text-white/80 text-xs font-mono">{adm.email}</p>
                              {adm.username ? (
                                <p className="text-[10px] text-accent/70 mt-1 font-mono uppercase tracking-wider font-bold">
                                  @{adm.username}
                                </p>
                              ) : (
                                <p className="text-[10px] text-white/20 mt-1 font-mono italic">
                                  No username set yet
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase font-mono ${
                              adm.role === 'super_admin' 
                                ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400' 
                                : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                            }`}>
                              {adm.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                            </span>
                          </td>
                          <td className="px-8 py-3.5">
                            {adm.lastLoginAt ? (
                              <p className="text-[11px] text-white/50 font-mono font-bold">
                                {new Date(adm.lastLoginAt).toLocaleString()}
                              </p>
                            ) : (
                              <p className="text-[10px] text-white/20 font-mono italic">
                                Never logged in
                              </p>
                            )}
                          </td>
                          <td className="px-8 py-3.5">
                            {adm.isDisabled ? (
                              <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase flex items-center gap-1.5 w-fit font-mono">
                                <UserX className="w-3 h-3" /> Disabled
                              </span>
                            ) : adm.username ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase flex items-center gap-1.5 w-fit font-mono">
                                <CheckCircle2 className="w-3 h-3" /> Active
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-black uppercase flex items-center gap-1.5 w-fit font-mono animate-pulse">
                                <ShieldCheck className="w-3 h-3" /> Pending Setup
                              </span>
                            )}
                          </td>
                          {currentAdmin?.role === 'super_admin' && (
                            <td className="px-8 py-3.5">
                              {currentAdmin.id !== adm.id ? (
                                <div className="flex items-center gap-2">
                                  {/* Toggle Disable/Enable */}
                                  <button
                                    onClick={() => handleToggleDisabled(adm.id, adm.isDisabled)}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm cursor-pointer ${
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
                                    className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm cursor-pointer"
                                    title="Reset Password Override"
                                  >
                                    <KeyRound className="w-4 h-4" />
                                  </button>

                                  {/* Delete Account */}
                                  <button 
                                    onClick={() => handleDeleteAdmin(adm.id)}
                                    className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer"
                                    title="Delete Account"
                                  >
                                    <UserX className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-white/25 font-mono italic">Logged In</span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {renderPagination()}

            </div>
          )}

          {/* Panels removed from here as they are now premium overlay modals */}

        </div>

      </main>

      {/* --- INVITE ADMIN GLASS MODAL --- */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-[#0c0c0c]/90 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.85)] relative overflow-hidden group">
            {/* Ambient top border glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-6 text-left">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-serif text-white tracking-wide">Invite Administrator</h3>
                <p className="text-xs text-white/40 leading-relaxed font-light">
                  Grant administrative console entry. An invitation email will request them to complete onboarding and select credentials.
                </p>
              </div>

              <form onSubmit={handleInviteAdmin} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Full Name</label>
                    <input
                      type="text"
                      required
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="E.g., John Doe"
                      className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Email Address</label>
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="e.g. john@forke.space"
                      className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Alternative Email (Optional)</label>
                    <input
                      type="email"
                      value={inviteAltEmail}
                      onChange={(e) => setInviteAltEmail(e.target.value)}
                      placeholder="Alternate email"
                      className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Access Role Level</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as 'super_admin' | 'admin')}
                      className="w-full h-12 bg-[#050505] border border-white/5 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                    >
                      <option value="admin">Admin (Standard)</option>
                      <option value="super_admin">Super Admin (All Privileges)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsInviteModalOpen(false)
                      setInviteName('')
                      setInviteEmail('')
                      setInviteAltEmail('')
                      setInviteRole('admin')
                    }}
                    className="px-6 h-12 text-xs font-black uppercase tracking-widest rounded-xl border border-white/5 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isInviting}
                    className="px-8 h-12 text-xs font-black uppercase tracking-widest rounded-xl bg-gradient-to-b from-accent to-[#d97706] text-[#050505] flex items-center justify-center gap-2 cursor-pointer font-bold hover:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isInviting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        <span>Inviting...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 text-black fill-current" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0c0c0c]/90 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.85)] relative overflow-hidden group">
            {/* Ambient top border glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-6 text-left">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-serif text-white tracking-wide">Reset Password</h3>
                <p className="text-xs text-white/40 leading-relaxed font-light">
                  Directly override the password for <strong>{resetTargetAdmin.name}</strong> (@{resetTargetAdmin.username || resetTargetAdmin.email}).
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">New Password</label>
                  <div className="relative">
                    <input
                      type={showResetPassword ? "text" : "password"}
                      required
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-xl pl-4 pr-12 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                    >
                      {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetModalOpen(false)
                      setResetTargetAdmin(null)
                      setResetNewPassword('')
                      setShowResetPassword(false)
                    }}
                    className="px-6 h-12 text-xs font-black uppercase tracking-widest rounded-xl border border-white/5 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="px-8 h-12 text-xs font-black uppercase tracking-widest rounded-xl bg-gradient-to-b from-accent to-[#d97706] text-[#050505] flex items-center justify-center gap-2 cursor-pointer font-bold hover:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResetting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0c0c0c]/90 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.85)] relative overflow-hidden group">
            {/* Ambient top border glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-6 text-left">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-serif text-white tracking-wide">
                  {waitlistEnabled ? 'Change Waitlist Bypass Key' : 'Enable Waitlist Gate'}
                </h3>
                <p className="text-xs text-white/40 leading-relaxed font-light">
                  Set the shared secret key that users can input to bypass the waitlist and access the signup/checkout panel directly.
                </p>
              </div>

              <form onSubmit={handleSaveWaitlistConfig} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Bypass Secret Key</label>
                  <input
                    type="text"
                    required
                    value={waitlistModalPassword}
                    onChange={(e) => setWaitlistModalPassword(e.target.value)}
                    placeholder="e.g., beta_secret_key"
                    className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsWaitlistModalOpen(false)
                      setWaitlistModalPassword('')
                    }}
                    className="px-6 h-12 text-xs font-black uppercase tracking-widest rounded-xl border border-white/5 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isTogglingWaitlist}
                    className="px-8 h-12 text-xs font-black uppercase tracking-widest rounded-xl bg-gradient-to-b from-accent to-[#d97706] text-[#050505] flex items-center justify-center gap-2 cursor-pointer font-bold hover:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTogglingWaitlist ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-[#0c0c0c]/90 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.85)] relative overflow-hidden group">
            {/* Ambient top border glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-6 text-left">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-serif text-white tracking-wide">Edit Profile</h3>
                <p className="text-xs text-white/40 leading-relaxed font-light">
                  Manage your administrator details. You can configure your name, username, and optional alternative communication email below.
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Alternative Email (Optional)</label>
                    <input
                      type="email"
                      value={profileAltEmail}
                      onChange={(e) => setProfileAltEmail(e.target.value)}
                      placeholder="alternate@email.com"
                      className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/25 font-black uppercase tracking-widest font-mono">Primary Email (Read-Only)</label>
                    <input
                      type="text"
                      disabled
                      value={currentAdmin?.email || ''}
                      className="w-full h-12 bg-white/[0.01] border border-white/[0.03] rounded-xl px-4 text-sm text-white/40 font-mono select-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Username</label>
                    <input
                      type="text"
                      required
                      value={profileUsername}
                      onChange={(e) => setProfileUsername(e.target.value)}
                      placeholder="Your username"
                      className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
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
                    className="px-6 h-12 text-xs font-black uppercase tracking-widest rounded-xl border border-white/5 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="px-8 h-12 text-xs font-black uppercase tracking-widest rounded-xl bg-gradient-to-b from-accent to-[#d97706] text-[#050505] flex items-center justify-center gap-2 cursor-pointer font-bold hover:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0c0c0c]/90 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.85)] relative overflow-hidden group">
            {/* Ambient top border glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-6 text-left">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-serif text-white tracking-wide">Change Password</h3>
                <p className="text-xs text-white/40 leading-relaxed font-light">
                  Securely update your administrative password credentials.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Current Password</label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-xl pl-4 pr-12 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                    >
                      {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-xl pl-4 pr-12 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-white/30 font-black uppercase tracking-widest font-mono">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-xl pl-4 pr-12 text-sm text-white focus:outline-none focus:border-accent/40 transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
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
                    className="px-6 h-12 text-xs font-black uppercase tracking-widest rounded-xl border border-white/5 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-8 h-12 text-xs font-black uppercase tracking-widest rounded-xl bg-gradient-to-b from-accent to-[#d97706] text-[#050505] flex items-center justify-center gap-2 cursor-pointer font-bold hover:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
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

    </div>
  )
}
