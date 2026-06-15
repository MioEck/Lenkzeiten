import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

export default function TimeGauge({ label, used, max, unit = 'h', color = '#f97316' }) {
  const percentage = Math.min((used / max) * 100, 100);
  const remaining = Math.max(max - used, 0);

  const statusColor =
    percentage >= 90 ? '#ef4444' : percentage >= 75 ? '#f59e0b' : '#22c55e';

  const data = [{ value: percentage, fill: statusColor }];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="90%"
            startAngle={220}
            endAngle={-40}
            data={data}
            barSize={12}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: '#1e293b' }}
              dataKey="value"
              angleAxisId={0}
              cornerRadius={6}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{used}{unit}</span>
          <span className="text-xs text-slate-400">von {max}{unit}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-200">{label}</p>
        <p className="text-xs" style={{ color: statusColor }}>
          {remaining}{unit} verbleibend
        </p>
      </div>
    </div>
  );
}
