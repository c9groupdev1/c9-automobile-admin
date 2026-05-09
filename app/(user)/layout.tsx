'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserTopbar } from '@/components/dashboard/user-topbar';
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
            router.push('/secured-admin/login');
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
        <div className="min-h-screen bg-white gradient-bg relative">
            <div className="absolute inset-0 grid-pattern opacity-5 pointer-events-none z-0" />
            
            <UserTopbar />
            
            <main className="relative z-10 p-6 md:p-8 lg:p-12 scroll-smooth">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
