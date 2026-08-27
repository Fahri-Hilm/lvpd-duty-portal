export type DutyStatus = 'DRAF' | 'DIPUBLIKASIKAN' | 'DIARSIPKAN';

export interface DutyFaction {
  id: string;
  title: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  description: string;
  photoUrl: string | null;
  status: DutyStatus;
  createdAt: string;
  publishedAt: string | null;
}

export type MemberStatus = 'Aktif' | 'Nonaktif';

export interface Member {
  id: string;
  name: string;
  rank: string;
  status: MemberStatus;
}

export interface Rank {
  id: string;
  name: string;
  level: number;
}
