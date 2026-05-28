'use client';

import React from 'react';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export function PublicFooter() {
    const { isAuthenticated, user } = useAuthStore();
    
    const hasStaffRole = user?.roles?.some((role: string) => 
        !['user', 'verified_user'].includes(role.toLowerCase())
    );

    const accountHref = isAuthenticated 
        ? (hasStaffRole ? '/admin/dashboard' : '/account') 
        : '/secured-admin/login';

    return (
        <footer className="bg-slate-900 text-white py-40 border-t border-slate-800 relative z-10 rounded-t-[4rem]">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid md:grid-cols-4 gap-24 mb-32">
                    <div className="col-span-2 space-y-10">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-[#0066CC] rounded-xl flex items-center justify-center">
                                <Logo className="w-8 h-8" />
                            </div>
                            <span className="text-3xl font-bold tracking-tighter font-display">C9x</span>
                        </div>
                        <p className="text-slate-400 font-medium leading-relaxed text-xl max-w-sm">
                            Redefining automotive commerce through technology, trust, and transparency. Built for the future elite.
                        </p>
                        <div className="flex items-center space-x-10 text-slate-400">
                            {['Twitter', 'LinkedIn', 'Instagram'].map(s => (
                                <a key={s} href="#" className="font-bold text-xs uppercase tracking-widest hover:text-[#0066CC] transition-colors">{s}</a>
                            ))}
                        </div>
                        <div className="space-y-4 pt-2">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Download Mobile App</h5>
                            <div className="flex flex-wrap items-center gap-3">
                                {/* App Store */}
                                <a
                                    href="https://apps.apple.com/ng/app/c9x/id6762285536"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-white rounded-xl px-4 py-2 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-md border border-slate-700/50"
                                >
                                    <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
                                    </svg>
                                    <div className="text-left leading-none">
                                        <p className="text-[8px] uppercase font-bold tracking-widest text-slate-400">Download on the</p>
                                        <p className="text-xs font-bold text-white mt-0.5">App Store</p>
                                    </div>
                                </a>

                                {/* Google Play */}
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.c9x.automobile&pli=1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-white rounded-xl px-4 py-2 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-md border border-slate-700/50"
                                >
                                    <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                                        <path d="M5 3.66c-.08 0-.15 0-.22.02L13.1 12l-8.32 8.32c.07.02.14.02.22.02.34 0 .68-.11.97-.33l11.45-6.54c.64-.37.98-.95.98-1.57s-.34-1.2-.98-1.57L6.97 3.99c-.29-.22-.63-.33-.97-.33z"/>
                                    </svg>
                                    <div className="text-left leading-none">
                                        <p className="text-[8px] uppercase font-bold tracking-widest text-slate-400">Get it on</p>
                                        <p className="text-xs font-bold text-white mt-0.5">Google Play</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.3em] text-slate-600 mb-10">Platform</h4>
                        <ul className="space-y-6 text-lg font-bold">
                            <li><Link href={accountHref} className="hover:text-[#0066CC] transition-colors">My Account</Link></li>
                            <li><Link href="/#features" className="hover:text-[#0066CC] transition-colors">Auctions</Link></li>
                            <li><Link href="/#features" className="hover:text-[#0066CC] transition-colors">Marketplace</Link></li>
                            <li><Link href="/services" className="hover:text-[#0066CC] transition-colors">Services</Link></li>
                            <li><Link href="/vendor-guidelines" className="hover:text-[#0066CC] transition-colors">Vendor Guidelines</Link></li>
                            <li><Link href="/guidelines" className="hover:text-[#0066CC] transition-colors">Guidelines</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.3em] text-slate-600 mb-10">Company</h4>
                        <ul className="space-y-6 text-lg font-bold">
                            <li><Link href="/about" className="hover:text-[#0066CC] transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-[#0066CC] transition-colors">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-[#0066CC] transition-colors">Privacy</Link></li>
                            <li><Link href="/terms" className="hover:text-[#0066CC] transition-colors">Terms</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
                    <p className="text-xs font-bold uppercase tracking-widest">© 2026 C9x Automobile Ecosystem. All Rights Reserved.</p>
                    {/* <div className="flex items-center gap-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol v0.4.2</span>
                    </div> */}
                </div>
            </div>
        </footer>
    );
}
