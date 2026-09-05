import { useEffect, useRef } from 'react';
import { BadgeCheck, Mail, Shield, Target, X } from 'lucide-react';
import type { Profile } from '../types';

const statusLabel: Record<Profile['status'], string> = {
  active: 'Aktif',
  deployed: 'Bertugas',
  standby: 'Siaga',
  offline: 'Tidak aktif',
};

type MemberDrawerProps = {
  readonly member: Profile | null;
  readonly onClose: () => void;
};

export function MemberDrawer({ member, onClose }: MemberDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (member && !dialog.open) dialog.showModal();
    if (!member && dialog.open) dialog.close();
  }, [member]);

  return (
    <dialog ref={dialogRef} onClose={onClose} onCancel={onClose} onClick={event => event.target === event.currentTarget && onClose()}
      className="member-drawer m-0 ml-auto h-dvh w-full max-w-md border-l border-slate-700 bg-slate-950 p-0 text-slate-100 backdrop:bg-slate-950/80">
      {member && (
        <div className="flex min-h-full flex-col">
          <header className="flex items-center justify-between border-b border-slate-800 p-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-400">Berkas personil</p>
              <h2 className="mt-1 font-display text-2xl font-bold uppercase">Detail anggota</h2>
            </div>
            <button type="button" onClick={onClose} aria-label="Tutup detail anggota" className="border border-slate-700 p-2 text-slate-400 transition-colors hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 space-y-8 overflow-y-auto p-6">
            <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-5">
              <div className="aspect-square overflow-hidden border border-slate-700 bg-slate-900">
                {member.portrait_url ? <img src={member.portrait_url} alt={`Potret ${member.full_name}`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center font-display text-3xl font-bold text-slate-600">{member.full_name.charAt(0)}</div>}
              </div>
              <div className="min-w-0 self-center">
                <h3 className="text-xl font-semibold text-slate-50">{member.full_name}</h3>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">{member.rank}</p>
                {member.codename && <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-cyan-400">{member.codename}</p>}
              </div>
            </div>

            <dl className="divide-y divide-slate-800 border-y border-slate-800">
              <div className="flex items-center justify-between gap-4 py-4"><dt className="flex items-center gap-2 text-xs text-slate-500"><BadgeCheck className="h-4 w-4" />Status</dt><dd className="text-xs font-semibold text-slate-200">{statusLabel[member.status]}</dd></div>
              <div className="flex items-center justify-between gap-4 py-4"><dt className="flex items-center gap-2 text-xs text-slate-500"><Target className="h-4 w-4" />Jumlah misi</dt><dd className="font-display text-xl font-bold tabular-nums text-slate-100">{member.mission_count}</dd></div>
              <div className="flex items-start justify-between gap-4 py-4"><dt className="flex items-center gap-2 text-xs text-slate-500"><Shield className="h-4 w-4" />Spesialisasi</dt><dd className="max-w-52 text-right text-xs font-semibold text-slate-200">{member.specialization.length > 0 ? member.specialization.join(', ') : 'Belum ditentukan'}</dd></div>
              <div className="flex items-start justify-between gap-4 py-4"><dt className="flex items-center gap-2 text-xs text-slate-500"><Mail className="h-4 w-4" />Email</dt><dd className="max-w-52 break-all text-right text-xs font-semibold text-slate-200">{member.email}</dd></div>
            </dl>
          </div>
        </div>
      )}
    </dialog>
  );
}
