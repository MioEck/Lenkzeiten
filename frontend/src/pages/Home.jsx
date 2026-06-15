import { useNavigate } from 'react-router-dom';
import TopicCard from '../components/TopicCard.jsx';
import TimelineBar from '../components/TimelineBar.jsx';

const topics = [
  {
    emoji: '🕐',
    title: 'Tageslenkezeit',
    summary: 'Max. 9h pro Tag, 2x/Woche bis 10h',
    color: 'orange',
    rules: [
      'Max. 9 Stunden täglich',
      '2x pro Woche auf 10h verlängerbar',
      'Zählung zwischen zwei Ruhezeiten',
    ],
  },
  {
    emoji: '📅',
    title: 'Wochenlenkezeit',
    summary: 'Max. 56h/Woche, 90h in 2 Wochen',
    color: 'blue',
    rules: [
      'Max. 56 Stunden pro Woche',
      'Max. 90 Stunden in 2 aufeinanderfolgenden Wochen',
      'Woche: Montag 00:00 bis Sonntag 24:00',
    ],
  },
  {
    emoji: '😴',
    title: 'Ruhezeiten',
    summary: 'Mind. 11h täglich, 45h wöchentlich',
    color: 'green',
    rules: [
      'Tagesruhezeit mind. 11h (oder 9h reduziert, max. 3x)',
      'Wöchentliche Ruhezeit mind. 45h regulär',
      'Reduziert auf 24h möglich (Nachholung erforderlich)',
    ],
  },
  {
    emoji: '💬',
    title: 'Fragen stellen',
    summary: 'KI-Assistent auf Basis des Fachbuchs',
    color: 'purple',
    link: '/chat',
    rules: [
      'Basiert auf dem Buch von Bopp & Faßbender',
      'Präzise Antworten mit Verordnungsreferenzen',
      'Konkrete Berechnungsbeispiele',
    ],
  },
  {
    emoji: '⚡',
    title: 'Sonderregelungen',
    summary: '12-Tage-Regel, Bus-Ausnahmen',
    color: 'red',
    rules: [
      '12-Tage-Regel für grenzüberschr. Reisebusse',
      'Linienverkehr <50 km: nationale Regeln',
      'AETR für Fahrten in Drittländer',
    ],
  },
  {
    emoji: '💶',
    title: 'Bußgelder',
    summary: 'Sanktionen und Strafen',
    color: 'gray',
    rules: [
      'Lenkzeitüberschreitung: 30–500 EUR',
      'Pausenverstoß: 30–250 EUR',
      'Schwere Verstöße: Fahrverbot möglich',
    ],
  },
];

const quickTimeline = [
  { start: 0, end: 4.5, type: 'drive', label: 'Fahrt 4,5h' },
  { start: 4.5, end: 5.25, type: 'break', label: '45min Pause' },
  { start: 5.25, end: 9.75, type: 'drive', label: 'Fahrt 4,5h' },
  { start: 9.75, end: 20.75, type: 'rest', label: 'Ruhezeit 11h' },
  { start: 20.75, end: 24, type: 'free', label: '' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-orange-950/50 border border-orange-800 rounded-full px-4 py-1.5 text-xs text-orange-300 font-medium mb-4">
          <span>🚛</span>
          <span>EU-Verordnung 561/2006</span>
        </div>
        <h1 className="text-3xl font-extrabold mb-2">
          <span className="text-gradient">Lenk- &amp; Ruhezeiten</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          Alle wichtigen Vorschriften auf einen Blick – powered by KI und dem Fachbuch von Bopp &amp; Faßbender.
        </p>
      </div>

      {/* Quick CTA */}
      <div className="card mb-6 bg-gradient-to-r from-orange-950/60 to-slate-800 border-orange-700">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-orange-300 mb-1">Frage stellen</h2>
            <p className="text-sm text-slate-400">KI-Assistent beantwortet alle Fragen zu Lenk- und Ruhezeiten</p>
          </div>
          <button
            onClick={() => navigate('/chat')}
            className="btn-primary whitespace-nowrap"
          >
            Chat öffnen →
          </button>
        </div>
      </div>

      {/* Typischer Tag */}
      <div className="card mb-6">
        <h2 className="font-bold text-slate-200 mb-1">Typischer Fahrertag</h2>
        <p className="text-xs text-slate-400 mb-4">Normaltag: 9h Lenkzeit + 45min Pause + 11h Ruhezeit</p>
        <TimelineBar segments={quickTimeline} />
      </div>

      {/* Topic cards grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {topics.map((topic, i) => (
          <TopicCard key={i} {...topic} />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-slate-600 mt-8">
        Basierend auf EU-VO 561/2006 • Kein Rechtsrat • Stand 2022
      </p>
    </div>
  );
}
