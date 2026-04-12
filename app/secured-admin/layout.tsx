'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Globe } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc] overflow-hidden">
            {/* Left Side: Branding & Info (Hidden on mobile or stacks) */}
            <div className="hidden md:flex md:w-[45%] lg:w-[40%] bg-[#003399] relative flex-col justify-between p-12 lg:p-16 text-white overflow-hidden">
                {/* Background Patterns */}
                <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 space-y-12">
                    {/* Logo & Portal Label */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-flex items-center space-x-3 group">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                                <Logo className="w-8 h-8 text-[#003399]" />
                            </div>
                        </Link>
                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Admin Portal</div>
                    </div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
                    >
                        Manage Your <br />
                        Automotive <br />
                        <span className="text-white/90">Marketplace</span>
                    </motion.h1>

                    <p className="text-lg lg:text-xl text-white/70 font-medium leading-relaxed max-w-sm">
                        Manage users, listings, auctions, services, orders, and platform operations.
                    </p>

                    {/* Authorized Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex items-start space-x-4 max-w-md shadow-2xl"
                    >
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="text-white" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-1">Authorized Personnel Only</h4>
                            <p className="text-sm text-white/60 leading-relaxed font-medium">
                                This portal is restricted to verified C9X system administrators.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Badges */}
                <div className="relative z-10 flex items-center space-x-8 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <div className="flex items-center space-x-2">
                        <Lock size={14} />
                        <span>256-bit SSL Encrypted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Globe size={14} />
                        <span>Secure Infrastructure</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
                {/* Back to Home Navigation (Mobile & Desktop Overlay) */}
                <div className="absolute top-8 right-8 z-50">
                    <Link
                        href="/"
                        className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 hover:border-[#0066CC]/20 transition-all active:scale-95 shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 text-[#0066CC] group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066CC]">Home </span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[500px]"
                >
                    {children}
                </motion.div>

                {/* Bottom Copyright */}
                <div className="mt-12 text-center space-y-2 opacity-100">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {new Date().getFullYear()} C9X Automotive Marketplace. All rights reserved.
                    </p>
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-[0.3em]">
                        C9X Admin Portal v1.0
                    </p>
                </div>
            </div>
        </div>
    );
}
