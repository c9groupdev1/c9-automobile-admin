'use client';

import { useState } from 'react';
import { 
    CreditCard, 
    Zap, 
    Search, 
    ArrowUpRight, 
    Clock, 
    CheckCircle2, 
    XCircle,
    Filter,
    Download,
    TrendingUp,
    LayoutGrid,
    History,
    MoreVertical,
    Loader2
} from 'lucide-react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { usePaymentHistory, useActivePromotions, PaymentHistory, ActivePromotion } from '@/hooks/usePayments';

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'success':
        case 'active':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" />
                    {status}
                </div>
            );
        case 'failed':
        case 'expired':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-wider">
                    <XCircle className="w-3 h-3" />
                    {status}
                </div>
            );
        case 'pending':
        case 'upcoming':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider">
                    <Clock className="w-3 h-3" />
                    {status}
                </div>
            );
        default:
            return (
                <div className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-wider">
                    {status}
                </div>
            );
    }
};

export default function PaymentsPage() {
    const [page, setPage] = useState(1);
    const [boostPage, setBoostPage] = useState(1);
    const { data: historyResponse, isLoading: historyLoading } = usePaymentHistory(page);
    const { data: promotionsResponse, isLoading: promotionsLoading } = useActivePromotions(boostPage);
    const [searchQuery, setSearchQuery] = useState('');

    const history = historyResponse?.data || [];
    const meta = historyResponse?.meta;

    const promotions = promotionsResponse?.data || [];
    const boostsMeta = promotionsResponse; // The backend structure provided has nested data in 'data' actually

    // Wait, let's look at the JSON again. 
    // "data": { "current_page": 1, "data": [...] }
    const actualPromotions = promotionsResponse?.data?.data || [];
    const actualBoostsMeta = promotionsResponse?.data;

    const filteredHistory = history.filter((item: PaymentHistory) => 
        (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.reference || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredPromotions = actualPromotions.filter((promo: ActivePromotion) => 
        promo.listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (promo.promotion.type || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStatusBadge = (status: string) => {
        const normalizedStatus = status === 'successful' || status === 'active' ? 'success' : status;
        return <StatusBadge status={normalizedStatus} />;
    };

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="text-[#0066CC] w-5 h-5" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Financial Intelligence</h3>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900">Payments & Protocol</h2>
                    <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                        Monitor the protocol's secondary economy, track transaction integrity, and manage active asset boosts across the ecosystem.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 rounded-2xl border-slate-200 font-bold hover:bg-slate-50 transition-all">
                        <Download className="w-4 h-4 mr-2" />
                        Export Ledger
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-[#0066CC]/20 transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <CreditCard className="text-[#0066CC] w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase">+12.5%</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 mb-1">
                        {historyLoading ? <Skeleton className="h-9 w-24" /> : `${history[0]?.formattedTotal?.substring(0, 1) || '₦'}${history?.reduce((acc: number, curr: PaymentHistory) => acc + (curr.status === 'successful' ? curr.amount : 0), 0).toLocaleString()}`}
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Page Volume</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-amber-500/20 transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                            <Zap className="text-amber-500 w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-amber-500 uppercase">ACTIVE</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 mb-1">
                        {promotionsLoading ? <Skeleton className="h-9 w-12" /> : actualBoostsMeta?.total || 0}
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Active Boosts</p>
                </div>

                <div className="bg-[#0066CC] p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:scale-150" />
                    <div className="flex items-center justify-between mb-6 relative">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                            <ArrowUpRight className="text-white w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white mb-1 relative underline underline-offset-8 decoration-white/30">
                        {meta?.total || '...'}
                    </div>
                    <p className="text-sm font-bold text-white/60 uppercase tracking-widest leading-none relative">Total Operations</p>
                </div>
            </div>

            <Tabs defaultValue="history" className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <TabsList className="bg-slate-100 p-1 rounded-2xl h-14">
                        <TabsTrigger value="history" className="rounded-xl px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm font-black text-[10px] uppercase tracking-widest transition-all">
                            <History className="w-4 h-4 mr-2" />
                            Transaction protocol
                        </TabsTrigger>
                        <TabsTrigger value="boosts" className="rounded-xl px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm font-black text-[10px] uppercase tracking-widest transition-all">
                            <Zap className="w-4 h-4 mr-2" />
                            Active boosts
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0066CC] transition-colors" />
                            <Input 
                                placeholder="Filter ledger..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-14 w-[300px] rounded-2xl border-slate-100 bg-white pl-11 font-bold text-sm focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm shadow-slate-100/50" 
                            />
                        </div>
                        <Button size="icon" variant="outline" className="h-14 w-14 rounded-2xl border-slate-100 bg-white transition-all hover:bg-slate-50">
                            <Filter className="w-5 h-5 text-slate-400" />
                        </Button>
                    </div>
                </div>

                <TabsContent value="history" className="space-y-4 focus-visible:outline-none">
                    <div className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm shadow-slate-200/50">
                        {historyLoading ? (
                            <div className="p-12 space-y-4">
                                <Skeleton className="h-12 w-full rounded-2xl" />
                                <Skeleton className="h-20 w-full rounded-2xl" />
                                <Skeleton className="h-20 w-full rounded-2xl" />
                                <Skeleton className="h-20 w-full rounded-2xl" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/80">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Operation Node</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Fiscal Amount</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Charges/Fee</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Net Total</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Timestamp</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Integrity</TableHead>
                                            <TableHead className="py-7 px-8 text-right text-[11px] font-black uppercase tracking-widest text-[#0066CC]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredHistory.map((item: PaymentHistory) => (
                                            <TableRow key={item.id} className="group border-slate-50 transition-colors hover:bg-slate-50/50">
                                                <TableCell className="py-6 px-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-[10px] uppercase tracking-tighter">
                                                            TRX
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-900 text-sm">{item.description}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">REF: {item.reference.substring(0, 8)}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-6 px-8 font-black text-slate-900 text-sm">
                                                    {item.formattedAmount}
                                                </TableCell>
                                                <TableCell className="py-6 px-8 font-bold text-rose-500 text-xs">
                                                    {item.formattedCharges}
                                                </TableCell>
                                                <TableCell className="py-6 px-8 font-black text-emerald-600 text-sm">
                                                    {item.formattedTotal}
                                                </TableCell>
                                                <TableCell className="py-6 px-8 text-slate-500 font-bold text-xs uppercase tabular-nums">
                                                    {new Date(item.date).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </TableCell>
                                                <TableCell className="py-6 px-8">
                                                    {handleStatusBadge(item.status)}
                                                </TableCell>
                                                <TableCell className="py-6 px-8 text-right">
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-sm">
                                                        <MoreVertical className="w-4 h-4 text-slate-400" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {!historyLoading && meta && (
                        <div className="flex items-center justify-between px-8 py-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                showing {meta.from} to {meta.to} of {meta.total} operations
                            </div>
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-10 px-4 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <ArrowUpRight className="w-3 h-3 mr-2 rotate-[225deg]" />
                                    Previous
                                </Button>
                                <div className="px-4 h-10 flex items-center bg-slate-50 rounded-xl font-black text-[10px] text-[#0066CC] uppercase tracking-widest border border-blue-100">
                                    PAGE {page} OF {meta.last_page}
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-10 px-4 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                                    onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                    disabled={page === meta.last_page}
                                >
                                    Next
                                    <ArrowUpRight className="w-3 h-3 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="boosts" className="space-y-4 focus-visible:outline-none">
                    <div className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm shadow-slate-200/50">
                        {promotionsLoading ? (
                            <div className="p-12 space-y-4">
                                <Skeleton className="h-12 w-full rounded-2xl" />
                                <Skeleton className="h-20 w-full rounded-2xl" />
                                <Skeleton className="h-20 w-full rounded-2xl" />
                                <Skeleton className="h-20 w-full rounded-2xl" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/80">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-amber-600">Asset Identity</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-amber-600">Protocol Tier</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-amber-600">Temporal Range</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-amber-600">Investment</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-amber-600">Integrity</TableHead>
                                            <TableHead className="py-7 px-8 text-right text-[11px] font-black uppercase tracking-widest text-amber-600"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPromotions.map((promo: ActivePromotion) => (
                                            <TableRow key={promo.id} className="group border-slate-50 transition-colors hover:bg-amber-50/20">
                                                <TableCell className="py-6 px-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center font-black text-amber-600 text-[10px] uppercase">
                                                            AST
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-900 text-sm">{promo.listing.title}</div>
                                                            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em]">Asset ID: {promo.listing_id.substring(0, 8)}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-6 px-8">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                                            {(promo.promotion.type || 'Standard Boost').replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-6 px-8">
                                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-tight tabular-nums">
                                                        {new Date(promo.starts_at).toLocaleDateString()}
                                                        <span className="mx-2 text-slate-300">→</span>
                                                        {new Date(promo.expires_at).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-6 px-8 font-black text-slate-900 text-sm tabular-nums">
                                                    ₦{parseFloat(promo.promotion.price).toLocaleString()}
                                                </TableCell>
                                                <TableCell className="py-6 px-8">
                                                    {handleStatusBadge(promo.status)}
                                                </TableCell>
                                                <TableCell className="py-6 px-8 text-right">
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-sm">
                                                        <MoreVertical className="w-4 h-4 text-slate-400" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>

                    {/* Boost Pagination Controls */}
                    {!promotionsLoading && actualBoostsMeta && (
                        <div className="flex items-center justify-between px-8 py-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                showing {actualBoostsMeta.from} to {actualBoostsMeta.to} of {actualBoostsMeta.total} active boosts
                            </div>
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-10 px-4 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                                    onClick={() => setBoostPage(p => Math.max(1, p - 1))}
                                    disabled={boostPage === 1}
                                >
                                    <ArrowUpRight className="w-3 h-3 mr-2 rotate-[225deg]" />
                                    Previous
                                </Button>
                                <div className="px-4 h-10 flex items-center bg-slate-50 rounded-xl font-black text-[10px] text-amber-600 uppercase tracking-widest border border-amber-100">
                                    PAGE {boostPage} OF {actualBoostsMeta.last_page}
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-10 px-4 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                                    onClick={() => setBoostPage(p => Math.min(actualBoostsMeta.last_page, p + 1))}
                                    disabled={boostPage === actualBoostsMeta.last_page}
                                >
                                    Next
                                    <ArrowUpRight className="w-3 h-3 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
