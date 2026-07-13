Write-Host "Setting up Fee Management files..." -ForegroundColor Cyan
$root = Get-Location

$targetDir = Join-Path $root ""
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
$targetFile = Join-Path $root "types\index.ts"
$content = @'
// ============================================================
// PAHORE ACADEMY — All TypeScript Types
// ============================================================

export type Role = 'student' | 'teacher' | 'admin'

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  gender: 'male' | 'female' | 'other' | null
  age: number | null
  class: string | null
  board: string | null
  subjects: string[] | null
  father_name: string | null
  phone: string | null
  profile_pic_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role: Role
  verified_at: string | null
  granted_by: string | null
}

export interface Student {
  id: string
  roll_number: string | null
  enrollment_date: string
  is_active: boolean
}

export interface Teacher {
  id: string
  subjects: string[]
  classes: string[]
  employee_id: string | null
}

export interface TestResult {
  id: string
  student_id: string
  teacher_id: string | null
  date: string
  subject: string
  test_name: string
  total_marks: number
  obtained_marks: number
  percentage: number
  remarks: string | null
  created_at: string
  updated_at: string
}

export interface LibraryFile {
  id: string
  title: string
  description: string | null
  subject: string | null
  class: string | null
  board: string | null
  file_url: string
  file_size: number | null
  uploaded_by: string | null
  upload_date: string
  is_active: boolean
  tags: string[] | null
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'marks' | 'library' | 'system' | 'announcement'
  is_read: boolean
  created_at: string
}

export interface Fee {
  id: string
  student_id: string
  month: string
  amount: number
  paid_amount: number
  due_date: string | null
  paid_date: string | null
  status: 'paid' | 'unpaid' | 'partial'
  payment_method: string | null
  remarks: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface FeeWithProfile extends Fee {
  student_profile?: Profile
}

export interface FeeFormData {
  student_id: string
  month: string
  amount: number
  due_date: string
  status: 'paid' | 'unpaid' | 'partial'
  paid_amount: number
  paid_date: string
  payment_method: string
  remarks: string
}

export interface AccessCode {
  id: string
  role: 'teacher' | 'admin'
  code: string
  created_by: string | null
  created_at: string
  is_active: boolean
}

// Combined types for display
export interface FullUser {
  user: User
  profile: Profile | null
  roles: Role[]
  student?: Student | null
  teacher?: Teacher | null
}

export interface TestResultWithProfile extends TestResult {
  student_profile?: Profile
  teacher_profile?: Profile
}

// Auth types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  full_name: string
}

export interface StudentOnboardingData {
  class: string
  board: string
  subjects: string[]
  father_name: string
  phone: string
  age: number
  gender: 'male' | 'female' | 'other'
  bio?: string
}

export interface RoleCodeFormData {
  code: string
}

// Analytics types
export interface SubjectAverage {
  subject: string
  average: number
  highest: number
  lowest: number
  count: number
}

export interface StudentRanking {
  student_id: string
  full_name: string
  roll_number: string | null
  average_percentage: number
  rank: number
}

export interface ClassAnalytics {
  total_students: number
  active_students: number
  total_tests: number
  class_average: number
  subject_averages: SubjectAverage[]
  top_students: StudentRanking[]
}

// Table column types
export interface MarksTableRow {
  id: string
  student_name: string
  roll_number: string | null
  subject: string
  test_name: string
  date: string
  total_marks: number
  obtained_marks: number
  percentage: number
  remarks: string | null
}

// AI types
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AICalculatorInput {
  marks: Array<{
    subject: string
    obtained: number
    total: number
  }>
  class?: string
}
'@
Set-Content -Path $targetFile -Value $content -Encoding UTF8
Write-Host "Wrote types\index.ts" -ForegroundColor Green

$targetDir = Join-Path $root ""
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
$targetFile = Join-Path $root "lib\supabase.ts"
$content = @'
// ============================================================
// Supabase client — all DB calls go through this file
// ============================================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side admin client (use only in API routes)
export const createAdminClient = () =>
  createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

// ---- Auth helpers ----

export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password })
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getSession() {
  return supabase.auth.getSession()
}

