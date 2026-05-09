'use client';

import { useBillingPlans, useSubscribeToPlan, usePurchaseBadge } from '@/hooks/useUserBilling';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, CheckCircle2, Crown, ShieldCheck, Zap, ArrowRight, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BillingSettings() {
    const { data: plans, isLoading: isLoadingPlans } = useBillingPlans();
    const { data: profile } = useUserProfile();
    const subscribe = useSubscribeToPlan();
    const purchaseBadge = usePurchaseBadge();

    if (isLoadingPlans) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#003399]" />
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Current Status Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-slate-100 shadow-sm rounded-[2rem] bg-gradient-to-br from-[#003399] to-[#0066CC] text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Crown size={80} />
                    </div>
                    <CardHeader className="pb-2 relative z-10">
                        <div className="flex items-center justify-between">
                            <Crown className="h-6 w-6 text-blue-200" />
                            <Badge className="bg-white/20 text-white border-0 text-[10px] font-black uppercase tracking-widest">Active Tier</Badge>
                        </div>
                        <CardTitle className="text-2xl font-black mt-4">
                            {profile?.activeSubscription?.plan?.name || 'Standard Protocol'}
                        </CardTitle>
                        <CardDescription className="text-blue-100 font-medium">
                            {profile?.activeSubscription?.expiresAt ? `Valid until ${new Date(profile.activeSubscription.expiresAt).toLocaleDateString()}` : 'No active subscription'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-3xl font-black">
                                {profile?.activeSubscription ? 'Active' : '₦0.00'}
                            </span>
                            {!profile?.activeSubscription && <span className="text-blue-100 text-xs font-bold">/month</span>}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm rounded-[2rem] bg-slate-50 relative overflow-hidden group">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <ShieldCheck className="h-6 w-6 text-emerald-600" />
                            {profile?.hasVerifiedBadge ? (
                                <Badge className="bg-emerald-100 text-emerald-600 border-0 text-[10px] font-black uppercase tracking-widest">Verified</Badge>
                            ) : (
                                <Badge className="bg-amber-100 text-amber-600 border-0 text-[10px] font-black uppercase tracking-widest">Protocol Required</Badge>
                            )}
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900 mt-4">Verification Badge</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">Standalone trust credential</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!profile?.hasVerifiedBadge ? (
                            <Button 
                                onClick={() => purchaseBadge.mutate()} 
                                disabled={purchaseBadge.isPending}
                                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs h-11 transition-all shadow-md shadow-emerald-900/10"
                            >
                                {purchaseBadge.isPending ? <Loader2 size={14} className="animate-spin" /> : "Acquire Annual Badge"}
                            </Button>
                        ) : (
                            <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                <CheckCircle2 size={16} />
                                Active Badge Protocol
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm rounded-[2rem] bg-slate-50">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <Zap className="h-6 w-6 text-violet-600" />
                            <Badge className="bg-violet-100 text-violet-600 border-0 text-[10px] font-black uppercase tracking-widest">Capacity</Badge>
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900 mt-4">Listing Utilization</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">Active boosting capacity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900">{profile?.activeListingsCount || 0}</span>
                            <span className="text-slate-500 text-xs font-bold text-slate-400">/ {profile?.remainingListings ? (profile.remainingListings + profile.activeListingsCount) : '...'} slots</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Plan Matrix */}
            <div>
                <div className="flex items-center gap-3 mb-8 px-4">
                    <Wallet className="text-[#003399] h-5 w-5" />
                    <h3 className="text-xl font-bold text-slate-900">Subscription Protocol Matrix</h3>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    {plans?.map((plan) => (
                        <Card key={plan.id} className={cn(
                            "border-slate-100 shadow-sm rounded-[3rem] overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 group",
                            plan.level > 0 ? "border-[#003399]/20 bg-blue-50/10 ring-1 ring-[#003399]/5" : ""
                        )}>
                            <CardHeader className="p-8 pb-4 text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
                                    {plan.level > 0 ? 'Enterprise Tier' : 'Community Tier'}
                                </p>
                                <CardTitle className="text-2xl font-black text-slate-900">{plan.name}</CardTitle>
                                <div className="mt-6 flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-black text-slate-900">₦{Number(plan.monthly_price).toLocaleString()}</span>
                                    <span className="text-slate-500 text-sm font-bold text-slate-400">/mo</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4">
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                                        <span>{plan.listing_limit === -1 ? 'Unlimited' : plan.listing_limit} Vehicle Listings</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                                        <span>{plan.featured_ads_limit} Featured Placements</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                                        <span>{plan.duration_days} Days Protocol Cycle</span>
                                    </li>
                                    {plan.has_verified_badge && (
                                        <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                                            <span>Integrated Verification Badge</span>
                                        </li>
                                    )}
                                </ul>
                                <Button 
                                    onClick={() => subscribe.mutate(plan.id)}
                                    disabled={subscribe.isPending || Number(plan.monthly_price) === 0}
                                    className={cn(
                                        "w-full rounded-2xl h-12 font-bold transition-all",
                                        plan.level > 0 
                                            ? "bg-[#003399] hover:bg-blue-800 text-white shadow-lg shadow-blue-900/20" 
                                            : "bg-slate-100 border-0 text-slate-400 cursor-not-allowed"
                                    )}
                                >
                                    {subscribe.isPending ? <Loader2 className="animate-spin" /> : (
                                        Number(plan.monthly_price) === 0 ? "Current Protocol" : (
                                            <>
                                                Initiate Upgrade
                                                <ArrowRight size={16} className="ml-2" />
                                            </>
                                        )
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Billing History */}
            <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-lg font-bold text-slate-900">Transaction Audit Log</CardTitle>
                    <CardDescription className="font-medium text-slate-500">Historical record of all platform fiscal events.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <tr className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-5 text-sm font-bold text-slate-600">Active</td>
                                    <td className="px-8 py-5 text-sm font-bold text-slate-900">Standard Free Protocol</td>
                                    <td className="px-8 py-5 text-sm font-bold text-slate-900">₦0.00</td>
                                    <td className="px-8 py-5 text-right">
                                        <Badge className="bg-emerald-50 text-emerald-600 border-0 text-[9px] font-black uppercase tracking-widest px-2">Verified</Badge>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
