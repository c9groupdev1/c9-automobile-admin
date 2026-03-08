'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function PublicNavbar() {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToWaitlist = () => {
        const el = document.getElementById('waitlist');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            router.push('/#waitlist');
        }
    };

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3 shadow-md' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
                            <div className="logo-glow">
                                <Logo className="w-10 h-10 shadow-lg" />
                            </div>
                            <span className="text-2xl font-bold tracking-tighter text-[#0066CC] font-display">C9x</span>
                        </Link>

                        {/* Desktop links */}
                        <div className="hidden md:flex items-center space-x-12">
                            <Link href="/#features" className="text-sm font-semibold text-slate-600 hover:text-[#0066CC] transition-colors">Features</Link>
                            <Link href="/services" className="text-sm font-semibold text-slate-600 hover:text-[#0066CC] transition-colors">Services</Link>
                            <Link href="/about" className="text-sm font-semibold text-slate-600 hover:text-[#0066CC] transition-colors">About</Link>
                            <Link href="/contact" className="text-sm font-semibold text-slate-600 hover:text-[#0066CC] transition-colors">Contact</Link>
                            {isAuthenticated ? (
                                <Button onClick={() => router.push('/dashboard')} size="sm" className="rounded-full px-7 h-11 transition-all font-bold bg-[#0066CC] hover:bg-blue-700 text-white shadow-lg">
                                    Admin Dashboard
                                </Button>
                            ) : (
                                <div className="flex items-center space-x-8">
                                    <button onClick={() => router.push('/auth/login')} className="text-sm font-bold text-slate-600 hover:text-[#0066CC] transition-colors">
                                        Sign In
                                    </button>
                                    <Button onClick={scrollToWaitlist} size="sm" className="rounded-full px-7 h-11 transition-all font-bold bg-[#0066CC] hover:bg-blue-700 text-white shadow-lg hover:scale-105 transform">
                                        Get Early Access
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Mobile toggle */}
                        <button className="md:hidden text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl px-8 pt-32 md:hidden"
                    >
                        <div className="flex flex-col space-y-10">
                            <Link href="/#features" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-slate-900">Features</Link>
                            <Link href="/services" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-slate-900">Services</Link>
                            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-slate-900">About</Link>
                            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-slate-900">Contact</Link>
                            <div className="pt-10 border-t border-slate-100 flex flex-col space-y-5">
                                <Button variant="outline" onClick={() => router.push('/auth/login')} className="w-full h-16 rounded-2xl text-xl font-bold">Sign In</Button>
                                <Button onClick={() => { setIsMenuOpen(false); scrollToWaitlist(); }} className="w-full h-16 rounded-2xl text-xl font-bold bg-[#0066CC]">Join Waitlist</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
