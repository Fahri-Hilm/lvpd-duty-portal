import { supabase } from './supabase';
import type { Profile, DutyFaction } from '../types';

// ─── Profiles (Personnel) ───────────────────────────────

export async function fetchProfiles(): Promise<Profile[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data;
}

export async function createProfile(input: {
  full_name: string;
  rank: string;
  email: string;
  role: Profile['role'];
  codename?: string;
  status?: Profile['status'];
  specialization?: string[];
}): Promise<Profile | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      full_name: input.full_name,
      rank: input.rank,
      email: input.email,
      role: input.role,
      codename: input.codename ?? null,
      status: input.status ?? 'active',
      specialization: input.specialization ?? ['RECON', 'COMBAT'],
    })
    .select()
    .single();

  if (error) return null;
  return data;
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: updates.full_name,
      rank: updates.rank,
      email: updates.email,
      role: updates.role,
      codename: updates.codename,
      status: updates.status,
      specialization: updates.specialization,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data;
}

export async function deleteProfile(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);

  return !error;
}

// ─── Duty Reports ───────────────────────────────────────

export async function fetchDuties(): Promise<DutyFaction[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('duty_reports')
    .select('*, duty_photos(storage_path)')
    .order('duty_date', { ascending: false })
    .limit(10);

  if (error || !data) return [];

  return data.map(d => ({
    id: d.id,
    title: `DUTY FACTION — ${d.duty_date}`,
    startDate: d.on_duty_at ?? d.duty_date,
    endDate: d.off_duty_at ?? d.duty_date,
    description: d.notes ?? 'Laporan kegiatan operasional mingguan.',
    photoUrl: d.duty_photos?.[0]?.storage_path ?? null,
    status: d.status === 'approved' ? 'DIPUBLIKASIKAN' as const
          : d.status === 'rejected' ? 'DIARSIPKAN' as const
          : 'DRAF' as const,
    createdAt: d.created_at,
    publishedAt: d.status === 'approved' ? d.created_at : null,
  }));
}

// ─── Activity Events ────────────────────────────────────

export interface ActivityEvent {
  id: string;
  type: string;
  actor: string;
  message: string;
  created_at: string;
}

export async function fetchActivityEvents(): Promise<ActivityEvent[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('activity_events')
    .select('id, type, actor, message, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data;
}

// ─── Stats ──────────────────────────────────────────────

export async function fetchStats() {
  const profiles = await fetchProfiles();
  const duties = await fetchDuties();

  return {
    activeProfiles: profiles.filter(p => p.status === 'active' || p.status === 'deployed').length,
    totalProfiles: profiles.length,
    totalDuties: duties.length,
    publishedDuties: duties.filter(d => d.status === 'DIPUBLIKASIKAN').length,
  };
}
