import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Start', emoji: '🏠' },
  { to: '/regelungen', label: 'Regelungen', emoji: '📋' },
  { to: '/chat', label: 'KI-Chat', emoji: '💬' },
];

export default function NavBar() {
  const location = useLocation();

  return (
    <>
      {/* Desktop top bar */}
      <header className="hidden md:flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚛</span>
          <div>
            <h1 className="text-lg font-bold text-gradient leading-none">LenkApp</h1>
            <p className="text-xs text-slate-400">Lenk- und Ruhezeiten</p>
          </div>
        </div>
        <nav className="flex gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span>{item.emoji}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Mobile header */}
      <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <span className="text-xl">🚛</span>
        <div>
          <h1 className="text-base font-bold text-gradient leading-none">LenkApp</h1>
          <p className="text-xs text-slate-400">Lenk- &amp; Ruhezeiten</p>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 flex">
        {navItems.map((item) => {
          const isActive =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors duration-150"
            >
              <span className={`text-xl ${isActive ? 'opacity-100' : 'opacity-50'}`}>{item.emoji}</span>
              <span className={isActive ? 'text-orange-400' : 'text-slate-400'}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
