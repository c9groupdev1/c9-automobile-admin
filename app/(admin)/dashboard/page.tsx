'use client';

import { StatsCard } from '@/components/dashboard/stats-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { 
    Users, 
    Store, 
    Car, 
    Gavel, 
    ShieldCheck, 
    Crown, 
    ShoppingBag, 
    CircleDollarSign,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowUpRight,
    Plus,
    ArrowRight,
    ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                    <p className="text-slate-500 font-medium">Welcome back, manage your C9X ecosystem.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button className="bg-[#003399] hover:bg-blue-800 rounded-xl px-6 font-bold shadow-lg shadow-blue-900/10 transition-all">
                        Generate Report
                    </Button>
                </div>
            </div>

            {/* Section: Platform Overview */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest px-1">Platform Overview</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Users"
                        value="12,480"
                        description="Total registered users"
                        icon={Users}
                        trend={{ value: '12%', positive: true }}
                        iconBg="bg-blue-50"
                        iconColor="text-[#003399]"
                    />
                    <StatsCard
                        title="Verified Vendors"
                        value="1,284"
                        description="Verified platform vendors"
                        icon={Store}
                        trend={{ value: '8%', positive: true }}
                        iconBg="bg-emerald-50"
                        iconColor="text-emerald-600"
                    />
                    <StatsCard
                        title="Active Listings"
                        value="4,296"
                        description="Total active listings"
                        icon={Car}
                        trend={{ value: '24%', positive: true }}
                        iconBg="bg-blue-50"
                        iconColor="text-blue-500"
                    />
                    <StatsCard
                        title="Live Auctions"
                        value="18"
                        description="Running vehicle auctions"
                        icon={Gavel}
                        trend={{ value: '2 new', positive: true }}
                        iconBg="bg-orange-50"
                        iconColor="text-orange-500"
                    />
                    <StatsCard
                        title="Pending KYC Reviews"
                        value="64"
                        description="Reviews needing attention"
                        icon={ShieldCheck}
                        trend={{ value: '9 urgent', positive: false }}
                        iconBg="bg-orange-50"
                        iconColor="text-orange-500"
                    />
                    <StatsCard
                        title="Active Subscriptions"
                        value="372"
                        description="Premium system users"
                        icon={Crown}
                        trend={{ value: '15%', positive: true }}
                        iconBg="bg-violet-50"
                        iconColor="text-violet-600"
                    />
                    <StatsCard
                        title="C9 Store Orders"
                        value="128"
                        description="New store transactions"
                        icon={ShoppingBag}
                        trend={{ value: '20%', positive: true }}
                        iconBg="bg-amber-50"
                        iconColor="text-amber-500"
                    />
                    <StatsCard
                        title="Monthly Revenue"
                        value="$284K"
                        description="Platform earnings this month"
                        icon={CircleDollarSign}
                        trend={{ value: '18%', positive: true }}
                        iconBg="bg-emerald-50"
                        iconColor="text-emerald-600"
                    />
                </div>
            </div>

            {/* Section: Performance & Analytics */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest px-1">Performance & Analytics</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <OverviewChart className="col-span-4" />
                    <Card className="col-span-3 border-slate-100 shadow-sm rounded-[1.5rem] overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-8">
                            <CardTitle className="text-lg font-bold">Listings by Category</CardTitle>
                            <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-500">This month</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px] w-full bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                                <span className="text-slate-400 font-bold text-xs">Analytics Visualization Placeholder</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-slate-100 shadow-sm rounded-[1.5rem] overflow-hidden p-6 h-[200px] flex items-center justify-center border-dashed border-slate-200 bg-slate-50/50">
                         <span className="text-slate-400 font-bold text-xs">Auction Activity Graph</span>
                    </Card>
                    <Card className="border-slate-100 shadow-sm rounded-[1.5rem] overflow-hidden p-6 h-[200px] flex items-center justify-center border-dashed border-slate-200 bg-slate-50/50">
                         <span className="text-slate-400 font-bold text-xs">Subscription Revenue Trend</span>
                    </Card>
                    <Card className="border-slate-100 shadow-sm rounded-[1.5rem] overflow-hidden p-6 h-[200px] flex items-center justify-center border-dashed border-slate-200 bg-slate-50/50">
                         <span className="text-slate-400 font-bold text-xs">C9 Store Performance</span>
                    </Card>
                </div>
            </div>

            {/* Section: Quick Actions */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest px-1">Quick Actions</h3>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    {[
                        { title: 'Review Pending KYC', desc: '64 pending approvals', icon: ShieldCheck, color: 'text-orange-500', bg: 'bg-orange-50' },
                        { title: 'Approve Listings', desc: '48 waiting approval', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { title: 'Create Auction', desc: 'Initialize new auction', icon: Plus, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { title: 'Manage Featured', desc: '12 featured listings', icon: Crown, color: 'text-violet-500', bg: 'bg-violet-50' },
                        { title: 'Subscription Renewals', desc: '15 expiring soon', icon: Crown, color: 'text-violet-500', bg: 'bg-violet-50' },
                        { title: 'Resolve Reports', desc: '8 reported items', icon: ShieldCheck, color: 'text-rose-500', bg: 'bg-rose-50' },
                        { title: 'Add Store Product', desc: 'Expansion inventory', icon: Plus, color: 'text-amber-500', bg: 'bg-amber-50' },
                        { title: 'Manage Inventory', desc: 'Store stock levels', icon: ShoppingBag, color: 'text-amber-500', bg: 'bg-amber-50' },
                    ].map((action, i) => (
                        <button key={i} className="group p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-blue-900/5 transition-all text-left">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", action.bg)}>
                                <action.icon className={action.color} size={20} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mb-1">{action.title}</h4>
                            <p className="text-[10px] font-medium text-slate-400">{action.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Section: Management Summary Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Subscription Management */}
                <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center">
                                <Crown className="text-violet-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 leading-none">Subscription Management</h3>
                                <p className="text-xs font-medium text-slate-500 mt-1">Review systems plans and renewals</p>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-violet-600 font-bold text-xs">View All <ArrowRight size={14} className="ml-1" /></Button>
                    </div>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active</p>
                             <div className="text-2xl font-bold text-slate-900">372</div>
                             <p className="text-[10px] text-emerald-600 font-bold">+15 this month</p>
                        </div>
                        <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expiring Soon</p>
                             <div className="text-2xl font-bold text-slate-900">18</div>
                             <p className="text-[10px] text-orange-500 font-bold">Needs attention</p>
                        </div>
                        <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Rev</p>
                             <div className="text-2xl font-bold text-slate-900">$48.2K</div>
                             <p className="text-[10px] text-emerald-600 font-bold">+12% growth</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button className="flex-1 bg-violet-600 hover:bg-violet-700 rounded-xl font-bold rounded-xl h-12">Manage Plans</Button>
                        <Button variant="outline" className="flex-1 border-slate-200 rounded-xl font-bold h-12">Billing Records</Button>
                    </div>
                </Card>

                {/* C9 Store Management */}
                <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                                <ShoppingBag className="text-amber-500" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 leading-none">C9 Store Management</h3>
                                <p className="text-xs font-medium text-slate-500 mt-1">Inventory and order fulfillment</p>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-amber-500 font-bold text-xs">View Store <ArrowRight size={14} className="ml-1" /></Button>
                    </div>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Open Orders</p>
                             <div className="text-2xl font-bold text-slate-900">246</div>
                             <p className="text-[10px] text-emerald-600 font-bold">+28 new today</p>
                        </div>
                        <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Ship</p>
                             <div className="text-2xl font-bold text-slate-900">128</div>
                             <p className="text-[10px] text-orange-500 font-bold">Priority fulfillment</p>
                        </div>
                        <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gross Rev</p>
                             <div className="text-2xl font-bold text-slate-900">$32.8K</div>
                             <p className="text-[10px] text-emerald-600 font-bold">Stable flow</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button className="flex-1 bg-amber-500 hover:bg-amber-600 rounded-xl font-bold rounded-xl h-12">Add Product</Button>
                        <Button variant="outline" className="flex-1 border-slate-200 rounded-xl font-bold h-12">View Orders</Button>
                    </div>
                </Card>
            </div>

            {/* Section: Lists & Tables */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Platform Activity */}
                <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold text-slate-900">Recent Platform Activity</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            {[
                                { user: 'New vendor registered', desc: 'AutoWorld Pro joined the marketplace', time: '2 minutes ago', icon: Store, color: 'text-emerald-500', bg: 'bg-emerald-50', badge: 'New', status: 'success' },
                                { user: 'Listing submitted for approval', desc: '2022 BMW M4 Competition - Premium Auto', time: '18 minutes ago', icon: Car, color: 'text-blue-500', bg: 'bg-blue-50', badge: 'Pending', status: 'warning' },
                                { user: 'KYC approved', desc: 'Elite Car Service verification completed', time: '1 hour ago', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', badge: 'Approved', status: 'success' },
                                { user: 'Subscription renewed', desc: 'TranSeychelles - Gold Hub Dealers', time: '2 hours ago', icon: Crown, color: 'text-violet-600', bg: 'bg-violet-50', badge: 'Premium', status: 'info' },
                                { user: 'New C9 Store order', desc: 'Premium Car Care Kit - Order ID: #10872', time: '3 hours ago', icon: ShoppingBag, color: 'text-amber-500', bg: 'bg-amber-50', badge: 'Store', status: 'default' },
                            ].map((activity, i) => (
                                <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", activity.bg)}>
                                            <activity.icon className={activity.color} size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{activity.user}</p>
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
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-slate-50">
                            <Button variant="ghost" className="w-full text-blue-600 font-bold text-xs">View All Activity <ArrowRight size={14} className="ml-1" /></Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Approvals */}
                <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-lg font-bold text-slate-900">Pending Approvals</CardTitle>
                        <div className="pt-4">
                            <Tabs defaultValue="kyc" className="w-full">
                                <TabsList className="bg-slate-100/50 rounded-xl p-1 gap-1 h-11 w-full flex">
                                    <TabsTrigger value="kyc" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">KYC Pending (64)</TabsTrigger>
                                    <TabsTrigger value="listings" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Listings (28)</TabsTrigger>
                                    <TabsTrigger value="services" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Services (12)</TabsTrigger>
                                </TabsList>
                                <TabsContent value="kyc" className="mt-8 space-y-4">
                                    {[
                                        { name: 'Premium Auto Dealers', type: 'Business Verification', img: '/avatars/1.png' },
                                        { name: 'Elite Car Service', type: 'Business Verification', img: '/avatars/2.png' },
                                        { name: 'AutoParts Express', type: 'Individual Verification', img: '/avatars/3.png' },
                                        { name: 'Luxury Motors Ltd', type: 'Business Verification', img: '/avatars/4.png' },
                                    ].map((approval, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 rounded-xl border border-slate-200">
                                                    <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">{approval.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{approval.name}</p>
                                                    <p className="text-[10px] font-medium text-slate-500">{approval.type}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" className="h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 font-bold text-[10px]">Approve</Button>
                                                <Button size="sm" variant="ghost" className="h-8 rounded-lg text-rose-500 font-bold text-[10px] hover:bg-rose-50">Reject</Button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-4">
                                        <Button variant="ghost" className="w-full text-blue-600 font-bold text-xs">View All Pending <ArrowRight size={14} className="ml-1" /></Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </CardHeader>
                </Card>
            </div>

            {/* Bottom Grid: Detailed Tables */}
            <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
                 {/* Latest Listings */}
                 <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <h4 className="font-bold text-slate-900">Latest Listings</h4>
                        <Button variant="ghost" size="sm" className="text-blue-600 font-bold text-xs">View All <ExternalLink size={12} className="ml-1" /></Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Listing</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[
                                    { name: '2023 BMW M4', owner: 'Premium Auto', type: 'Vehicle', status: 'Pending', color: 'text-orange-500', bg: 'bg-orange-50' },
                                    { name: 'Brake Pads Set', owner: 'AutoParts Pro', type: 'Parts', status: 'Active', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { name: 'Oil Change Service', owner: 'Elite Service', type: 'Service', status: 'Active', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { name: '2022 Tesla Model 3', owner: 'BH Motors', type: 'Vehicle', status: 'Pending', color: 'text-orange-500', bg: 'bg-orange-50' },
                                ].map((item, i) => (
                                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-4">
                                            <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                            <p className="text-[10px] font-medium text-slate-500">{item.owner}</p>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs font-medium text-slate-600">{item.type}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <Badge className={cn("text-[9px] font-black uppercase tracking-widest rounded-md border-0 pointer-events-none", item.bg, item.color)}>
                                                {item.status}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <Button variant="link" className="text-blue-600 font-bold text-xs p-0">Details</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </Card>

                 {/* Latest Auctions */}
                 <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <h4 className="font-bold text-slate-900">Latest Auctions</h4>
                        <Button variant="ghost" size="sm" className="text-blue-600 font-bold text-xs">View All <ExternalLink size={12} className="ml-1" /></Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vehicle</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Bid</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[
                                    { name: '2021 Porsche 911', timer: 'Ends in 2h 15m', bid: '$82,500', status: 'Live', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { name: '2022 Mercedes S-Class', timer: 'Ends in 1d 4h', bid: '$97,200', status: 'Live', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { name: '2022 Audi RS7', timer: 'Ended', bid: '$110,000', status: 'Closed', color: 'text-slate-500', bg: 'bg-slate-100' },
                                    { name: '2023 BMW X7', timer: 'Starts in 3h', bid: '$73,800', status: 'Live', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                ].map((item, i) => (
                                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-4">
                                            <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                            <p className="text-[10px] font-medium text-slate-500">{item.timer}</p>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-sm font-bold text-slate-900">{item.bid}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <Badge className={cn("text-[9px] font-black uppercase tracking-widest rounded-md border-0 pointer-events-none", item.bg, item.color)}>
                                                {item.status}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <Button variant="link" className="text-blue-600 font-bold text-xs p-0">View</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </Card>
            </div>
        </div>
    );
}
