'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Topbar } from '@/components/dashboard/topbar';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, _hasHydrated, token: storeToken, user } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Only redirect if hydration is complete
        if (_hasHydrated) {
            const isOffline = typeof window !== 'undefined' && !window.navigator.onLine;
            const authStorageStr = sessionStorage.getItem('auth-storage');
            const hasSessionToken = authStorageStr && authStorageStr.includes('"token":"');
            if (!isAuthenticated && !hasSessionToken && !isOffline) {
                console.log('Redirecting to login: Not authenticated and no session token');
                router.push('/secured-admin/login');
                return;
            }

            // RBAC: Check if user has administrative roles
            if (user && !isOffline) {
                const hasStaffRole = user.roles.some(role =>
                    !['user', 'verified_user'].includes(role.toLowerCase())
                );

                if (hasStaffRole) {
                    // Admin/Staff stay here
                } else {
                    console.log('Redirecting basic user to member space', user.roles);
                    router.push('/account');
                }
            }
        }
    }, [_hasHydrated, isAuthenticated, user, router]);

    // Show a high-fidelity loading screen
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
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Loading System</p>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-[#0066CC] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-1.5 h-1.5 bg-[#0066CC] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1.5 h-1.5 bg-[#0066CC] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Instead of returning null (white screen), show a placeholder if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-[#0066CC] mb-4" />
                <p className="text-sm font-bold text-slate-500">Securing Session...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-white gradient-bg relative">
            {/* Grid Overlay for Texture */}
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none z-0" />

            <Sidebar className="hidden lg:flex" />

            <div className="flex flex-col flex-1 overflow-hidden relative z-10">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 scroll-smooth custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
