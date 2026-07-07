'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBlockedUsers, useUnblockUser } from '@/hooks/useUserMarketplace';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
    UserX, 
    Loader2, 
    ChevronLeft, 
    Unlock 
} from 'lucide-react';

export default function BlockedUsersPage() {
    const router = useRouter();
    const { data: blockedList, isLoading, isError } = useBlockedUsers();
    const unblockMutation = useUnblockUser();

    // The endpoint might return blocked user info directly as data array
    const blockedUsers = Array.isArray(blockedList) ? blockedList : [];

    const handleUnblock = async (userId: string) => {
        await unblockMutation.mutateAsync(userId);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="h-10 w-10 animate-spin text-[#003399] mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading blocked users...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Blocked Users</h2>
                    <p className="text-slate-500 font-semibold text-sm mt-1">
                        Manage members you have blocked from contacting you
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/account')}
                    className="rounded-xl border-slate-200 text-slate-655 font-bold text-xs"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Account
                </Button>
            </div>

            {blockedUsers.length === 0 ? (
                <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white py-16 text-center">
                    <CardContent className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-350">
                            <UserX size={28} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No blocked users</h3>
                        <p className="text-slate-500 font-semibold text-sm max-w-sm mx-auto">
                            Members you block from the marketplace listing details page will appear here.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {blockedUsers.map((item: any) => {
                        const blockUser = item.blocked || item.blockedUser || item;
                        const blockId = blockUser.id;
                        const name = blockUser.name || 'Member';
                        const email = blockUser.email || '';
                        
                        return (
                            <Card key={item.id || blockId} className="border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                                <CardContent className="p-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 rounded-xl bg-slate-100 flex-shrink-0">
                                            <AvatarFallback className="rounded-xl bg-[#003399]/10 text-[#003399] font-bold text-sm">
                                                {name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">
                                                {name}
                                            </p>
                                            {email && (
                                                <p className="text-xs font-semibold text-slate-400 truncate">
                                                    {email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleUnblock(blockId)}
                                        disabled={unblockMutation.isPending}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl border-slate-200 text-slate-600 hover:text-[#003399] font-bold text-xs"
                                    >
                                        {unblockMutation.isPending ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                                        ) : (
                                            <Unlock size={13} className="mr-1.5" />
                                        )}
                                        Unblock
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
