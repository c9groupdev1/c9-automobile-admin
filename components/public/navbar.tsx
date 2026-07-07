'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, Car, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from '@/lib/api';

export function PublicNavbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await api.post('/users/logout');
        } catch (e) {}
        logout();
        router.push('/login');
    };
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHome = pathname === '/overview';

    const navClass = isHome
        ? (scrolled ? 'glass py-3 shadow-md border-b border-slate-100/50' : 'bg-transparent py-6')
        : 'glass py-3 shadow-sm border-b border-slate-150/50';

    const textClass = isHome
        ? (scrolled ? 'text-slate-600 hover:text-[#0066CC]' : 'text-white/80 hover:text-white')
        : 'text-slate-600 hover:text-[#0066CC]';

    const signInClass = isHome
        ? (scrolled ? 'text-slate-600 hover:text-[#0066CC]' : 'text-white hover:text-slate-200')
        : 'text-slate-600 hover:text-[#0066CC]';

    const actionBtnClass = isHome
        ? (scrolled ? 'bg-[#003399] text-white hover:bg-blue-800' : 'bg-white text-[#003399] hover:bg-slate-100')
        : 'bg-[#003399] text-white hover:bg-blue-800';

    const toggleColorClass = isHome
        ? (scrolled ? 'text-slate-600' : 'text-white')
        : 'text-slate-600';

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${navClass}`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
                            <div className="logo-glow">
                                <Logo className="w-10 h-10 shadow-lg" />
                            </div>
                            {/* <span className={`text-2xl font-bold tracking-tighter font-display ${scrolled ? 'text-[#0066CC]' : 'text-white'}`}>C9x</span> */}
                        </Link>

                        <div className="hidden md:flex items-center space-x-8">
                            <div className={isAuthenticated ? "hidden lg:flex items-center space-x-6 mr-6" : "flex items-center space-x-12 mr-8"}>
                                {!isAuthenticated ? (
                                    <>
                                        <Link href="/about" className={`text-sm font-bold transition-colors ${textClass}`}>About Us</Link>
                                        <Link href="/contact" className={`text-sm font-bold transition-colors ${textClass}`}>Contact Us</Link>
                                        <Link href="/faq" className={`text-sm font-bold transition-colors ${textClass}`}>FAQ</Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/marketplace" className={`text-sm font-bold transition-colors ${textClass}`}>Marketplace</Link>
                                        <Link href="/list-vehicle" className={`text-sm font-bold transition-colors ${textClass}`}>Sell Car</Link>
                                        <Link href="/my-listings" className={`text-sm font-bold transition-colors ${textClass}`}>Listings</Link>
                                        <Link href="/favorites" className={`text-sm font-bold transition-colors ${textClass}`}>Favorites</Link>
                                        <Link href="/messages" className={`text-sm font-bold transition-colors ${textClass}`}>Messages</Link>
                                        <Link href="/support" className={`text-sm font-bold transition-colors ${textClass}`}>Support</Link>
                                    </>
                                )}
                            </div>
                            
                            {isAuthenticated ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger render={
                                        <Button className={`rounded-xl px-4 font-bold h-11 transition-all flex items-center gap-2 ${actionBtnClass}`} />
                                    }>
                                        <User size={16} />
                                        {user?.name?.split(' ')[0] || 'Account'}
                                        <ChevronDown size={14} className="opacity-70" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-100 p-2 shadow-xl">
                                        <DropdownMenuLabel className="font-black text-slate-800 text-xs uppercase tracking-widest px-3 py-2">
                                            My Account
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-slate-100 mb-2" />
                                        
                                        {user?.roles?.some(r => !['user', 'verified_user'].includes(r.toLowerCase())) && (
                                            <DropdownMenuItem render={<Link href="/admin/dashboard" className="flex items-center" />} className="rounded-xl cursor-pointer font-semibold text-slate-600 focus:bg-[#003399]/5 focus:text-[#003399] py-2.5">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                Admin Dashboard
                                            </DropdownMenuItem>
                                        )}
                                        
                                        <DropdownMenuItem render={<Link href="/account" className="flex items-center" />} className="rounded-xl cursor-pointer font-semibold text-slate-600 focus:bg-[#003399]/5 focus:text-[#003399] py-2.5">
                                            <User className="mr-2 h-4 w-4" />
                                            Profile Settings
                                        </DropdownMenuItem>

                                        <DropdownMenuItem render={<Link href="/my-listings" className="flex items-center" />} className="rounded-xl cursor-pointer font-semibold text-slate-600 focus:bg-[#003399]/5 focus:text-[#003399] py-2.5">
                                            <Car className="mr-2 h-4 w-4" />
                                            My Listings
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuSeparator className="bg-slate-100 my-2" />
                                        
                                        <DropdownMenuItem 
                                            onClick={handleLogout}
                                            className="rounded-xl cursor-pointer font-semibold text-rose-600 focus:bg-rose-50 focus:text-rose-700 py-2.5"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link href="/login">
                                        <button className={`text-sm font-bold transition-colors hover:opacity-85 cursor-pointer ${signInClass}`}>
                                            Sign In
                                        </button>
                                    </Link>
                                    <Link href="/register">
                                        <Button className={`rounded-xl px-6 font-bold h-11 transition-all ${actionBtnClass}`}>
                                            Register
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile toggle */}
                        <div className="flex items-center space-x-4 md:hidden">
                             {isAuthenticated ? (
                                <Link href={user?.roles.some(r => !['user', 'verified_user'].includes(r.toLowerCase())) ? '/admin/dashboard' : '/account'}>
                                    <Button size="sm" className={`rounded-lg px-4 font-bold text-[10px] h-8 ${actionBtnClass}`}>
                                        Account
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/register">
                                    <Button size="sm" className={`rounded-lg px-4 font-bold text-[10px] h-8 ${actionBtnClass}`}>
                                        Register
                                    </Button>
                                </Link>
                            )}
                            <button className={toggleColorClass} onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
                        <div className="flex flex-col space-y-8">
                            {!isAuthenticated ? (
                                <>
                                    <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">About Us</Link>
                                    <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">Contact Us</Link>
                                    <Link href="/faq" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">FAQ</Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/marketplace" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">Marketplace</Link>
                                    <Link href="/list-vehicle" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">Sell Your Car</Link>
                                    <Link href="/my-listings" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">My Listings</Link>
                                    <Link href="/favorites" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">Favorites</Link>
                                    <Link href="/messages" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">Messages</Link>
                                    <Link href="/support" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">Support / Help</Link>
                                </>
                            )}
                            <div className="pt-6 border-t border-slate-100 flex flex-col space-y-4">
                                {isAuthenticated ? (
                                    <>
                                        <Link 
                                            href={user?.roles.some(r => !['user', 'verified_user'].includes(r.toLowerCase())) ? '/admin/dashboard' : '/account'}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full text-left px-4 py-3 bg-slate-50 text-slate-900 rounded-xl font-bold text-sm shadow-sm flex items-center gap-3"
                                        >
                                            <User size={18} className="text-[#003399]" />
                                            Profile Settings
                                        </Link>
                                        <Link 
                                            href="/my-listings"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full text-left px-4 py-3 bg-slate-50 text-slate-900 rounded-xl font-bold text-sm shadow-sm flex items-center gap-3"
                                        >
                                            <Car size={18} className="text-[#003399]" />
                                            My Listings
                                        </Link>
                                        <button 
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                handleLogout();
                                            }}
                                            className="w-full text-left px-4 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm shadow-sm flex items-center gap-3 mt-2"
                                        >
                                            <LogOut size={18} />
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link 
                                            href="/register" 
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full text-center py-3.5 bg-[#003399] text-white rounded-xl font-bold text-sm shadow-sm"
                                        >
                                            Register / Sign Up
                                        </Link>
                                        <Link 
                                            href="/login" 
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full text-center py-3.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-sm"
                                        >
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
