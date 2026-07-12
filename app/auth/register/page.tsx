'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp, upsertProfile } from '@/lib/supabase'
import { useAuthStore } from '@/store'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const store = useAuthStore()
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', full_name: '' })
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const { data, error } = await signUp(formData.email, formData.password)
      if (error) { toast.error(error.message); setLoading(false); return }

      const user = data.user!
      store.setUser(user.id, user.email!)

      // Create profile with name
      const { data: profile } = await upsertProfile({ id: user.id, full_name: formData.full_name })
      if (profile) store.setProfile(profile)

      toast.success('Account created!')
      router.push('/auth/select-role')
    } catch {
      toast.error('Registration failed')
    }
    setLoading(false)
  }

  const update = (field: string, val: string) => setFormData(p => ({ ...p, [field]: val }))

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-5"
        style={{ background: '#5B4FCF', filter: 'blur(100px)' }} />

      <div className="relative z-10 w-full max-w-md">
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

        <div className="card fade-in-up">
          <h2 className="font-heading text-2xl font-bold text-text-primary mb-1">Create Account</h2>
          <p className="text-text-muted text-sm mb-8">Join Pahore Academy&apos;s digital platform</p>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Full Name</label>
              <input type="text" value={formData.full_name} onChange={(e) => update('full_name', e.target.value)}
                placeholder="Muhammad Ali" className="input-field" required />
            </div>
            <div>
              <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
              <input type="email" value={formData.email} onChange={(e) => update('email', e.target.value)}
                placeholder="your@email.com" className="input-field" required />
            </div>
            <div>
              <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
              <input type="password" value={formData.password} onChange={(e) => update('password', e.target.value)}
                placeholder="Min 8 characters" className="input-field" required />
            </div>
            <div>
              <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Confirm Password</label>
              <input type="password" value={formData.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)}
                placeholder="Repeat password" className="input-field" required />
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 rounded-xl text-base mt-2 disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <div className="gold-divider my-6" />
          <p className="text-center text-text-muted text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-gold hover:text-gold-light transition-colors font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
