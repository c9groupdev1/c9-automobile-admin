'use client';

import Link from 'next/link';
import { Search, Bell, LogOut, User, Settings, Menu } from 'lucide-react';
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
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from './theme-toggle';
import { useAuthStore } from '@/store/authStore';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NotificationCenter } from './notification-center';

export function Topbar() {
    const { user, logout } = useAuthStore();

    return (
        <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-xl px-4 md:px-8 lg:px-10">
            <div className="flex flex-1 items-center gap-4 md:gap-6">
                <Sheet>
                    <SheetTrigger
                        render={
                            <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 rounded-xl text-slate-500 hover:text-[#003399] hover:bg-slate-50">
                                <Menu className="h-6 w-6" />
                            </Button>
                        }
                    />
                    <SheetContent side="left" className="p-0 w-72 border-none">
                        <Sidebar className="flex" />
                    </SheetContent>
                </Sheet>

                <div className="relative w-full max-w-md hidden md:block group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
                    <Input
                        type="search"
                        placeholder="Search Records, Users, Listings..."
                        className="w-full bg-slate-50 border-transparent pl-11 h-11 rounded-xl focus:bg-white focus:border-slate-200 transition-all font-semibold text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100 gap-1">
                    <ThemeToggle />
                    <NotificationCenter />
                </div>

                <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

                <DropdownMenu>
                    <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), "relative h-12 flex items-center gap-3 px-2 rounded-xl hover:bg-slate-50 transition-all")}>
                        <div className="text-right hidden sm:block">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#003399] leading-none mb-1">Authenticated</p>
                            <p className="text-xs font-bold text-slate-900 leading-none">{user?.name || 'Admin'}</p>
                        </div>
                        <Avatar className="h-9 w-9 rounded-xl border border-slate-200">
                            <AvatarImage src="/avatars/admin.png" alt="Admin" />
                            <AvatarFallback className="rounded-xl bg-[#003399] text-white font-bold">{user?.name?.[0] || 'A'}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 mt-4 p-2 rounded-2xl border-slate-100 shadow-xl" align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="font-normal p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 rounded-xl">
                                        <AvatarFallback className="rounded-xl bg-slate-100 text-slate-600 font-bold">{user?.name?.[0] || 'A'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col space-y-0.5">
                                        <p className="text-sm font-bold leading-none text-slate-900">{user?.name || 'Admin'}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#003399]/60">
                                            System Administrator
                                        </p>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <Link href="/admin/profile">
                                <DropdownMenuItem className="h-11 rounded-xl px-4 cursor-pointer focus:bg-slate-50 focus:text-[#003399] font-bold text-xs">
                                    <User className="mr-3 h-4 w-4" />
                                    <span>Profile Settings</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className="h-11 rounded-xl px-4 cursor-pointer focus:bg-slate-50 focus:text-[#003399] font-bold text-xs">
                                <Settings className="mr-3 h-4 w-4" />
                                <span>Preferences</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="h-11 rounded-xl px-4 cursor-pointer text-rose-500 focus:text-rose-600 focus:bg-rose-50 font-black text-[10px] uppercase tracking-widest">
                            <LogOut className="mr-3 h-4 w-4" />
                            <span>Logout Session</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
