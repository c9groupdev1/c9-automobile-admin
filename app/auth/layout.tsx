'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-6 relative overflow-hidden">
            {/* Back to Home Navigation */}
            <div className="absolute top-8 left-8 z-50">
                <Link
                    href="/"
                    className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/40 border border-[#0066CC]/10 backdrop-blur-md hover:bg-white/60 hover:border-[#0066CC]/20 transition-all active:scale-95 shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 text-[#0066CC] group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066CC]">Back to Home </span>
                </Link>
            </div>
            {/* Grid Overlay for Texture */}
            <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none z-0" />

            {/* Floating Logo Watermark */}
            <div className="absolute -top-24 -right-24 w-96 h-96 opacity-[0.03] pointer-events-none rotate-12">
                <Logo className="w-full h-full" />
            </div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 opacity-[0.03] pointer-events-none -rotate-12">
                <Logo className="w-full h-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.21, 1, 0.36, 1] }}
                className="w-full max-w-[440px] relative z-10"
            >
                <div className="glass-dark rounded-[3rem] p-8 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,102,204,0.15)] border border-white/20">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-[#0066CC] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                            <Logo className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tighter font-display">C9x Protocol</h2>
                        <div className="h-1 w-12 bg-linear-to-r from-[#0066CC] to-[#00AAFF] rounded-full mt-4"></div>
                    </div>
                    {children}
                </div>

                {/* Footer credit */}
                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] opacity-50">
                        Institutional Grade Security
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
