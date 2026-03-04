import React, { useEffect } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAppStore } from '@/store/appStore';
import { Trophy, Users, ArrowUp, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
export const LeaderboardPage: React.FC = () => {
  const classes = useAppStore(s => s.classes);
  const isLoading = useAppStore(s => s.isLoadingClasses);
  const fetchClasses = useAppStore(s => s.fetchClasses);
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);
  // Calculate normalized XP: total XP / member count
  const rankedClasses = [...(classes ?? [])]
    .map(c => ({
      ...c,
      normalizedXp: Math.round(c.totalXp / (c.memberCount || 1))
    }))
    .sort((a, b) => b.normalizedXp - a.normalizedXp);
  return (
    <MobileLayout title="Rang Lista">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <RefreshCcw className="w-16 h-16 text-blue-600 animate-spin opacity-20" />
              <Trophy className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Računam Standings...</p>
          </div>
        ) : rankedClasses.length > 0 ? (
          <>
            {/* Top 3 Podium Visual */}
            <div className="flex items-end justify-center gap-4 pt-12 pb-6 h-72">
              {/* Rank 2 - Silver */}
              <div className="flex flex-col items-center group transition-transform hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl border-4 border-slate-300 bg-white mb-3 overflow-hidden flex items-center justify-center font-black text-slate-400 shadow-[4px_4px_0px_0px_rgba(203,213,225,0.5)]">2</div>
                <div className="w-24 h-28 bg-slate-200 rounded-t-3xl border-x-4 border-t-4 border-slate-300 flex flex-col items-center justify-center p-3 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,0.02)]">
                  <span className="text-[10px] font-black text-slate-600 truncate w-full uppercase tracking-tighter">{rankedClasses[1]?.name || '---'}</span>
                  <div className="mt-2 bg-slate-300/50 px-2 py-0.5 rounded-full text-[10px] font-black text-slate-600">{rankedClasses[1]?.normalizedXp || 0} XP</div>
                </div>
              </div>
              {/* Rank 1 - Gold */}
              <div className="flex flex-col items-center z-10 scale-110 group transition-transform hover:-translate-y-1">
                <Trophy className="w-10 h-10 text-yellow-500 mb-2 animate-bounce drop-shadow-md" />
                <div className="w-18 h-18 rounded-3xl border-4 border-yellow-400 bg-white mb-3 overflow-hidden flex items-center justify-center font-black text-yellow-600 text-2xl shadow-[6px_6px_0px_0px_rgba(250,204,21,0.3)]">1</div>
                <div className="w-28 h-36 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-t-3xl border-x-4 border-t-4 border-yellow-600/20 flex flex-col items-center justify-center p-3 text-center shadow-[12px_12px_0px_0px_rgba(250,204,21,0.1)]">
                   <span className="text-[11px] font-black text-white truncate w-full uppercase tracking-tighter">{rankedClasses[0]?.name || '---'}</span>
                   <div className="mt-3 bg-white/20 px-3 py-1 rounded-full text-[12px] font-black text-white shadow-sm border border-white/10">{rankedClasses[0]?.normalizedXp || 0} XP</div>
                </div>
              </div>
              {/* Rank 3 - Bronze */}
              <div className="flex flex-col items-center group transition-transform hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl border-4 border-amber-600 bg-white mb-3 overflow-hidden flex items-center justify-center font-black text-amber-700 shadow-[4px_4px_0px_0px_rgba(180,83,9,0.2)]">3</div>
                <div className="w-24 h-20 bg-amber-700 rounded-t-3xl border-x-4 border-t-4 border-amber-800 flex flex-col items-center justify-center p-3 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,0.02)]">
                  <span className="text-[10px] font-black text-amber-100/90 truncate w-full uppercase tracking-tighter">{rankedClasses[2]?.name || '---'}</span>
                  <div className="mt-2 bg-amber-800/40 px-2 py-0.5 rounded-full text-[10px] font-black text-amber-100/70">{rankedClasses[2]?.normalizedXp || 0} XP</div>
                </div>
              </div>
            </div>
            {/* List Header */}
            <div className="bg-white rounded-[32px] border-4 border-black/5 overflow-hidden shadow-playful-lg">
              <div className="bg-slate-50/80 backdrop-blur-sm px-6 py-5 border-b-4 border-black/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-400" />
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Odeljenska Tabela</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Live</span>
                </div>
              </div>
              <div className="divide-y-2 divide-black/5">
                {rankedClasses.map((c, index) => (
                  <div
                    key={c.id}
                    className={cn(
                      "px-6 py-5 flex items-center gap-5 transition-all duration-300",
                      index === 0 ? "bg-yellow-50/20" : "hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border-2 transition-transform hover:scale-105",
                      index === 0 ? "bg-yellow-400 border-yellow-600 text-white shadow-sm" :
                      index === 1 ? "bg-slate-200 border-slate-300 text-slate-600" :
                      index === 2 ? "bg-amber-100 border-amber-300 text-amber-700" :
                      "bg-white border-slate-100 text-slate-400"
                    )}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-800 text-base tracking-tight">{c.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Users className="w-3.5 h-3.5" />
                          {c.memberCount} Učenika
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5 text-blue-600 font-black text-2xl tracking-tighter tabular-nums">
                        {c.normalizedXp}
                        <ArrowUp className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prosek</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="py-32 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto border-4 border-dashed border-slate-200">
              <Trophy className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Nema podataka o rang listi.</p>
          </div>
        )}
        {/* Explain Card */}
        <div className="p-6 bg-blue-50/50 rounded-3xl border-4 border-dashed border-blue-100/50 transition-colors hover:bg-blue-50/80">
           <p className="text-[11px] text-blue-700/60 text-center font-bold leading-relaxed uppercase tracking-widest">
             Rang lista se računa deljenjem ukupnog XP-a odeljenja sa brojem učenika. Fer borba za sve veličine odeljenja!
           </p>
        </div>
      </div>
    </MobileLayout>
  );
};