'use client'

import React, { useState, useEffect } from 'react'
import { 
  getPendingOwners, 
  getApprovedOwners, 
  getDevelopers, 
  approveOwner, 
  declineOwner, 
  toggleDeveloperBan 
} from '@/lib/admin-dashboard-actions'
import { adminLogout } from '@/lib/admin-actions'
import { Button } from '@/components/ui/Button'
import { 
  Users, 
  ShieldCheck, 
  UserX, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter,
  LogOut,
  ExternalLink,
  Mail,
  Phone,
  Briefcase
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'owners' | 'developers'>('owners')
  const [ownersList, setOwnersList] = useState<any[]>([])
  const [developersList, setDevelopersList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  async function fetchData() {
    setIsLoading(true)
    if (activeTab === 'owners') {
      const pending = await getPendingOwners()
      const approved = await getApprovedOwners()
      setOwnersList([...pending, ...approved])
    } else {
      const devs = await getDevelopers()
      setDevelopersList(devs)
    }
    setIsLoading(false)
  }

  async function handleApprove(userId: string) {
    await approveOwner(userId)
    fetchData()
  }

  async function handleDecline(userId: string) {
    if (confirm('Are you sure you want to decline and DELETE this user?')) {
      await declineOwner(userId)
      fetchData()
    }
  }

  async function handleToggleBan(userId: string, isBanned: boolean) {
    await toggleDeveloperBan(userId, !isBanned)
    fetchData()
  }

  async function handleLogout() {
    await adminLogout()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Sidebar Header */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
            <ShieldCheck className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-serif tracking-tight">Forke Admin</h1>
            <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">System Control Unit</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="flex items-center bg-white/[0.02] border border-white/5 rounded-full p-1">
            <button 
              onClick={() => setActiveTab('owners')}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'owners' ? 'bg-accent text-white' : 'text-white/20 hover:text-white'}`}
            >
              Owners
            </button>
            <button 
              onClick={() => setActiveTab('developers')}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'developers' ? 'bg-accent text-white' : 'text-white/20 hover:text-white'}`}
            >
              Developers
            </button>
          </nav>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Total Users</p>
                   <Users className="w-4 h-4 text-accent" />
                </div>
                <h3 className="text-4xl font-serif">{isLoading ? '...' : (activeTab === 'owners' ? ownersList.length : developersList.length)}</h3>
             </div>
             {/* Add more stats as needed */}
          </div>

          {/* Table Container */}
          <div className="rounded-[2.5rem] bg-white/[0.01] border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`}
                  className="w-full h-11 bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-6 text-sm text-white focus:outline-none focus:border-accent/40 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2 border-white/5 text-[10px] font-black uppercase rounded-xl h-11">
                  <Filter className="w-3 h-3" /> Filter
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20">User Details</th>
                    {activeTab === 'owners' && <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20">Company / Designation</th>}
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-white/20 uppercase font-black tracking-widest">Loading Records...</td>
                    </tr>
                  ) : activeTab === 'owners' ? (
                    ownersList.map(({ user, owner }) => (
                      <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 overflow-hidden relative">
                              {user.image && <img src={user.image} alt={user.name} className="object-cover w-full h-full" />}
                            </div>
                            <div>
                              <p className="font-bold text-white">{owner.firstName} {owner.lastName}</p>
                              <div className="flex items-center gap-3 text-[11px] text-white/30 mt-1">
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {owner.contactEmail}</span>
                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {owner.contactNumber}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div>
                            <p className="text-sm font-medium text-white/80">{owner.companyName}</p>
                            <p className="text-[11px] text-accent/60 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                              <Briefcase className="w-3 h-3" /> {owner.designation}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                              <a href={owner.personalLinkedIn} target="_blank" className="text-[9px] text-white/20 hover:text-white transition-colors underline">LinkedIn</a>
                              {owner.companyWebsite && <a href={owner.companyWebsite} target="_blank" className="text-[9px] text-white/20 hover:text-white transition-colors underline">Website</a>}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {user.isApproved ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase flex items-center gap-1.5 w-fit">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-black uppercase flex items-center gap-1.5 w-fit">
                              <ShieldCheck className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            {!user.isApproved && (
                              <button 
                                onClick={() => handleApprove(user.id)}
                                className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"
                                title="Approve"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDecline(user.id)}
                              className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                              title="Decline / Delete"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    developersList.map((user) => (
                      <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 overflow-hidden relative">
                              {user.image && <img src={user.image} alt={user.name} className="object-cover w-full h-full" />}
                            </div>
                            <div>
                              <p className="font-bold text-white">{user.name}</p>
                              <p className="text-[11px] text-white/30 mt-1 flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {user.isBanned ? (
                            <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase flex items-center gap-1.5 w-fit">
                              <UserX className="w-3 h-3" /> Banned
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase flex items-center gap-1.5 w-fit">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <button 
                            onClick={() => handleToggleBan(user.id, user.isBanned)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${user.isBanned ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white'}`}
                          >
                            {user.isBanned ? 'Unban User' : 'Ban User'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {!isLoading && (activeTab === 'owners' ? ownersList.length : developersList.length) === 0 && (
                <div className="py-20 text-center">
                   <p className="text-white/20 uppercase font-black tracking-widest">No records found in Nexus</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
