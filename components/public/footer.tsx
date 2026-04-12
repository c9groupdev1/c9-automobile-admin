'use client';

import React from 'react';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export function PublicFooter() {
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
                    </div>

                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.3em] text-slate-600 mb-10">Platform</h4>
                        <ul className="space-y-6 text-lg font-bold">
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
