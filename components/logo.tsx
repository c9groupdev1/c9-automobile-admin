'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className = "w-12 h-12" }: { className?: string }) {
    return (
        <div className={cn("relative flex items-center justify-center transition-all duration-500", className)}>
            <img 
                src="/c9x-logo.png" 
                alt="C9X Logo" 
                className="w-full h-full object-contain drop-shadow-sm"
            />
        </div>
    );
}
