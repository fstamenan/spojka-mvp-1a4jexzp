import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { toast } from 'sonner';
import { Plus, Trash2, BrainCircuit } from 'lucide-react';
interface CreateQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function CreateQuizDialog({ open, onOpenChange }: CreateQuizDialogProps) {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctIndex: 0 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore(s => s.user);
  const createQuiz = useAppStore(s => s.createQuiz);
  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };
  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };
  const addQuestion = () => {
    if (questions.length < 5) {
      setQuestions([...questions, { question: '', options: ['', '', '', ''], correctIndex: 0 }]);
    }
  };
  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || questions.some(q => !q.question.trim())) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await createQuiz({
        title: title.trim(),
        createdBy: user.id,
        questions,
        xpReward: 25,
        completions: []
      });
      toast.success("Quiz created successfully!");
      setTitle('');
      setQuestions([{ question: '', options: ['', '', '', ''], correctIndex: 0 }]);
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to create quiz");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-[32px] border-4 border-black/5">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-blue-600" />
            Create Class Quiz
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Fill out the details below to create a new 5-question quiz for your class.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="quiz-title" className="font-bold text-slate-700">Quiz Title</Label>
            <Input
              id="quiz-title"
              placeholder="e.g., Biology: The Cell"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-2 h-12"
              required
            />
          </div>
          <div className="space-y-8">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 bg-slate-50 rounded-3xl border-2 border-black/5 space-y-4 relative">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-blue-600 uppercase">Question {qIndex + 1}</span>
                  {questions.length > 1 && (
                    <button type="button" onClick={() => removeQuestion(qIndex)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Input
                  placeholder="Enter question here"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                  className="rounded-xl border-2 bg-white"
                  required
                />
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex gap-2 items-center">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correctIndex === oIndex}
                        onChange={() => handleQuestionChange(qIndex, 'correctIndex', oIndex)}
                        className="w-4 h-4 text-blue-600 border-2"
                      />
                      <Input
                        placeholder={`Option ${oIndex + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        className="rounded-xl border-2 bg-white h-10"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {questions.length < 5 && (
            <Button
              type="button"
              variant="outline"
              onClick={addQuestion}
              className="w-full border-2 border-dashed border-slate-300 rounded-2xl h-12 hover:bg-slate-50 hover:border-blue-400 text-slate-500 font-bold"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Question ({questions.length}/5)
            </Button>
          )}
          <DialogFooter className="pt-4 sticky bottom-0 bg-white">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all"
            >
              {isSubmitting ? 'Creating...' : 'Launch Quiz (+25 XP reward)'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}