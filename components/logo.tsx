'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className = "w-12 h-12" }: { className?: string }) {
    return (
        <div className={cn("relative flex items-center justify-center overflow-hidden", className)}>
            <img 
                src="/c9x-logo.png" 
                alt="C9x Logo" 
                className="w-full h-full object-contain"
            />
        </div>
    );
}
