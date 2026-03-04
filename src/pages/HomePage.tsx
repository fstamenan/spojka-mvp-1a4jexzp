import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, UserPlus, Fingerprint, Info, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster, toast } from 'sonner';
import { cn } from '@/lib/utils';
const AVATAR_SEEDS = ['Felix', 'Luna', 'Oliver', 'Milo', 'Leo', 'Bella', 'Jasper', 'Chloe', 'Max', 'Zoe'];
export const HomePage: React.FC = () => {
  // Primitives only selectors for Zustand to prevent re-render loops
  const login = useAuthStore(state => state.login);
  const signup = useAuthStore(state => state.signup);
  const isLoading = useAuthStore(state => state.isLoading);
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState('');
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    joinCode: '',
    mascotName: '',
    avatarSeed: AVATAR_SEEDS[0]
  });
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      toast.error("Unesite email");
      return;
    }
    try {
      await login(loginEmail.trim());
      toast.success(`Dobrodošli nazad!`);
      navigate('/feed');
    } catch (err: any) {
      toast.error(err.message || "Prijava nije uspela");
    }
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, joinCode, mascotName } = signupForm;
    if (!name || !email || !joinCode || !mascotName) {
      toast.error("Popunite sva polja");
      return;
    }
    try {
      await signup(signupForm);
      toast.success(`Uspešno ste se registrovali!`);
      navigate('/feed');
    } catch (err: any) {
      toast.error(err.message || "Registracija nije uspela");
    }
  };
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md space-y-10 animate-fade-in">
          {/* Branding Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(37,99,235,0.2)] border-2 border-black/5 rotate-6 mb-2">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Spojka</h1>
              <p className="text-blue-600 font-black text-xl mt-1 uppercase tracking-widest">
                Tvoja skola na JEDNOM mestu
              </p>
            </div>
          </div>
          {/* Info Card */}
          <div className="bg-white rounded-[32px] border-4 border-black/5 p-6 shadow-playful-lg space-y-4 transition-transform hover:scale-[1.02] duration-300">
            <div className="flex items-center gap-2 text-blue-600">
              <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Info className="w-4 h-4" /> Šta je SPOJKA?
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed font-bold italic">
              "Spojka je gamifikovana zajednica za srednjoškolce. Osvajaj XP, razvijaj maskotu i pobedi u rang listi odeljenja!"
            </p>
          </div>
          {/* Tabs Section */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-16 bg-slate-200/50 rounded-2xl p-1.5 mb-8 border-2 border-black/5">
              <TabsTrigger
                value="login"
                className="rounded-xl font-black uppercase tracking-[0.2em] text-[10px] data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all"
              >
                Prijava
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-xl font-black uppercase tracking-[0.2em] text-[10px] data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all"
              >
                Novi Nalog
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-0">
              <form onSubmit={handleLogin} className="bg-white p-8 rounded-[40px] border-4 border-black/5 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.03)] space-y-6">
                <div className="space-y-3">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">Školski Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      placeholder="alex@school.edu"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-12 h-14 rounded-2xl border-2 border-slate-100 focus-visible:ring-blue-500 font-bold text-lg transition-all"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 text-lg"
                >
                  {isLoading ? "Ulazak..." : "Uđi u Hol"}
                  {!isLoading && <Fingerprint className="w-6 h-6" />}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="mt-0">
              <form onSubmit={handleSignup} className="bg-white p-8 rounded-[40px] border-4 border-black/5 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.03)] space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">Ime</Label>
                    <Input
                      placeholder="Marko"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                      className="h-12 rounded-xl border-2 border-slate-100 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">Email</Label>
                    <Input
                      type="email"
                      placeholder="email@skola.rs"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                      className="h-12 rounded-xl border-2 border-slate-100 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">Izaberi svoj stil</Label>
                  <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
                    {AVATAR_SEEDS.map((seed) => (
                      <button
                        key={seed}
                        type="button"
                        onClick={() => setSignupForm(prev => ({ ...prev, avatarSeed: seed }))}
                        className={cn(
                          "relative flex-shrink-0 w-16 h-16 rounded-2xl border-2 transition-all p-1 overflow-hidden",
                          signupForm.avatarSeed === seed
                            ? "border-blue-600 bg-blue-50 shadow-[0_0_15px_rgba(37,99,235,0.3)] scale-110 z-10"
                            : "border-slate-100 bg-slate-50 opacity-60 hover:opacity-100"
                        )}
                      >
                        <img
                          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`}
                          alt={seed}
                          className="w-full h-full object-contain"
                        />
                        {signupForm.avatarSeed === seed && (
                          <div className="absolute top-0 right-0 bg-blue-600 rounded-bl-lg p-0.5">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">Kod Odeljenja</Label>
                    <Input
                      placeholder="CODE10A"
                      value={signupForm.joinCode}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, joinCode: e.target.value.toUpperCase() }))}
                      className="h-12 rounded-xl border-2 border-slate-100 font-black tracking-widest text-center"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-500 ml-1">Ime Maskote</Label>
                    <Input
                      placeholder="Brzi"
                      value={signupForm.mascotName}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, mascotName: e.target.value }))}
                      className="h-12 rounded-xl border-2 border-slate-100 font-bold"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 mt-4 text-lg"
                >
                  {isLoading ? "Kreiranje..." : "Započni Avanturu"}
                  {!isLoading && <UserPlus className="w-6 h-6" />}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <footer className="text-center pt-8">
            <img
              src="https://aurelia-blob.s3.us-east-1.amazonaws.com/uploads/1715011707018-Filip_Pavlovic_Signature.png"
              alt="Signature"
              className="h-8 w-auto mx-auto opacity-50 hover:opacity-80 transition-opacity object-contain"
            />
          </footer>
        </div>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
};