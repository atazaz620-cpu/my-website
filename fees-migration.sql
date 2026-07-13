-- ============================================================
-- PAHORE ACADEMY â€” Fee Management Migration
-- Run this in Supabase SQL Editor (after the main schema)
-- ============================================================

-- â”€â”€ FEES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€ ROW LEVEL SECURITY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
