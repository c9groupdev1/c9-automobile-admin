'use client';

import {
    Car,
    Clock,
    CheckCircle2,
    XCircle,
    Star,
    AlertTriangle,
    Search,
    Download,
    Filter,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    X,
    User,
    ArrowUpRight,
    Calendar,
    MapPin,
    RotateCcw
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
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
import { useListings, useListingAnalysis } from '@/hooks/useListings';
import { useDebounce } from '@/hooks/use-debounce';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;

export default function ListingsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [makeFilter, setMakeFilter] = useState('');
    const [modelFilter, setModelFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [stateIdFilter, setStateIdFilter] = useState('');

    // Temporary states for the filter sheet
    const [tempStatus, setTempStatus] = useState('all');
    const [tempMake, setTempMake] = useState('');
    const [tempModel, setTempModel] = useState('');
    const [tempYear, setTempYear] = useState('');
    const [tempStateId, setTempStateId] = useState('');

    const debouncedSearch = useDebounce(search, 500);

    const { data: listingsData, isLoading: loadingListings } = useListings({
        page,
        search: debouncedSearch,
        status: statusFilter === 'all' ? undefined : statusFilter,
        make: makeFilter || undefined,
        model: modelFilter || undefined,
        year: yearFilter || undefined,
        stateId: stateIdFilter || undefined,
        perPage: 10
    });

    const handleApplyFilters = () => {
        setStatusFilter(tempStatus);
        setMakeFilter(tempMake);
        setModelFilter(tempModel);
        setYearFilter(tempYear);
        setStateIdFilter(tempStateId);
        setPage(1);
    };

    const handleResetFilters = () => {
        setTempStatus('all');
        setTempMake('');
        setTempModel('');
        setTempYear('');
        setTempStateId('');

        setStatusFilter('all');
        setMakeFilter('');
        setModelFilter('');
        setYearFilter('');
        setStateIdFilter('');
        setPage(1);
    };

    const clearFilter = (key: string) => {
        if (key === 'status') { setStatusFilter('all'); setTempStatus('all'); }
        if (key === 'make') { setMakeFilter(''); setTempMake(''); }
        if (key === 'model') { setModelFilter(''); setTempModel(''); }
        if (key === 'year') { setYearFilter(''); setTempYear(''); }
        if (key === 'stateId') { setStateIdFilter(''); setTempStateId(''); }
        setPage(1);
    };

    const { data: analysis, isLoading: loadingAnalysis } = useListingAnalysis();

    const listings = listingsData?.data || [];
    const meta = listingsData?.meta;

    const formatDate = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), 'MMM dd, yyyy');
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Vehicle Listing Management</h2>
                    <p className="text-slate-500 font-medium text-sm">Review and manage all vehicle listings submitted across the C9X marketplace.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                <StatsCard
                    title="Total Vehicles"
                    value={loadingAnalysis || !analysis ? '...' : analysis.totalVehicleListings.toLocaleString()}
                    description="Gross inventory"
                    icon={Car}
                    iconBg="bg-blue-50"
                    iconColor="text-[#003399]"
                />
                <StatsCard
                    title="Pending Review"
                    value={loadingAnalysis || !analysis ? '...' : "0"}
                    description="Awaiting approval"
                    icon={Clock}
                    iconBg="bg-orange-50"
                    iconColor="text-orange-500"
                />
                <StatsCard
                    title="Approved"
                    value={loadingAnalysis || !analysis ? '...' : analysis.approvedListings?.toLocaleString()}
                    description="Live in marketplace"
                    icon={CheckCircle2}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                />
                <StatsCard
                    title="Rejected"
                    value={loadingAnalysis || !analysis ? '...' : analysis.rejectedListings?.toLocaleString()}
                    description="Compliance issues"
                    icon={XCircle}
                    iconBg="bg-rose-50"
                    iconColor="text-rose-500"
                />
                <StatsCard
                    title="Featured"
                    value={loadingAnalysis || !analysis ? '...' : "0"}
                    description="Premium placements"
                    icon={Star}
                    iconBg="bg-violet-50"
                    iconColor="text-violet-600"
                />
                <StatsCard
                    title="Flagged"
                    value={loadingAnalysis || !analysis ? '...' : analysis.flaggedListings.toLocaleString()}
                    description="User reports"
                    icon={AlertTriangle}
                    iconBg="bg-rose-50"
                    iconColor="text-rose-500"
                />
            </div>

            {/* Search & Filters Bar */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[300px] group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
                        <Input
                            placeholder="Search by listing title, vehicle brand, model, location..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-12 pl-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 transition-all text-sm font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Sheet>
                            <SheetTrigger
                                render={
                                    <Button variant="outline" className="border-slate-100 rounded-xl px-6 h-12 font-bold text-xs text-slate-600 hover:bg-slate-50">
                                        <Filter size={16} className="mr-2" />
                                        All Filters
                                        {(statusFilter !== 'all' || makeFilter || modelFilter || yearFilter || stateIdFilter) && (
                                            <Badge className="ml-2 bg-[#003399] text-white h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                                                {[statusFilter !== 'all', !!makeFilter, !!modelFilter, !!yearFilter, !!stateIdFilter].filter(Boolean).length}
                                            </Badge>
                                        )}
                                    </Button>
                                }
                            />
                            <SheetContent className="w-[400px] sm:w-[540px] rounded-l-[2rem] border-slate-100 p-8">
                                <SheetHeader className="pb-8 border-b border-slate-100">
                                    <SheetTitle className="text-2xl font-bold">Advanced Filters</SheetTitle>
                                    <SheetDescription className="text-slate-500 font-medium pt-1">Refine your vehicle list using multiple parameters.</SheetDescription>
                                </SheetHeader>
                                <div className="py-8 space-y-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#003399]">Operational Status</Label>
                                        <Select value={tempStatus} onValueChange={(val) => setTempStatus(val || 'all')}>
                                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-semibold focus:ring-offset-0 focus:ring-0">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-slate-100">
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="available">Available</SelectItem>
                                                <SelectItem value="pending">Pending Review</SelectItem>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="sold">Sold</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                                <SelectItem value="flagged">Flagged</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vehicle Make</Label>
                                            <Input
                                                placeholder="Toyota"
                                                value={tempMake}
                                                onChange={(e) => setTempMake(e.target.value)}
                                                className="h-12 rounded-xl bg-slate-50 border-slate-100 font-semibold"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vehicle Model</Label>
                                            <Input
                                                placeholder="Camry"
                                                value={tempModel}
                                                onChange={(e) => setTempModel(e.target.value)}
                                                className="h-12 rounded-xl bg-slate-50 border-slate-100 font-semibold"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Model Year</Label>
                                            <Input
                                                placeholder="2024"
                                                type="number"
                                                value={tempYear}
                                                onChange={(e) => setTempYear(e.target.value)}
                                                className="h-12 rounded-xl bg-slate-50 border-slate-100 font-semibold"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">State (ID)</Label>
                                            <Input
                                                placeholder="Lagos (19)"
                                                value={tempStateId}
                                                onChange={(e) => setTempStateId(e.target.value)}
                                                className="h-12 rounded-xl bg-slate-50 border-slate-100 font-semibold"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <SheetFooter className="p-0 pt-8 border-t border-slate-100 mt-auto">
                                    <div className="flex items-center gap-3 w-full">
                                        <Button
                                            variant="ghost"
                                            className="flex-1 h-14 rounded-2xl font-bold text-slate-500 hover:text-slate-900"
                                            onClick={handleResetFilters}
                                        >
                                            <RotateCcw size={16} className="mr-2" />
                                            Reset All
                                        </Button>
                                        <SheetClose
                                            render={
                                                <Button
                                                    className="flex-[2] h-14 rounded-2xl font-bold bg-[#003399] hover:bg-blue-900 shadow-xl shadow-blue-900/10"
                                                    onClick={handleApplyFilters}
                                                >
                                                    Apply Parameters
                                                </Button>
                                            }
                                        />
                                    </div>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                        {/* <Button variant="outline" className="border-slate-100 rounded-xl px-6 h-12 font-bold text-xs text-slate-600 hover:bg-slate-50">
                            <Download size={16} className="mr-2" />
                            Export
                        </Button> */}
                    </div>
                </div>

                {(statusFilter !== 'all' || makeFilter || modelFilter || yearFilter || stateIdFilter) && (
                    <div className="flex flex-wrap items-center gap-2">
                        {statusFilter !== 'all' && (
                            <div className="flex items-center gap-2 bg-blue-50 text-[#003399] pl-3 pr-2 py-1.5 rounded-lg border border-blue-100 shadow-sm">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Status: {statusFilter}</span>
                                <button
                                    onClick={() => clearFilter('status')}
                                    className="text-[#003399] p-0.5 hover:bg-blue-100 rounded-md transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                        {makeFilter && (
                            <div className="flex items-center gap-2 bg-slate-50 text-slate-900 pl-3 pr-2 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Make: {makeFilter}</span>
                                <button
                                    onClick={() => clearFilter('make')}
                                    className="text-slate-400 p-0.5 hover:bg-slate-100 rounded-md transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                        {modelFilter && (
                            <div className="flex items-center gap-2 bg-slate-50 text-slate-900 pl-3 pr-2 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Model: {modelFilter}</span>
                                <button
                                    onClick={() => clearFilter('model')}
                                    className="text-slate-400 p-0.5 hover:bg-slate-100 rounded-md transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                        {yearFilter && (
                            <div className="flex items-center gap-2 bg-slate-50 text-slate-900 pl-3 pr-2 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Year: {yearFilter}</span>
                                <button
                                    onClick={() => clearFilter('year')}
                                    className="text-slate-400 p-0.5 hover:bg-slate-100 rounded-md transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                        {stateIdFilter && (
                            <div className="flex items-center gap-2 bg-slate-50 text-slate-900 pl-3 pr-2 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                <span className="text-[10px] font-bold uppercase tracking-widest">State: {stateIdFilter}</span>
                                <button
                                    onClick={() => clearFilter('stateId')}
                                    className="text-slate-400 p-0.5 hover:bg-slate-100 rounded-md transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                        <button
                            onClick={handleResetFilters}
                            className="text-[10px] font-bold text-rose-500 uppercase tracking-widest px-4 hover:underline"
                        >Clear All Filters</button>
                    </div>
                )}
            </div>

            {/* Listings Table Card */}
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                <div className="px-10 py-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">All Vehicle Listings</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {meta ? `Showing ${meta.from}-${meta.to} of ${meta.total} listings` : 'Loading listings...'}
                        </p>
                    </div>
                    {/* <div className="flex items-center gap-3">
                        <Button className="bg-emerald-500 hover:bg-emerald-600 rounded-xl px-6 h-11 font-bold text-xs text-white shadow-lg shadow-emerald-900/10">
                            Approve Selected
                        </Button>
                        <Button className="bg-rose-500 hover:bg-rose-600 rounded-xl px-6 h-11 font-bold text-xs text-white shadow-lg shadow-rose-900/10">
                            Reject Selected
                        </Button>
                    </div> */}
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-50">
                                <TableHead className="w-12 px-10 py-5">
                                    <Checkbox className="rounded-md border-slate-300" />
                                </TableHead>
                                <TableHead className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vehicle Details</TableHead>
                                <TableHead className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</TableHead>
                                <TableHead className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vendor/Seller</TableHead>
                                <TableHead className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</TableHead>
                                <TableHead className="px-4 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</TableHead>
                                <TableHead className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loadingListings ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003399]"></div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Retrieving fleet data...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : listings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                                                <Car size={24} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">No listings found matching criteria</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                listings.map((listing) => (
                                    <TableRow key={listing.id} className="hover:bg-slate-50/50 border-slate-50 group transition-colors">
                                        <TableCell className="px-10 py-6 text-center">
                                            <Checkbox className="rounded-md border-slate-300 group-hover:border-[#003399]" />
                                        </TableCell>
                                        <TableCell className="px-4 py-6">
                                            <div className="flex items-center gap-4 min-w-[300px]">
                                                <div className="h-14 w-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 shadow-sm relative group-hover:border-blue-200 transition-colors">
                                                    {listing.image ? (
                                                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover transition-all group-hover:scale-110" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <Car size={20} />
                                                        </div>
                                                    )}
                                                    {listing.isFeatured && (
                                                        <div className="absolute top-1 left-1 bg-[#003399] text-white text-[6px] font-black uppercase rounded-sm px-1 py-0.5 shadow-lg">Featured</div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <Link href={`/admin/listings/${listing.id}`} className="block">
                                                        <span className="text-xs font-black text-slate-900 leading-tight hover:text-[#003399] transition-colors">{listing.title}</span>
                                                    </Link>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                                            <Calendar size={10} />
                                                            {listing.yearModel} {listing.brandModel}
                                                        </span>
                                                        {listing.isVerified && (
                                                            <div className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase flex items-center gap-1">
                                                                <CheckCircle2 size={8} fill="currentColor" />
                                                                Verified
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 whitespace-nowrap">
                                                    {listing.price}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{listing.condition}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-6">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 rounded-xl border border-slate-100 shadow-sm">
                                                    <AvatarImage src={listing.avatar || ''} />
                                                    <AvatarFallback className="bg-blue-50 text-[#003399] font-bold text-[10px] uppercase">{listing.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-800">{listing.name}</span>
                                                    <span className="text-[10px] font-medium text-slate-400 truncate max-w-[120px]">{listing.type}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-6">
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <MapPin size={12} className="shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{listing.city ? `${listing.city}, ${listing.area}` : listing.area || 'Not specified'}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-6 text-center">
                                            <Badge className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-0 pointer-events-none inline-flex items-center gap-1.5",
                                                listing.status === 'available' ? 'bg-emerald-50 text-emerald-600' :
                                                    listing.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                                                        listing.status === 'draft' ? 'bg-slate-100 text-slate-500' : 'bg-rose-50 text-rose-600'
                                            )}>
                                                <div className={cn("w-1.5 h-1.5 rounded-full",
                                                    listing.status === 'available' ? 'bg-emerald-600' :
                                                        listing.status === 'pending' ? 'bg-orange-600' : 'bg-slate-400'
                                                )}></div>
                                                {listing.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-[#003399] hover:bg-blue-50" title="View Details">
                                                    <ArrowUpRight size={14} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {meta && meta.last_page > 1 && (
                    <div className="px-10 py-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Showing {meta.from}-{meta.to} of {meta.total} listings
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors disabled:opacity-30"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <div className="flex gap-1.5">
                                {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => {
                                    const p = i + 1;
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={cn(
                                                "h-10 w-10 rounded-xl font-bold text-xs transition-all",
                                                page === p ? "bg-[#003399] text-white shadow-lg shadow-blue-900/10" : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                                {meta.last_page > 5 && <div className="px-2 self-end text-slate-400 font-bold mb-2">...</div>}
                                {meta.last_page > 5 && (
                                    <button
                                        onClick={() => setPage(meta.last_page)}
                                        className={cn(
                                            "h-10 px-4 rounded-xl bg-white border border-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-50",
                                            page === meta.last_page && "bg-[#003399] text-white"
                                        )}
                                    >{meta.last_page}</button>
                                )}
                            </div>
                            <button
                                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                disabled={page === meta.last_page}
                                className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors disabled:opacity-30"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Audit foundations remains same */}
            {/* <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-lg">Recent Listing Activity</h3>
                    <button className="text-blue-600 font-bold text-[10px] uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="p-4 sm:p-6 lg:p-10 pt-4 divide-y divide-slate-50">
                    <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                            <Clock size={32} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No recent audit logs found</p>
                            <p className="text-xs text-slate-400 font-medium">Activity logs will appear as moderators process listings.</p>
                        </div>
                    </div>
                </div>
            </Card> */}
        </div>
    );
}
