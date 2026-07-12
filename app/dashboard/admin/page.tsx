'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { useAuthStore } from '@/store'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function AdminDashboardPage() {
  const { profile } = useAuthStore()
  const [stats, setStats] = useState({
    students: 0, teachers: 0, admins: 0, totalTests: 0,
    libraryFiles: 0, avgScore: 0,
  })
  const [classData, setClassData] = useState<{ name: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [roles, tests, lib, profiles, marksData] = await Promise.all([
        supabase.from('roles').select('role'),
        supabase.from('test_results').select('id, percentage', { count: 'exact' }),
        supabase.from('library_files').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('profiles').select('class'),
        supabase.from('test_results').select('percentage'),
      ])

      const roleArr = roles.data || []
      const students = roleArr.filter((r: { role: string }) => r.role === 'student').length
      const teachers = roleArr.filter((r: { role: string }) => r.role === 'teacher').length
      const admins = roleArr.filter((r: { role: string }) => r.role === 'admin').length

      const pcts = (marksData.data || []).map((m: { percentage: number }) => m.percentage)
      const avg = pcts.length ? pcts.reduce((a: number, b: number) => a + b, 0) / pcts.length : 0

      setStats({
        students, teachers, admins,
        totalTests: tests.count || 0,
        libraryFiles: lib.count || 0,
        avgScore: Math.round(avg * 10) / 10,
      })

      const classCounts: Record<string, number> = {}
      ;(profiles.data || []).forEach((p: { class: string }) => {
        if (p.class) classCounts[p.class] = (classCounts[p.class] || 0) + 1
      })
      setClassData(Object.entries(classCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count))
      setLoading(false)
    }
    load()
  }, [])

  const COLORS = ['#C9A84C', '#5B4FCF', '#C9A84C', '#B87A1A', '#C4541A']

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <Sidebar />
      <Topbar title="Admin Dashboard" subtitle="Pahore Academy Mianwali — Command Centre" />
      <main className="pt-[60px] pl-[248px]">
        <div className="p-6">
          {/* Admin profile banner */}
          <div className="card mb-6" style={{ borderColor: '#6B1A1A' }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ background: '#6B1A1A', color: '#FCA5A5' }}>
                {profile?.full_name?.[0] || 'A'}
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-xl font-bold text-text-primary">{profile?.full_name}</h2>
                <p className="text-text-muted text-sm">System Administrator · Pahore Academy Mianwali</p>
                <span className="badge-admin mt-1 inline-block">Admin</span>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {[
              { label: 'Students', value: stats.students, icon: '🎓', color: '#C4B5FD' },
              { label: 'Teachers', value: stats.teachers, icon: '📝', color: '#FCD9A0' },
              { label: 'Admins', value: stats.admins, icon: '⚙️', color: '#FCA5A5' },
              { label: 'Total Tests', value: stats.totalTests, icon: '📊', color: '#C9A84C' },
              { label: 'Library Files', value: stats.libraryFiles, icon: '📚', color: '#C9A84C' },
              { label: 'Avg Score', value: stats.avgScore + '%', icon: '📈', color: '#C9A84C' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="card text-center">
                <span className="text-2xl">{icon}</span>
                <p className="font-heading text-2xl font-bold mt-2" style={{ color }}>{value}</p>
                <p className="text-text-muted text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Chart + Quick Links */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="card">
              <h3 className="font-heading text-lg font-bold text-text-primary mb-4">Students by Class</h3>
              {classData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={classData.slice(0, 8).map(c => ({ name: c.name.replace('Class ', 'Cls '), count: c.count }))}>
                    <XAxis dataKey="name" tick={{ fill: '#5A6478', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#5A6478', fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#141d2e', border: '1px solid #1e2d47', borderRadius: '8px', color: '#F0EBE1' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {classData.slice(0, 8).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-text-muted">No data yet</div>
              )}
            </div>

            <div className="card">
              <h3 className="font-heading text-lg font-bold text-text-primary mb-4">Admin Actions</h3>
              <div className="space-y-2">
                {[
                  { href: '/dashboard/admin/students', icon: '🎓', label: 'Manage Students', desc: 'Add, edit, view all students' },
                  { href: '/dashboard/admin/users', icon: '👥', label: 'User Management', desc: 'Manage roles and accounts' },
                  { href: '/dashboard/admin/codes', icon: '🔐', label: 'Rotate Access Codes', desc: 'Update teacher/admin codes' },
                  { href: '/dashboard/admin/export', icon: '📤', label: 'Export Data', desc: 'Download CSV reports' },
                ].map(({ href, icon, label, desc }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors group"
                    style={{ background: '#0A0F1C', border: '1px solid #1e2d47' }}>
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="text-text-primary text-sm font-medium group-hover:text-gold transition-colors">{label}</p>
                      <p className="text-text-muted text-xs">{desc}</p>
                    </div>
                    <span className="ml-auto text-text-muted group-hover:text-gold transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
