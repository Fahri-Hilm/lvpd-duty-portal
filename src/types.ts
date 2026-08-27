export type DutyStatus = 'DRAF' | 'DIPUBLIKASIKAN' | 'DIARSIPKAN';

export interface DutyFaction {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  photoUrl: string | null;
  status: DutyStatus;
  createdAt: string;
  publishedAt: string | null;
}

export interface Profile {
  id: string;
  full_name: string;
  rank: string;
  email: string;
  role: 'admin' | 'commander' | 'analyst';
  codename: string | null;
  status: 'active' | 'standby' | 'deployed' | 'offline';
  specialization: string[];
  mission_count: number;
  portrait_url: string | null;
  created_at: string;
}

export type UserStatus = Profile['status'];
