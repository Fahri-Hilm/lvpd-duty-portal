import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

const chartData = [
  { name: 'W1', reports: 12 },
  { name: 'W2', reports: 19 },
  { name: 'W3', reports: 15 },
  { name: 'W4', reports: 22 },
  { name: 'W5', reports: 28 },
  { name: 'W6', reports: 24 },
] as const;

export default function ActivityChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '12px', color: '#f8fafc' }}
          itemStyle={{ color: '#60a5fa' }}
          cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Area type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
