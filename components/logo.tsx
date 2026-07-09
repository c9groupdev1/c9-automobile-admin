'use client';

import React from 'react';
import { cn } from '@/lib/utils';

import Image from 'next/image';

export function Logo({ className = "w-12 h-12" }: { className?: string }) {
    return (
        <div className={cn("relative flex items-center justify-center transition-all duration-500", className)}>
            <Image 
                src="/c9x-logo.png" 
                alt="C9X Logo" 
                fill
                priority
                sizes="48px"
                className="object-contain drop-shadow-sm"
            />
        </div>
    );
}
