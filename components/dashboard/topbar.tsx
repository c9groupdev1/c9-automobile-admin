'use client';

import { Search, Bell, LogOut, User, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from './theme-toggle';
import { useAuthStore } from '@/store/authStore';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Topbar() {
    const { user, logout } = useAuthStore();

    return (
        <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-xl px-6 md:px-10">
            <div className="flex flex-1 items-center gap-6">
                <div className="relative w-full max-w-md hidden md:block group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#0066CC] transition-colors" />
                    <Input
                        type="search"
                        placeholder="Search Protocol Records..."
                        className="w-full bg-slate-50 border-transparent pl-11 h-12 rounded-2xl focus:bg-white focus:border-slate-200 transition-all font-semibold text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100 gap-1">
                    <ThemeToggle />
                    <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl text-slate-500 hover:text-[#0066CC] hover:bg-white">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-rose-500 border-2 border-slate-50"></span>
                    </Button>
                </div>

                <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

                <DropdownMenu>
                    <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), "relative h-12 flex items-center gap-3 px-2 rounded-2xl hover:bg-slate-50 transition-all")}>
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Authenticated</p>
                            <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || 'Admin'}</p>
                        </div>
                        <div className="p-0.5 rounded-xl border border-slate-200 ring-2 ring-transparent group-hover:ring-[#0066CC]/10 transition-all">
                            <Avatar className="h-9 w-9 rounded-lg">
                                <AvatarImage src="/avatars/admin.png" alt="Admin" />
                                <AvatarFallback className="rounded-lg bg-[#0066CC] text-white font-black">{user?.name?.[0] || 'A'}</AvatarFallback>
                            </Avatar>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 mt-4 p-3 rounded-[2rem] border-slate-100 shadow-3xl" align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="font-normal p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 rounded-xl">
                                        <AvatarFallback className="rounded-xl bg-slate-100 text-slate-600 font-bold">{user?.name?.[0] || 'A'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col space-y-0.5">
                                        <p className="text-sm font-bold leading-none text-slate-900">{user?.name || 'Admin'}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#00AAFF]">
                                            Verified Protocol Role
                                        </p>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="opacity-50" />
                        <DropdownMenuGroup className="p-1">
                            <DropdownMenuItem className="h-12 rounded-xl px-4 cursor-pointer focus:bg-slate-50 focus:text-[#0066CC] group">
                                <User className="mr-3 h-4 w-4 text-slate-400 group-hover:text-[#0066CC]" />
                                <span className="font-bold">Profile Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="h-12 rounded-xl px-4 cursor-pointer focus:bg-slate-50 focus:text-[#0066CC] group">
                                <Settings className="mr-3 h-4 w-4 text-slate-400 group-hover:text-[#0066CC]" />
                                <span className="font-bold">Preferences</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="opacity-50" />
                        <DropdownMenuItem onClick={logout} className="h-12 rounded-xl px-4 cursor-pointer text-rose-500 focus:text-rose-600 focus:bg-rose-50 group">
                            <LogOut className="mr-3 h-4 w-4" />
                            <span className="font-bold text-sm uppercase tracking-widest">Terminate Session</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
