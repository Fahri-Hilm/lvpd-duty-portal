import { DutyFaction, Member, Rank } from './types';
import { subDays, startOfWeek, endOfWeek, formatISO } from 'date-fns';

export const ranks: Rank[] = [
  { id: 'r1', name: 'JENDPOL', level: 1 },
  { id: 'r2', name: 'KOMJENPOL', level: 2 },
  { id: 'r3', name: 'IRJENPOL', level: 3 },
  { id: 'r4', name: 'BRIGJENPOL', level: 4 },
  { id: 'r5', name: 'KOMBESPOL', level: 5 },
  { id: 'r6', name: 'AKBP', level: 6 },
  { id: 'r7', name: 'KOMPOL', level: 7 },
  { id: 'r8', name: 'AKP', level: 8 },
  { id: 'r9', name: 'IPTU', level: 9 },
  { id: 'r10', name: 'IPDA', level: 10 },
];

export const mockMembers: Member[] = [
  { id: 'm1', name: 'Gwen_Pratama', rank: 'JENDPOL', status: 'Aktif' },
  { id: 'm2', name: 'Sean_Partridge', rank: 'KOMJENPOL', status: 'Aktif' },
  { id: 'm3', name: 'Fanzy_Zull', rank: 'IRJENPOL', status: 'Aktif' },
  { id: 'm4', name: 'Theodore_Khareem', rank: 'BRIGJENPOL', status: 'Aktif' },
  { id: 'm5', name: 'Gond_Echizen', rank: 'KOMBESPOL', status: 'Aktif' },
  { id: 'm6', name: 'Paul_Lobare', rank: 'KOMPOL', status: 'Aktif' },
  { id: 'm7', name: 'Tatang_Suherman', rank: 'KOMPOL', status: 'Aktif' },
];

// Helper to generate a realistic duty
const generateDuty = (weeksAgo: number, isDraft: boolean = false): DutyFaction => {
  const date = subDays(new Date('2026-08-30T12:00:00Z'), weeksAgo * 7);
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 }); // Sunday
  const weekNumber = 35 - weeksAgo;

  return {
    id: `d${weekNumber}`,
    title: `DUTY FACTION MINGGU ${weekNumber}`,
    startDate: formatISO(start),
    endDate: formatISO(end),
    description: `Kegiatan operasional Kepolisian Futuristic Daerah Las Venturas selama minggu berjalan. Laporan ini mencakup patroli rutin, penanganan laporan masyarakat, dan pelatihan internal anggota divisi.`,
    photoUrl: isDraft ? null : `https://images.unsplash.com/photo-1555848962-6e79363ec58f?q=72&w=1200&auto=format&fit=crop`,
    status: isDraft ? 'DRAF' : (weeksAgo === 0 ? 'DIPUBLIKASIKAN' : 'DIARSIPKAN'),
    createdAt: formatISO(subDays(end, 2)),
    publishedAt: isDraft ? null : formatISO(subDays(end, 1)),
  };
};

export const mockDuties: DutyFaction[] = [
  generateDuty(0), // Minggu 35
  generateDuty(1), // Minggu 34
  generateDuty(2), // Minggu 33
];
