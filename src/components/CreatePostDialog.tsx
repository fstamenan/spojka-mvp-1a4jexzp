import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { toast } from 'sonner';
interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore(s => s.user);
  const updateXP = useAuthStore(s => s.updateXP);
  const createPost = useAppStore(s => s.createPost);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      await createPost({
        authorId: user.id,
        authorName: user.name,
        authorAvatarSeed: user.avatarSeed || user.name,
        classId: user.classId,
        title: title.trim(),
        content: content.trim(),
        category: user.role === 'teacher' ? 'Announcements' : 'All',
        isPinned: user.role === 'teacher',
      });
      updateXP(10);
      toast.success("Post kreiran! +10 XP bodova");
      setTitle('');
      setContent('');
      onOpenChange(false);
    } catch (err) {
      toast.error("Greška pri kreiranju posta");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-2 border-black/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900">Novi Post</DialogTitle>
          <DialogDescription className="text-slate-500">
            Podeli novost, pitanje ili obaveštenje sa svojim odeljenjem.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-bold text-slate-700">Naslov</Label>
            <Input
              id="title"
              placeholder="Šta se dešava?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-2 focus-visible:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content" className="font-bold text-slate-700">Detalji</Label>
            <Textarea
              id="content"
              placeholder="Podeli više informacija..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] rounded-xl border-2 focus-visible:ring-blue-500"
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all"
            >
              {isSubmitting ? 'Objavljivanje...' : 'Objavi u Feed'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}