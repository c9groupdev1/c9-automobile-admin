'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/dashboard/stats-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { StateDistributionChart } from '@/components/dashboard/state-distribution-chart';
import {
    Users,
    Store,
    Car,
    ShieldCheck,
    Plus,
    ArrowRight,
    ExternalLink,
    Loader2,
    AlertCircle,
    Filter,
    Activity as ActivityIcon,
    CreditCard,
    HandCoins,
    BadgeDollarSign,
    TrendingUp,
    Headphones,
    Zap,
    Ticket,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
    useDashboardStats,
    useLatestListings,
    usePendingKycs,
    useListingsByState,
    useListingsPerMonth
} from '@/hooks/useDashboard';
import { useListingTypes } from '@/hooks/useListings';

export default function DashboardPage() {
    // Dynamic Protocol Definitions
    const { data: listingTypes, isLoading: isLoadingTypes } = useListingTypes();

    // Section 1: Stats Filters
    const [statsStartDate, setStatsStartDate] = useState('');
    const [statsEndDate, setStatsEndDate] = useState('');

    // Section 2: Chart Filters
    const [chartListingType, setChartListingType] = useState('all');

    // Section 3: Listings Table Filters
    const [tableListingType, setTableListingType] = useState('all');
    const [tableListingStatus, setTableListingStatus] = useState('all');

    // Section 4: Activity Feed Filters
    const [activityTypeFilter, setActivityTypeFilter] = useState('all');

    const statsParams = useMemo(() => ({
        startDate: statsStartDate || undefined,
        endDate: statsEndDate || undefined,
    }), [statsStartDate, statsEndDate]);

    const chartParams = useMemo(() => ({
        listingTypeId: chartListingType === 'all' ? undefined : Number(chartListingType),
    }), [chartListingType]);

    const listingsParams = useMemo(() => ({
        status: tableListingStatus === 'all' ? undefined : tableListingStatus,
        listingTypeId: tableListingType === 'all' ? undefined : Number(tableListingType),
        limit: 10
    }), [tableListingStatus, tableListingType]);

    const kycParams = useMemo(() => ({
        limit: 10
    }), []);

    const { data: stats, isLoading: isLoadingStats } = useDashboardStats(statsParams);
    const { data: latestListings, isLoading: isLoadingListings } = useLatestListings(listingsParams);
    const { data: listingsByState, isLoading: isLoadingStates } = useListingsByState(chartParams);
    const { data: listingsPerMonth, isLoading: isLoadingMonths } = useListingsPerMonth({ ...chartParams, months: 6 });

    // Independent data for Intelligence Feed & Verification Queue
    const { data: activityListings, isLoading: isLoadingActivityListings } = useLatestListings({ limit: 5 });
    const { data: activityKycs, isLoading: isLoadingActivityKycs } = usePendingKycs({ limit: 5 });
    const { data: queueKycs, isLoading: isLoadingQueueKycs } = usePendingKycs({ limit: 10 });

    const formatRevenue = (value: number) => {
        return `₦${value.toLocaleString()}`;
    };

    const formatTrend = (change: number) => {
        return {
            value: `${Math.abs(change)}%`,
            positive: change >= 0
        };
    };

    const filteredListings = useMemo(() => {
        if (!latestListings) return [];
        return latestListings;
    }, [latestListings]);

    const filteredActivity = useMemo(() => {
        const activities = [
            ...(activityListings?.map(l => ({
                id: l.id,
                type: 'listing',
                title: 'New Listing Submitted',
                desc: `${l.year} ${l.make} ${l.model} - ${l.user.name}`,
                time: new Date(l.createdAt),
                icon: Car,
                color: 'text-blue-500',
                bg: 'bg-blue-50',
                status: 'warning',
                badge: l.status.toUpperCase()
            })) || []),
            ...(activityKycs?.map(k => ({
                id: k.id,
                type: 'kyc',
                title: 'KYC Verification Requested',
                desc: `Identity review for ${k.user.name}`,
                time: new Date(k.createdAt),
                icon: ShieldCheck,
                color: 'text-orange-500',
                bg: 'bg-orange-50',
                status: 'warning',
                badge: 'PENDING'
            })) || [])
        ].sort((a, b) => b.time.getTime() - a.time.getTime());

        if (activityTypeFilter === 'all') return activities;
        return activities.filter(a => a.type === activityTypeFilter);
    }, [activityListings, activityKycs, activityTypeFilter]);

    if (!stats && isLoadingStats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#003399]" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h2>
                    <p className="text-slate-500 font-medium">Real-time ecosystem intelligence and administrative controls.</p>
                </div>
                {/* <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-slate-200 rounded-xl px-6 font-bold text-slate-600">
                        Export Analytics
                    </Button>
                    <Button className="bg-[#003399] hover:bg-blue-800 rounded-xl px-6 font-bold shadow-lg shadow-blue-900/10 transition-all">
                        Refresh Node
                    </Button>
                </div> */}
            </div>

                {/* Section: Platform Overview */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 pb-6">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Platform Overview</h3>
                        {isLoadingStats && <Loader2 className="w-4 h-4 text-slate-300 animate-spin" />}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From</label>
                            <Input
                                type="date"
                                value={statsStartDate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStatsStartDate(e.target.value)}
                                className="h-9 w-[140px] rounded-xl bg-white border-slate-200 text-xs font-bold"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To</label>
                            <Input
                                type="date"
                                value={statsEndDate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStatsEndDate(e.target.value)}
                                className="h-9 w-[140px] rounded-xl bg-white border-slate-200 text-xs font-bold"
                            />
                        </div>
                        {(statsStartDate || statsEndDate) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setStatsStartDate(''); setStatsEndDate(''); }}
                                className="h-9 rounded-xl text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50"
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {(stats?.totalUsers || stats?.verifiedVendors || stats?.activeListings || stats?.pendingKyc) && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatsCard
                            title="Total Users"
                            value={stats?.totalUsers?.current ?? '...'}
                            description="Registered protocol participants"
                            icon={Users}
                            trend={stats?.totalUsers ? formatTrend(stats.totalUsers.change) : undefined}
                            iconBg="bg-blue-50"
                            iconColor="text-[#003399]"
                        />
                        <StatsCard
                            title="Verified Vendors"
                            value={stats?.verifiedVendors?.current ?? '...'}
                            description="Authorized system vendors"
                            icon={Store}
                            trend={stats?.verifiedVendors ? formatTrend(stats.verifiedVendors.change) : undefined}
                            iconBg="bg-amber-50"
                            iconColor="text-amber-600"
                        />
                        <StatsCard
                            title="Active Listings"
                            value={stats?.activeListings?.current ?? '...'}
                            description="Live marketplace assets"
                            icon={Car}
                            trend={stats?.activeListings ? formatTrend(stats.activeListings.change) : undefined}
                            iconBg="bg-indigo-50"
                            iconColor="text-indigo-600"
                        />
                        <StatsCard
                            title="Pending KYC"
                            value={stats?.pendingKyc?.current ?? '...'}
                            description="Awaiting identity verification"
                            icon={ShieldCheck}
                            trend={stats?.pendingKyc?.current ? { value: 'Urgent', positive: false } : undefined}
                            iconBg="bg-rose-50"
                            iconColor="text-rose-500"
                        />
                    </div>
                )}

                {/* Section: Fiscal Intelligence */}
                {(stats?.totalRevenue || stats?.monthlyRevenue || stats?.subscriptions || stats?.promotions) && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-1 pt-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Fiscal Intelligence</h3>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
                            {(stats?.totalRevenue || stats?.monthlyRevenue) && (
                                <StatsCard
                                    title="Total Revenue"
                                    value={stats?.totalRevenue ? formatRevenue(stats.totalRevenue.current) : '...'}
                                    description="Cumulative platform earnings"
                                    icon={BadgeDollarSign}
                                    trend={stats?.totalRevenue ? { value: stats.totalRevenue.status, positive: true } : undefined}
                                    iconBg="bg-emerald-50"
                                    iconColor="text-emerald-600"
                                />
                            )}
                            {stats?.subscriptions && (
                                <StatsCard
                                    title="Monthly Subscriptions"
                                    value={stats?.subscriptions?.monthlyRevenueFormatted ?? '...'}
                                    description="Revenue from active recurring cycles"
                                    icon={TrendingUp}
                                    trend={stats?.subscriptions?.expiringThisWeek ? { value: `${stats.subscriptions.expiringThisWeek} Expiring`, positive: false } : { value: 'Stable', positive: true }}
                                    iconBg="bg-blue-50"
                                    iconColor="text-blue-600"
                                />
                            )}
                            {stats?.promotions && (
                                <StatsCard
                                    title="Promotion Revenue"
                                    value={stats?.promotions?.monthlyRevenueFormatted ?? '...'}
                                    description="Earnings from featured placements"
                                    icon={CreditCard}
                                    trend={stats?.promotions?.pendingReview ? { value: `${stats.promotions.pendingReview} Pending`, positive: false } : { value: 'Active', positive: true }}
                                    iconBg="bg-violet-50"
                                    iconColor="text-violet-600"
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Section: Operational & Support Intelligence */}
                {(stats?.support || stats?.promotions || stats?.subscriptions) && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-1 pt-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Operational & Support Intelligence</h3>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
                            {stats?.support && (
                                <StatsCard
                                    title="Open Support Tickets"
                                    value={stats?.support?.openTickets ?? '0'}
                                    description="Active assistance requests"
                                    icon={Headphones}
                                    trend={stats?.support?.pendingResponse ? { value: `${stats.support.pendingResponse} Awaiting`, positive: false } : { value: 'All Responded', positive: true }}
                                    iconBg="bg-rose-50"
                                    iconColor="text-rose-600"
                                />
                            )}
                            {stats?.promotions && (
                                <StatsCard
                                    title="Active Promotions"
                                    value={stats?.promotions?.totalActive ?? '0'}
                                    description="Live marketplace campaigns"
                                    icon={Zap}
                                    trend={stats?.promotions ? { value: 'Live Now', positive: true } : undefined}
                                    iconBg="bg-amber-50"
                                    iconColor="text-amber-600"
                                />
                            )}
                            {stats?.subscriptions && (
                                <StatsCard
                                    title="Subscribed Assets"
                                    value={stats?.subscriptions?.totalActive ?? '0'}
                                    description="Premium network participants"
                                    icon={Ticket}
                                    trend={stats?.subscriptions ? { value: 'Recurring', positive: true } : undefined}
                                    iconBg="bg-indigo-50"
                                    iconColor="text-indigo-600"
                                />
                            )}
                        </div>
                    </div>
                )}

            {/* Section: Performance & Analytics */}
            {((listingsPerMonth?.length ?? 0) > 0 || (listingsByState?.length ?? 0) > 0 || isLoadingMonths || isLoadingStates) && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Performance & Growth</h3>
                        <Select value={chartListingType} onValueChange={(val) => setChartListingType(val || 'all')}>
                            <SelectTrigger className="w-[160px] h-9 rounded-xl border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest">
                                <SelectValue placeholder={isLoadingTypes ? "Loading..." : "All Categories"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {Array.isArray(listingTypes?.data) ? listingTypes.data.map((t: any) => (
                                    <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                                )) : Array.isArray(listingTypes) ? listingTypes.map((t: any) => (
                                    <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                                )) : null}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
                        <OverviewChart
                            className="col-span-1 lg:col-span-4"
                            data={listingsPerMonth}
                            isLoading={isLoadingMonths}
                        />
                        <StateDistributionChart
                            className="col-span-1 lg:col-span-3"
                            data={listingsByState}
                            isLoading={isLoadingStates}
                        />
                    </div>
                </div>
            )}

            {/* Section: Intelligence Hub */}
            {(filteredActivity.length > 0 || 
              (queueKycs?.length ?? 0) > 0 || 
              activityListings?.some(l => l.status === 'pending') ||
              isLoadingActivityListings || 
              isLoadingActivityKycs || 
              isLoadingQueueKycs) && (
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
                    {/* Recent Platform Activity */}
                    {(filteredActivity.length > 0 || isLoadingActivityListings || isLoadingActivityKycs) && (
                        <Card className={cn(
                            "border-slate-100 shadow-sm rounded-[2rem] overflow-hidden",
                            ((queueKycs?.length ?? 0) > 0 || activityListings?.some(l => l.status === 'pending') || isLoadingQueueKycs) 
                                ? "col-span-1 lg:col-span-3" 
                                : "col-span-1 lg:col-span-5"
                        )}>
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ActivityIcon size={18} className="text-[#003399]" />
                                        <CardTitle className="text-lg font-bold text-slate-900">Live Activity Feed</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Select value={activityTypeFilter} onValueChange={(val) => setActivityTypeFilter(val || 'all')}>
                                            <SelectTrigger className="w-[120px] h-9 rounded-xl border-slate-100 bg-slate-50/50 text-xs font-bold">
                                                <Filter size={12} className="mr-2 text-slate-400" />
                                                <SelectValue placeholder="All Events" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Events</SelectItem>
                                                <SelectItem value="listing">Listings</SelectItem>
                                                <SelectItem value="kyc">KYC</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {isLoadingActivityListings || isLoadingActivityKycs ? (
                                    <div className="flex flex-col items-center justify-center p-20 gap-3">
                                        <Loader2 className="w-8 h-8 text-slate-200 animate-spin" />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Streaming Logs</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-50 font-display">
                                        {filteredActivity.slice(0, 5).map((activity, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", activity.bg)}>
                                                        <activity.icon className={activity.color} size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{activity.title}</p>
                                                        <p className="text-[11px] font-medium text-slate-500">{activity.desc}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline" className={cn(
                                                        "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border-0 mb-1 block w-fit ml-auto",
                                                        activity.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                                                            activity.status === 'warning' ? 'bg-orange-50 text-orange-500' :
                                                                activity.status === 'info' ? 'bg-violet-50 text-violet-600' : 'bg-slate-100 text-slate-400'
                                                    )}>
                                                        {activity.badge}
                                                    </Badge>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">{activity.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {!filteredActivity.length && (
                                            <div className="p-20 flex flex-col items-center justify-center text-center">
                                                <AlertCircle className="w-10 h-10 text-slate-100 mb-4" />
                                                <p className="text-sm font-bold text-slate-400">No matching activity detected.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="p-6 border-t border-slate-50">
                                    <Button variant="ghost" className="w-full text-blue-600 font-bold text-xs">View Full Audit Log <ArrowRight size={14} className="ml-1" /></Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pending Approvals */}
                    {((queueKycs?.length ?? 0) > 0 || activityListings?.some(l => l.status === 'pending') || isLoadingQueueKycs) && (
                        <Card className={cn(
                            "border-slate-100 shadow-sm rounded-[2rem] overflow-hidden",
                            (filteredActivity.length > 0 || isLoadingActivityListings || isLoadingActivityKycs) 
                                ? "col-span-1 lg:col-span-2" 
                                : "col-span-1 lg:col-span-5"
                        )}>
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-lg font-bold text-slate-900">Verification Queue</CardTitle>
                                <div className="pt-4">
                                    <Tabs defaultValue="kyc" className="w-full">
                                        <TabsList className="bg-slate-100/50 rounded-xl p-1 gap-1 h-11 w-full flex">
                                            <TabsTrigger value="kyc" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">KYC ({queueKycs?.length || 0})</TabsTrigger>
                                            <TabsTrigger value="listings" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Listings ({activityListings?.filter(l => l.status === 'pending').length || 0})</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="kyc" className="mt-8 space-y-4">
                                            {isLoadingQueueKycs ? (
                                                <div className="flex justify-center p-10">
                                                    <Loader2 className="w-6 h-6 text-slate-200 animate-spin" />
                                                </div>
                                            ) : queueKycs?.length ? (
                                                queueKycs.slice(0, 5).map((k, i) => (
                                                    <div key={i} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-10 w-10 rounded-xl border border-slate-200">
                                                                <AvatarFallback className="bg-slate-100 text-slate-600 font-bold uppercase">{k.user.name[0]}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900">{k.user.name}</p>
                                                                <p className="text-[10px] font-medium text-slate-500">Awaiting {k.type} Review</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Link href={`/admin/kyc/${k.id}`}>
                                                                <Button size="sm" className="h-8 rounded-lg bg-[#003399] hover:bg-blue-800 font-bold text-[10px] px-4">Review</Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-10 text-center">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Queue Empty</p>
                                                </div>
                                            )}
                                            <div className="pt-4">
                                                <Link href="/admin/kyc">
                                                    <Button variant="ghost" className="w-full text-blue-600 font-bold text-xs uppercase tracking-widest">Open Full Queue <ArrowRight size={14} className="ml-1" /></Button>
                                                </Link>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </CardHeader>
                        </Card>
                    )}
                </div>
            )}

            {/* Bottom Grid: Detailed Assets */}
            {(filteredListings?.length > 0 || isLoadingListings) && (
                <div className="grid gap-6 grid-cols-1">
                    {/* Latest Platform Listings */}
                    <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h4 className="font-bold text-slate-900">Latest Platform Listings</h4>
                                <p className="text-xs font-medium text-slate-500 mt-1">Real-time inventory submissions across the network.</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Select value={tableListingType} onValueChange={(val) => setTableListingType(val || 'all')}>
                                    <SelectTrigger className="w-[140px] h-10 rounded-xl border-slate-200 bg-white text-xs font-bold">
                                        <SelectValue placeholder={isLoadingTypes ? "Loading..." : "All types"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        {Array.isArray(listingTypes?.data) ? listingTypes.data.map((t: any) => (
                                            <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                                        )) : Array.isArray(listingTypes) ? listingTypes.map((t: any) => (
                                            <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                                        )) : null}
                                    </SelectContent>
                                </Select>
                                <Select value={tableListingStatus} onValueChange={(val) => setTableListingStatus(val || 'all')}>
                                    <SelectTrigger className="w-[140px] h-10 rounded-xl border-slate-200 bg-white text-xs font-bold">
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Link href="/admin/listings">
                                    <Button variant="ghost" size="sm" className="text-blue-600 font-bold text-xs">Access Inventory <ExternalLink size={12} className="ml-1" /></Button>
                                </Link>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vehicle / Asset</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Merchant / Owner</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Protocol Status</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Administrative</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {isLoadingListings ? (
                                        <tr>
                                            <td colSpan={4} className="p-20 text-center">
                                                <Loader2 className="w-6 h-6 text-slate-200 animate-spin mx-auto" />
                                            </td>
                                        </tr>
                                    ) : filteredListings?.length ? (
                                        filteredListings.map((item, i) => (
                                            <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="px-8 py-4">
                                                    <p className="text-sm font-bold text-slate-900 uppercase">{item.year} {item.make} {item.model}</p>
                                                    <p className="text-[10px] font-medium text-slate-500">{item.title}</p>
                                                </td>
                                                <td className="px-8 py-4 font-medium text-xs text-slate-600">
                                                    {item.user.name}
                                                    <p className="text-[10px] text-slate-400 lowercase">{item.user.email}</p>
                                                </td>
                                                <td className="px-8 py-4 text-center">
                                                    <Badge className={cn(
                                                        "text-[9px] font-black uppercase tracking-widest rounded-md border-0 pointer-events-none px-2",
                                                        item.status === 'active' ? 'bg-emerald-50 text-emerald-600' :
                                                            item.status === 'pending' ? 'bg-orange-50 text-orange-500' : 'bg-slate-100 text-slate-400'
                                                    )}>
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <Link href={`/admin/listings/${item.id}`}>
                                                        <Button variant="ghost" className="text-[#003399] font-bold text-xs h-9 rounded-xl hover:bg-blue-50">Inspect Record</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-20 text-center">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">No inventory submissions detected</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
