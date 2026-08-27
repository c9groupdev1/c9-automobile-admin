'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function OfflineBanner() {
    const [isOffline, setIsOffline] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        const handleOffline = () => {
            setIsOffline(true);
            toast.error('Connection Lost', {
                description: 'You are currently working offline. Session state is saved locally.',
                id: 'network-offline-toast',
                duration: 5000,
            });
        };

        const handleOnline = () => {
            setIsOffline(false);
            toast.success('Back Online', {
                description: 'Internet connection restored. Synchronizing system data...',
                id: 'network-online-toast',
                duration: 4000,
            });
        };

        // Sync initial state
        if (typeof window !== 'undefined') {
            setIsOffline(!window.navigator.onLine);
            window.addEventListener('offline', handleOffline);
            window.addEventListener('online', handleOnline);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('offline', handleOffline);
                window.removeEventListener('online', handleOnline);
            }
        };
    }, []);

    const checkConnection = async () => {
        setIsChecking(true);
        try {
            // Ping lightweight endpoint or check navigator status
            if (typeof window !== 'undefined' && window.navigator.onLine) {
                const res = await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' }).catch(() => null);
                if (res) {
                    setIsOffline(false);
                    toast.success('Connection Verified', {
                        description: 'System is connected to the network.',
                    });
                } else {
                    toast.warning('Still Offline', {
                        description: 'Network is still unreachable. Please check your Wi-Fi or cellular network.',
                    });
                }
            } else {
                toast.warning('Still Offline', {
                    description: 'No internet connection detected by your browser.',
                });
            }
        } catch {
            toast.warning('Still Offline', {
                description: 'Unable to reach backend network servers.',
            });
        } finally {
            setTimeout(() => setIsChecking(false), 600);
        }
    };

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 80, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-lg"
                >
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-rose-500/30 shadow-2xl rounded-2xl p-4 text-white flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 animate-pulse">
                                <WifiOff className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">Offline Mode Active</h4>
                                <p className="text-xs text-slate-300 font-medium">Session preserved. System functionality paused until reconnected.</p>
                            </div>
                        </div>

                        <Button
                            onClick={checkConnection}
                            disabled={isChecking}
                            size="sm"
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold text-xs rounded-xl transition-all shrink-0 flex items-center gap-1.5"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                            <span>{isChecking ? 'Checking...' : 'Retry'}</span>
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
