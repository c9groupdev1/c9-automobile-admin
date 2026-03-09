'use client';

import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Car, Trash2, ExternalLink, Settings2, Calendar, Gauge, Zap } from 'lucide-react';
import { Listing, useListings, useDeleteListing } from '@/hooks/useListings';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export function ListingsGrid({ onEdit }: { onEdit?: (listing: Listing) => void }) {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useListings({ page });
    const deleteListing = useDeleteListing();

    const listings = Array.isArray(data?.data?.data) ? data.data.data : (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
    const meta = data?.meta || data?.data?.meta || { current_page: 1, last_page: 1, total: 0 };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this listing?')) {
            try {
                await deleteListing.mutateAsync(id);
                toast.success('Listing deleted successfully');
            } catch (error) {
                toast.error('Failed to delete listing');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="rounded-3xl border border-slate-100 p-4 space-y-4">
                        <Skeleton className="aspect-video w-full rounded-2xl" />
                        <Skeleton className="h-6 w-3/4 rounded-lg" />
                        <Skeleton className="h-4 w-1/2 rounded-lg" />
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <Skeleton className="h-10 rounded-xl" />
                            <Skeleton className="h-10 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.length === 0 ? (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <Car className="h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-slate-500 font-bold">No active listings found in the protocol.</p>
                    </div>
                ) : (
                    listings.map((listing: Listing) => (
                        <div key={listing.id} className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden flex flex-col">
                            {/* Asset Visualization */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                {listing.media?.[0]?.path ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${listing.media[0].path}`}
                                        alt={listing.title}
                                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                        <Car className="h-12 w-12 text-slate-200" />
                                    </div>
                                )}

                                {/* Status & Collection Overlays */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    <Badge
                                        className={cn(
                                            "rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-lg backdrop-blur-md",
                                            listing.status === 'available'
                                                ? 'bg-emerald-500/90 text-white'
                                                : listing.status === 'sold'
                                                    ? 'bg-slate-700/90 text-white'
                                                    : 'bg-rose-500/90 text-white'
                                        )}
                                    >
                                        {listing.status}
                                    </Badge>
                                    {Boolean(listing.is_c9_collection) && (
                                        <Badge className="rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-lg bg-[#0066CC] text-white backdrop-blur-md">
                                            C9 Collection
                                        </Badge>
                                    )}
                                </div>

                                {/* Actions Trigger */}
                                <div className="absolute top-4 right-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger render={
                                            <Button variant="secondary" className="h-10 w-10 p-0 rounded-xl bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/40 text-white transition-all shadow-lg">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        } />
                                        <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 shadow-2xl p-2 min-w-[180px]">
                                            <DropdownMenuGroup>
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Asset Control</DropdownMenuLabel>
                                                <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer focus:bg-slate-50">
                                                    <ExternalLink className="mr-3 h-4 w-4 text-slate-400" />
                                                    <span className="text-sm font-bold text-slate-700">View Public</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onEdit?.(listing)} className="rounded-xl px-3 py-2 cursor-pointer focus:bg-slate-50">
                                                    <Settings2 className="mr-3 h-4 w-4 text-slate-400" />
                                                    <span className="text-sm font-bold text-slate-700">Edit Details</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-slate-50 my-1" />
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(listing.id)}
                                                    className="rounded-xl px-3 py-2 cursor-pointer focus:bg-rose-50 group"
                                                >
                                                    <Trash2 className="mr-3 h-4 w-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                                                    <span className="text-sm font-bold text-slate-700 group-hover:text-rose-600">Delete Asset</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Price Tag & Type */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-slate-900/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex justify-between items-center text-white">
                                        <div className="flex flex-col">
                                            <div className="text-[8px] font-black uppercase tracking-widest opacity-70 leading-none mb-1">Valuation</div>
                                            <div className="text-xl font-black">${Number(listing.amount).toLocaleString()}</div>
                                        </div>
                                        <Badge className="bg-white/20 hover:bg-white/30 border-white/10 text-[8px] font-black uppercase tracking-widest text-white px-2 py-0.5 rounded-lg">
                                            {listing.listing_type?.name || 'Vehicle'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Asset Information */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-lg font-black text-slate-900 line-clamp-1 leading-tight group-hover:text-[#0066CC] transition-colors">
                                        {listing.title}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                                        {listing.car?.make} {listing.car?.model}
                                    </p>
                                </div>

                                {/* Seller Context */}
                                <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                                    <div className="w-8 h-8 rounded-full bg-[#0066CC]/10 flex items-center justify-center border border-[#0066CC]/20">
                                        <span className="text-[10px] font-black text-[#0066CC]">{listing.user?.name?.charAt(0) || 'A'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[10px] font-black uppercase tracking-tighter text-slate-400 leading-none mb-1">Managed By</div>
                                        <div className="text-[10px] font-bold text-slate-700 truncate">{listing.user?.name || 'System Admin'}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mt-auto border-t border-slate-50 pt-4">
                                    <div className="flex flex-col items-center">
                                        <div className="text-[8px] font-black uppercase tracking-tighter text-slate-300">Year</div>
                                        <div className="text-[10px] font-black text-slate-600">{listing.car?.year}</div>
                                    </div>
                                    <div className="flex flex-col items-center border-x border-slate-100 px-2">
                                        <div className="text-[8px] font-black uppercase tracking-tighter text-slate-300">Mileage</div>
                                        <div className="text-[10px] font-black text-slate-600">{listing.car?.mileage} KM</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="text-[8px] font-black uppercase tracking-tighter text-slate-300">Duty</div>
                                        <div className="text-[10px] font-black text-slate-600">{Number(listing.car?.custom_duty) ? 'Paid' : 'Unpaid'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Protocol */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                    System Registry: <span className="text-slate-900">{meta.total} Assets</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-10 rounded-xl px-4 font-bold border-slate-100 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-30"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <div className="h-10 px-4 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-black text-slate-900 border border-slate-100 min-w-[3rem]">
                        {page} / {meta.last_page}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-10 rounded-xl px-4 font-bold border-slate-100 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-30"
                        onClick={() => setPage(page + 1)}
                        disabled={page === meta.last_page}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
