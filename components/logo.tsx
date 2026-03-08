'use client';

import React from 'react';

export function Logo({ className = "w-12 h-12" }: { className?: string }) {
    return (
        <div className={`${className} bg-linear-to-br from-[#0066CC] to-[#004499] rounded-xl shadow-lg flex items-center justify-center overflow-hidden`}>
            <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#0066CC', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#004499', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="swooshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#00AAFF', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#0066CC', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#bgGrad)" rx="30" />
                <path d="M 40 140 Q 80 100 120 110 T 180 80" stroke="url(#swooshGrad)" strokeWidth="12" fill="none" strokeLinecap="round" />
                <path d="M 50 150 Q 90 110 130 120 T 190 90" stroke="rgba(255,255,255,0.3)" strokeWidth="6" fill="none" strokeLinecap="round" />
                <text x="55" y="135" fontFamily="Arial, sans-serif" fontSize="90" fontWeight="bold" fill="white">C9</text>
                <text x="145" y="135" fontFamily="Arial, sans-serif" fontSize="70" fontWeight="bold" fill="white">x</text>
            </svg>
        </div>
    );
}
