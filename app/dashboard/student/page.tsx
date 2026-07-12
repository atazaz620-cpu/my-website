'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { useAuthStore } from '@/store'
import { getStudentMarks } from '@/lib/supabase'
import { gradeColor, gradeLabel, formatDate } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'
import type { TestResult } from '@/types'

export default function StudentDashboardPage() {
  const { profile, userId, unreadCount } = useAuthStore()
  const [marks, setMarks] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      getStudentMarks(userId).then(({ data }) => {
        setMarks(data || [])
        setLoading(false)
      })
    }
  }, [userId])

  const avg = marks.length ? Math.round(marks.reduce((s, m) => s + m.percentage, 0) / marks.length * 10) / 10 : 0
  const recent = marks.slice(0, 5)
  const chartData = marks.slice(0, 10).reverse().map(m => ({
    name: m.test_name.slice(0, 10),
    score: m.percentage,
  }))

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <Sidebar />
      <Topbar title="Student Dashboard" subtitle={`Welcome back, ${profile?.full_name?.split(' ')[0] || 'Student'}`} />

      <main className="pt-[60px] pl-[248px] transition-all">
        <div className="p-6">

          {/* Profile banner */}
          <div className="rounded-card mb-6 overflow-hidden" style={{ background: '#141d2e', border: '1px solid #1e2d47' }}>
            <div className="h-16 w-full" style={{
              background: 'linear-gradient(90deg, #0A0F1C 0%, #141d2e 40%, #C9A84C22 100%)',
              borderBottom: '1px solid #1e2d47',
            }}>
              <div className="h-full flex items-center px-6 gap-2">
                <div className="w-1 h-6 rounded-full" style={{ background: '#C9A84C' }} />
                <p className="text-text-secondary text-sm">
                  <span className="font-heading text-text-primary font-bold">Pahore Academy Mianwali</span>
                  {' — '}{profile?.class || 'Class not set'}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ background: '#C9A84C', color: '#0A0F1C' }}>
                {profile?.full_name?.[0] || '?'}
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-xl font-bold text-text-primary">{profile?.full_name || 'Student'}</h2>
                <p className="text-text-muted text-sm">{profile?.class} · {profile?.board} Board</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge-student">Student</span>
                </div>
              </div>
              <Link href="/dashboard/student/profile" className="btn-secondary text-sm px-4 py-2 rounded-lg">
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Tests', value: marks.length, icon: '📝', color: '#C9A84C' },
              { label: 'Average', value: avg + '%', icon: '📊', color: gradeColor(avg) },
              { label: 'Grade', value: gradeLabel(avg), icon: '🏆', color: gradeColor(avg) },
              { label: 'Unread', value: unreadCount, icon: '🔔', color: '#5B4FCF' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs text-text-muted uppercase tracking-widest">{label}</span>
                </div>
                <p className="font-heading text-3xl font-bold" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress chart */}
            <div className="card">
              <h3 className="font-heading text-lg font-bold text-text-primary mb-4">Performance Trend</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fill: '#5A6478', fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#5A6478', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ background: '#141d2e', border: '1px solid #1e2d47', borderRadius: '8px', color: '#F0EBE1' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#C9A84C" strokeWidth={2} dot={{ fill: '#C9A84C' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-text-muted">
                  No marks data yet
                </div>
              )}
            </div>

            {/* Recent marks */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-bold text-text-primary">Recent Tests</h3>
                <Link href="/dashboard/student/marks" className="text-gold text-xs hover:underline">View all</Link>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="skeleton h-12 rounded-lg" />)}
                </div>
              ) : recent.length > 0 ? (
                <div className="space-y-2">
                  {recent.map(m => (
                    <div key={m.id} className="flex items-center justify-between py-2 px-3 rounded-lg"
                      style={{ background: '#0A0F1C' }}>
                      <div>
                        <p className="text-text-primary text-sm font-medium">{m.test_name}</p>
                        <p className="text-text-muted text-xs">{m.subject} · {formatDate(m.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-sm" style={{ color: gradeColor(m.percentage) }}>
                          {m.obtained_marks}/{m.total_marks}
                        </p>
                        <p className="font-mono text-xs" style={{ color: gradeColor(m.percentage) }}>
                          {m.percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-muted">No marks yet</div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: '/dashboard/student/library', icon: '📚', label: 'Open Library' },
              { href: '/dashboard/student/ai', icon: '🤖', label: 'Ask AI' },
              { href: '/dashboard/student/marks', icon: '📊', label: 'Full Marks' },
              { href: '/dashboard/student/notifications', icon: '🔔', label: 'Notifications' },
            ].map(({ href, icon, label }) => (
              <Link key={href} href={href}
                className="card flex items-center gap-3 hover:border-border-light transition-colors cursor-pointer">
                <span className="text-2xl">{icon}</span>
                <span className="text-text-secondary text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
