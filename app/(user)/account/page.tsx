'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from '@/components/dashboard/profile-settings';
import { SecuritySettings } from '@/components/dashboard/security-settings';
import { BillingSettings } from '@/components/dashboard/billing-settings';
import { User, ShieldCheck, CreditCard, Smartphone } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function AccountPage() {
    const { user } = useAuthStore();
    const isVerified = user?.roles?.some(role => role.toLowerCase() === 'verified_user');
    const [deviceOS, setDeviceOS] = useState<'ios' | 'android' | 'desktop'>('desktop');

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
        if (/android/i.test(userAgent)) {
            setDeviceOS('android');
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
            setDeviceOS('ios');
        } else {
            setDeviceOS('desktop');
        }
    }, []);

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">My Account</h2>
                    <p className="text-slate-500 font-medium">
                        Manage your membership credentials, security{isVerified ? ', and subscription plans' : ''}.
                    </p>
                </div>
            </div>

            {/* Mobile App Promotion Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#001533] via-[#003399] to-[#001f54] rounded-[2rem] p-8 md:p-10 shadow-xl border border-[#003399]/20 flex flex-col md:flex-row items-center justify-between gap-8 group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[6rem] -z-10 group-hover:bg-blue-500/20 transition-all duration-700" />
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-[4rem] -z-10" />

                <div className="space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 border border-blue-400/20 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest mx-auto md:mx-0">
                        <Smartphone size={12} />
                        C9X Mobile Experience
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none uppercase">
                        Take C9X on the Go
                    </h3>
                    <p className="text-blue-100/75 text-sm font-medium leading-relaxed max-w-xl">
                        Access real-time automotive auctions, live bidding, instant push notifications, and verified vehicle transactions straight from your pocket.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-center md:justify-end shrink-0">
                    {/* App Store Download Button */}
                    {(deviceOS === 'ios' || deviceOS === 'desktop') && (
                        <a
                            href="https://apps.apple.com/ng/app/c9x/id6762285536"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-slate-950 hover:bg-[#003399] text-white rounded-2xl px-6 py-3.5 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-black/20 hover:shadow-black/30 border border-slate-800 w-full sm:w-auto justify-center group"
                        >
                            <svg className="w-6 h-6 fill-current text-white shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
                            </svg>
                            <div className="text-left leading-none">
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 leading-none">Download on the</p>
                                <p className="text-base font-extrabold text-white leading-none mt-1">App Store</p>
                            </div>
                        </a>
                    )}

                    {/* Google Play Download Button */}
                    {(deviceOS === 'android' || deviceOS === 'desktop') && (
                        <a
                            href="https://play.google.com/store/apps/details?id=com.c9x.automobile&pli=1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-slate-950 hover:bg-[#003399] text-white rounded-2xl px-6 py-3.5 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-black/20 hover:shadow-black/30 border border-slate-800 w-full sm:w-auto justify-center group"
                        >
                            <svg className="w-6 h-6 fill-current text-white shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path d="M5.25 3.375c-.247 0-.495.068-.712.203l11.437 11.438 2.625-1.5c.712-.412 1.15-1.125 1.15-1.938s-.438-1.525-1.15-1.938L6.47 3.633c-.368-.21-.8-.328-1.22-.328zm-1.5 1.125C3.275 4.8 3 5.4 3 6.1v11.8c0 .7.275 1.3.75 1.6l8.25-8.25-8.25-8.25zm9.5 9.5l-2.25-2.25-8.25 8.25c.212.075.45.125.7.125.287 0 .563-.075.812-.212l8.988-5.138z" />
                            </svg>
                            <div className="text-left leading-none">
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 leading-none">Get it on</p>
                                <p className="text-base font-extrabold text-white leading-none mt-1">Google Play</p>
                            </div>
                        </a>
                    )}
                </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="bg-slate-100/50 rounded-2xl p-1 gap-1 h-14 w-full md:w-fit flex mb-8">
                    <TabsTrigger
                        value="profile"
                        className="flex-1 md:flex-none rounded-xl px-8 h-12 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#003399]"
                    >
                        <User size={16} className="mr-2" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="flex-1 md:flex-none rounded-xl px-8 h-12 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#003399]"
                    >
                        <ShieldCheck size={16} className="mr-2" />
                        Security
                    </TabsTrigger>
                    {/* {isVerified && (
                        <TabsTrigger 
                            value="billing" 
                            className="flex-1 md:flex-none rounded-xl px-8 h-12 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#003399]"
                        >
                            <CreditCard size={16} className="mr-2" />
                            Billing
                        </TabsTrigger>
                    )} */}
                </TabsList>

                <TabsContent value="profile" className="focus-visible:outline-none">
                    <ProfileSettings />
                </TabsContent>

                <TabsContent value="security" className="focus-visible:outline-none">
                    <SecuritySettings />
                </TabsContent>

                {isVerified && (
                    <TabsContent value="billing" className="focus-visible:outline-none">
                        <BillingSettings />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
