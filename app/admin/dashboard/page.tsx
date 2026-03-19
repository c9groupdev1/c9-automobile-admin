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
    Activity as ActivityIcon
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

export default function DashboardPage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [listingTypeFilter, setListingTypeFilter] = useState('all');
    const [listingStatusFilter, setListingStatusFilter] = useState('all');
    const [activityTypeFilter, setActivityTypeFilter] = useState('all');

    const dashboardParams = useMemo(() => ({
        dateFrom: startDate || undefined,
        dateTo: endDate || undefined,
        status: listingStatusFilter === 'all' ? undefined : listingStatusFilter,
        type: listingTypeFilter === 'all' ? undefined : listingTypeFilter,
    }), [startDate, endDate, listingStatusFilter, listingTypeFilter]);

    const { data: stats, isLoading: isLoadingStats } = useDashboardStats(dashboardParams);
    const { data: latestListings, isLoading: isLoadingListings } = useLatestListings(dashboardParams);
    const { data: pendingKycs, isLoading: isLoadingKycs } = usePendingKycs(dashboardParams);
    const { data: listingsByState, isLoading: isLoadingStates } = useListingsByState(dashboardParams);
    const { data: listingsPerMonth, isLoading: isLoadingMonths } = useListingsPerMonth(dashboardParams);

    const formatTrend = (change: number) => {
        return {
            value: `${Math.abs(change)}%`,
            positive: change >= 0
        };
    };

    const filteredListings = useMemo(() => {
        if (!latestListings) return [];
        return latestListings; // Hook now handles actual filtering via dashboardParams
    }, [latestListings]);

    const filteredActivity = useMemo(() => {
        const activities = [
            ...(latestListings?.map(l => ({
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
            ...(pendingKycs?.map(k => ({
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
    }, [latestListings, pendingKycs, activityTypeFilter]);

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

            {/* Global Filters Bar */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Date From</label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                                className="h-10 w-[180px] rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 transition-all text-xs font-bold"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Date To</label>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                                    className="h-10 w-[180px] rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 transition-all text-xs font-bold"
                                />
                                {(startDate || endDate) && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => { setStartDate(''); setEndDate(''); }}
                                        className="h-10 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                                    >
                                        Reset Range
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* <div className="flex items-center gap-4 pt-4 md:pt-0">
                        <Badge variant="outline" className="h-10 px-4 rounded-xl border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-[#003399]">
                            Node Status: Operational
                        </Badge>
                    </div> */}
                </div>
            </div>

            {/* Section: Platform Overview */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Platform Overview</h3>
                    {isLoadingStats && <Loader2 className="w-4 h-4 text-slate-300 animate-spin" />}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Users"
                        value={stats?.totalUsers.current ?? '...'}
                        description="Registered protocol participants"
                        icon={Users}
                        trend={stats ? formatTrend(stats.totalUsers.change) : undefined}
                        iconBg="bg-blue-50"
                        iconColor="text-[#003399]"
                    />
                    <StatsCard
                        title="Verified Vendors"
                        value={stats?.verifiedVendors.current ?? '...'}
                        description="Authorized system vendors"
                        icon={Store}
                        trend={stats ? formatTrend(stats.verifiedVendors.change) : undefined}
                        iconBg="bg-emerald-50"
                        iconColor="text-emerald-600"
                    />
                    <StatsCard
                        title="Active Listings"
                        value={stats?.activeListings.current ?? '...'}
                        description="Live marketplace assets"
                        icon={Car}
                        trend={stats ? formatTrend(stats.activeListings.change) : undefined}
                        iconBg="bg-indigo-50"
                        iconColor="text-indigo-600"
                    />
                    <StatsCard
                        title="Pending KYC"
                        value={stats?.pendingKyc.current ?? '...'}
                        description="Awaiting identity verification"
                        icon={ShieldCheck}
                        trend={stats?.pendingKyc.current ? { value: 'Urgent', positive: false } : undefined}
                        iconBg="bg-orange-50"
                        iconColor="text-orange-500"
                    />
                </div>
            </div>

            {/* Section: Performance & Analytics */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest px-1">Performance & Growth</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <OverviewChart
                        className="col-span-4"
                        data={listingsPerMonth}
                        isLoading={isLoadingMonths}
                    />
                    <StateDistributionChart
                        className="col-span-3"
                        data={listingsByState}
                        isLoading={isLoadingStates}
                    />
                </div>
            </div>

            {/* Section: Intelligence Hub */}
            <div className="grid gap-6 lg:grid-cols-5">
                {/* Recent Platform Activity */}
                <Card className="col-span-3 border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
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
                        {isLoadingListings || isLoadingKycs ? (
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

                {/* Pending Approvals */}
                <Card className="col-span-2 border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-lg font-bold text-slate-900">Verification Queue</CardTitle>
                        <div className="pt-4">
                            <Tabs defaultValue="kyc" className="w-full">
                                <TabsList className="bg-slate-100/50 rounded-xl p-1 gap-1 h-11 w-full flex">
                                    <TabsTrigger value="kyc" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">KYC ({pendingKycs?.length || 0})</TabsTrigger>
                                    <TabsTrigger value="listings" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Listings ({latestListings?.filter(l => l.status === 'pending').length || 0})</TabsTrigger>
                                </TabsList>
                                <TabsContent value="kyc" className="mt-8 space-y-4">
                                    {isLoadingKycs ? (
                                        <div className="flex justify-center p-10">
                                            <Loader2 className="w-6 h-6 text-slate-200 animate-spin" />
                                        </div>
                                    ) : pendingKycs?.length ? (
                                        pendingKycs.slice(0, 5).map((k, i) => (
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
            </div>

            {/* Bottom Grid: Detailed Assets */}
            <div className="grid gap-6 grid-cols-1">
                {/* Latest Platform Listings */}
                <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-slate-900">Latest Platform Listings</h4>
                            <p className="text-xs font-medium text-slate-500 mt-1">Real-time inventory submissions across the network.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Select value={listingStatusFilter} onValueChange={(val) => setListingStatusFilter(val || 'all')}>
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
        </div>
    );
}
