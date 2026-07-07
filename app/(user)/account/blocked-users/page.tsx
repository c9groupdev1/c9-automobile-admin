'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBlockedUsers, useUnblockUser } from '@/hooks/useUserMarketplace';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    ShieldAlert, 
    UserX, 
    Loader2, 
    ChevronLeft, 
    Unlock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function BlockedUsersPage() {
    const router = useRouter();
    const { data: blockedList, isLoading, refetch } = useBlockedUsers();
    const unblockUserMutation = useUnblockUser();

    const blockedUsers = blockedList || [];

    const handleUnblock = async (userId: string) => {
        try {
            await unblockUserMutation.mutateAsync(userId);
            refetch();
        } catch (error) {}
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Blocked Users</h2>
                    <p className="text-slate-500 font-semibold text-sm mt-1">
                        Manage members you have blocked
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/account')}
                    className="rounded-xl border-slate-200 text-slate-600 font-bold text-xs"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Back to Account
                </Button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-32">
                    <Loader2 className="h-8 w-8 animate-spin text-[#003399] mb-4" />
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading blocked list...</p>
                </div>
            ) : blockedUsers.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center justify-center shadow-sm">
                    <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-6">
                        <UserX size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Blocked Members</h3>
                    <p className="text-slate-500 font-semibold text-sm max-w-sm">
                        You haven't blocked any users. If you block a user, they will appear here and you won't see their listings.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 max-w-2xl">
                    {blockedUsers.map((userItem: any) => (
                        <motion.div
                            key={userItem.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                    {userItem.name?.charAt(0) || <UserX size={16} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-950 text-sm">{userItem.name}</h4>
                                    <p className="text-xs text-slate-400 font-semibold">{userItem.email}</p>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => handleUnblock(userItem.id)}
                                disabled={unblockUserMutation.isPending}
                                className="rounded-xl h-10 border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50"
                            >
                                <Unlock size={14} />
                                Unblock
                            </Button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
