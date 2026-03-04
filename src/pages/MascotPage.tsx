import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAuthStore } from '@/store/authStore';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Trophy, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
export const MascotPage: React.FC = () => {
  // Zustand selectors - Primitives only for stability
  const userMascotStage = useAuthStore(state => state.user?.mascotStage);
  const userMascotName = useAuthStore(state => state.user?.mascotName);
  const userXpTotal = useAuthStore(state => state.user?.xpTotal);
  const updateMascotName = useAuthStore(state => state.updateMascotName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userMascotName || '');
  const prevStageRef = useRef<string | null>(userMascotStage || null);
  const thresholds = {
    'Egg': 100,
    'Little Cat': 500,
    'Big Cat': 1000
  };
  const currentThreshold = thresholds[userMascotStage as keyof typeof thresholds] || 1000;
  const progress = ((userXpTotal || 0) / currentThreshold) * 100;
  // Level-up celebration
  useEffect(() => {
    if (userMascotStage && prevStageRef.current && userMascotStage !== prevStageRef.current) {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#22C55E', '#FFD700', '#F59E0B']
      });
      prevStageRef.current = userMascotStage;
    }
  }, [userMascotStage]);
  const handleSaveName = useCallback(() => {
    if (!tempName.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }
    updateMascotName(tempName.trim());
    setIsEditingName(false);
    toast.success("Mascot renamed!");
  }, [tempName, updateMascotName]);
  const handleStartEdit = () => {
    setTempName(userMascotName || '');
    setIsEditingName(true);
  };
  return (
    <MobileLayout title="Your Mascot">
      <div className="p-6 flex flex-col items-center space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        {/* Mascot Container */}
        <div className="relative w-64 h-64 bg-slate-50 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent group-hover:bg-blue-500/10 transition-colors" />
          <div className="relative z-10 animate-float">
             {userMascotStage === 'Egg' ? (
                <div className="w-32 h-40 bg-white rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] border-4 border-slate-900 shadow-[inset_-8px_-8px_0px_0px_rgba(0,0,0,0.05)] flex items-center justify-center">
                  <div className="flex gap-4">
                    <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse" />
                  </div>
                </div>
             ) : (
                <img
                  src={`https://robohash.org/${userMascotName || 'cat'}?set=set4`}
                  className="w-48 h-48 drop-shadow-2xl transition-transform hover:scale-110 object-contain"
                  alt="mascot"
                />
             )}
          </div>
          {/* Mascot Name Display/Editor */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full px-4 flex justify-center">
            {isEditingName ? (
              <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm p-1 rounded-2xl border-2 border-blue-500 shadow-lg animate-scale-in w-full max-w-[200px]">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="h-8 border-0 bg-transparent focus-visible:ring-0 font-bold text-center text-slate-800 p-0 text-sm"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                />
                <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-green-600 hover:bg-green-50" onClick={handleSaveName}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-50" onClick={() => setIsEditingName(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={handleStartEdit}
                className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border-2 border-slate-200 shadow-sm flex items-center gap-2 cursor-pointer hover:bg-white hover:border-blue-300 transition-all group/name"
              >
                <span className="text-sm font-black text-slate-700">{userMascotName || 'My Mascot'}</span>
                <Edit2 className="w-3 h-3 text-slate-400 group-hover/name:text-blue-500 transition-colors" />
              </div>
            )}
          </div>
        </div>
        {/* Stats Card */}
        <div className="w-full bg-white rounded-[32px] border-4 border-black/5 p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-yellow-100 rounded-2xl text-yellow-600 border-2 border-yellow-200">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Evolution Stage</p>
                <p className="font-black text-slate-900 text-lg leading-none">{userMascotStage}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total XP</p>
              <p className="font-black text-blue-600 text-2xl tabular-nums leading-none">{userXpTotal}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-end px-1">
              <span className="text-xs font-black text-slate-500 uppercase tracking-tight">Level Progress</span>
              <span className="text-sm font-black text-slate-900">{userXpTotal} / {currentThreshold}</span>
            </div>
            <div className="relative h-8 bg-slate-100 rounded-full overflow-hidden border-2 border-black/5 p-1.5 shadow-inner">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-[0px_4px_8px_rgba(37,99,235,0.4)] flex items-center justify-end px-2"
                style={{ width: `${Math.min(100, progress)}%` }}
              >
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-ping" />
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-100 flex items-center gap-4 group transition-colors hover:bg-blue-100/50">
             <div className="w-12 h-12 bg-white rounded-2xl border-2 border-blue-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-blue-500" />
             </div>
             <p className="text-xs font-bold text-blue-800 leading-snug">
               {(userXpTotal || 0) < 1000
                 ? `Complete quizzes and earn upvotes to reach ${Object.entries(thresholds).find(([_, v]) => v > (userXpTotal || 0))?.[0]}!`
                 : "You reached the maximum evolution stage! You are a legendary Big Cat!"}
             </p>
          </div>
        </div>
      </div>
      {/* Footer with Signature Image */}
      <footer className="mt-8 text-center pb-8">
        <img
          src="https://aurelia-blob.s3.us-east-1.amazonaws.com/uploads/1715011707018-Filip_Pavlovic_Signature.png"
          alt="Signature"
          className="h-8 w-auto mx-auto opacity-50 hover:opacity-80 transition-opacity object-contain"
        />
      </footer>
    </MobileLayout>
  );
};