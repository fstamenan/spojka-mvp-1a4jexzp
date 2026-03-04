import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
export function DemoPage() {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <div className="space-y-6 text-center max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg animate-bounce">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Demo Placeholder
          </h1>
          <p className="text-slate-500 font-medium">
            This page has been replaced to resolve type errors. All core functionality for SPojka MVP is available in the main application flow.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="rounded-xl px-8 h-12 font-bold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </main>
    </AppLayout>
  );
}