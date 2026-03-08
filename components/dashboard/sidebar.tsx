'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    Car,
    UserCog,
    Key,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Logo } from '@/components/logo';
import { useAuthStore } from '@/store/authStore';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Users', href: '/users' },
    { icon: ShieldCheck, label: 'KYC Management', href: '/kyc' },
    { icon: Car, label: 'Listings', href: '/listings' },
    { icon: Settings, label: 'System Config', href: '/system-config' },
];

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);

    return (
        <aside
            className={cn(
                'relative flex flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out z-40',
                isCollapsed ? 'w-20' : 'w-72'
            )}
        >
            <div className="flex h-20 items-center justify-between px-6 border-b border-white/5 overflow-hidden">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#0066CC] rounded-xl flex items-center justify-center shadow-lg">
                        <Logo className="w-6 h-6" />
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-bold tracking-tighter font-display">
                            C9<span className="text-[#00AAFF]">x</span> Admin
                        </span>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl ml-2"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </Button>
            </div>

            <nav className="flex-1 space-y-1 p-4 mt-6 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 group relative',
                                isActive
                                    ? 'bg-[#0066CC] text-white shadow-lg shadow-primary/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            )}
                        >
                            <item.icon className={cn("shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-[#00AAFF] transition-colors")} size={22} />
                            {!isCollapsed && <span>{item.label}</span>}

                            {/* Simple Tooltip approach for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-6 px-3 py-2 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] border border-white/10 shadow-2xl">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <div className={cn("glass-dark rounded-2xl p-2", isCollapsed ? "flex justify-center" : "")}>
                    <Button
                        variant="ghost"
                        className={cn(
                            'w-full flex items-center gap-4 py-3 rounded-xl transition-all duration-200 font-bold',
                            isCollapsed ? 'justify-center px-0' : 'justify-start px-4',
                            'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                        )}
                        onClick={logout}
                    >
                        <LogOut className="shrink-0" size={20} />
                        {!isCollapsed && <span>Termnal Session</span>}
                    </Button>
                </div>
            </div>
        </aside>
    );
}
