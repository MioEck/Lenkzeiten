import { Outlet } from 'react-router-dom';
import NavBar from './NavBar.jsx';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <NavBar />
      <main className="flex-1 pb-24 md:pb-8">
        <Outlet />
      </main>
    </div>
  );
}
