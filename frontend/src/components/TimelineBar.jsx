const SEGMENTS = [
  { start: 0, end: 4.5, type: 'drive', label: 'Fahrt 4,5h' },
  { start: 4.5, end: 5.25, type: 'break', label: 'Pause 45min' },
  { start: 5.25, end: 9.75, type: 'drive', label: 'Fahrt 4,5h' },
  { start: 9.75, end: 20.75, type: 'rest', label: 'Ruhezeit 11h' },
  { start: 20.75, end: 24, type: 'free', label: '' },
];

const typeConfig = {
  drive: { bg: 'bg-orange-500', label: 'text-orange-200', legend: 'Lenkzeit', legendBg: 'bg-orange-500' },
  break: { bg: 'bg-amber-400', label: 'text-amber-900', legend: 'Pause', legendBg: 'bg-amber-400' },
  rest: { bg: 'bg-emerald-600', label: 'text-emerald-100', legend: 'Ruhezeit', legendBg: 'bg-emerald-600' },
  free: { bg: 'bg-slate-700', label: 'text-slate-400', legend: '', legendBg: '' },
};

export default function TimelineBar({ segments = SEGMENTS, totalHours = 24 }) {
  const segs = segments || SEGMENTS;

  return (
    <div className="w-full">
      {/* Hour markers */}
      <div className="flex justify-between text-xs text-slate-500 mb-1 px-0.5">
        {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>

      {/* Timeline bar */}
      <div className="relative h-10 flex rounded-xl overflow-hidden border border-slate-700">
        {segs.map((seg, i) => {
          const width = ((seg.end - seg.start) / totalHours) * 100;
          const cfg = typeConfig[seg.type] || typeConfig.free;
          return (
            <div
              key={i}
              className={`relative ${cfg.bg} flex items-center justify-center overflow-hidden`}
              style={{ width: `${width}%` }}
              title={seg.label}
            >
              {seg.label && width > 8 && (
                <span className={`text-xs font-medium ${cfg.label} truncate px-1 select-none`}>
                  {seg.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3">
        {[
          { type: 'drive', label: 'Lenkzeit' },
          { type: 'break', label: 'Pause' },
          { type: 'rest', label: 'Ruhezeit' },
        ].map(({ type, label }) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${typeConfig[type].legendBg}`} />
            <span className="text-xs text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
