'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
    useNotifications, 
    useMarkAsRead, 
    useMarkAllRead, 
    useDeleteNotification, 
    useClearAllNotifications 
} from '@/hooks/useNotifications';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Bell, 
    BellOff, 
    Check, 
    CheckSquare, 
    Trash2, 
    Loader2, 
    ChevronLeft, 
    Calendar,
    MailOpen,
    Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function NotificationsPage() {
    const router = useRouter();
    const { data: notifications, isLoading, refetch } = useNotifications();
    
    // Mutations
    const markAsReadMutation = useMarkAsRead();
    const markAllReadMutation = useMarkAllRead();
    const deleteNotificationMutation = useDeleteNotification();
    const clearAllMutation = useClearAllNotifications();

    const alerts = notifications || [];
    const unreadCount = alerts.filter(a => !a.read_at).length;

    const handleMarkRead = async (id: string) => {
        try {
            await markAsReadMutation.mutateAsync(id);
            refetch();
        } catch (error) {}
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllReadMutation.mutateAsync();
            toast.success('All notifications marked as read.');
            refetch();
        } catch (error) {}
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await deleteNotificationMutation.mutateAsync(id);
            toast.success('Notification deleted.');
            refetch();
        } catch (error) {}
    };

    const handleClearAll = async () => {
        try {
            await clearAllMutation.mutateAsync();
            toast.success('All notifications cleared.');
            refetch();
        } catch (error) {}
    };

    const getRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const diff = Date.now() - date.getTime();
        if (diff < 60 * 60 * 1000) {
            return `${Math.max(Math.floor(diff / (60 * 1000)), 1)}m ago`;
        } else if (diff < 24 * 60 * 60 * 1000) {
            return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
        }
        return date.toLocaleDateString();
    };

    return (
        <div className="space-y-8 pb-20 pt-28 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Bell className="w-5 h-5 text-[#003399]" />
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Alert Center</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Notifications</h2>
                        {unreadCount > 0 && (
                            <Badge className="bg-rose-50 text-rose-600 border-0 text-[10px] font-black px-2 py-0.5 rounded-full">
                                {unreadCount} New
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {alerts.length > 0 && (
                        <>
                            <Button
                                variant="outline"
                                onClick={handleMarkAllRead}
                                className="rounded-xl border-slate-200 text-slate-650 font-bold text-xs flex items-center gap-1.5 h-10"
                            >
                                <CheckSquare size={14} />
                                Mark all read
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleClearAll}
                                className="rounded-xl border-slate-200 text-rose-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1.5 h-10"
                            >
                                <Trash2 size={14} />
                                Clear all
                            </Button>
                        </>
                    )}
                    <Button
                        variant="outline"
                        onClick={() => router.push('/account')}
                        className="rounded-xl border-slate-200 text-slate-600 font-bold text-xs h-10"
                    >
                        <ChevronLeft size={16} className="mr-1" />
                        Account
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-32">
                    <Loader2 className="h-8 w-8 animate-spin text-[#003399] mb-4" />
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading alerts...</p>
                </div>
            ) : alerts.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center justify-center shadow-sm">
                    <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-6">
                        <BellOff size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Your Inbox is Empty</h3>
                    <p className="text-slate-500 font-semibold text-sm max-w-sm">
                        You don't have any notifications or activity logs at the moment.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {alerts.map((item) => {
                        const isRead = !!item.read_at;
                        return (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => !isRead && handleMarkRead(item.id)}
                                className={`group p-5 rounded-3xl border shadow-sm transition-all flex items-start gap-4 cursor-pointer relative ${
                                    isRead 
                                        ? 'bg-white border-slate-100/50 hover:bg-slate-50/20' 
                                        : 'bg-blue-50/10 border-blue-100/40 hover:bg-blue-50/20'
                                }`}
                            >
                                <div className={`p-3.5 rounded-2xl flex-shrink-0 ${
                                    isRead ? 'bg-slate-50 text-slate-400' : 'bg-blue-50 text-[#003399]'
                                }`}>
                                    {isRead ? <MailOpen size={18} /> : <Mail size={18} />}
                                </div>

                                <div className="flex-1 space-y-1 pr-6">
                                    <div className="flex items-center justify-between gap-3 flex-wrap">
                                        <h4 className={`text-xs uppercase tracking-wider ${isRead ? 'text-slate-400 font-bold' : 'text-slate-950 font-black'}`}>
                                            {item.title}
                                        </h4>
                                        <span className="text-[10px] font-bold text-slate-400 flex-shrink-0">
                                            {getRelativeTime(item.created_at)}
                                        </span>
                                    </div>
                                    <p className={`text-xs leading-relaxed ${isRead ? 'text-slate-500 font-semibold' : 'text-slate-800 font-bold'}`}>
                                        {item.message}
                                    </p>
                                </div>

                                {/* Delete btn */}
                                <button
                                    onClick={(e) => handleDelete(e, item.id)}
                                    className="absolute right-4 top-5 p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100 shadow-sm"
                                    title="Delete Notification"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
