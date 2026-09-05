import { getISOWeek, getISOWeekYear, subWeeks } from 'date-fns';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { DutyFaction } from '../types';

type ActivityChartProps = {
  readonly duties: readonly DutyFaction[];
};

export default function ActivityChart({ duties }: ActivityChartProps) {
  const now = new Date();
  const chartData = Array.from({ length: 6 }, (_, index) => {
    const date = subWeeks(now, 5 - index);
    const week = getISOWeek(date);
    const year = getISOWeekYear(date);
    return {
      name: `M${week}`,
      reports: duties.filter(duty => {
        const created = new Date(duty.createdAt);
        return getISOWeek(created) === week && getISOWeekYear(created) === year;
      }).length,
    };
  });
  const total = chartData.reduce((sum, item) => sum + item.reports, 0);

  return (
    <div className="h-full w-full">
      <p className="sr-only">Grafik jumlah laporan selama enam minggu terakhir. Total {total} laporan.</p>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          <defs><linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
          <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '12px', color: '#f8fafc' }} itemStyle={{ color: '#60a5fa' }} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
