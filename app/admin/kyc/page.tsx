'use client';

import {
    ShieldCheck,
    UserCheck,
    UserX,
    FileText,
    Users,
    Store,
    Search,
    Download,
    Filter,
    RefreshCcw,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Clock,
    User,
    CheckCircle2,
    XCircle,
    RotateCcw,
    AlertCircle,
    Building2,
    CreditCard,
    Camera,
    Activity
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useKycRequests } from '@/hooks/useKyc';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;

export default function KYCManagementPage() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const { data: kycData, isLoading } = useKycRequests({
        page,
        status: statusFilter === 'all' ? undefined : statusFilter
    });

    const requests = kycData?.data.data || [];
    const meta = kycData?.data;

    const formatDate = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), 'MMM dd, yyyy');
        } catch (e) {
            return dateStr;
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return { color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2, label: 'Approved' };
            case 'pending':
                return { color: 'bg-orange-50 text-orange-600', icon: Clock, label: 'Pending' };
            case 'rejected':
                return { color: 'bg-rose-50 text-rose-600', icon: XCircle, label: 'Rejected' };
            default:
                return { color: 'bg-slate-100 text-slate-500', icon: RotateCcw, label: status };
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">KYC Management Hub</h2>
                    <p className="text-slate-500 font-medium text-sm">Review and verify user & vendor identity documentation across the protocol.</p>
                </div>
            </div>

            {/* Stats Grid */}
            {/* <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                <StatsCard
                    title="Total Submissions"
                    value={meta?.total?.toLocaleString() || '...'}
                    description="Total KYC entries"
                    icon={FileText}
                    iconBg="bg-blue-50"
                    iconColor="text-[#003399]"
                />
                <StatsCard
                    title="Pending Review"
                    value="..."
                    description="Awaiting verification"
                    icon={Clock}
                    iconBg="bg-orange-50"
                    iconColor="text-orange-500"
                />
                <StatsCard
                    title="Approved"
                    value="..."
                    description="Verified users"
                    icon={CheckCircle2}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                />
                <StatsCard
                    title="Rejected"
                    value="..."
                    description="Denied submissions"
                    icon={XCircle}
                    iconBg="bg-rose-50"
                    iconColor="text-rose-500"
                />
                <StatsCard
                    title="Individual"
                    value="..."
                    description="Personal KYC"
                    icon={User}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-500"
                />
                <StatsCard
                    title="Business"
                    value="..."
                    description="Vendor KYC"
                    icon={Building2}
                    iconBg="bg-violet-50"
                    iconColor="text-violet-600"
                />
            </div> */}

            {/* Search & Filters Bar */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[300px] group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
                        <Input
                            placeholder="Search by name, email, phone, RC number..."
                            className="h-12 pl-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 transition-all text-sm font-medium"
                        />
                    </div>

                    {/* <div className="flex items-center gap-2">
                        <Button className="bg-[#003399] hover:bg-blue-800 rounded-xl px-6 h-12 font-bold text-xs shadow-lg shadow-blue-900/10 whitespace-nowrap">
                            Bulk Actions
                        </Button>
                        <Button variant="outline" className="border-slate-100 rounded-xl px-6 h-12 font-bold text-xs text-slate-600 hover:bg-slate-50">
                            <Download size={16} className="mr-2" />
                            Export
                        </Button>
                    </div> */}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || 'all')}>
                        <SelectTrigger className="w-[150px] h-10 rounded-xl bg-slate-50 border-transparent font-bold text-[10px] text-slate-600 uppercase tracking-widest">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'all')}>
                        <SelectTrigger className="w-[160px] h-10 rounded-xl bg-slate-50 border-transparent font-bold text-[10px] text-slate-600 uppercase tracking-widest">
                            <SelectValue placeholder="Review Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="verification-type">
                        <SelectTrigger className="w-[180px] h-10 rounded-xl bg-slate-50 border-transparent font-bold text-[10px] text-slate-600 uppercase tracking-widest">
                            <SelectValue placeholder="Verification Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="verification-type">ID Type</SelectItem>
                            <SelectItem value="national_id">National ID</SelectItem>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="cac">CAC Certificate</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="ghost" size="icon" className="h-10 w-10 bg-slate-50 rounded-xl border-transparent text-slate-400">
                        <RefreshCcw size={16} />
                    </Button>
                </div>
            </div>

            {/* KYC Submissions Table */}
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">KYC Submission Queue</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {meta ? `Showing ${meta.from}-${meta.to} of ${meta.total} entries` : 'Loading queue...'}
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-50">
                                <TableHead className="w-12 px-10 py-5 text-center">
                                    <Checkbox className="rounded-md border-slate-300" />
                                </TableHead>
                                <TableHead className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User / Business Identity</TableHead>
                                <TableHead className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</TableHead>
                                <TableHead className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Contact Hub</TableHead>
                                <TableHead className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Verif. Artifacts</TableHead>
                                <TableHead className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Submitted At</TableHead>
                                <TableHead className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Progress</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003399]"></div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aggregating submission data...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : requests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Queue is currently empty</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                requests.map((req) => {
                                    const status = getStatusConfig(req.status);
                                    return (
                                        <TableRow key={req.id} className="hover:bg-slate-50/50 border-slate-50 group transition-colors">
                                            <TableCell className="px-10 py-6 text-center">
                                                <Checkbox className="rounded-md border-slate-300 group-hover:border-[#003399]" />
                                            </TableCell>
                                            <TableCell className="px-4 py-6">
                                                <Link href={`/admin/kyc/${req.id}`} className="group/link block">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-11 w-11 rounded-2xl border border-white shadow-sm ring-1 ring-slate-100 overflow-hidden group-hover/link:ring-blue-200 transition-all">
                                                            {req.verificationDetails?.selfiePicture && (
                                                                <AvatarImage src={req.verificationDetails.selfiePicture.startsWith('http') ? req.verificationDetails.selfiePicture : `${STORAGE_URL}${req.verificationDetails.selfiePicture}`} className="object-cover" />
                                                            )}
                                                            <AvatarFallback className="bg-blue-50 text-[#003399] font-black text-xs uppercase">{req.user?.name?.[0] || 'U'}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-sm font-black text-slate-900 truncate max-w-[180px] group-hover/link:text-[#003399] transition-colors">{req.verificationDetails?.businessInfo?.businessName || req.user?.name || 'Unknown'}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-[150px]">
                                                                {req.user.id?.split('-')?.[0]?.toUpperCase() || 'USER'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="px-4 py-6">
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl whitespace-nowrap",
                                                    req.type.toLowerCase() === 'business' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600'
                                                )}>
                                                    {req.type.toLowerCase() === 'business' ? <Building2 size={12} /> : <User size={12} />}
                                                    <span className="text-[9px] font-black uppercase tracking-widest">{req.type}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-6 text-center">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-700">{req.user.email}</span>
                                                    <span className="text-[10px] font-medium text-slate-400 mt-0.5">{req.verificationDetails?.phoneNumber || 'N/A'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-6">
                                                <div className="flex items-center justify-center gap-3">
                                                    {(req.verificationDetails?.individualInfo?.idType || req.verificationDetails?.businessInfo?.rcNumber) && (
                                                        <div className="flex flex-col items-center gap-1 group/item">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-blue-50 group-hover/item:text-blue-500 transition-colors">
                                                                <CreditCard size={14} />
                                                            </div>
                                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter truncate max-w-[60px]">
                                                                {req.verificationDetails?.individualInfo?.idType || `RC: ${req.verificationDetails?.businessInfo?.rcNumber}`}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {req.verificationDetails?.selfiePicture && (
                                                        <div className="flex flex-col items-center gap-1 group/item">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-emerald-50 group-hover/item:text-emerald-500 transition-colors">
                                                                <Camera size={14} />
                                                            </div>
                                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Selfie</span>
                                                        </div>
                                                    )}
                                                    {req.verificationDetails?.businessInfo?.rcNumber && (
                                                        <div className="flex flex-col items-center gap-1 group/item">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-violet-50 group-hover/item:text-violet-500 transition-colors">
                                                                <FileText size={14} />
                                                            </div>
                                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">RC: {req.verificationDetails.businessInfo.rcNumber}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-6 text-center">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-900">{formatDate(req.submittedAt)}</span>
                                                    <span className="text-[10px] font-medium text-slate-400 mt-0.5 whitespace-nowrap">Official Entry</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-10 py-6 text-right">
                                                <Badge className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border-0 pointer-events-none inline-flex items-center gap-1.5",
                                                    status.color
                                                )}>
                                                    <status.icon size={12} className="shrink-0" />
                                                    {status.label}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {meta && meta.last_page > 1 && (
                    <div className="px-10 py-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/20">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Showing {meta.from} to {meta.to} of {meta.total} submissions
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 rounded-xl border-slate-100 bg-white hover:bg-slate-50 disabled:opacity-30"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <div className="flex gap-1.5">
                                {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => {
                                    const p = i + 1;
                                    return (
                                        <Button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={cn(
                                                "h-10 w-10 rounded-xl font-bold text-xs transition-all",
                                                page === p ? "bg-[#003399] text-white shadow-lg shadow-blue-900/10" : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
                                            )}
                                        >
                                            {p}
                                        </Button>
                                    );
                                })}
                                {meta.last_page > 5 && <div className="px-2 self-end text-slate-400 font-bold mb-2">...</div>}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 rounded-xl border-slate-100 bg-white hover:bg-slate-50 disabled:opacity-30"
                                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                disabled={page === meta.last_page}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Recent KYC Review Activity foundations (remains same) */}
            {/* <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                <CardHeader className="px-10 py-8 border-b border-slate-50">
                    <CardTitle className="text-lg font-bold text-slate-900">Recent KYC Review Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pb-10">
                    <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                            <Activity size={32} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No recent audit logs found</p>
                            <p className="text-xs text-slate-400 font-medium">Activity logs will appear as moderators process submissions.</p>
                        </div>
                    </div>
                </CardContent>
            </Card> */}
        </div>
    );
}
