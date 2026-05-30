'use client'

import React, { useState, useEffect, useRef } from 'react'
import { getMessagesBetweenUsers, sendMessageAction } from '@/app/(app)/messages/actions'
import { Send, CheckCheck, Paperclip, Mail, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Contact {
  id: string
  name: string | null
  image: string | null
  role: string
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: Date
}

interface ChatConsoleProps {
  contacts: Contact[]
  currentUserId: string
  initialMessages: Message[]
}

export default function ChatConsole({ contacts, currentUserId, initialMessages }: ChatConsoleProps) {
  const [activeContactId, setActiveContactId] = useState<string>(contacts[0]?.id || '')
  const [messagesList, setMessagesList] = useState<Message[]>(initialMessages)
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0]

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesList])

  // Poll for new messages every 3 seconds to make it feel real-time!
  useEffect(() => {
    if (!activeContactId) return
    const interval = setInterval(async () => {
      const res = await getMessagesBetweenUsers(currentUserId, activeContactId)
      if (res.success) {
        setMessagesList(res.messages)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [currentUserId, activeContactId])

  const handleSelectContact = async (contactId: string) => {
    setActiveContactId(contactId)
    const res = await getMessagesBetweenUsers(currentUserId, contactId)
    if (res.success) {
      setMessagesList(res.messages)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !activeContactId) return
    
    const text = inputText
    setInputText('')

    // Optimistic UI update
    const optimisticMessage: Message = {
      id: Math.random().toString(),
      senderId: currentUserId,
      receiverId: activeContactId,
      content: text,
      createdAt: new Date()
    }
    setMessagesList(prev => [...prev, optimisticMessage])

    const res = await sendMessageAction(currentUserId, activeContactId, text)
    if (!res.success) {
      // Remove optimistic message and show alert if failed
      setMessagesList(prev => prev.filter(m => m.id !== optimisticMessage.id))
      alert(res.error || 'Failed to send message')
    } else {
      // Re-fetch message logs to get canonical id/timestamp
      const fetchRes = await getMessagesBetweenUsers(currentUserId, activeContactId)
      if (fetchRes.success) {
        setMessagesList(fetchRes.messages)
      }
    }
  }

  return (
    <div className="flex-grow flex items-stretch gap-4 overflow-hidden h-[calc(100vh-130px)] select-none">
      {/* Left Column: Contact threads */}
      <div className="w-72 rounded-xl bg-white/[0.018] border border-[var(--color-border)] p-3 flex flex-col gap-3 shrink-0">
        <div className="px-1.5 text-left">
          <h4 className="text-sm font-semibold text-white">Conversations</h4>
        </div>

        <div className="flex-grow overflow-y-auto space-y-1 pr-0.5">
          {contacts.map((c) => {
            const isActive = c.id === activeContactId
            return (
              <button
                key={c.id}
                onClick={() => handleSelectContact(c.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-2.5 rounded-lg border transition-colors text-left group cursor-pointer",
                  isActive
                    ? "bg-white/[0.05] border-[var(--color-border)] text-white"
                    : "bg-transparent border-transparent text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white"
                )}
              >
                <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-[13px] font-medium shrink-0 overflow-hidden">
                  {c.image ? (
                    <img src={c.image} alt={c.name || ''} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    c.name?.[0]?.toUpperCase() || '?'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className={cn("text-[13px] font-medium truncate transition-colors", isActive ? "text-white" : "text-white/80 group-hover:text-white")}>
                    {c.name}
                  </h5>
                  <p className="text-[11px] text-[var(--color-text-muted)] truncate mt-0.5 capitalize">
                    {c.role === 'owner' ? 'Client' : 'Developer'}
                  </p>
                </div>
              </button>
            )})}
        </div>
      </div>

      {/* Right Column: Active thread console */}
      <div className="flex-1 rounded-xl bg-white/[0.018] border border-[var(--color-border)] flex flex-col overflow-hidden">
        {activeContact ? (
          <>
            {/* Header */}
            <div className="h-14 border-b border-[var(--color-border)] px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-medium shrink-0 overflow-hidden">
                  {activeContact.image ? (
                    <img src={activeContact.image} alt={activeContact.name || ''} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    activeContact.name?.[0]?.toUpperCase() || '?'
                  )}
                </div>
                <div>
                  <h5 className="text-[13px] font-medium text-white leading-none">{activeContact.name}</h5>
                  <span className="text-[11px] text-emerald-400 mt-1 block">Active</span>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            {/* Messages list (scrollable) */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3">
              {messagesList.length > 0 ? (
                messagesList.map((m) => {
                  const isSender = m.senderId === currentUserId
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex items-end gap-2.5 max-w-[75%] text-left",
                        isSender ? "ml-auto justify-end text-right" : "justify-start"
                      )}
                    >
                      {!isSender && (
                        <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-[10px] font-medium shrink-0">
                          {activeContact.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                      <div className={cn(
                        "px-3 py-2 rounded-lg text-[13px] leading-relaxed relative text-left pb-5",
                        isSender
                          ? "bg-accent/15 border border-accent/20 text-white"
                          : "bg-white/[0.03] border border-[var(--color-border)] text-white/85"
                      )}>
                        {m.content}
                        <span className="absolute bottom-1 right-2 flex items-center gap-1 text-[10px] text-white/30 tabular-nums">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isSender && <CheckCheck className="w-3 h-3 text-accent" />}
                        </span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                  <Mail className="w-5 h-5 text-[var(--color-text-muted)]" />
                  <p className="text-[13px] text-[var(--color-text-muted)]">No messages yet</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input field */}
            <form onSubmit={handleSend} className="p-3 border-t border-[var(--color-border)] flex items-center gap-2 shrink-0">
              <button type="button" className="p-2 text-[var(--color-text-muted)] hover:text-white rounded-lg hover:bg-white/[0.03] cursor-pointer">
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 h-10 bg-white/[0.02] border border-[var(--color-border)] rounded-lg px-3 text-[13px] text-white placeholder-white/25 outline-none focus:border-accent transition-colors"
              />
              <button type="submit" className="p-2.5 text-[#0a0a0a] bg-accent hover:bg-accent-hover rounded-lg cursor-pointer transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-10">
            <ShieldAlert className="w-6 h-6 text-[var(--color-text-muted)]" />
            <div className="space-y-1">
              <p className="text-white font-medium text-sm">No conversations</p>
              <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed max-w-xs">
                Other registered users will appear here so you can message them.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
