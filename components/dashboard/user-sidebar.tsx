'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    Car,
    PlusCircle,
    MessageSquare,
    ShieldCheck,
    LifeBuoy,
    User,
    Lock,
    CreditCard,
    LogOut,
    ChevronRight,
    Bell,
    Settings,
    Home,
    X,
    Menu,
    ChevronDown,
    Heart,
    Folder,
    UserX,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { NotificationCenter } from './notification-center';
import { ThemeToggle } from './theme-toggle';

const mainNavItems = [
    {
        label: 'Marketplace',
        href: '/marketplace',
        icon: Car,
        description: 'Browse vehicles',
    },
    {
        label: 'List Vehicle',
        href: '/list-vehicle',
        icon: PlusCircle,
        description: 'Sell your car',
    },
    {
        label: 'My Listings',
        href: '/my-listings',
        icon: Folder,
        description: 'Manage listings',
    },
    {
        label: 'Favorites',
        href: '/favorites',
        icon: Heart,
        description: 'Saved listings',
    },
    {
        label: 'Messages',
        href: '/messages',
        icon: MessageSquare,
        description: 'Inbox & chats',
    },
    {
        label: 'KYC Verification',
        href: '/kyc',
        icon: ShieldCheck,
        description: 'Verify identity',
    },
    {
        label: 'Support / Help',
        href: '/support',
        icon: LifeBuoy,
        description: 'Get help',
    },
];

const accountNavItems = [
    {
        label: 'Profile',
        href: '/account',
        search: '',
        icon: User,
    },
    {
        label: 'Security',
        href: '/account',
        search: '?tab=security',
        icon: Lock,
    },
    {
        label: 'Billing',
        href: '/account',
        search: '?tab=billing',
        icon: CreditCard,
    },
    {
        label: 'Blocked Users',
        href: '/blocked-users',
        search: '',
        icon: UserX,
    },
];

interface SidebarContentProps {
    onClose?: () => void;
}

function SidebarContent({ onClose }: SidebarContentProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, logout } = useAuthStore();
    const [accountOpen, setAccountOpen] = useState(
        pathname === '/account' || pathname.startsWith('/account')
    );

    const currentTab = searchParams.get('tab') || '';

    const isActive = (href: string, search = '') => {
        if (href === '/account') {
            if (!pathname.startsWith('/account')) return false;
            const tabParam = search.replace('?tab=', '');
            if (!search) return !currentTab; // profile = default (no ?tab)
            return currentTab === tabParam;
        }
        return pathname === href || pathname.startsWith(href + '/');
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-slate-100">
            {/* Logo */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
                <Link href="/" className="flex items-center gap-3" onClick={onClose}>
                    <Logo className="w-9 h-9" />
                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-black tracking-tighter text-slate-900">
                            C9<span className="text-[#003399]">x</span>
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            Member Space
                        </span>
                    </div>
                </Link>
                {onClose && (
                    <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors lg:hidden">
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* User Profile Badge */}
            <div className="px-4 py-4 border-b border-slate-50">
                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3">
                    <Avatar className="h-10 w-10 rounded-xl border border-slate-200 flex-shrink-0">
                        <AvatarFallback className="rounded-xl bg-[#003399] text-white font-bold text-sm">
                            {user?.name?.[0] || 'M'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate leading-none mb-1">
                            {user?.name || 'Member'}
                        </p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#003399] leading-none">
                            {user?.roles?.[0]?.replace(/_/g, ' ') || 'User Account'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 pb-2">
                    Navigation
                </p>

                {mainNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all group',
                                active
                                    ? 'bg-[#003399] text-white shadow-lg shadow-blue-900/15'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            )}
                        >
                            <Icon
                                size={17}
                                className={cn(
                                    'flex-shrink-0',
                                    active ? 'text-white' : 'text-slate-400 group-hover:text-[#003399]'
                                )}
                            />
                            <span className="flex-1 truncate">{item.label}</span>
                            {active && (
                                <div className="w-1.5 h-1.5 bg-white/60 rounded-full flex-shrink-0" />
                            )}
                        </Link>
                    );
                })}

                {/* Account Section */}
                <div className="pt-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 pb-2">
                        My Account
                    </p>

                    <button
                        onClick={() => setAccountOpen((v) => !v)}
                        className={cn(
                            'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all group',
                            pathname.startsWith('/account')
                                ? 'bg-blue-50 text-[#003399]'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        )}
                    >
                        <Settings
                            size={17}
                            className={cn(
                                'flex-shrink-0',
                                pathname.startsWith('/account')
                                    ? 'text-[#003399]'
                                    : 'text-slate-400 group-hover:text-[#003399]'
                            )}
                        />
                        <span className="flex-1 text-left">Account</span>
                        <ChevronDown
                            size={14}
                            className={cn(
                                'transition-transform duration-200',
                                accountOpen ? 'rotate-180' : ''
                            )}
                        />
                    </button>

                    {accountOpen && (
                        <div className="ml-4 mt-1 pl-3 border-l-2 border-slate-100 space-y-0.5">
                            {accountNavItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href, item.search);
                                return (
                                    <Link
                                        key={item.label}
                                        href={`${item.href}${item.search}`}
                                        onClick={onClose}
                                        className={cn(
                                            'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold transition-all',
                                            active
                                                ? 'bg-[#003399] text-white shadow-sm shadow-blue-900/10'
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        )}
                                    >
                                        <Icon size={14} className={active ? 'text-white' : 'text-slate-400'} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </nav>

            {/* Bottom Actions */}
            <div className="px-3 py-4 border-t border-slate-100 space-y-1">
                <button
                    onClick={() => { logout(); if (onClose) onClose(); }}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all"
                >
                    <LogOut size={17} className="flex-shrink-0" />
                    Logout
                </button>
            </div>
        </div>
    );
}

export function UserSidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useAuthStore();

    return (
        <>
            {/* ── Desktop Sidebar ─────────────────────── */}
            <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 sticky top-0 h-screen overflow-hidden">
                <SidebarContent />
            </aside>

            {/* ── Mobile Top Bar ──────────────────────── */}
            <header className="lg:hidden sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-xl px-4">
                <Link href="/" className="flex items-center gap-2.5">
                    <Logo className="w-8 h-8" />
                    <span className="text-lg font-black tracking-tighter text-slate-900">
                        C9<span className="text-[#003399]">x</span>
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    <NotificationCenter />
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </header>

            {/* ── Mobile Drawer ───────────────────────── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-72 shadow-2xl">
                        <SidebarContent onClose={() => setMobileOpen(false)} />
                    </div>
                </div>
            )}
        </>
    );
}
