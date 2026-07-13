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
                âš ï¸ You have an outstanding balance of <strong>Rs. {totalDue.toLocaleString()}</strong>. Please contact the academy office to clear your dues.
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
                        <td className="text-text-muted text-xs">{f.due_date ? formatDate(f.due_date) : 'â€”'}</td>
                        <td className="text-text-muted text-xs">{f.paid_date ? formatDate(f.paid_date) : 'â€”'}</td>
                        <td className="text-text-secondary text-xs">{f.payment_method || 'â€”'}</td>
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
                <div className="text-4xl mb-3">ðŸ’³</div>
                <p className="text-text-muted">No fee records yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
