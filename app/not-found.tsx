'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Car, HelpCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10 space-y-8 bg-white/80 backdrop-blur-xl border border-slate-100/80 p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
        <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner relative animate-pulse">
          <ShieldAlert size={48} className="stroke-[1.5]" />
          <div className="absolute inset-0 rounded-full border border-rose-200/50 scale-110" />
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#003399] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Error 404
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none pt-2 uppercase">
            Vehicle Not Found
          </h1>
          <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs mx-auto">
            The vehicle listing or page you are looking for does not exist, has been sold, or was removed by the seller.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Link href="/marketplace" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#003399] hover:bg-blue-800 text-white font-bold h-12 rounded-xl px-6 shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2">
              <Car size={16} />
              Go to Marketplace
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto border-slate-200 hover:bg-slate-50 font-bold h-12 rounded-xl px-6 transition-all flex items-center justify-center gap-2 text-slate-600">
              <ArrowLeft size={16} />
              Back Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
