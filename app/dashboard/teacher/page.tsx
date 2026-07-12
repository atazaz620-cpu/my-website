'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { useAuthStore } from '@/store'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function TeacherDashboardPage() {
  const { profile } = useAuthStore()
  const [stats, setStats] = useState({ students: 0, testsEntered: 0, classes: 0, filesUploaded: 0 })

  useEffect(() => {
    const load = async () => {
      const [students, tests] = await Promise.all([
        supabase.from('students').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('test_results').select('id', { count: 'exact' }),
      ])
      setStats({
        students: students.count || 0,
        testsEntered: tests.count || 0,
        classes: 0,
        filesUploaded: 0,
      })
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <Sidebar />
      <Topbar title="Teacher Dashboard" subtitle={`Welcome, ${profile?.full_name?.split(' ')[0] || 'Teacher'}`} />
      <main className="pt-[60px] pl-[248px]">
        <div className="p-6">
          {/* Profile banner */}
          <div className="card mb-6" style={{ borderColor: '#7A4A0A' }}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ background: '#7A4A0A', color: '#FCD9A0' }}>
                {profile?.full_name?.[0] || 'T'}
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-xl font-bold text-text-primary">{profile?.full_name}</h2>
                <p className="text-text-muted text-sm">Pahore Academy Mianwali</p>
                <span className="badge-teacher mt-1 inline-block">Teacher</span>
              </div>
              <Link href="/dashboard/teacher/marks" className="btn-primary px-5 py-2.5 rounded-xl">
                Enter Marks →
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Students', value: stats.students, icon: '🎓' },
              { label: 'Tests Entered', value: stats.testsEntered, icon: '📝' },
              { label: 'Active Classes', value: stats.classes, icon: '📋' },
              { label: 'Library Files', value: stats.filesUploaded, icon: '📚' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="card text-center">
                <span className="text-2xl">{icon}</span>
                <p className="font-heading text-3xl font-bold text-gold mt-2">{value}</p>
                <p className="text-text-muted text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <h3 className="font-heading text-lg font-bold text-text-primary mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: '/dashboard/teacher/marks', icon: '📝', title: 'Enter Marks', desc: 'Add or edit student test results', color: '#FCD9A0' },
              { href: '/dashboard/teacher/roster', icon: '👥', title: 'Student Roster', desc: 'View and manage your students', color: '#FCD9A0' },
              { href: '/dashboard/teacher/reports', icon: '📊', title: 'Class Reports', desc: 'Analyze performance and averages', color: '#FCD9A0' },
              { href: '/dashboard/teacher/library', icon: '📚', title: 'Upload Resources', desc: 'Add books and notes to the library', color: '#FCD9A0' },
              { href: '/dashboard/teacher/ai-calculator', icon: '🤖', title: 'AI Calculator', desc: 'Smart marks analysis with AI', color: '#FCD9A0' },
            ].map(({ href, icon, title, desc, color }) => (
              <Link key={href} href={href}
                className="card group hover:border-border-light transition-all cursor-pointer">
                <div className="text-3xl mb-3">{icon}</div>
                <h4 className="font-heading text-base font-bold text-text-primary mb-1">{title}</h4>
                <p className="text-text-muted text-sm">{desc}</p>
                <div className="mt-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color }}>
                  Open →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
