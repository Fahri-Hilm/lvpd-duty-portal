import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const adminChartData = [
  { day: 'Sen', reports: 2 },
  { day: 'Sel', reports: 5 },
  { day: 'Rab', reports: 3 },
  { day: 'Kam', reports: 7 },
  { day: 'Jum', reports: 4 },
  { day: 'Sab', reports: 8 },
  { day: 'Min', reports: 5 },
] as const;

export default function AdminActivityChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={adminChartData}>
        <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '12px', color: '#f8fafc' }}
          itemStyle={{ color: '#60a5fa' }}
          cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#0f172a', stroke: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#3b82f6' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
