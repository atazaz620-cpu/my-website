'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn, getProfile, getUserRoles } from '@/lib/supabase'
import { useAuthStore } from '@/store'
import type { Role } from '@/types'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const store = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await signIn(email, password)
      if (error) { toast.error(error.message); setLoading(false); return }

      const user = data.user!
      store.setUser(user.id, user.email!)

      // Load profile
      const { data: profile } = await getProfile(user.id)
      if (profile) store.setProfile(profile)

      // Load roles
      const { data: rolesData } = await getUserRoles(user.id)
      const roles = rolesData?.map((r: { role: Role }) => r.role) || []
      store.setRoles(roles)

      // If no roles yet, go to role selection
      if (roles.length === 0) {
        router.push('/auth/select-role')
      } else {
        // Go to appropriate dashboard
        const activeRole = roles.includes('admin') ? 'admin'
          : roles.includes('teacher') ? 'teacher' : 'student'
        router.push(`/dashboard/${activeRole}`)
      }
    } catch {
      toast.error('Login failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-5"
        style={{ background: '#C9A84C', filter: 'blur(100px)' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: '#141d2e', border: '2px solid #C9A84C' }}>
              <span className="font-heading text-2xl font-bold text-gold">PA</span>
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-text-primary">Pahore Academy</h1>
              <p className="text-text-muted text-sm">Mianwali</p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="card fade-in-up">
          <h2 className="font-heading text-2xl font-bold text-text-primary mb-1">Welcome back</h2>
          <p className="text-text-muted text-sm mb-8">Sign in to your academy account</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl text-base mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          <div className="gold-divider my-6" />

          <p className="text-center text-text-muted text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-gold hover:text-gold-light transition-colors font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
