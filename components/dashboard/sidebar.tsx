'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users as UsersIcon,
    ShieldCheck,
    Car,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Store,
    Box,
    Wrench,
    Gavel,
    ShoppingBag,
    MessageSquare,
    Crown,
    BarChart3,
    FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Logo } from '@/components/logo';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: UsersIcon, label: 'Users', href: '/admin/users' },
    // { icon: Store, label: 'Vendors', href: '/admin/vendors' },
    { icon: ShieldCheck, label: 'KYC Management', href: '/admin/kyc' },
    { icon: Car, label: 'Vehicle Listings', href: '/admin/listings' },
    // { icon: Box, label: 'Parts Listings', href: '/admin/parts' },
    // { icon: Wrench, label: 'Service Listings', href: '/admin/services' },
    // { icon: Gavel, label: 'Auctions', href: '/admin/auctions' },
    // { icon: ShoppingBag, label: 'C9 Store Management', href: '/admin/store' },
    // { icon: MessageSquare, label: 'Messages / Support', href: '/admin/messages' },
    // { icon: Crown, label: 'Subscription Management', href: '/admin/subscriptions' },
    // { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    // { icon: FileText, label: 'Reports', href: '/admin/reports' },
    { icon: Settings, label: 'Settings', href: '/admin/system-config' },
];

export function Sidebar({ className }: { className?: string }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const { logout, user } = useAuthStore();

    return (
        <aside
            className={cn(
                'relative flex flex-col bg-white border-r border-slate-100 transition-all duration-300 ease-in-out z-40 h-full',
                isCollapsed ? 'w-20' : 'w-72',
                className
            )}
        >
            {/* Header / Logo */}
            <div className="flex h-20 items-center justify-between px-6 border-b border-slate-50 overflow-hidden">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#003399] rounded-xl flex items-center justify-center shadow-lg">
                        <Logo className="w-6 h-6 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tighter text-slate-900 leading-none">
                                C9<span className="text-[#003399]">x</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Admin Portal</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-4 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 group relative',
                                isActive
                                    ? 'bg-[#003399] text-white shadow-lg shadow-blue-900/10'
                                    : 'text-slate-500 hover:text-[#003399] hover:bg-slate-50'
                            )}
                        >
                            <item.icon className={cn("shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-[#003399] transition-colors")} size={18} />
                            {!isCollapsed && <span>{item.label}</span>}

                            {isCollapsed && (
                                <div className="absolute left-full ml-6 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] border border-white/10 shadow-2xl">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-slate-50">
                {!isCollapsed ? (
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 rounded-xl border-2 border-white shadow-sm">
                                <AvatarImage src="/avatars/admin.png" />
                                <AvatarFallback className="bg-[#003399] text-white font-bold">{user?.name?.[0] || 'A'}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-bold text-slate-900 truncate">{user?.name || 'John Admin'}</span>
                                <span className="text-[10px] font-medium text-slate-500 truncate">System Administrator</span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all font-bold text-xs"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-10 w-10 rounded-xl border-2 border-white shadow-sm">
                            <AvatarFallback className="bg-[#003399] text-white font-bold">{user?.name?.[0] || 'A'}</AvatarFallback>
                        </Avatar>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={logout}
                            className="h-10 w-10 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                            <LogOut size={18} />
                        </Button>
                    </div>
                )}
            </div>

            {/* Collapse Toggle */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-24 h-6 w-6 rounded-full bg-white border border-slate-200 shadow-md text-slate-400 hover:text-[#003399] z-50 p-0"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </Button>
        </aside>
    );
}
