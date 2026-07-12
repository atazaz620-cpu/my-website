'use client'

import Link from 'next/link'
import { useAuthStore, useUIStore } from '@/store'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface TopbarProps {
  title: string
  subtitle?: string
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { profile, roles, unreadCount, clearAuth } = useAuthStore()
  const { sidebarCollapsed } = useUIStore()
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    clearAuth()
    toast.success('Signed out')
    router.push('/auth/login')
  }

  return (
    <header
      className="fixed right-0 top-0 z-30 flex items-center justify-between px-6 py-4 transition-all"
      style={{
        left: sidebarCollapsed ? '72px' : '260px',
        background: 'rgba(13,27,42,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1e2d47',
      }}>

      {/* Page title */}
      <div>
        <h1 className="font-heading text-lg font-bold text-text-primary">{title}</h1>
        {subtitle && <p className="text-text-muted text-xs">{subtitle}</p>}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Link href="/dashboard/student/notifications" className="relative text-text-secondary hover:text-gold transition-colors">
          <span className="text-xl">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
              style={{ background: '#8B2E2E', color: '#F0EBE1' }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* Roles badges */}
        <div className="hidden md:flex items-center gap-1">
          {roles.map(role => (
            <span key={role} className={`badge-${role}`}>{role}</span>
          ))}
        </div>

        {/* User avatar + logout */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: '#C9A84C', color: '#0A0F1C' }}>
            {profile?.full_name?.[0] || '?'}
          </div>
          <button onClick={logout} className="text-text-muted hover:text-danger text-xs transition-colors">
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
