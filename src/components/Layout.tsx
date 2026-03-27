import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import TrendingTicker from './TrendingTicker';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Header />
      <TrendingTicker />
      <main className="flex-1 pb-20 md:pb-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
