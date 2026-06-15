import TimeGauge from '../components/TimeGauge.jsx';
import TimelineBar from '../components/TimelineBar.jsx';

const RULES_CARDS = [
  {
    title: 'Tageslenkezeit',
    emoji: '🕐',
    color: 'orange',
    limit: 'Max. 9 Stunden (2×/Woche bis 10h)',
    status: 'green',
    details: [
      { label: 'Regelfall', value: '9 Stunden', badge: 'green' },
      { label: 'Ausnahme', value: '10 Stunden (max. 2×/Woche)', badge: 'yellow' },
      { label: 'Verstoß ab', value: 'Überschreitung der Grenze', badge: 'red' },
    ],
    law: 'Art. 6 Abs. 1 EU-VO 561/2006',
  },
  {
    title: 'Wochenlenkezeit',
    emoji: '📅',
    color: 'blue',
    limit: 'Max. 56 Stunden',
    status: 'yellow',
    details: [
      { label: 'Wöchentlich max.', value: '56 Stunden', badge: 'yellow' },
      { label: '2-Wochen max.', value: '90 Stunden', badge: 'red' },
    ],
    law: 'Art. 6 Abs. 2-3 EU-VO 561/2006',
  },
  {
    title: 'Lenkunterbrechung',
    emoji: '☕',
    color: 'amber',
    limit: 'Nach 4,5h mind. 45 Min Pause',
    status: 'green',
    details: [
      { label: 'Spätestens nach', value: '4,5 Stunden Fahrt', badge: 'yellow' },
      { label: 'Pausendauer', value: 'Mind. 45 Minuten', badge: 'green' },
      { label: 'Aufteilung', value: '15 Min + 30 Min (in dieser Reihenfolge)', badge: 'green' },
    ],
    law: 'Art. 7 EU-VO 561/2006',
  },
  {
    title: 'Tagesruhezeit',
    emoji: '🌙',
    color: 'green',
    limit: 'Mind. 11h (oder 9h reduziert)',
    status: 'green',
    details: [
      { label: 'Regulär', value: 'Mind. 11 Stunden', badge: 'green' },
      { label: 'Reduziert', value: '9 Stunden (max. 3×/Woche)', badge: 'yellow' },
      { label: 'Geteilt', value: '3h + 9h (= reguläre Ruhezeit)', badge: 'green' },
    ],
    law: 'Art. 8 Abs. 1-5 EU-VO 561/2006',
  },
  {
    title: 'Wöchentliche Ruhezeit',
    emoji: '🏠',
    color: 'purple',
    limit: 'Mind. 45h regulär / 24h reduziert',
    status: 'yellow',
    details: [
      { label: 'Regulär', value: 'Mind. 45 Stunden', badge: 'green' },
      { label: 'Reduziert', value: 'Mind. 24 Stunden', badge: 'yellow' },
      { label: 'Kompensation', value: 'Bis Ende 3. Folgewoche nachholen', badge: 'red' },
      { label: 'Frequenz', value: 'Spätestens nach 6 × 24-Stunden-Perioden', badge: 'yellow' },
    ],
    law: 'Art. 8 Abs. 6-9 EU-VO 561/2006',
  },
  {
    title: '12-Tage-Regelung',
    emoji: '🚌',
    color: 'red',
    limit: 'Nur grenzüberschr. Gelegenheitsverkehr',
    status: 'red',
    details: [
      { label: 'Voraussetzung', value: 'Grenzüberschreitend + Gelegenheitsverkehr', badge: 'yellow' },
      { label: 'Erlaubnis', value: '12 Fahrtage am Stück', badge: 'red' },
      { label: 'Vorher/Nachher', value: 'Je reguläre Wochenruhezeit (45h)', badge: 'yellow' },
    ],
    law: 'Art. 29 EU-VO 1073/2009',
  },
];

const colorVariants = {
  orange: { border: 'border-orange-700', title: 'text-orange-300', bg: 'bg-orange-950/30' },
  blue: { border: 'border-blue-700', title: 'text-blue-300', bg: 'bg-blue-950/30' },
  amber: { border: 'border-amber-700', title: 'text-amber-300', bg: 'bg-amber-950/30' },
  green: { border: 'border-emerald-700', title: 'text-emerald-300', bg: 'bg-emerald-950/30' },
  purple: { border: 'border-purple-700', title: 'text-purple-300', bg: 'bg-purple-950/30' },
  red: { border: 'border-red-700', title: 'text-red-300', bg: 'bg-red-950/30' },
};

function BadgeDot({ badge }) {
  const cls = {
    green: 'badge-green',
    yellow: 'badge-yellow',
    red: 'badge-red',
  }[badge] || 'badge-green';
  return <span className={cls}>●</span>;
}

