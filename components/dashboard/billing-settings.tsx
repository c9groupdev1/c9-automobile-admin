'use client';

import { useState } from 'react';
import { useBillingPlans, useSubscribeToPlan, usePurchaseBadge, usePaymentHistory, usePaymentDetails } from '@/hooks/useUserBilling';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, CheckCircle2, Crown, ShieldCheck, Zap, ArrowRight, Wallet, ChevronLeft, ChevronRight, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function BillingSettings() {
    const { data: plans, isLoading: isLoadingPlans } = useBillingPlans();
    const { data: profile } = useUserProfile();
    const [paymentPage, setPaymentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [fromDateFilter, setFromDateFilter] = useState<string>('');
    const [toDateFilter, setToDateFilter] = useState<string>('');
    const [perPageFilter, setPerPageFilter] = useState<number>(10);
    const [selectedPaymentId, setSelectedPaymentId] = useState<number | string | null>(null);

    const { data: paymentsData, isLoading: isLoadingPayments } = usePaymentHistory({
        page: paymentPage,
        perPage: perPageFilter,
        status: statusFilter,
        fromDate: fromDateFilter,
        toDate: toDateFilter
    });
    const payments = paymentsData?.data || [];
    const meta = paymentsData?.meta;
    const { data: detailPayment, isLoading: isLoadingDetail } = usePaymentDetails(selectedPaymentId);
    const subscribe = useSubscribeToPlan();
    const purchaseBadge = usePurchaseBadge();

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '...';
        try {
            const d = new Date(dateStr.replace(' ', 'T'));
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) {
            return dateStr;
        }
    };

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
                <Card className="border-slate-100 shadow-sm rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-[#003399] to-[#0066CC] text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Crown size={80} />
                    </div>
                    <CardHeader className="p-5 sm:p-6 pb-2 relative z-10">
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
                    <CardContent className="p-5 sm:p-6 pt-0 relative z-10">
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-3xl font-black">
                                {profile?.activeSubscription ? 'Active' : '₦0.00'}
                            </span>
                            {!profile?.activeSubscription && <span className="text-blue-100 text-xs font-bold">/month</span>}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm rounded-2xl sm:rounded-[2rem] bg-slate-50 relative overflow-hidden group">
                    <CardHeader className="p-5 sm:p-6 pb-2">
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
                    <CardContent className="p-5 sm:p-6 pt-0">
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

                <Card className="border-slate-100 shadow-sm rounded-2xl sm:rounded-[2rem] bg-slate-50">
                    <CardHeader className="p-5 sm:p-6 pb-2">
                        <div className="flex items-center justify-between">
                            <Zap className="h-6 w-6 text-violet-600" />
                            <Badge className="bg-violet-100 text-violet-600 border-0 text-[10px] font-black uppercase tracking-widest">Capacity</Badge>
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900 mt-4">Listing Utilization</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">Active boosting capacity</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-6 pt-0">
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
                    <h3 className="text-xl font-bold text-slate-900">Subscription</h3>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    {plans?.map((plan) => (
                        <Card key={plan.id} className={cn(
                            "border-slate-100 shadow-sm rounded-2xl sm:rounded-[3rem] overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 group",
                            plan.level > 0 ? "border-[#003399]/20 bg-blue-50/10 ring-1 ring-[#003399]/5" : ""
                        )}>
                            <CardHeader className="p-5 sm:p-8 pb-4 text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
                                    {plan.level > 0 ? 'Enterprise Tier' : 'Community Tier'}
                                </p>
                                <CardTitle className="text-2xl font-black text-slate-900">{plan.name}</CardTitle>
                                <div className="mt-6 flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-black text-slate-900">₦{Number(plan.monthly_price).toLocaleString()}</span>
                                    <span className="text-slate-500 text-sm font-bold text-slate-400">/mo</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 sm:p-8 pt-4">
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
                                    disabled={
                                        subscribe.isPending ||
                                        profile?.activeSubscription?.plan?.id === plan.id ||
                                        (!profile?.activeSubscription && Number(plan.monthly_price) === 0)
                                    }
                                    className={cn(
                                        "w-full rounded-2xl h-12 font-bold transition-all",
                                        (profile?.activeSubscription?.plan?.id === plan.id || (!profile?.activeSubscription && Number(plan.monthly_price) === 0))
                                            ? "bg-slate-100 border-0 text-slate-400 cursor-not-allowed"
                                            : "bg-[#003399] hover:bg-blue-800 text-white shadow-lg shadow-blue-900/20"
                                    )}
                                >
                                    {subscribe.isPending ? <Loader2 className="animate-spin" /> : (
                                        (profile?.activeSubscription?.plan?.id === plan.id || (!profile?.activeSubscription && Number(plan.monthly_price) === 0))
                                            ? "Current Protocol"
                                            : (
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
            <Card className="border-slate-100 shadow-sm rounded-2xl sm:rounded-[2rem] overflow-hidden">
                <CardHeader className="p-4 sm:p-8 pb-4">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-900">Transaction Audit Log</CardTitle>
                            <CardDescription className="font-medium text-slate-500">Historical record of all platform fiscal events.</CardDescription>
                        </div>

                        {/* Query Parameter Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPaymentPage(1); }}
                                className="h-10 rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#003399] transition-all shadow-sm cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                <option value="successful">Successful</option>
                                <option value="failed">Failed</option>
                                <option value="pending">Pending</option>
                            </select>

                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1 h-10 shadow-sm">
                                <label className="text-[9px] font-black uppercase text-slate-400">From</label>
                                <input
                                    type="date"
                                    value={fromDateFilter}
                                    onChange={(e) => { setFromDateFilter(e.target.value); setPaymentPage(1); }}
                                    className="bg-transparent border-0 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1 h-10 shadow-sm">
                                <label className="text-[9px] font-black uppercase text-slate-400">To</label>
                                <input
                                    type="date"
                                    value={toDateFilter}
                                    onChange={(e) => { setToDateFilter(e.target.value); setPaymentPage(1); }}
                                    className="bg-transparent border-0 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                                />
                            </div>

                            <select
                                value={perPageFilter}
                                onChange={(e) => { setPerPageFilter(Number(e.target.value)); setPaymentPage(1); }}
                                className="h-10 rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#003399] transition-all shadow-sm cursor-pointer"
                            >
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={50}>50 per page</option>
                            </select>

                            {(statusFilter !== 'all' || fromDateFilter !== '' || toDateFilter !== '' || perPageFilter !== 20) && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setStatusFilter('all');
                                        setFromDateFilter('');
                                        setToDateFilter('');
                                        setPerPageFilter(20);
                                        setPaymentPage(1);
                                    }}
                                    className="h-10 text-xs font-bold text-slate-400 hover:text-slate-600 rounded-xl px-3"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-4 sm:px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                    <th className="px-4 sm:px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                                    <th className="px-4 sm:px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                                    <th className="px-4 sm:px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoadingPayments ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 sm:px-8 py-10 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Loader2 className="h-5 w-5 animate-spin text-[#003399]" />
                                                <span className="text-xs font-bold text-slate-400">Loading audit trail...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : payments && payments.length > 0 ? (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-slate-50/30 transition-colors cursor-pointer" onClick={() => setSelectedPaymentId(payment.id)}>
                                            <td className="px-4 sm:px-8 py-5 text-xs font-bold text-slate-500 whitespace-nowrap">
                                                {formatDate(payment.date)}
                                            </td>
                                            <td className="px-4 sm:px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 leading-tight">{payment.description || 'General Fiscal Event'}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider font-mono">
                                                        Ref: {payment.transactionId}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-8 py-5 text-sm font-black text-slate-900">
                                                {payment.formattedAmount || `₦${Number(payment.amount).toLocaleString()}`}
                                            </td>
                                            <td className="px-4 sm:px-8 py-5 text-right whitespace-nowrap">
                                                <Badge className={cn(
                                                    "border-0 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full",
                                                    payment.status.toLowerCase() === 'successful' || payment.status.toLowerCase() === 'success'
                                                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
                                                        : payment.status.toLowerCase() === 'failed'
                                                            ? "bg-rose-50 text-rose-600 hover:bg-rose-50"
                                                            : "bg-amber-50 text-amber-600 hover:bg-amber-600/10"
                                                )}>
                                                    {payment.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 sm:px-8 py-10 text-center text-xs font-bold text-slate-400">
                                            No transaction records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {meta && meta.last_page > 1 && (
                        <div className="px-4 sm:px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Showing {meta.from || 0}-{meta.to || 0} of {meta.total?.toLocaleString() || 0} transactions
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 rounded-xl border-slate-100 hover:bg-slate-50 disabled:opacity-30"
                                    onClick={() => setPaymentPage(p => Math.max(1, p - 1))}
                                    disabled={paymentPage === 1}
                                >
                                    <ChevronLeft size={16} />
                                </Button>
                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => {
                                        const p = i + 1;
                                        return (
                                            <Button
                                                key={p}
                                                onClick={() => setPaymentPage(p)}
                                                className={cn(
                                                    "h-9 w-9 rounded-xl font-bold text-xs",
                                                    paymentPage === p ? "bg-[#003399] text-white shadow-lg shadow-blue-900/10" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                                )}
                                            >
                                                {p}
                                            </Button>
                                        );
                                    })}
                                    {meta.last_page > 5 && <div className="px-2 self-end text-slate-400 font-bold mb-1">...</div>}
                                    {meta.last_page > 5 && (
                                        <Button
                                            onClick={() => setPaymentPage(meta.last_page)}
                                            className={cn(
                                                "h-9 px-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-xs hover:bg-slate-100",
                                                paymentPage === meta.last_page && "bg-[#003399] text-white shadow-lg shadow-blue-900/10"
                                            )}
                                        >
                                            {meta.last_page}
                                        </Button>
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 rounded-xl border-slate-100 hover:bg-slate-50 disabled:opacity-30"
                                    onClick={() => setPaymentPage(p => Math.min(meta.last_page, p + 1))}
                                    disabled={paymentPage === meta.last_page}
                                >
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payment Details Dialog */}
            <Dialog open={!!selectedPaymentId} onOpenChange={(open) => { if (!open) setSelectedPaymentId(null); }}>
                <DialogContent className="sm:max-w-md max-w-sm rounded-[2rem] p-6 bg-white border border-slate-100 shadow-2xl">
                    <DialogHeader className="text-center pb-2 flex flex-col items-center">
                        <div className="h-12 w-12 bg-blue-50 text-[#003399] rounded-full flex items-center justify-center mb-2">
                            <Receipt size={24} />
                        </div>
                        <DialogTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Payment Details</DialogTitle>
                        <DialogDescription className="text-xs font-semibold text-slate-400">Official receipt breakdown</DialogDescription>
                    </DialogHeader>

                    {isLoadingDetail ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-3">
                            <Loader2 className="h-8 w-8 animate-spin text-[#003399]" />
                            <span className="text-xs font-bold text-slate-400">Loading audit records...</span>
                        </div>
                    ) : detailPayment ? (
                        <div className="space-y-6">
                            {/* Summary info card */}
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Transaction Type</span>
                                    <span className="text-sm font-extrabold text-slate-900 leading-tight">{detailPayment.description || 'General Fiscal Event'}</span>
                                </div>
                                <Badge className={cn(
                                    "border-0 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap",
                                    detailPayment.status?.toLowerCase() === 'successful' || detailPayment.status?.toLowerCase() === 'success'
                                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
                                        : detailPayment.status?.toLowerCase() === 'failed'
                                            ? "bg-rose-50 text-rose-600 hover:bg-rose-50"
                                            : "bg-amber-50 text-amber-600 hover:bg-amber-600/10"
                                )}>
                                    {detailPayment.status}
                                </Badge>
                            </div>

                            {/* Core Transaction Metadata */}
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs border-y border-slate-100/70 py-4">
                                <div className="space-y-0.5">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Initiated At</span>
                                    <span className="font-bold text-slate-700">{formatDate(detailPayment.date)}</span>
                                </div>
                                {detailPayment.paidAt && (
                                    <div className="space-y-0.5">
                                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Settled At</span>
                                        <span className="font-bold text-slate-700">{formatDate(detailPayment.paidAt)}</span>
                                    </div>
                                )}
                                <div className="space-y-0.5 col-span-2">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Reference Code</span>
                                    <span className="font-mono font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-150 select-all break-all block">{detailPayment.reference}</span>
                                </div>
                                {detailPayment.transactionId && (
                                    <div className="space-y-0.5 col-span-2">
                                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Gateway Transaction ID</span>
                                        <span className="font-mono font-semibold text-slate-500 break-all block">{detailPayment.transactionId}</span>
                                    </div>
                                )}
                                <div className="space-y-0.5">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Gateway Node</span>
                                    <span className="font-bold text-slate-700 uppercase">{detailPayment.gateway || 'Paystack'}</span>
                                </div>
                            </div>

                            {/* Invoice Breakdown */}
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-500">Base Amount</span>
                                    <span className="font-bold text-slate-900">{detailPayment.formattedAmount || `₦${Number(detailPayment.amount).toLocaleString()}`}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-500">Gateway Charges</span>
                                    <span className="font-bold text-slate-900">{detailPayment.formattedCharges || `₦${Number(detailPayment.charges).toLocaleString()}`}</span>
                                </div>
                                <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-center">
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">Total Charged</span>
                                    <span className="text-lg font-black text-[#003399]">{detailPayment.formattedTotal || `₦${Number(detailPayment.total).toLocaleString()}`}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6 text-xs font-bold text-rose-500">
                            Failed to pull payment audit logs.
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
