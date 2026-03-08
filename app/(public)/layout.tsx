'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PublicNavbar } from '@/components/public/navbar';
import { PublicFooter } from '@/components/public/footer';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="min-h-screen gradient-bg text-slate-900 selection:bg-primary/10 selection:text-primary scroll-smooth font-sans antialiased overflow-x-hidden relative">
            {/* Scroll Progress Indicator */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[3px] bg-[#0066CC] z-[70] origin-left"
                style={{ scaleX }}
            />

            {/* Grid Overlay for Texture */}
            <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none z-0" />

            <PublicNavbar />

            <main className="relative z-10">
                {children}
            </main>

            <PublicFooter />
        </div>
    );
}
