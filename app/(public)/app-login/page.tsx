'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Logo } from '@/components/logo';
import { Suspense } from 'react';

function AppLoginHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        const userParam = searchParams.get('user');

        if (!tokenParam) {
            router.replace('/login');
            return;
        }

        let userObj: any = null;
        try {
            userObj = JSON.parse(decodeURIComponent(userParam || '{}'));
        } catch {
            router.replace('/login');
            return;
        }

        // 1. Seed Zustand store (this writes to sessionStorage automatically via persist middleware)
        setAuth(userObj, tokenParam);

        // 2. Ask BFF to set the HttpOnly c9_session cookie server-side
        fetch('/api/app-auth', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: tokenParam, user: userObj }),
        }).finally(() => {
            // 3. Navigate to /account — layout will see isAuthenticated: true
            router.replace('/account');
        });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
            <div className="relative">
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center relative z-10 animate-pulse">
                    <Logo className="w-14 h-14" />
                </div>
                <div className="absolute inset-0 bg-[#0066CC]/20 rounded-[2rem] blur-2xl animate-ping scale-75" />
            </div>
            <div className="mt-8 flex flex-col items-center space-y-2">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">
                    Syncing Account...
                </p>
            </div>
        </div>
    );
}

export default function AppLoginPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <div className="w-16 h-16 rounded-full border-4 border-[#003399] border-t-transparent animate-spin" />
            </div>
        }>
            <AppLoginHandler />
        </Suspense>
    );
}
