'use client'

import React, { useRef, useState } from 'react'
import { Eye, EyeOff, Save, Upload, Loader2, Globe } from 'lucide-react'
import { updateProfile, uploadAvatar } from '@/lib/actions/profile-actions'

function Github({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function Linkedin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
import { toast } from '@/components/shared/Toast'
import PublicProfileView, { ProfileData } from './PublicProfileView'

export default function ProfileEditor({ data }: { data: ProfileData }) {
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: data.name || '',
    headline: data.headline || '',
    bio: data.bio || '',
    location: data.location || '',
    githubUrl: data.githubUrl || '',
    linkedinUrl: data.linkedinUrl || '',
    websiteUrl: data.websiteUrl || '',
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(data.avatarUrl)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  // Live preview merges edits over the computed base data.
  const previewData: ProfileData = { ...data, ...form, avatarUrl }

  async function handleSave() {
    setSaving(true)
    const res = await updateProfile(form)
    if (res.success) toast('Profile saved!', 'success')
    else toast(res.error || 'Could not save profile', 'error')
    setSaving(false)
  }

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await uploadAvatar(fd)
    if (res.success && res.url) {
      setAvatarUrl(res.url)
      toast('Avatar updated!', 'success')
    } else {
      toast(res.error || 'Upload failed', 'error')
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-4 lg:h-full lg:min-h-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap shrink-0">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">{preview ? 'Public preview' : 'Edit your profile'}</h1>
          <p className="text-[13px] text-white/40 mt-0.5">
            {preview ? 'This is exactly what visitors see at your public link.' : 'Fill in your details, then hit the eye to preview your public profile.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview((p) => !p)}
            className="h-9 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
            title="Toggle public preview"
          >
            {preview ? <><EyeOff className="w-4 h-4" /> Back to editing</> : <><Eye className="w-4 h-4" /> Preview public</>}
          </button>
          {!preview && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-9 px-4 rounded-lg bg-[#ff8a00] hover:bg-[#ff8a00]/90 transition-all text-xs font-black text-[#0a0a0a] flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </button>
          )}
        </div>
      </div>

      <div className="lg:flex-grow lg:min-h-0">
      {preview ? (
        <PublicProfileView data={previewData} contained />
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0f]/60 backdrop-blur-xl p-6 md:p-8 space-y-6 lg:h-full lg:overflow-y-auto">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative w-24 h-24 rounded-full border border-[#ff8a00]/40 bg-accent/10 overflow-hidden shrink-0 group cursor-pointer"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-3xl font-black text-accent">
                  {form.name?.[0]?.toUpperCase() || 'F'}
                </span>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Upload className="w-5 h-5 text-white" />}
              </div>
            </button>
            <div>
              <p className="text-sm font-semibold text-white">Profile photo</p>
              <p className="text-[12px] text-white/40 mt-0.5">PNG, JPG, WebP or GIF · up to 5MB. Stored privately (encrypted path).</p>
              <button onClick={() => fileRef.current?.click()} className="mt-2 h-8 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white/80 cursor-pointer">
                Upload new
              </button>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleAvatar} className="hidden" />
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Display name" value={form.name} onChange={set('name')} placeholder="Your name" />
            <Field label="Location" value={form.location} onChange={set('location')} placeholder="e.g. Bengaluru, India" />
          </div>
          <Field label="Headline" value={form.headline} onChange={set('headline')} placeholder="One line that describes you" />
          <Field label="Bio" value={form.bio} onChange={set('bio')} placeholder="A few sentences about what you build…" textarea />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="GitHub URL" value={form.githubUrl} onChange={set('githubUrl')} placeholder="https://github.com/you" icon={<Github className="w-4 h-4" />} />
            <Field label="LinkedIn URL" value={form.linkedinUrl} onChange={set('linkedinUrl')} placeholder="https://linkedin.com/in/you" icon={<Linkedin className="w-4 h-4" />} />
          </div>
          <Field label="Website" value={form.websiteUrl} onChange={set('websiteUrl')} placeholder="https://yoursite.com" icon={<Globe className="w-4 h-4" />} />

          <div className="flex justify-end pt-2 border-t border-white/[0.05]">
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-9 px-5 rounded-lg bg-[#ff8a00] hover:bg-[#ff8a00]/90 transition-all text-xs font-black text-[#0a0a0a] flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save changes
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, textarea, icon,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder?: string
  textarea?: boolean
  icon?: React.ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-white/60">{label}</span>
      <div className="relative">
        {icon && <span className="absolute left-3 top-3 text-white/30">{icon}</span>}
        {textarea ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={3}
            className="w-full bg-white/[0.02] border border-white/[0.08] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder:text-white/25 focus:outline-none focus:border-accent/50 transition-colors resize-none"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full h-10 bg-white/[0.02] border border-white/[0.08] rounded-lg ${icon ? 'pl-9' : 'pl-3'} pr-3 text-[13px] text-white placeholder:text-white/25 focus:outline-none focus:border-accent/50 transition-colors`}
          />
        )}
      </div>
    </label>
  )
}