export async function getUser() {
  return supabase.auth.getUser()
}

// ---- Profile helpers ----

export async function getProfile(userId: string) {
  return supabase.from('profiles').select('*').eq('id', userId).single()
}

export async function upsertProfile(profile: Record<string, unknown>) {
  return supabase.from('profiles').upsert(profile).select().single()
}

// ---- Roles helpers ----

export async function getUserRoles(userId: string) {
  return supabase.from('roles').select('role').eq('user_id', userId)
}

export async function addRole(userId: string, role: string, grantedBy?: string) {
  return supabase.from('roles').insert({
    user_id: userId,
    role,
    verified_at: new Date().toISOString(),
    granted_by: grantedBy || userId,
  })
}

// ---- Students helpers ----

export async function getAllStudents() {
  return supabase
    .from('profiles')
    .select(`
      *,
      students!inner(*),
      roles!inner(role)
    `)
    .eq('roles.role', 'student')
    .eq('students.is_active', true)
}

export async function getStudentByRoll(rollNumber: string) {
  return supabase
    .from('students')
    .select(`*, profiles(*)`)
    .eq('roll_number', rollNumber)
    .single()
}

// ---- Marks helpers ----

export async function getStudentMarks(studentId: string) {
  return supabase
    .from('test_results')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false })
}

export async function insertTestResult(result: Record<string, unknown>) {
  return supabase.from('test_results').insert(result).select().single()
}

export async function updateTestResult(id: string, updates: Record<string, unknown>) {
  return supabase.from('test_results').update(updates).eq('id', id).select().single()
}

export async function deleteTestResult(id: string) {
  return supabase.from('test_results').delete().eq('id', id)
}

export async function getClassMarks(className: string) {
  return supabase
    .from('test_results')
    .select(`*, profiles!test_results_student_id_fkey(full_name, class)`)
    .eq('profiles.class', className)
}

// ---- Library helpers ----

export async function getLibraryFiles(filters?: { subject?: string; class?: string; board?: string }) {
  let query = supabase.from('library_files').select('*').eq('is_active', true).order('upload_date', { ascending: false })
  if (filters?.subject) query = query.eq('subject', filters.subject)
  if (filters?.class) query = query.eq('class', filters.class)
  if (filters?.board) query = query.eq('board', filters.board)
  return query
}

export async function uploadLibraryFile(file: File, meta: Record<string, unknown>) {
  // Upload file to Supabase Storage
  const fileName = `${Date.now()}-${file.name}`
  const { data: storageData, error: storageError } = await supabase.storage
    .from('library')
    .upload(fileName, file)

  if (storageError) return { data: null, error: storageError }

  const { data: { publicUrl } } = supabase.storage.from('library').getPublicUrl(fileName)

  return supabase.from('library_files').insert({
    ...meta,
    file_url: publicUrl,
    file_size: file.size,
    upload_date: new Date().toISOString(),
  }).select().single()
}

// ---- Notifications helpers ----

export async function getUserNotifications(userId: string) {
  return supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
}

export async function markNotificationRead(id: string) {
  return supabase.from('notifications').update({ is_read: true }).eq('id', id)
}

export async function createNotification(notification: Record<string, unknown>) {
  return supabase.from('notifications').insert(notification)
}

// ---- Fees helpers ----

export async function getAllFees() {
  return supabase.from('fees').select('*').order('created_at', { ascending: false })
}

export async function getStudentFees(studentId: string) {
  return supabase
    .from('fees')
    .select('*')
    .eq('student_id', studentId)
    .order('due_date', { ascending: false })
}

export async function insertFee(fee: Record<string, unknown>) {
  return supabase.from('fees').insert(fee).select().single()
}

export async function updateFee(id: string, updates: Record<string, unknown>) {
  return supabase.from('fees').update(updates).eq('id', id).select().single()
}

export async function deleteFee(id: string) {
  return supabase.from('fees').delete().eq('id', id)
}

export async function markFeePaid(id: string, amount: number, method: string) {
  return supabase.from('fees').update({
    status: 'paid',
    paid_amount: amount,
    paid_date: new Date().toISOString().slice(0, 10),
    payment_method: method,
  }).eq('id', id).select().single()
}

