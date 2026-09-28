import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle()
  const { data: profile } = await supabase.from('profiles').select('is_active,role').eq('user_id', user.id).maybeSingle()
  if (!data || profile?.is_active === false || (profile && profile.role !== 'admin')) redirect('/admin/login?error=unauthorized')
  return { supabase, user }
}
