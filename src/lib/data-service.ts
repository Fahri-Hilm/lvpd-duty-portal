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

export async function uploadPortrait(id: string, file: File): Promise<string | null> {
  if (!supabase) return null;

  const ext = file.name.split('.').pop();
  const path = `${id}-${Date.now()}.${ext}`;
  const { error: uploadErr } = await supabase.storage
    .from('character-portraits')
    .upload(path, file, { contentType: file.type, upsert: true });
  if (uploadErr) return null;

  const { data: urlData } = supabase.storage.from('character-portraits').getPublicUrl(path);

  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ portrait_url: urlData.publicUrl })
    .eq('id', id);
  if (updateErr) return null;

  return urlData.publicUrl;
}

// ─── Duty Reports ───────────────────────────────────────

export interface DutyRow {
  id: string;
  member_id: string;
  duty_date: string;
  on_duty_at: string;
  off_duty_at: string;
  status: string;
  notes: string | null;
  created_at: string;
  photos: { storage_path: string | null }[];
}

export async function fetchDuties(): Promise<DutyFaction[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('duty_reports')
    .select('*, duty_photos(storage_path)')
    .is('deleted_at', null)
    .order('duty_date', { ascending: false });

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

export async function fetchDutyRows(): Promise<DutyRow[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('duty_reports')
    .select('*, duty_photos(storage_path, id)')
    .is('deleted_at', null)
    .order('duty_date', { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data;
}

export async function updateDuty(id: string, updates: {
  duty_date?: string;
  on_duty_at?: string;
  off_duty_at?: string;
  notes?: string;
  status?: string;
}): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase.from('duty_reports').update(updates).eq('id', id).select('id');
  if (error) {
    console.error('[updateDuty] error:', error.message, error.code, error.details);
    return false;
  }
  return true;
}

export async function deleteDuty(id: string): Promise<boolean> {
  if (!supabase) { console.error('[deleteDuty] supabase not initialized'); return false; }
  const { data, error } = await supabase
    .from('duty_reports')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .select('id');
  if (error) {
    console.error('[deleteDuty] error:', error.message, error.code, error.details);
    return false;
  }
  console.log('[deleteDuty] success, affected:', data);
  return true;
}

export async function uploadDutyPhoto(dutyReportId: string, file: File): Promise<string | null> {
  if (!supabase) return null;
  const ext = file.name.split('.').pop();
  const path = `duty/${dutyReportId}/${Date.now()}.${ext}`;
  const { error: uploadErr } = await supabase.storage
    .from('duty-photos')
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadErr) return null;

  const { data: urlData } = supabase.storage.from('duty-photos').getPublicUrl(path);

  await supabase.from('duty_photos').insert({
    duty_report_id: dutyReportId,
    storage_path: urlData.publicUrl,
    original_size: file.size,
  });

  return urlData.publicUrl;
}

export async function deleteDutyPhoto(photoId: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('duty_photos').update({ deleted_at: new Date().toISOString() }).eq('id', photoId);
  return !error;
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