// ---- Access codes ----

export async function validateAccessCode(code: string, role: 'teacher' | 'admin') {
  const { data, error } = await supabase
    .from('access_codes')
    .select('*')
    .eq('code', code)
    .eq('role', role)
    .eq('is_active', true)
    .single()
  return { valid: !error && !!data, data, error }
}

export async function rotateAccessCode(role: 'teacher' | 'admin', newCode: string, adminId: string) {
  // Deactivate old codes
  await supabase.from('access_codes').update({ is_active: false }).eq('role', role)
  // Create new code
  return supabase.from('access_codes').insert({
    role, code: newCode, created_by: adminId, is_active: true,
  })
}
'@
Set-Content -Path $targetFile -Value $content -Encoding UTF8
Write-Host "Wrote lib\supabase.ts" -ForegroundColor Green

$targetDir = Join-Path $root ""
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
$targetFile = Join-Path $root "components\layout\Sidebar.tsx"
$content = @'
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore, useUIStore } from '@/store'
import { cn } from '@/lib/utils'

const studentNav = [
  { href: '/dashboard/student', icon: '🏠', label: 'Dashboard' },
  { href: '/dashboard/student/profile', icon: '👤', label: 'My Profile' },
  { href: '/dashboard/student/marks', icon: '📊', label: 'My Marks' },
  { href: '/dashboard/student/fees', icon: '💳', label: 'My Fees' },
  { href: '/dashboard/student/library', icon: '📚', label: 'Library' },
  { href: '/dashboard/student/ai', icon: '🤖', label: 'AI Assistant' },
  { href: '/dashboard/student/notifications', icon: '🔔', label: 'Notifications' },
]

const teacherNav = [
  { href: '/dashboard/teacher', icon: '🏠', label: 'Dashboard' },
  { href: '/dashboard/teacher/roster', icon: '👥', label: 'My Students' },
  { href: '/dashboard/teacher/marks', icon: '📝', label: 'Marks Entry' },
  { href: '/dashboard/teacher/reports', icon: '📊', label: 'Reports' },
  { href: '/dashboard/teacher/library', icon: '📚', label: 'Library' },
  { href: '/dashboard/teacher/ai-calculator', icon: '🤖', label: 'AI Calculator' },
]

