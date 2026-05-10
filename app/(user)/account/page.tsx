'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from '@/components/dashboard/profile-settings';
import { SecuritySettings } from '@/components/dashboard/security-settings';
import { BillingSettings } from '@/components/dashboard/billing-settings';
import { User, ShieldCheck, CreditCard } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function AccountPage() {
    const { user } = useAuthStore();
    const isVerified = user?.roles?.some(role => role.toLowerCase() === 'verified_user');

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
                    {isVerified && (
                        <TabsTrigger 
                            value="billing" 
                            className="flex-1 md:flex-none rounded-xl px-8 h-12 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#003399]"
                        >
                            <CreditCard size={16} className="mr-2" />
                            Billing
                        </TabsTrigger>
                    )}
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
