'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore, useUIStore } from '@/store'
import { cn } from '@/lib/utils'

const studentNav = [
  { href: '/dashboard/student', icon: 'ðŸ ', label: 'Dashboard' },
  { href: '/dashboard/student/profile', icon: 'ðŸ‘¤', label: 'My Profile' },
  { href: '/dashboard/student/marks', icon: 'ðŸ“Š', label: 'My Marks' },
  { href: '/dashboard/student/fees', icon: 'ðŸ’³', label: 'My Fees' },
  { href: '/dashboard/student/library', icon: 'ðŸ“š', label: 'Library' },
  { href: '/dashboard/student/ai', icon: 'ðŸ¤–', label: 'AI Assistant' },
  { href: '/dashboard/student/notifications', icon: 'ðŸ””', label: 'Notifications' },
]

const teacherNav = [
  { href: '/dashboard/teacher', icon: 'ðŸ ', label: 'Dashboard' },
  { href: '/dashboard/teacher/roster', icon: 'ðŸ‘¥', label: 'My Students' },
  { href: '/dashboard/teacher/marks', icon: 'ðŸ“', label: 'Marks Entry' },
  { href: '/dashboard/teacher/reports', icon: 'ðŸ“Š', label: 'Reports' },
  { href: '/dashboard/teacher/library', icon: 'ðŸ“š', label: 'Library' },
  { href: '/dashboard/teacher/ai-calculator', icon: 'ðŸ¤–', label: 'AI Calculator' },
]

const adminNav = [
  { href: '/dashboard/admin', icon: 'ðŸ ', label: 'Dashboard' },
  { href: '/dashboard/admin/students', icon: 'ðŸŽ“', label: 'Students' },
  { href: '/dashboard/admin/fees', icon: 'ðŸ’³', label: 'Fee Management' },
  { href: '/dashboard/admin/users', icon: 'ðŸ‘¥', label: 'Users' },
  { href: '/dashboard/admin/analytics', icon: 'ðŸ“ˆ', label: 'Analytics' },
  { href: '/dashboard/admin/library', icon: 'ðŸ“š', label: 'Library' },
  { href: '/dashboard/admin/codes', icon: 'ðŸ”', label: 'Access Codes' },
  { href: '/dashboard/admin/export', icon: 'ðŸ“¤', label: 'Export Data' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { activeRole, roles, setActiveRole, profile } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  const navItems = activeRole === 'admin' ? adminNav
    : activeRole === 'teacher' ? teacherNav
    : studentNav

  return (
    <aside className={cn(
      'fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-all duration-300',
      sidebarCollapsed ? 'w-[72px]' : 'w-[260px]',
    )} style={{ background: '#111827', borderRight: '1px solid #1e2d47' }}>

      {/* Academy Logo Header */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid #1e2d47' }}>
        <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: '#0A0F1C', border: '1px solid #C9A84C' }}>
          <span className="font-heading text-sm font-bold text-gold">PA</span>
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <p className="font-heading text-text-primary font-bold text-sm truncate">Pahore Academy</p>
            <p className="text-text-muted text-xs truncate">Mianwali</p>
          </div>
        )}
        <button onClick={toggleSidebar} className="ml-auto shrink-0 text-text-muted hover:text-gold transition-colors">
          {sidebarCollapsed ? 'â€º' : 'â€¹'}
        </button>
      </div>

      {/* Role switcher */}
      {roles.length > 1 && !sidebarCollapsed && (
        <div className="px-3 py-3" style={{ borderBottom: '1px solid #1e2d47' }}>
          <p className="text-text-muted text-xs uppercase tracking-widest mb-2 px-1">Switch Role</p>
          <div className="flex flex-wrap gap-1">
            {roles.map(role => (
              <button key={role} onClick={() => setActiveRole(role)}
                className={cn('text-xs px-2 py-1 rounded-md transition-all font-medium capitalize',
                  role === 'badge-' + activeRole ? 'opacity-100' : 'opacity-60 hover:opacity-80')}
                style={{
                  background: activeRole === role ? (role === 'admin' ? '#6B1A1A' : role === 'teacher' ? '#7A4A0A' : '#3D2E8C') : 'transparent',
                  color: activeRole === role ? (role === 'admin' ? '#FCA5A5' : role === 'teacher' ? '#FCD9A0' : '#C4B5FD') : '#9EA8B8',
                  border: `1px solid ${activeRole === role ? 'transparent' : '#1e2d47'}`,
                }}>
                {role}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {!sidebarCollapsed && (
          <p className="text-text-muted text-xs uppercase tracking-widest mb-3 px-2">
            {activeRole} Menu
          </p>
        )}
        <ul className="space-y-1">
          {navItems.map(({ href, icon, label }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group',
                    active
                      ? 'text-text-primary font-medium'
                      : 'text-text-secondary hover:text-text-primary',
                  )}
                  style={{
                    background: active ? 'rgba(184,150,106,0.12)' : 'transparent',
                    borderLeft: active ? '3px solid #C9A84C' : '3px solid transparent',
                  }}>
                  <span className="text-base shrink-0">{icon}</span>
                  {!sidebarCollapsed && <span className="truncate">{label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Profile footer */}
      {!sidebarCollapsed && (
        <div className="px-3 py-4" style={{ borderTop: '1px solid #1e2d47' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
              style={{ background: '#C9A84C', color: '#0A0F1C' }}>
              {profile?.full_name?.[0] || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-text-primary text-xs font-medium truncate">{profile?.full_name || 'Loading...'}</p>
              <p className="text-text-muted text-xs truncate capitalize">{activeRole}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
