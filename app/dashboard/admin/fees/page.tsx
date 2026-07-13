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
      profileMap[p.id] = { full_name: p.full_name || 'Unknown', class: p.class || 'â€”' }
    })
    const rollMap: Record<string, string | null> = {}
    studentData?.forEach((s: { id: string; roll_number: string | null }) => { rollMap[s.id] = s.roll_number })

    setStudents((profiles || [])
      .filter((p: { id: string }) => rollMap[p.id] !== undefined)
      .map((p: { id: string; full_name: string; class: string }) => ({
        id: p.id, full_name: p.full_name || 'Unknown', class: p.class || 'â€”', roll_number: rollMap[p.id] || null,
      })))

    setFees((feeData || []).map((f: Omit<FeeRow, 'student_name' | 'student_class' | 'roll_number'>) => ({
      ...f,
      student_name: profileMap[f.student_id]?.full_name || 'Unknown',
      student_class: profileMap[f.student_id]?.class || 'â€”',
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

  const classes = useMemo(() => ['all', ...Array.from(new Set(fees.map(f => f.student_class).filter(c => c !== 'â€”')))], [fees])

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
                      <option key={s.id} value={s.id}>{s.full_name} â€” {s.class} {s.roll_number ? `(#${s.roll_number})` : ''}</option>
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
                      <td className="text-text-muted text-xs">{f.due_date ? formatDate(f.due_date) : 'â€”'}</td>
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
