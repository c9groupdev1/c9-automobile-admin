'use client';

import {
    MessageSquare,
    Search,
    RefreshCcw,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    ArrowUpRight
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useSupportEnquiries } from '@/hooks/useSupport';
import { useDebounce } from '@/hooks/use-debounce';
import Link from 'next/link';
import { format } from 'date-fns';

export default function SupportPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [status, setStatus] = useState<string>('all');

    const { data: enquiriesData, isLoading, refetch } = useSupportEnquiries({
        page,
        status: status === 'all' ? undefined : status,
        search: debouncedSearch,
    });

    const enquiries = enquiriesData?.data || [];
    const meta = enquiriesData; // The response data object itself contains the meta fields

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Support Enquiries</h2>
                    <p className="text-slate-500 font-medium text-sm">Manage and respond to customer support requests and technical inquiries</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Enquiries"
                    value={isLoading ? '...' : meta?.total?.toLocaleString() || '0'}
                    description="All time requests"
                    icon={MessageSquare}
                    iconBg="bg-blue-50"
                    iconColor="text-[#003399]"
                />
                <StatsCard
                    title="Pending"
                    value={isLoading ? '...' : (enquiries.filter(e => e.status === 'pending').length).toLocaleString()}
                    description="Awaiting response"
                    icon={Clock}
                    iconBg="bg-orange-50"
                    iconColor="text-orange-500"
                />
                <StatsCard
                    title="Resolved"
                    value={isLoading ? '...' : (enquiries.filter(e => e.status === 'resolved').length).toLocaleString()}
                    description="Successfully closed"
                    icon={CheckCircle2}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                />
                <StatsCard
                    title="Closed"
                    value={isLoading ? '...' : (enquiries.filter(e => e.status === 'closed').length).toLocaleString()}
                    description="Archived cases"
                    icon={XCircle}
                    iconBg="bg-slate-50"
                    iconColor="text-slate-500"
                />
            </div>

            {/* Search & Filters Bar */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[300px] group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
                        <Input
                            placeholder="Search by subject, email, or name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-12 pl-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 transition-all text-sm font-medium"
                        />
                    </div>

                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[180px] h-12 rounded-xl bg-slate-50 border-transparent font-bold text-xs text-slate-600">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="all">All Enquiries</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="ghost" size="sm" onClick={() => refetch()} className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                        <RefreshCcw size={14} className="mr-2" /> Refresh
                    </Button>
                </div>
            </div>

            {/* Table Card */}
            <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white min-h-[400px]">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Enquiry List</h3>
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-50">
                                <TableHead className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Requester</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {enquiries.length > 0 ? (
                                enquiries.map((enquiry) => (
                                    <TableRow key={enquiry.id} className="hover:bg-slate-50/50 border-slate-50 group transition-colors">
                                        <TableCell className="px-8 py-5 text-xs font-medium text-slate-500">
                                            {format(new Date(enquiry.created_at), 'MMM dd, yyyy HH:mm')}
                                        </TableCell>
                                        <TableCell className="px-4 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">{enquiry.name || 'Guest'}</span>
                                                <span className="text-[10px] font-medium text-slate-500">{enquiry.email || 'No email provided'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-5">
                                            <span className="text-sm font-bold text-slate-700 truncate max-w-[200px] block" title={enquiry.subject}>
                                                {enquiry.subject}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-5 text-center">
                                            <Badge className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border-0 pointer-events-none",
                                                enquiry.status === 'pending' ? 'bg-orange-50 text-orange-500' :
                                                enquiry.status === 'reviewing' ? 'bg-blue-50 text-[#003399]' :
                                                enquiry.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' :
                                                'bg-slate-100 text-slate-400'
                                            )}>
                                                {enquiry.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-5 text-right">
                                            <Button asChild variant="ghost" size="sm" className="h-8 rounded-lg text-slate-400 hover:text-[#003399] hover:bg-blue-50 font-bold text-xs">
                                                <Link href={`/admin/support/${enquiry.id}`}>
                                                    <Eye size={14} className="mr-2" />
                                                    View Details
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : !isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-48 text-center bg-slate-50/30">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <MessageSquare className="h-8 w-8 text-slate-200" />
                                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No enquiries found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : null}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {meta && meta.last_page > 1 && (
                    <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Showing page {meta.current_page} of {meta.last_page}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-xl border-slate-100 hover:bg-slate-50 disabled:opacity-30"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <div className="flex gap-1">
                                {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => {
                                    const p = i + 1;
                                    return (
                                        <Button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={cn(
                                                "h-9 w-9 rounded-xl font-bold text-xs",
                                                page === p ? "bg-[#003399] text-white shadow-lg shadow-blue-900/10" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                            )}
                                        >
                                            {p}
                                        </Button>
                                    );
                                })}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-xl border-slate-100 hover:bg-slate-50 disabled:opacity-30"
                                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                disabled={page === meta.last_page}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
