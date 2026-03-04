import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { MessageSquare, ThumbsUp, Pin, Plus, Send, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { CreatePostDialog } from '@/components/CreatePostDialog';
import { CreateQuizDialog } from '@/components/CreateQuizDialog';
import { TakeQuizDialog } from '@/components/TakeQuizDialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Post, Comment, Quiz } from '@shared/types';
export const FeedPage: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Announcements'>('All');
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [selectedQuizForTake, setSelectedQuizForTake] = useState<Quiz | null>(null);
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  // Zustand selectors - Primitives only
  const userId = useAuthStore(s => s.user?.id);
  const userName = useAuthStore(s => s.user?.name);
  const userAvatarSeed = useAuthStore(s => s.user?.avatarSeed);
  const userClassId = useAuthStore(s => s.user?.classId);
  const userRole = useAuthStore(s => s.user?.role);
  const updateXP = useAuthStore(s => s.updateXP);
  const posts = useAppStore(s => s.posts);
  const quizzes = useAppStore(s => s.quizzes);
  const fetchPosts = useAppStore(s => s.fetchPosts);
  const fetchQuizzes = useAppStore(s => s.fetchQuizzes);
  const upvotePost = useAppStore(s => s.upvotePost);
  const fetchComments = useAppStore(s => s.fetchComments);
  const addComment = useAppStore(s => s.addComment);
  useEffect(() => {
    fetchPosts(userClassId);
    fetchQuizzes();
  }, [fetchPosts, fetchQuizzes, userClassId]);
  const filteredPosts = useMemo(() => {
    return (posts ?? []).filter(p => filter === 'All' || p.category === filter);
  }, [posts, filter]);
  const handleUpvote = useCallback(async (postId: string) => {
    try {
      await upvotePost(postId);
      toast.success("Post upvoted!");
    } catch (err) {
      toast.error("Failed to upvote");
    }
  }, [upvotePost]);
  const handleOpenComments = useCallback(async (post: Post) => {
    setSelectedPostForComments(post);
    try {
      const cms = await fetchComments(post.id);
      setComments(cms ?? []);
    } catch (err) {
      toast.error("Failed to load comments");
    }
  }, [fetchComments]);
  const handleAddComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !userName || !selectedPostForComments || !newComment.trim()) return;
    setIsCommenting(true);
    try {
      const comment = await addComment(selectedPostForComments.id, {
        authorId: userId,
        authorName: userName,
        authorAvatarSeed: userAvatarSeed || userName,
        content: newComment.trim()
      });
      setComments(prev => [...prev, comment]);
      setNewComment('');
      updateXP(5);
      toast.success("Komentar dodat! +5 XP bodova");
    } catch (err) {
      toast.error("Greška pri dodavanju komentara");
    } finally {
      setIsCommenting(false);
    }
  }, [userId, userName, userAvatarSeed, selectedPostForComments, newComment, addComment, updateXP]);
  return (
    <MobileLayout title="Feed">
      <div className="p-4 space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex p-1 bg-slate-100 rounded-xl border-2 border-black/5 shadow-sm">
          <button
            onClick={() => setFilter('All')}
            className={cn(
              "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
              filter === 'All' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Svi Postovi
          </button>
          <button
            onClick={() => setFilter('Announcements')}
            className={cn(
              "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
              filter === 'Announcements' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Obaveštenja
          </button>
        </div>
        {(quizzes ?? []).length > 0 && filter === 'All' && (
          <div className="space-y-2 py-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Aktivni Kvizovi</h3>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-4 pb-4">
                {(quizzes ?? []).map(quiz => {
                  const isCompleted = userId && quiz.completions?.includes(userId);
                  return (
                    <div
                      key={quiz.id}
                      onClick={() => !isCompleted && setSelectedQuizForTake(quiz)}
                      className={cn(
                        "inline-flex flex-col w-48 p-4 rounded-2xl border-2 transition-all cursor-pointer relative",
                        isCompleted
                          ? "bg-slate-50 border-slate-100 opacity-80"
                          : "bg-blue-600 border-blue-700 shadow-[4px_4px_0px_0px_rgba(37,99,235,0.2)] hover:translate-y-[-2px]"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className={cn(
                          "p-1.5 rounded-lg",
                          isCompleted ? "bg-slate-200 text-slate-500" : "bg-white/20 text-white"
                        )}>
                          <BrainCircuit className="w-5 h-5" />
                        </div>
                        {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      </div>
                      <h4 className={cn(
                        "font-bold text-sm truncate mb-1",
                        isCompleted ? "text-slate-500" : "text-white"
                      )}>
                        {quiz.title}
                      </h4>
                      <div className={cn(
                        "text-[10px] font-black uppercase tracking-wider",
                        isCompleted ? "text-slate-400" : "text-blue-100"
                      )}>
                        {isCompleted ? 'Završeno' : `+${quiz.xpReward} XP Nagrada`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
        <div className="space-y-4 py-2">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <div
                key={post.id}
                className={cn(
                  "bg-white rounded-2xl border-2 p-4 transition-all hover:border-black/10 animate-fade-in",
                  post.isPinned ? "border-blue-200 bg-blue-50/30" : "border-black/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.02)]"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white overflow-hidden shadow-sm">
                      <img
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${post.authorAvatarSeed || post.authorName}`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{post.authorName}</h3>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {post.createdAt ? formatDistanceToNow(post.createdAt) + ' ago' : 'Just now'}
                      </p>
                    </div>
                  </div>
                  {post.isPinned && (
                    <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-current" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Prikačeno</span>
                    </div>
                  )}
                </div>
                <h2 className="font-bold text-lg mb-2 text-slate-800 leading-tight">{post.title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
                <div className="flex items-center gap-6 border-t-2 border-black/5 pt-3">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-blue-500 transition-colors group"
                  >
                    <ThumbsUp className="w-5 h-5 group-active:scale-125 transition-transform" />
                    <span className="text-sm font-bold">{post.upvotesCount}</span>
                  </button>
                  <button
                    onClick={() => handleOpenComments(post)}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-blue-500 transition-colors group"
                  >
                    <MessageSquare className="w-5 h-5 group-active:scale-125 transition-transform" />
                    <span className="text-sm font-bold">{post.commentsCount}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <MessageSquare className="w-8 h-8" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nema postova još uvek.</p>
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-24 right-4 flex flex-col items-end gap-3 z-40">
        {userRole === 'teacher' && (
          <Button
            onClick={() => setIsQuizDialogOpen(true)}
            className="h-12 px-4 rounded-xl shadow-lg bg-green-600 hover:bg-green-700 border-2 border-black/10 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold text-xs uppercase tracking-widest">Novi Kviz</span>
          </Button>
        )}
        <Button
          onClick={() => setIsPostDialogOpen(true)}
          className="h-14 w-14 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] bg-blue-600 hover:bg-blue-700 border-2 border-black/10 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center p-0"
        >
          <Plus className="w-8 h-8 text-white" />
        </Button>
      </div>
      <CreatePostDialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen} />
      <CreateQuizDialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen} />
      <TakeQuizDialog
        quiz={selectedQuizForTake}
        open={!!selectedQuizForTake}
        onOpenChange={(open) => !open && setSelectedQuizForTake(null)}
      />
      <Sheet open={!!selectedPostForComments} onOpenChange={(open) => !open && setSelectedPostForComments(null)}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-[32px] border-t-4 border-black/5 p-0">
          <div className="flex flex-col h-full bg-white">
            <SheetHeader className="p-6 border-b-2 border-black/5">
              <SheetTitle className="text-xl font-black text-slate-900">Komentari</SheetTitle>
              <SheetDescription className="font-medium text-slate-500">
                Diskusija: {selectedPostForComments?.title}
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-6">
                {(comments ?? []).length > 0 ? (
                  comments.map(cm => (
                    <div key={cm.id} className="flex gap-3 animate-fade-in">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white overflow-hidden flex-shrink-0">
                        <img 
                          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${cm.authorAvatarSeed || cm.authorName}`} 
                          alt="avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 bg-slate-50 rounded-2xl rounded-tl-none p-3 border-2 border-black/5">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs text-slate-900">{cm.authorName}</span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {formatDistanceToNow(cm.createdAt)} ago
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{cm.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Nema komentara još uvek</p>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t-2 border-black/5 bg-slate-50 pb-8">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input
                  placeholder="Dodaj komentar..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="rounded-xl border-2 border-black/5 bg-white focus-visible:ring-blue-500"
                />
                <Button
                  type="submit"
                  disabled={isCommenting || !newComment.trim()}
                  size="icon"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </MobileLayout>
  );
};