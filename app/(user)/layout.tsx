'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserSidebar } from '@/components/dashboard/user-sidebar';
import { NotificationCenter } from '@/components/dashboard/notification-center';
import { ThemeToggle } from '@/components/dashboard/theme-toggle';
import { useAuthStore } from '@/store/authStore';
import { Logo } from '@/components/logo';

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, user, _hasHydrated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [hideKycBanner, setHideKycBanner] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const hidden = sessionStorage.getItem('c9x_hide_kyc_banner');
            if (hidden === 'true') {
                setHideKycBanner(true);
            }
        }
    }, []);

    useEffect(() => {
        if (_hasHydrated && !isAuthenticated) {
            const isOffline = typeof window !== 'undefined' && !window.navigator.onLine;
            if (!isOffline) {
                router.push('/login');
            }
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
                        {/* KYC Banner for Unverified Users */}
                        {isAuthenticated && user && (user.kycStatus === 'pending' || !user.kycStatus || user.kycStatus === 'rejected') && !hideKycBanner && !pathname.includes('/kyc') && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <ShieldAlert size={120} />
                                </div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="p-3 bg-amber-100 text-amber-600 rounded-full hidden sm:block">
                                        <ShieldAlert size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-amber-900 font-bold text-lg">Verify your identity</h3>
                                        <p className="text-amber-700/80 font-medium text-sm mt-1 max-w-2xl">
                                            You are currently unverified. Complete your KYC verification to unlock full access to the C9X Marketplace, including posting vehicles and messaging sellers securely.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 relative z-10">
                                    <Button
                                        variant="outline"
                                        className="border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800 bg-transparent font-bold whitespace-nowrap"
                                        onClick={() => {
                                            sessionStorage.setItem('c9x_hide_kyc_banner', 'true');
                                            setHideKycBanner(true);
                                        }}
                                    >
                                        Do KYC Later
                                    </Button>
                                    <Link href="/account/kyc">
                                        <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold whitespace-nowrap shadow-md">
                                            Complete KYC Now
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