const TIMELINE_EXAMPLES = [
  {
    title: 'Normaltag (9h)',
    segments: [
      { start: 0, end: 4.5, type: 'drive', label: 'Fahrt 4,5h' },
      { start: 4.5, end: 5.25, type: 'break', label: '45min' },
      { start: 5.25, end: 9.75, type: 'drive', label: 'Fahrt 4,5h' },
      { start: 9.75, end: 20.75, type: 'rest', label: 'Ruhezeit 11h' },
      { start: 20.75, end: 24, type: 'free', label: '' },
    ],
  },
  {
    title: 'Verlängerter Tag (10h)',
    segments: [
      { start: 0, end: 4.5, type: 'drive', label: 'Fahrt 4,5h' },
      { start: 4.5, end: 5.25, type: 'break', label: '45min' },
      { start: 5.25, end: 10.25, type: 'drive', label: 'Fahrt 5h' },
      { start: 10.25, end: 19.25, type: 'rest', label: 'Ruhezeit 9h (red.)' },
      { start: 19.25, end: 24, type: 'free', label: '' },
    ],
  },
  {
    title: 'Geteilte Pause (15+30 Min)',
    segments: [
      { start: 0, end: 2, type: 'drive', label: 'Fahrt 2h' },
      { start: 2, end: 2.25, type: 'break', label: '15min' },
      { start: 2.25, end: 4.75, type: 'drive', label: 'Fahrt 2,5h' },
      { start: 4.75, end: 5.25, type: 'break', label: '30min' },
      { start: 5.25, end: 9.75, type: 'drive', label: 'Fahrt 4,5h' },
      { start: 9.75, end: 20.75, type: 'rest', label: 'Ruhezeit 11h' },
      { start: 20.75, end: 24, type: 'free', label: '' },
    ],
  },
];

export default function Regelungen() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gradient mb-1">Regelungen im Überblick</h1>
        <p className="text-sm text-slate-400">Visuelle Darstellung der EU-VO 561/2006</p>
      </div>

      {/* Gauges */}
      <div className="card mb-6">
        <h2 className="font-bold text-slate-200 mb-4">Zeitlimits – Beispielwerte</h2>
        <div className="grid grid-cols-3 gap-4">
          <TimeGauge label="Heute" used={7.5} max={9} />
          <TimeGauge label="Diese Woche" used={42} max={56} />
          <TimeGauge label="2 Wochen" used={78} max={90} />
        </div>
        <p className="text-xs text-slate-500 text-center mt-3">
          Beispielwerte zur Veranschaulichung • Grün ≤75% • Gelb ≤90% • Rot &gt;90%
        </p>
      </div>

      {/* Timeline examples */}
      <div className="card mb-6">
        <h2 className="font-bold text-slate-200 mb-4">Tagesbeispiele Zeitleiste</h2>
        <div className="space-y-6">
          {TIMELINE_EXAMPLES.map((ex, i) => (
            <div key={i}>
              <p className="text-sm font-semibold text-slate-300 mb-2">{ex.title}</p>
              <TimelineBar segments={ex.segments} />
            </div>
          ))}
        </div>
      </div>

      {/* Rules cards */}
      <h2 className="font-bold text-slate-200 mb-3">Regelkarten</h2>
      <div className="space-y-3">
        {RULES_CARDS.map((card, i) => {
          const c = colorVariants[card.color] || colorVariants.orange;
          return (
            <div key={i} className={`rounded-2xl border ${c.border} ${c.bg} p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{card.emoji}</span>
                <div className="flex-1">
                  <h3 className={`font-bold text-sm ${c.title}`}>{card.title}</h3>
                  <p className="text-xs text-slate-400">{card.limit}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {card.details.map((d, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <BadgeDot badge={d.badge} />
                    <span className="text-xs text-slate-400 w-24 flex-shrink-0">{d.label}:</span>
                    <span className="text-xs text-slate-200">{d.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-600 mt-2 pt-2 border-t border-slate-800">{card.law}</p>
            </div>
          );
        })}
      </div>

      {/* Bussgelder table */}
      <div className="card mt-6">
        <h2 className="font-bold text-slate-200 mb-3">💶 Bußgeldübersicht (Deutschland)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium pb-2 pr-4">Verstoß</th>
                <th className="text-left text-slate-400 font-medium pb-2 pr-4">Fahrer</th>
                <th className="text-left text-slate-400 font-medium pb-2">Unternehmer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                ['Lenkzeit +1-60 Min', '30–100 €', '—'],
                ['Lenkzeit +1-2h', '150–250 €', 'bis 500 €'],
                ['Lenkzeit >2h', '250–500 €', 'bis 1.500 €'],
                ['Pause verkürzt', '30–250 €', 'bis 500 €'],
                ['Keine Pause nach 4,5h', '250 €', '500 €'],
                ['Tagesruhezeit verkürzt', '30–250 €', 'bis 500 €'],
                ['Wochenruhezeit verkürzt', '250–1.500 €', 'bis 2.000 €'],
                ['Keine Fahrerkarte', '250 €', '—'],
                ['Tachomanipulation', '—', 'bis 5.000 € + Strafanzeige'],
              ].map(([verstos, fahrer, unternehmer], i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2 pr-4 text-slate-300">{verstos}</td>
                  <td className="py-2 pr-4 text-red-300 font-medium">{fahrer}</td>
                  <td className="py-2 text-amber-300 font-medium">{unternehmer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-600 mt-3">Gemäß deutschem Bußgeldkatalog (DSGV) • Keine Rechtsberatung</p>
      </div>

      <p className="text-center text-xs text-slate-600 mt-8 pb-4">
        Basierend auf EU-VO 561/2006 • Stand 2022 • Kein Rechtsrat
      </p>
    </div>
  );
}