const adminNav = [
  { href: '/dashboard/admin', icon: '🏠', label: 'Dashboard' },
  { href: '/dashboard/admin/students', icon: '🎓', label: 'Students' },
  { href: '/dashboard/admin/fees', icon: '💳', label: 'Fee Management' },
  { href: '/dashboard/admin/users', icon: '👥', label: 'Users' },
  { href: '/dashboard/admin/analytics', icon: '📈', label: 'Analytics' },
  { href: '/dashboard/admin/library', icon: '📚', label: 'Library' },
  { href: '/dashboard/admin/codes', icon: '🔐', label: 'Access Codes' },
  { href: '/dashboard/admin/export', icon: '📤', label: 'Export Data' },
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
          {sidebarCollapsed ? '›' : '‹'}
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
'@
Set-Content -Path $targetFile -Value $content -Encoding UTF8
Write-Host "Wrote components\layout\Sidebar.tsx" -ForegroundColor Green

$targetDir = Join-Path $root ""
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
$targetFile = Join-Path $root "app\dashboard\admin\page.tsx"
$content = @'
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
                  { href: '/dashboard/admin/fees', icon: '💳', label: 'Fee Management', desc: 'Track payments & dues' },
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
'@
Set-Content -Path $targetFile -Value $content -Encoding UTF8
Write-Host "Wrote app\dashboard\admin\page.tsx" -ForegroundColor Green

$targetDir = Join-Path $root ""
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
$targetFile = Join-Path $root "app\dashboard\admin\fees\page.tsx"
$content = @'
'use client'

import { useEffect, useMemo, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { supabase, insertFee, updateFee, deleteFee, markFeePaid } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface StudentOption { id: string; full_name: string; class: string; roll_number: string | null }

interface FeeRow {
  id: string
  student_id: string
  month: string
  amount: number
  paid_amount: number
  due_date: string | null
  paid_date: string | null
  status: 'paid' | 'unpaid' | 'partial'
  payment_method: string | null
  remarks: string | null
  student_name: string
  student_class: string
  roll_number: string | null
}

const EMPTY_FORM = {
  student_id: '', month: '', amount: '', due_date: '',
  status: 'unpaid' as 'paid' | 'unpaid' | 'partial',
  paid_amount: '', paid_date: '', payment_method: 'Cash', remarks: '',
}

export default function AdminFeesPage() {
  const [fees, setFees] = useState<FeeRow[]>([])
  const [students, setStudents] = useState<StudentOption[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid' | 'partial'>('all')
  const [filterClass, setFilterClass] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const loadData = async () => {
    setLoading(true)
    const [{ data: feeData }, { data: profiles }, { data: studentData }] = await Promise.all([
      supabase.from('fees').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, full_name, class'),
      supabase.from('students').select('id, roll_number'),
    ])

    const profileMap: Record<string, { full_name: string; class: string }> = {}
    profiles?.forEach((p: { id: string; full_name: string; class: string }) => {
      profileMap[p.id] = { full_name: p.full_name || 'Unknown', class: p.class || '—' }
    })
    const rollMap: Record<string, string | null> = {}
    studentData?.forEach((s: { id: string; roll_number: string | null }) => { rollMap[s.id] = s.roll_number })

    setStudents((profiles || [])
      .filter((p: { id: string }) => rollMap[p.id] !== undefined)
      .map((p: { id: string; full_name: string; class: string }) => ({
        id: p.id, full_name: p.full_name || 'Unknown', class: p.class || '—', roll_number: rollMap[p.id] || null,
      })))

    setFees((feeData || []).map((f: Omit<FeeRow, 'student_name' | 'student_class' | 'roll_number'>) => ({
      ...f,
      student_name: profileMap[f.student_id]?.full_name || 'Unknown',
      student_class: profileMap[f.student_id]?.class || '—',
      roll_number: rollMap[f.student_id] || null,
    })))
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(false) }

  const openEdit = (f: FeeRow) => {
    setEditingId(f.id)
    setForm({
      student_id: f.student_id, month: f.month, amount: String(f.amount),
      due_date: f.due_date || '', status: f.status,
      paid_amount: String(f.paid_amount || ''), paid_date: f.paid_date || '',
      payment_method: f.payment_method || 'Cash', remarks: f.remarks || '',
    })
    setShowForm(true)
  }

  const submitForm = async () => {
    if (!form.student_id || !form.month || !form.amount) {
      toast.error('Student, month, and amount are required')
      return
    }
    const payload = {
      student_id: form.student_id,
      month: form.month,
      amount: Number(form.amount),
      due_date: form.due_date || null,
      status: form.status,
      paid_amount: Number(form.paid_amount) || 0,
      paid_date: form.paid_date || null,
      payment_method: form.payment_method || null,
      remarks: form.remarks || null,
    }
    if (editingId) {
      const { error } = await updateFee(editingId, payload)
      if (error) { toast.error('Failed to update fee'); return }
      toast.success('Fee record updated!')
    } else {
      const { error } = await insertFee(payload)
      if (error) { toast.error('Failed to add fee'); return }
      toast.success('Fee record added!')
    }
    resetForm()
    loadData()
  }

  const quickMarkPaid = async (f: FeeRow) => {
    const { error } = await markFeePaid(f.id, f.amount, f.payment_method || 'Cash')
    if (error) { toast.error('Failed to update'); return }
    toast.success('Marked as paid!')
    loadData()
  }

  const removeFee = async (id: string) => {
    if (!confirm('Delete this fee record?')) return
    const { error } = await deleteFee(id)
    if (error) { toast.error('Failed to delete'); return }
    toast.success('Fee record deleted')
    loadData()
  }

  const classes = useMemo(() => ['all', ...Array.from(new Set(fees.map(f => f.student_class).filter(c => c !== '—')))], [fees])

  const filtered = useMemo(() => fees.filter(f => {
    const q = search.toLowerCase()
    return (filterStatus === 'all' || f.status === filterStatus) &&
      (filterClass === 'all' || f.student_class === filterClass) &&
      (!search || f.student_name.toLowerCase().includes(q) || (f.roll_number || '').toLowerCase().includes(q) || f.month.toLowerCase().includes(q))
  }), [fees, search, filterStatus, filterClass])

  const totals = useMemo(() => {
    const collected = fees.reduce((s, f) => s + (Number(f.paid_amount) || 0), 0)
    const due = fees.reduce((s, f) => s + (Number(f.amount) - (Number(f.paid_amount) || 0)), 0)
    const unpaidCount = fees.filter(f => f.status !== 'paid').length
    return { collected, due, unpaidCount }
  }, [fees])

  const statusStyle = (status: string) =>
    status === 'paid' ? { background: '#C9A84C22', color: '#C9A84C' }
      : status === 'partial' ? { background: '#B87A1A22', color: '#F5C97A' }
      : { background: '#8B2E2E22', color: '#FCA5A5' }

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <Sidebar />
      <Topbar title="Fee Management" subtitle="Track student fee payments & dues" />
      <main className="pt-[60px] pl-[248px]">
        <div className="p-6">

          {/* Summary stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card text-center">
              <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Total Collected</p>
              <p className="font-heading text-2xl font-bold" style={{ color: '#C9A84C' }}>Rs. {totals.collected.toLocaleString()}</p>
            </div>
            <div className="card text-center">
              <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Total Outstanding</p>
              <p className="font-heading text-2xl font-bold" style={{ color: '#FCA5A5' }}>Rs. {totals.due.toLocaleString()}</p>
            </div>
            <div className="card text-center">
              <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Pending Records</p>
              <p className="font-heading text-2xl font-bold text-text-primary">{totals.unpaidCount}</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by student, roll #, or month..." className="input-field flex-1" />
            <div className="flex gap-2 flex-wrap">
              {(['all', 'unpaid', 'partial', 'paid'] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className="text-xs px-3 py-2 rounded-lg transition-all capitalize"
                  style={{ background: filterStatus === s ? '#C9A84C' : '#1e2d47', color: filterStatus === s ? '#0A0F1C' : '#9EA8B8' }}>
                  {s}
                </button>
              ))}
            </div>
            <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
              className="input-field sm:w-48">
              {classes.map(c => <option key={c} value={c}>{c === 'all' ? 'All Classes' : c}</option>)}
            </select>
            <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary whitespace-nowrap">
              + Add Fee Record
            </button>
          </div>

          {/* Add / Edit form */}
          {showForm && (
            <div className="card mb-6">
              <h3 className="font-heading text-lg font-bold text-text-primary mb-4">
                {editingId ? 'Edit Fee Record' : 'New Fee Record'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-text-muted text-xs block mb-1">Student</label>
                  <select value={form.student_id} onChange={e => setForm(p => ({ ...p, student_id: e.target.value }))} className="input-field">
                    <option value="">Select student...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.full_name} — {s.class} {s.roll_number ? `(#${s.roll_number})` : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-text-muted text-xs block mb-1">Month / Period</label>
                  <input type="text" placeholder="e.g. July 2026" value={form.month}
                    onChange={e => setForm(p => ({ ...p, month: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="text-text-muted text-xs block mb-1">Amount (Rs.)</label>
                  <input type="number" min="0" value={form.amount}
                    onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="text-text-muted text-xs block mb-1">Due Date</label>
                  <input type="date" value={form.due_date}
                    onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="text-text-muted text-xs block mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as 'paid' | 'unpaid' | 'partial' }))} className="input-field">
                    <option value="unpaid">Unpaid</option>
                    <option value="partial">Partially Paid</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="text-text-muted text-xs block mb-1">Amount Paid (Rs.)</label>
                  <input type="number" min="0" value={form.paid_amount}
                    onChange={e => setForm(p => ({ ...p, paid_amount: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="text-text-muted text-xs block mb-1">Paid Date</label>
                  <input type="date" value={form.paid_date}
                    onChange={e => setForm(p => ({ ...p, paid_date: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="text-text-muted text-xs block mb-1">Payment Method</label>
                  <select value={form.payment_method} onChange={e => setForm(p => ({ ...p, payment_method: e.target.value }))} className="input-field">
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                    <option>EasyPaisa</option>
                    <option>JazzCash</option>
                    <option>Cheque</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="text-text-muted text-xs block mb-1">Remarks (optional)</label>
                  <input type="text" value={form.remarks}
                    onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))} className="input-field" />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={submitForm} className="btn-primary">{editingId ? 'Save Changes' : 'Add Record'}</button>
                <button onClick={resetForm} className="btn-secondary">Cancel</button>
              </div>
            </div>
          )}

          {/* Fees table */}
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="marks-table">
                <thead>
                  <tr>
                    <th>Student</th><th>Class</th><th>Month</th><th>Amount</th>
                    <th>Paid</th><th>Due Date</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8} className="text-center py-8 text-text-muted">Loading...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-10 text-text-muted">No fee records found</td></tr>
                  ) : filtered.map(f => (
                    <tr key={f.id}>
                      <td>
                        <p className="text-text-primary text-sm">{f.student_name}</p>
                        <p className="text-text-muted text-xs">{f.roll_number ? `#${f.roll_number}` : ''}</p>
                      </td>
                      <td className="text-text-secondary">{f.student_class}</td>
                      <td className="text-text-secondary">{f.month}</td>
                      <td className="font-mono">Rs. {Number(f.amount).toLocaleString()}</td>
                      <td className="font-mono text-text-muted">Rs. {Number(f.paid_amount || 0).toLocaleString()}</td>
                      <td className="text-text-muted text-xs">{f.due_date ? formatDate(f.due_date) : '—'}</td>
                      <td>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize" style={statusStyle(f.status)}>
                          {f.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2 flex-wrap">
                          {f.status !== 'paid' && (
                            <button onClick={() => quickMarkPaid(f)} className="text-xs px-2 py-1 rounded"
                              style={{ background: '#C9A84C22', color: '#C9A84C' }}>
                              Mark Paid
                            </button>
                          )}
                          <button onClick={() => openEdit(f)} className="text-xs px-2 py-1 rounded" style={{ background: '#1e2d47', color: '#9EA8B8' }}>
                            Edit
                          </button>
                          <button onClick={() => removeFee(f.id)} className="text-xs px-2 py-1 rounded" style={{ background: '#8B2E2E22', color: '#FCA5A5' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
'@
Set-Content -Path $targetFile -Value $content -Encoding UTF8
Write-Host "Wrote app\dashboard\admin\fees\page.tsx" -ForegroundColor Green

$targetDir = Join-Path $root ""
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
$targetFile = Join-Path $root "app\dashboard\student\fees\page.tsx"
$content = @'
'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { useAuthStore } from '@/store'
import { getStudentFees } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import type { Fee } from '@/types'

export default function StudentFeesPage() {
  const { userId } = useAuthStore()
  const [fees, setFees] = useState<Fee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    getStudentFees(userId).then(({ data }) => {
      setFees(data || [])
      setLoading(false)
    })
  }, [userId])

  const totalDue = fees.reduce((s, f) => s + (Number(f.amount) - Number(f.paid_amount || 0)), 0)
  const totalPaid = fees.reduce((s, f) => s + Number(f.paid_amount || 0), 0)
  const pendingCount = fees.filter(f => f.status !== 'paid').length

  const statusStyle = (status: string) =>
    status === 'paid' ? { background: '#C9A84C22', color: '#C9A84C' }
      : status === 'partial' ? { background: '#B87A1A22', color: '#F5C97A' }
      : { background: '#8B2E2E22', color: '#FCA5A5' }

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <Sidebar />
      <Topbar title="My Fees" subtitle="Payment history & dues" />
      <main className="pt-[60px] pl-[248px]">
        <div className="p-6">

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card text-center">
              <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Total Paid</p>
              <p className="font-heading text-2xl font-bold" style={{ color: '#C9A84C' }}>Rs. {totalPaid.toLocaleString()}</p>
            </div>
            <div className="card text-center">
              <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Outstanding Balance</p>
              <p className="font-heading text-2xl font-bold" style={{ color: totalDue > 0 ? '#FCA5A5' : '#C9A84C' }}>
                Rs. {totalDue.toLocaleString()}
              </p>
            </div>
            <div className="card text-center">
              <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Pending Months</p>
              <p className="font-heading text-2xl font-bold text-text-primary">{pendingCount}</p>
            </div>
          </div>

          {totalDue > 0 && (
            <div className="card mb-6" style={{ borderColor: '#6B1A1A' }}>
              <p className="text-sm" style={{ color: '#FCA5A5' }}>
                ⚠️ You have an outstanding balance of <strong>Rs. {totalDue.toLocaleString()}</strong>. Please contact the academy office to clear your dues.
              </p>
            </div>
          )}

          {/* Table */}
          <div className="card overflow-hidden p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="skeleton h-12 rounded-lg" />)}
              </div>
            ) : fees.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="marks-table">
                  <thead>
                    <tr>
                      <th>Month</th><th>Amount</th><th>Paid</th><th>Due Date</th>
                      <th>Paid Date</th><th>Method</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map(f => (
                      <tr key={f.id}>
                        <td className="text-text-primary font-medium">{f.month}</td>
                        <td className="font-mono">Rs. {Number(f.amount).toLocaleString()}</td>
                        <td className="font-mono text-text-muted">Rs. {Number(f.paid_amount || 0).toLocaleString()}</td>
                        <td className="text-text-muted text-xs">{f.due_date ? formatDate(f.due_date) : '—'}</td>
                        <td className="text-text-muted text-xs">{f.paid_date ? formatDate(f.paid_date) : '—'}</td>
                        <td className="text-text-secondary text-xs">{f.payment_method || '—'}</td>
                        <td>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize" style={statusStyle(f.status)}>
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="text-4xl mb-3">💳</div>
                <p className="text-text-muted">No fee records yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
'@
Set-Content -Path $targetFile -Value $content -Encoding UTF8
Write-Host "Wrote app\dashboard\student\fees\page.tsx" -ForegroundColor Green

$targetDir = Join-Path $root ""
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
$targetFile = Join-Path $root "fees-migration.sql"
$content = @'
-- ============================================================
-- PAHORE ACADEMY — Fee Management Migration
-- Run this in Supabase SQL Editor (after the main schema)
-- ============================================================

-- ── FEES ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fees (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month          text NOT NULL,                         -- e.g. 'July 2026'
  amount         numeric(10,2) NOT NULL CHECK (amount >= 0),
  paid_amount    numeric(10,2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
  due_date       date,
  paid_date      date,
  status         text CHECK (status IN ('paid','unpaid','partial')) NOT NULL DEFAULT 'unpaid',
  payment_method text,                                   -- cash / bank / easypaisa / jazzcash etc.
  remarks        text,
  created_by     uuid REFERENCES auth.users(id),
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS fees_student_id_idx ON public.fees(student_id);
CREATE INDEX IF NOT EXISTS fees_status_idx     ON public.fees(status);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

-- Students can see their own fee records; teachers/admins can see everyone's
CREATE POLICY "fees_select" ON public.fees
  FOR SELECT USING (
    auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM public.roles WHERE user_id = auth.uid() AND role IN ('admin','teacher'))
  );

-- Only admins can create, edit, or delete fee records
CREATE POLICY "fees_admin_insert" ON public.fees
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "fees_admin_update" ON public.fees
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "fees_admin_delete" ON public.fees
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Keep updated_at fresh on every edit
CREATE OR REPLACE FUNCTION public.set_fees_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS fees_set_updated_at ON public.fees;
CREATE TRIGGER fees_set_updated_at
  BEFORE UPDATE ON public.fees
  FOR EACH ROW EXECUTE FUNCTION public.set_fees_updated_at();
'@
Set-Content -Path $targetFile -Value $content -Encoding UTF8
Write-Host "Wrote fees-migration.sql" -ForegroundColor Green

Write-Host "" 
Write-Host "All fee management files created successfully!" -ForegroundColor Yellow
Write-Host "Now run: git add . ; git commit -m 'Add fee management' ; git push" -ForegroundColor Yellow