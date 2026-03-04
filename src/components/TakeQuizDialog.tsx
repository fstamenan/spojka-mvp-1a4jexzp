import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { toast } from 'sonner';
import { Quiz } from '@shared/types';
import { CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
interface TakeQuizDialogProps {
  quiz: Quiz | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function TakeQuizDialog({ quiz, open, onOpenChange }: TakeQuizDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore(s => s.user);
  const updateXP = useAuthStore(s => s.updateXP);
  const submitQuiz = useAppStore(s => s.submitQuiz);
  if (!quiz) return null;
  const currentQuestion = quiz.questions[currentStep];
  const handleSelectOption = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = index;
    setAnswers(newAnswers);
  };
  const handleNext = async () => {
    if (currentStep < quiz.questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate results and submit
      const correctCount = answers.reduce((acc, val, idx) => 
        val === quiz.questions[idx].correctIndex ? acc + 1 : acc, 0
      );
      setIsFinished(true);
      if (correctCount === quiz.questions.length) {
        setIsSubmitting(true);
        try {
          if (user) {
            await submitQuiz(quiz.id, user.id);
            updateXP(quiz.xpReward);
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#2563EB', '#22C55E', '#FFD700']
            });
            toast.success(`Perfect score! You earned +${quiz.xpReward} XP!`);
          }
        } catch (err) {
          toast.error("Failed to save progress");
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };
  const handleClose = () => {
    setCurrentStep(0);
    setAnswers([]);
    setIsFinished(false);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] rounded-[32px] border-4 border-black/5 overflow-hidden">
        <DialogHeader className="pt-4 px-2">
          <DialogTitle className="text-2xl font-black text-slate-900 text-center">
            {isFinished ? 'Quiz Results' : quiz.title}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-500 font-medium">
            {isFinished ? 'See how you performed on this quiz.' : 'Answer all questions correctly to earn 25 XP!'}
          </DialogDescription>
        </DialogHeader>
        {!isFinished ? (
          <div className="py-6 space-y-6">
            {/* Progress Bar */}
            <div className="flex gap-2">
              {quiz.questions.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    i <= currentStep ? 'bg-blue-600' : 'bg-slate-100'
                  }`}
                />
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 leading-tight">
                {currentQuestion.question}
              </h3>
              <div className="grid gap-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all font-bold text-sm ${
                      answers[currentStep] === idx 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[4px_4px_0px_0px_rgba(37,99,235,0.2)]' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <Button
              disabled={answers[currentStep] === undefined}
              onClick={handleNext}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all"
            >
              {currentStep === quiz.questions.length - 1 ? 'Finish' : 'Next Question'}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center border-4 border-green-200">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Great Job!</h2>
              <p className="text-slate-500 font-bold mt-1">
                You answered {answers.reduce((acc, val, idx) => val === quiz.questions[idx].correctIndex ? acc + 1 : acc, 0)} out of {quiz.questions.length} correctly.
              </p>
            </div>
            {answers.every((val, idx) => val === quiz.questions[idx].correctIndex) ? (
              <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-blue-500" />
                <span className="text-sm font-black text-blue-700">+{quiz.xpReward} XP earned!</span>
              </div>
            ) : (
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-4 py-2 rounded-full">Try again for a perfect score!</p>
            )}
            <Button
              onClick={handleClose}
              className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}