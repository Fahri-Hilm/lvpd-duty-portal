import { differenceInCalendarDays, startOfWeek } from 'date-fns';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import type { DutyFaction } from '../types';

const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'] as const;

type AdminActivityChartProps = {
  readonly duties: readonly DutyFaction[];
};

export default function AdminActivityChart({ duties }: AdminActivityChartProps) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const chartData = days.map((day, index) => ({
    day,
    reports: duties.filter(duty => differenceInCalendarDays(new Date(duty.createdAt), weekStart) === index).length,
  }));
  const total = chartData.reduce((sum, item) => sum + item.reports, 0);

  return (
    <div className="h-full w-full">
      <p className="sr-only">Grafik laporan minggu berjalan dari Senin sampai Minggu. Total {total} laporan.</p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '12px', color: '#f8fafc' }} itemStyle={{ color: '#60a5fa' }} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#0f172a', stroke: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#3b82f6' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
