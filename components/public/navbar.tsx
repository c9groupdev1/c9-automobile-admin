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
    const { isAuthenticated, user } = useAuthStore();
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
                            {/* <span className={`text-2xl font-bold tracking-tighter font-display ${scrolled ? 'text-[#0066CC]' : 'text-white'}`}>C9x</span> */}
                        </Link>

                        <div className="hidden md:flex items-center space-x-8">
                            <div className="flex items-center space-x-12 mr-8">
                                <Link href="/about" className={`text-sm font-bold transition-colors ${scrolled ? 'text-slate-600 hover:text-[#0066CC]' : 'text-white/80 hover:text-white'}`}>About Us</Link>
                                <Link href="/contact" className={`text-sm font-bold transition-colors ${scrolled ? 'text-slate-600 hover:text-[#0066CC]' : 'text-white/80 hover:text-white'}`}>Contact Us</Link>
                                <Link href="/faq" className={`text-sm font-bold transition-colors ${scrolled ? 'text-slate-600 hover:text-[#0066CC]' : 'text-white/80 hover:text-white'}`}>FAQ</Link>
                            </div>
                            
                            {isAuthenticated ? (
                                <Link href={user?.roles.some(r => ['admin', 'staff', 'super-admin', 'editor', 'support', 'moderator', 'manager'].includes(r.toLowerCase())) ? '/admin/dashboard' : '/account'}>
                                    <Button className={`rounded-xl px-6 font-bold h-11 transition-all ${scrolled ? 'bg-[#003399] text-white' : 'bg-white text-[#003399] hover:bg-slate-100'}`}>
                                        My Account
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/secured-admin/login">
                                    <Button className={`rounded-xl px-6 font-bold h-11 transition-all ${scrolled ? 'bg-[#003399] text-white' : 'bg-white text-[#003399] hover:bg-slate-100'}`}>
                                        Sign In
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile toggle */}
                        <div className="flex items-center space-x-4 md:hidden">
                             {isAuthenticated && (
                                <Link href={user?.roles.some(r => ['admin', 'staff', 'super-admin', 'editor', 'support', 'moderator', 'manager'].includes(r.toLowerCase())) ? '/admin/dashboard' : '/account'}>
                                    <Button size="sm" className={`rounded-lg px-4 font-bold text-[10px] h-8 ${scrolled ? 'bg-[#003399] text-white' : 'bg-white text-[#003399]'}`}>
                                        Account
                                    </Button>
                                </Link>
                            )}
                            <button className={scrolled ? 'text-slate-600' : 'text-white'} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                            </button>
                        </div>
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
                            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-slate-900">About Us</Link>
                            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-slate-900">Contact Us</Link>
                            <Link href="/faq" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-slate-900">FAQ</Link>
                            <div className="pt-10 border-t border-slate-100 flex flex-col space-y-5">
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
