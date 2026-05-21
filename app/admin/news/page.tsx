'use client';

import {
  Plus,
  Search,
  FileText,
  MoreVertical,
  Calendar,
  Eye,
  Trash2,
  Mail,
  Bell,
  CheckCircle2,
  Clock,
  Loader2,
  Filter,
  ArrowRight,
  TrendingUp,
  Newspaper
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNewsList, useCreateNews, useDeleteNews } from '@/hooks/useNews';
import { NewsForm } from '@/components/admin/news/NewsForm';
import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: newsData, isLoading } = useNewsList({ page });
  const { mutate: createNews, isPending: isCreating } = useCreateNews();
  const { mutate: deleteNews } = useDeleteNews();

  const handleCreate = (formData: FormData) => {
    createNews(formData, {
      onSuccess: () => {
        toast.success('News item created successfully');
        setIsCreateOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to create news');
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      deleteNews(id, {
        onSuccess: () => toast.success('News item deleted'),
        onError: () => toast.error('Failed to delete news')
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-12 w-48 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8">
           <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const newsItems = newsData?.data || [];
  const stats = {
    total: newsData?.total || 0,
    published: newsItems.filter(n => n.is_published).length,
    drafts: newsItems.filter(n => !n.is_published).length
  };

  return (
    <div className="space-y-8 pb-20 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="text-[#003399] w-5 h-5" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Communication Hub</h3>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">News & Updates</h2>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            Publish platform updates, promotional events, and essential announcements to the C9x community.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger render={
            <Button className="bg-[#003399] hover:bg-blue-800 rounded-2xl px-8 h-14 font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/10 gap-2">
              <Plus size={16} />
              Draft New Update
            </Button>
          } />
          <DialogContent className="sm:max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
            <div className="p-10 border-b border-slate-50 bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-slate-900">Compose Update</DialogTitle>
                <DialogDescription className="font-medium text-slate-500">Draft a new announcement for the community.</DialogDescription>
              </DialogHeader>
            </div>
            <div className="p-10 bg-white max-h-[70vh] overflow-y-auto custom-scrollbar">
              <NewsForm onSubmit={handleCreate} isPending={isCreating} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Records', value: stats.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Live Updates', value: stats.published, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending Drafts', value: stats.drafts, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' }
        ].map((stat, i) => (
          <Card key={i} className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
            <CardContent className="p-8 flex items-center gap-6">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardHeader className="p-10 border-b border-slate-50 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003399] transition-colors" size={18} />
              <Input 
                placeholder="Search updates by title..." 
                className="pl-12 h-12 rounded-2xl bg-slate-50 border-slate-100 focus:ring-0 focus:border-[#003399]/30 transition-all font-medium"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-12 px-5 rounded-2xl border-slate-100 hover:border-blue-500 hover:text-blue-600 font-bold text-xs uppercase tracking-widest gap-2">
                <Filter size={14} />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="py-7 px-10 text-[11px] font-black uppercase tracking-widest text-slate-400 w-[40%]">Announcement Title</TableHead>
                  <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Author</TableHead>
                  <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Channels</TableHead>
                  <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                  <TableHead className="py-7 px-10 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-[400px] text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200">
                          <FileText size={40} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-900 font-black text-lg">No announcements found</p>
                          <p className="text-slate-500 font-medium text-sm">Start by drafting a new community update.</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  newsItems.map((item) => (
                    <TableRow key={item.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="py-6 px-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#003399] group-hover:text-white transition-all overflow-hidden shrink-0">
                            {item.image_path ? (
                              <img src={item.image_path} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <FileText size={20} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-slate-900 text-sm truncate uppercase tracking-tight">{item.title}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                              <Calendar size={12} className="text-[#003399]" />
                              {format(new Date(item.created_at), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-8">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900 truncate">{item.admin?.name || 'Unassigned'}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Originator</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-8">
                        <div className="flex gap-2">
                          {item.send_email && (
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#003399]" title="Email Notification">
                              <Mail size={14} />
                            </div>
                          )}
                          {item.send_popup && (
                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600" title="In-App Popup">
                              <Bell size={14} />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-6 px-8">
                        <Badge className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border-0",
                          item.is_published ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        )}>
                          {item.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-6 px-10 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Link 
                              href={`/admin/news/${item.id}`}
                              className={cn(
                                buttonVariants({ variant: "ghost", size: "icon" }),
                                "h-10 w-10 rounded-xl hover:bg-white hover:text-[#003399] border-0 flex items-center justify-center transition-all"
                              )}
                           >
                                <Eye size={18} />
                           </Link>
                           <DropdownMenu>
                              <DropdownMenuTrigger render={
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical size={18} className="text-slate-400" />
                                </Button>
                              } />
                              <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 p-2 min-w-[160px]">
                                <DropdownMenuItem className="rounded-xl font-bold text-xs uppercase tracking-wider py-3 cursor-pointer">
                                  Modify Update
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(item.id)}
                                  className="rounded-xl font-bold text-xs uppercase tracking-wider py-3 cursor-pointer text-rose-600 hover:bg-rose-50"
                                >
                                  Delete Announcement
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-8 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Showing <span className="text-slate-900">{newsItems.length}</span> announcements
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="h-11 rounded-xl border-slate-100 font-bold text-xs"
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                disabled={!newsData?.last_page || page === newsData.last_page}
                onClick={() => setPage(page + 1)}
                className="h-11 rounded-xl border-slate-100 font-bold text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
