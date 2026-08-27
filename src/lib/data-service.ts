import { supabase } from './supabase';
import type { Member, DutyFaction, Rank } from '../types';
import { mockMembers, mockDuties, ranks } from '../data';

// ─── Members ────────────────────────────────────────────

export async function fetchMembers(): Promise<Member[]> {
  if (!supabase) return mockMembers;

  const { data, error } = await supabase
    .from('members')
    .select('id, name, rank, is_active')
    .order('created_at', { ascending: true });

  if (error || !data || data.length === 0) return mockMembers;

  return data.map(m => ({
    id: m.id,
    name: m.name,
    rank: m.rank ?? 'ANALYST',
    status: m.is_active ? 'Aktif' as const : 'Nonaktif' as const,
  }));
}

// ─── Duty Reports ───────────────────────────────────────

export async function fetchDuties(): Promise<DutyFaction[]> {
  if (!supabase) return mockDuties;

  const { data, error } = await supabase
    .from('duty_reports')
    .select(`
      id, duty_date, on_duty_at, off_duty_at, status, notes, created_at,
      duty_photos ( storage_path ),
      members!duty_reports_member_id_fkey ( name, rank )
    `)
    .order('duty_date', { ascending: false })
    .limit(10);

  if (error || !data || data.length === 0) return mockDuties;

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

// ─── Activity Feed ──────────────────────────────────────

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

// ─── Ranks (static) ────────────────────────────────────

export function getRanks(): Rank[] {
  return ranks;
}

// ─── Stats ──────────────────────────────────────────────

export async function fetchStats() {
  const members = await fetchMembers();
  const duties = await fetchDuties();
  const active = members.filter(m => m.status === 'Aktif').length;

  return {
    activeMembers: active,
    totalMembers: members.length,
    totalDuties: duties.length,
    publishedDuties: duties.filter(d => d.status === 'DIPUBLIKASIKAN').length,
  };
}
