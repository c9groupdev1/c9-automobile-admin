'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserSidebar } from '@/components/dashboard/user-sidebar';
import { NotificationCenter } from '@/components/dashboard/notification-center';
import { ThemeToggle } from '@/components/dashboard/theme-toggle';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, _hasHydrated } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (_hasHydrated && !isAuthenticated) {
            router.push('/login');
        }
    }, [_hasHydrated, isAuthenticated, router]);

    if (!mounted || !_hasHydrated) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gradient-bg">
                <div className="relative">
                    <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center relative z-10 animate-pulse">
                        <Logo className="w-14 h-14" />
                    </div>
                    <div className="absolute inset-0 bg-[#0066CC]/20 rounded-[2rem] blur-2xl animate-ping scale-75"></div>
                </div>
                <div className="mt-8 flex flex-col items-center space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Loading Member Space</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-slate-50 gradient-bg flex flex-col lg:flex-row">
            <div className="absolute inset-0 grid-pattern opacity-5 pointer-events-none z-0" />

            {/* Sidebar */}
            <UserSidebar />

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                {/* Desktop top bar (notification + theme only — no duplicate nav) */}
                <header className="hidden lg:flex sticky top-0 z-30 h-16 items-center justify-end gap-3 px-8 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                    <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100 gap-1">
                        <ThemeToggle />
                        <NotificationCenter />
                    </div>
                </header>

                <main className="flex-1 p-5 md:p-8 overflow-auto">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
