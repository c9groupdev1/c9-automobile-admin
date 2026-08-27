'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { OfflineBanner } from '@/components/offline-banner';

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                retry: 1,
                networkMode: 'offlineFirst',
            },
            mutations: {
                networkMode: 'offlineFirst',
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <OfflineBanner />
            <Toaster position="top-right" richColors />
        </QueryClientProvider>
    );
}
