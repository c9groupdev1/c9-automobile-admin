'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Car, Trash2, ExternalLink } from 'lucide-react';
import { Listing, useListings, useDeleteListing } from '@/hooks/useListings';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export function ListingsTable() {
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
            <div className="rounded-md border">
                <div className="h-96 w-full flex flex-col gap-4 p-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Transmission</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {listings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No listings found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            listings.map((listing: Listing) => (
                                <TableRow key={listing.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 relative rounded-lg overflow-hidden bg-slate-100 border border-slate-100 shadow-sm">
                                                {listing.media?.[0]?.path ? (
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${listing.media[0].path}`}
                                                        alt={listing.title}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                                        <Car className="h-5 w-5 text-slate-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-slate-900 line-clamp-1">{listing.title}</div>
                                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">
                                                    {listing.car?.make} {listing.car?.model}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold text-slate-600">
                                        {listing.car?.year || 'N/A'}
                                    </TableCell>
                                    <TableCell className="font-bold text-[#0066CC]">
                                        ${Number(listing.amount).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={cn(
                                                "rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border-none shadow-sm",
                                                listing.status === 'available'
                                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                                    : listing.status === 'sold'
                                                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-100'
                                                        : 'bg-rose-100 text-rose-700 hover:bg-rose-100'
                                            )}
                                        >
                                            {listing.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="capitalize text-slate-500 font-medium text-xs">
                                        {listing.car?.transmission || 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger render={
                                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100 transition-all">
                                                    <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                </Button>
                                            } />
                                            <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 shadow-2xl p-2 min-w-[160px]">
                                                <DropdownMenuGroup>
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Asset Control</DropdownMenuLabel>
                                                </DropdownMenuGroup>
                                                <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer focus:bg-slate-50">
                                                    <ExternalLink className="mr-3 h-4 w-4 text-slate-400" />
                                                    <span className="text-sm font-bold text-slate-700">View Public</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer focus:bg-slate-50">
                                                    <Trash2 className="mr-3 h-4 w-4 text-slate-400" />
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
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2">
                <div className="text-sm text-muted-foreground flex-1">
                    Total {meta.total} listings
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === meta.last_page}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
