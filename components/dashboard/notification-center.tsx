'use client';

import { Bell, Check, Trash2, Loader2, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNotifications, useMarkAsRead, useMarkAllRead, useClearAllNotifications, useDeleteNotification } from '@/hooks/useNotifications';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationCenter() {
    const { data: notifications = [], isLoading } = useNotifications();
    const markAsRead = useMarkAsRead();
    const markAllRead = useMarkAllRead();
    const clearAll = useClearAllNotifications();
    const deleteNotif = useDeleteNotification();

    const unreadCount = notifications.filter(n => !n.read_at).length;

    const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await markAsRead.mutateAsync(id);
            toast.success('Notification marked as read');
        } catch (error) {
            toast.error('Failed to mark notification as read');
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteNotif.mutateAsync(id);
            toast.success('Notification deleted');
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllRead.mutateAsync();
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark all notifications as read');
        }
    };

    const handleClearAll = async () => {
        try {
            await clearAll.mutateAsync();
            toast.success('All notifications cleared');
        } catch (error) {
            toast.error('Failed to clear notifications');
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'general':
                return <Info className="h-4 w-4 text-blue-500" />;
            case 'new_listing':
                return <CheckCircle className="h-4 w-4 text-emerald-500" />;
            default:
                return <AlertCircle className="h-4 w-4 text-amber-500" />;
        }
    };

    const formatTime = (dateString: string) => {
        try {
            const safeDateString = dateString.replace(' ', 'T');
            return formatDistanceToNow(parseISO(safeDateString), { addSuffix: true });
        } catch (error) {
            return dateString;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="relative h-9 w-9 rounded-lg text-slate-500 hover:text-[#003399] hover:bg-white flex items-center justify-center cursor-pointer">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-rose-500 border-2 border-slate-50 animate-pulse"></span>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 sm:w-96 mt-4 p-0 rounded-2xl border-slate-100 shadow-xl overflow-hidden bg-white/90 backdrop-blur-xl" align="end">
                <DropdownMenuLabel className="p-4 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="bg-[#003399]/10 text-[#003399] border-0 font-bold text-[10px] px-2 py-0.5 rounded-md">
                                {unreadCount} New
                            </Badge>
                        )}
                    </div>
                    {notifications.length > 0 && (
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={handleMarkAllRead}
                                    disabled={markAllRead.isPending}
                                    className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider text-[#003399] hover:bg-white"
                                >
                                    {markAllRead.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Mark all read'}
                                </Button>
                            )}
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleClearAll}
                                disabled={clearAll.isPending}
                                className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-50"
                            >
                                {clearAll.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Clear all'}
                            </Button>
                        </div>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="m-0" />
                
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-[#003399]" />
                            <span className="text-xs font-bold uppercase tracking-widest">Loading...</span>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                            <Bell className="h-8 w-8 text-slate-300" />
                            <span className="text-xs font-bold uppercase tracking-widest">No notifications</span>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {notifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className={cn(
                                        "p-4 flex items-start gap-3 border-b border-slate-50 hover:bg-slate-50/50 transition-colors group relative",
                                        !notification.read_at && "bg-[#003399]/5"
                                    )}
                                >
                                    <div className={cn(
                                        "p-2 rounded-xl shrink-0",
                                        notification.type === 'general' && "bg-blue-50",
                                        notification.type === 'new_listing' && "bg-emerald-50",
                                        notification.type !== 'general' && notification.type !== 'new_listing' && "bg-amber-50"
                                    )}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={cn("text-xs font-bold text-slate-900 truncate", !notification.read_at && "font-black")}>
                                                {notification.title}
                                            </p>
                                            <span className="text-[9px] font-medium text-slate-400 shrink-0">
                                                {formatTime(notification.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                            {notification.message}
                                        </p>
                                        
                                        {/* Action Buttons on Hover */}
                                        <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!notification.read_at && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                    disabled={markAsRead.isPending}
                                                    className="h-6 w-6 rounded-md bg-white shadow-sm border border-slate-100 text-[#003399] hover:bg-blue-50"
                                                >
                                                    {markAsRead.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                                </Button>
                                            )}
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={(e) => handleDelete(notification.id, e)}
                                                disabled={deleteNotif.isPending}
                                                className="h-6 w-6 rounded-md bg-white shadow-sm border border-slate-100 text-rose-500 hover:bg-rose-50"
                                            >
                                                {deleteNotif.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
