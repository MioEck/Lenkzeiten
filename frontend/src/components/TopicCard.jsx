import { useNavigate } from 'react-router-dom';

const colorMap = {
  orange: {
    border: 'border-orange-700',
    bg: 'bg-orange-950/40',
    accent: 'bg-orange-500',
    text: 'text-orange-300',
    hover: 'hover:border-orange-500 hover:bg-orange-950/60',
    glow: 'hover:shadow-orange-900/30',
  },
  blue: {
    border: 'border-blue-700',
    bg: 'bg-blue-950/40',
    accent: 'bg-blue-500',
    text: 'text-blue-300',
    hover: 'hover:border-blue-500 hover:bg-blue-950/60',
    glow: 'hover:shadow-blue-900/30',
  },
  green: {
    border: 'border-emerald-700',
    bg: 'bg-emerald-950/40',
    accent: 'bg-emerald-500',
    text: 'text-emerald-300',
    hover: 'hover:border-emerald-500 hover:bg-emerald-950/60',
    glow: 'hover:shadow-emerald-900/30',
  },
  purple: {
    border: 'border-purple-700',
    bg: 'bg-purple-950/40',
    accent: 'bg-purple-500',
    text: 'text-purple-300',
    hover: 'hover:border-purple-500 hover:bg-purple-950/60',
    glow: 'hover:shadow-purple-900/30',
  },
  red: {
    border: 'border-red-700',
    bg: 'bg-red-950/40',
    accent: 'bg-red-500',
    text: 'text-red-300',
    hover: 'hover:border-red-500 hover:bg-red-950/60',
    glow: 'hover:shadow-red-900/30',
  },
  gray: {
    border: 'border-slate-600',
    bg: 'bg-slate-800/40',
    accent: 'bg-slate-500',
    text: 'text-slate-300',
    hover: 'hover:border-slate-400 hover:bg-slate-800/60',
    glow: 'hover:shadow-slate-700/30',
  },
};

export default function TopicCard({ emoji, title, summary, color = 'orange', link, rules = [] }) {
  const navigate = useNavigate();
  const c = colorMap[color] || colorMap.orange;

  const handleClick = () => {
    if (link) navigate(link);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative rounded-2xl border ${c.border} ${c.bg} ${c.hover} p-5 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl ${c.glow} hover:-translate-y-0.5 group`}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl leading-none">{emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-base ${c.text} leading-tight`}>{title}</h3>
          <p className="text-slate-400 text-sm mt-0.5 leading-snug">{summary}</p>
        </div>
        {link && (
          <span className="text-slate-500 group-hover:text-slate-300 transition-colors text-lg">→</span>
        )}
      </div>
      {rules.length > 0 && (
        <ul className="space-y-1.5 mt-3 border-t border-slate-700/50 pt-3">
          {rules.map((rule, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className={`w-1.5 h-1.5 rounded-full ${c.accent} mt-1.5 flex-shrink-0`} />
              <span className="text-slate-300">{rule}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
