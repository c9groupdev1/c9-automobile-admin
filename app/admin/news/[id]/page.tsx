'use client';

import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Bell,
  CheckCircle2,
  Clock,
  Loader2,
  Edit3,
  Trash2,
  Send,
  Zap,
  Tag,
  Share2,
  Newspaper
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNewsItem, useUpdateNews, useDeleteNews, usePublishNews, useNotifyNews } from '@/hooks/useNews';
import { NewsForm } from '@/components/admin/news/NewsForm';
import { useParams, useRouter } from 'next/navigation';
import { useState, use } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function NewsDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: news, isLoading } = useNewsItem(params.id);
  const { mutate: updateNews, isPending: isUpdating } = useUpdateNews();
  const { mutate: deleteNews } = useDeleteNews();
  const { mutate: publishNews, isPending: isPublishing } = usePublishNews();
  const { mutate: notifyNews, isPending: isNotifying } = useNotifyNews();

  const handleUpdate = (formData: FormData) => {
    updateNews({ id: params.id, formData }, {
      onSuccess: () => {
        toast.success('Announcement updated successfully');
        setIsEditOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update news');
      }
    });
  };

  const handlePublish = () => {
    publishNews(params.id, {
      onSuccess: () => toast.success('Announcement is now live'),
      onError: () => toast.error('Failed to publish announcement')
    });
  };

  const handleNotify = () => {
    notifyNews(params.id, {
      onSuccess: () => toast.success('Notifications dispatched'),
      onError: () => toast.error('Failed to send notifications')
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      deleteNews(params.id, {
        onSuccess: () => {
          toast.success('Announcement deleted');
          router.push('/admin/news');
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#003399]" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200">
          <Newspaper size={40} />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Not Found</h3>
        <p className="text-slate-500 font-medium max-w-xs">The requested announcement could not be found.</p>
        <Link 
          href="/admin/news"
          className={cn(
            buttonVariants({ variant: "default" }),
            "bg-[#003399] rounded-2xl px-8 h-12 font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/10 flex items-center justify-center transition-all"
          )}
        >
          Return to News
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Navigation & Actions Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/news"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-slate-500 font-black text-xs uppercase tracking-widest hover:text-[#003399] transition-colors p-0 hover:bg-transparent flex items-center gap-2"
          )}
        >
          <ArrowLeft size={16} /> Back to News & Updates
        </Link>
        <div className="flex items-center gap-4">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger render={
              <Button variant="outline" className="h-12 rounded-2xl border-slate-100 hover:border-blue-500 hover:text-blue-600 font-black text-xs uppercase tracking-widest gap-2 bg-white shadow-sm">
                <Edit3 size={16} />
                Modify Content
              </Button>
            } />
            <DialogContent className="sm:max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
              <div className="p-10 border-b border-slate-50 bg-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-slate-900">Modify Announcement</DialogTitle>
                </DialogHeader>
              </div>
              <div className="p-10 bg-white max-h-[70vh] overflow-y-auto custom-scrollbar">
                <NewsForm initialData={news} onSubmit={handleUpdate} isPending={isUpdating} />
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="h-12 w-12 rounded-2xl p-0 shadow-lg shadow-rose-900/10"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Card */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-[3rem] border-slate-100 shadow-sm overflow-hidden bg-white">
            {news.image_path && (
              <div className="aspect-video w-full overflow-hidden border-b border-slate-50">
                <img src={news.image_path} alt={news.title} className="w-full h-full object-cover" />
              </div>
            )}
            <CardContent className="p-12 space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <Badge className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl border-0 shadow-sm",
                    news.is_published ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {news.is_published ? <Zap size={12} className="mr-1.5 inline" /> : <Clock size={12} className="mr-1.5 inline" />}
                    {news.is_published ? 'Published' : 'Draft'}
                  </Badge>
                  <div className="flex gap-2">
                    {news.send_email && <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003399] flex items-center justify-center" title="Email Integrated"><Mail size={16} /></div>}
                    {news.send_popup && <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center" title="Popup Configured"><Bell size={16} /></div>}
                  </div>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{news.title}</h1>
              </div>

              <div className="prose prose-slate max-w-none">
                {news.content.split('\n').map((para, i) => (
                  <p key={i} className="text-slate-600 text-lg leading-relaxed font-medium mb-4">{para}</p>
                ))}
              </div>

              <div className="pt-10 border-t border-slate-50 flex flex-wrap gap-4">
                 <div className="flex items-center gap-3 bg-slate-50/80 px-5 py-3 rounded-2xl">
                    <Tag size={14} className="text-slate-400" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">System News</span>
                 </div>
                 <div className="flex items-center gap-3 bg-slate-50/80 px-5 py-3 rounded-2xl">
                    <Share2 size={14} className="text-slate-400" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Public Archive</span>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Controls & Metadata */}
        <div className="space-y-8">
          {/* Action Panel */}
          <Card className="rounded-[2.5rem] border-slate-100 shadow-2xl overflow-hidden bg-white">
             <CardHeader className="p-8 border-b border-slate-50">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Publish Control</CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-4">
                {!news.is_published ? (
                    <Button 
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className="w-full h-16 rounded-2xl bg-[#003399] hover:bg-blue-800 text-sm font-black uppercase tracking-widest gap-3 shadow-xl shadow-blue-900/10"
                    >
                      {isPublishing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                      Publish Announcement
                    </Button>
                ) : (
                    <Button 
                      onClick={handleNotify}
                      disabled={isNotifying}
                      variant="outline"
                      className="w-full h-16 rounded-2xl border-2 border-[#003399] text-[#003399] hover:bg-blue-50 text-sm font-black uppercase tracking-widest gap-3"
                    >
                      {isNotifying ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                      Re-Dispatch Alerts
                    </Button>
                )}
                <p className="text-[10px] font-bold text-slate-400 text-center px-4 uppercase tracking-widest leading-relaxed">
                   Publishing will immediately notify platform users.
                </p>
             </CardContent>
          </Card>

          {/* Author info */}
          <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/50">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Publisher Information</h3>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
               <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[#003399]">
                    <User size={24} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-black text-slate-900 truncate">{news.admin?.name || 'Unknown Officer'}</span>
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Administrator</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-widest">Reference Code</span>
                    <code className="bg-slate-50 px-3 py-1 rounded-lg text-[10px] text-slate-500 font-black">{news.id.substring(0, 8).toUpperCase()}</code>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-widest">Created On</span>
                    <span className="font-black text-slate-600 tabular-nums">{format(new Date(news.created_at), 'MMM dd, HH:mm')}</span>
                  </div>
                  {news.published_at && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400 uppercase tracking-widest">Published Since</span>
                      <span className="font-black text-slate-600 tabular-nums">{format(new Date(news.published_at), 'MMM dd, HH:mm')}</span>
                    </div>
                  )}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
