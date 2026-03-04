import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Trophy, Cat, LogOut, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
}
export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, title }) => {
  // Zustand selectors - Primitives only for performance and to avoid re-render loops
  const xpTotal = useAuthStore(state => state.user?.xpTotal);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* 
        Root Container wrapper following non-negotiables:
        max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 sm:py-8 md:py-10 lg:py-12
      */}
      <div className="w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-8 md:py-10 lg:py-12 flex justify-center items-start min-h-screen sm:min-h-0">
        {/* Mobile container - Simulated phone frame on desktop */}
        <div className={cn(
          "w-full max-w-md bg-white flex flex-col relative",
          "min-h-screen sm:min-h-[850px] sm:max-h-[90vh]",
          "sm:rounded-[40px] sm:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)]",
          "sm:border-[8px] sm:border-slate-900 sm:overflow-hidden",
          "border-x-0 sm:border-x-[8px] border-black/5"
        )}>
          {/* Sticky Header */}
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b-2 border-black/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center border-2 border-black/10 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] rotate-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-black text-xl text-slate-900 tracking-tight">{title || 'Spojka'}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 px-3 py-1.5 rounded-full border-2 border-blue-100 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(37,99,235,0.1)]">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">XP</span>
                <span className="text-sm font-black text-blue-700 tabular-nums">{xpTotal ?? 0}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout} 
                className="h-9 w-9 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <LogOut className="w-4 h-4 text-slate-400" />
              </Button>
            </div>
          </header>
          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24 scrollbar-hide">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
          {/* Navigation Bar - Fixed within the mobile container */}
          <nav className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t-2 border-black/5 px-8 py-4 flex justify-between items-center z-50 rounded-b-none sm:rounded-b-[32px]">
            <NavIcon to="/feed" icon={<Home className="w-6 h-6" />} label="Feed" />
            <NavIcon to="/mascot" icon={<Cat className="w-6 h-6" />} label="Mascot" />
            <NavIcon to="/leaderboard" icon={<Trophy className="w-6 h-6" />} label="Ranks" />
          </nav>
        </div>
      </div>
    </div>
  );
};
const NavIcon = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex flex-col items-center gap-1.5 transition-all duration-300 group",
      isActive ? "text-blue-600 scale-105" : "text-slate-400 hover:text-slate-600"
    )}
  >
    <div className={cn(
      "p-2.5 rounded-2xl border-2 transition-all duration-300",
      "group-[.active]:bg-blue-50 group-[.active]:border-blue-600 group-[.active]:shadow-[4px_4px_0px_0px_rgba(37,99,235,0.15)]",
      "border-transparent"
    )}>
      {icon}
    </div>
    <span className="text-[9px] font-black uppercase tracking-[0.15em]">{label}</span>
  </NavLink>
);