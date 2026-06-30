'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMyListings, useDeleteListing, useUpdateListingStatus } from '@/hooks/useUserMarketplace';
import { usePromotions, usePromoteListing } from '@/hooks/useUserBilling';
import { formatNaira } from '@/app/(public)/marketplace/page';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Car, 
    Loader2, 
    ChevronLeft, 
    Trash2, 
    Zap, 
    CheckCircle2, 
    XCircle,
    Eye,
    PlusCircle,
    Clock,
    X
} from 'lucide-react';
import Link from 'next/link';

export default function MyListingsPage() {
    const router = useRouter();
    const { data: listingsResponse, isLoading, isError, refetch } = useMyListings();
    const deleteMutation = useDeleteListing();
    const updateStatusMutation = useUpdateListingStatus();
    
    // Promotion states and hooks
    const { data: promotions } = usePromotions();
    const promoteMutation = usePromoteListing();
    const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
    const [showBoostModal, setShowBoostModal] = useState(false);
    const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(null);

    const listings = Array.isArray(listingsResponse?.data?.data) 
        ? listingsResponse.data.data 
        : Array.isArray(listingsResponse?.data)
        ? listingsResponse.data
        : [];

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to permanently delete this listing? This action cannot be undone.')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const handleStatusToggle = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus.toLowerCase() === 'available' ? 'sold' : 'available';
        await updateStatusMutation.mutateAsync({ id, status: nextStatus });
    };

    const handleOpenBoostModal = (listingId: string) => {
        setSelectedListingId(listingId);
        setShowBoostModal(true);
        if (promotions && promotions.length > 0) {
            setSelectedPromotionId(String(promotions[0].id));
        }
    };

    const handleCloseBoostModal = () => {
        setShowBoostModal(false);
        setSelectedListingId(null);
        setSelectedPromotionId(null);
    };

    const handleApplyBoost = async () => {
        if (!selectedListingId || !selectedPromotionId) return;
        try {
            await promoteMutation.mutateAsync({
                listingId: selectedListingId,
                promotionId: selectedPromotionId
            });
            handleCloseBoostModal();
        } catch (error) {}
    };

    const getPrimaryImage = (item: any): string => {
        if (item.primaryImage?.url) return item.primaryImage.url;
        if (item.primaryImage?.path) return item.primaryImage.path;
        if (item.images?.length > 0) {
            const primary = item.images.find((m: any) => m.isPrimary || m.is_primary);
            return primary?.path || primary?.url || item.images[0]?.path || item.images[0]?.url || '/c9x-logo.png';
        }
        if (item.media?.length > 0) {
            const primary = item.media.find((m: any) => m.isPrimary || m.is_primary);
            return primary?.path || primary?.url || item.media[0]?.path || item.media[0]?.url || '/c9x-logo.png';
        }
        return '/c9x-logo.png';
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="h-10 w-10 animate-spin text-[#003399] mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading your listings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">My Listings</h2>
                    <p className="text-slate-500 font-semibold text-sm mt-1">
                        Manage your active listings, view metrics, and boost ads
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/account')}
                        className="rounded-xl border-slate-200 text-slate-600 font-bold text-xs"
                    >
                        <ChevronLeft size={16} className="mr-1" />
                        Account
                    </Button>
                    <Button
                        onClick={() => router.push('/list-vehicle')}
                        className="bg-[#003399] hover:bg-blue-800 rounded-xl text-white font-bold text-xs h-10 px-4 flex items-center gap-1.5"
                    >
                        <PlusCircle size={15} />
                        List New Car
                    </Button>
                </div>
            </div>

            {listings.length === 0 ? (
                <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white py-16 text-center">
                    <CardContent className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-350">
                            <Car size={28} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">You haven't listed any cars</h3>
                        <p className="text-slate-500 font-semibold text-sm max-w-sm mx-auto">
                            Submit your first vehicle to the C9X Marketplace and connect with thousands of buyers.
                        </p>
                        <Button 
                            onClick={() => router.push('/list-vehicle')}
                            className="bg-[#003399] hover:bg-blue-800 rounded-xl font-bold h-11 text-white px-6 mt-4"
                        >
                            List Your Car
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {listings.map((item: any) => {
                        const status = item.status || 'available';
                        const isSold = status.toLowerCase() === 'sold';
                        
                        return (
                            <Card key={item.id} className="border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white hover:border-slate-200 transition-colors">
                                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                    <div className="flex gap-4 items-center min-w-0 w-full md:w-auto">
                                        <div className="w-20 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                                            <img
                                                src={getPrimaryImage(item)}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/c9x-logo.png';
                                                }}
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <Badge className={`border-0 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 ${
                                                    isSold 
                                                        ? 'bg-rose-50 text-rose-600' 
                                                        : 'bg-emerald-50 text-emerald-700'
                                                }`}>
                                                    {status}
                                                </Badge>
                                                {item.isBoosted && (
                                                    <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 flex items-center gap-0.5">
                                                        <Zap size={9} className="fill-amber-500 text-amber-500" />
                                                        Boosted
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="font-extrabold text-slate-800 text-sm leading-snug truncate">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mt-1 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={11} />
                                                    Listed {new Date(item.createdAt || item.created_at || Date.now()).toLocaleDateString()}
                                                </span>
                                                {item.viewsCount !== undefined && (
                                                    <span className="flex items-center gap-1">
                                                        <Eye size={11} />
                                                        {item.viewsCount} Views
                                                    </span>
                                                )}
                                                <span className="font-black text-[#003399]">
                                                    {formatNaira(item.amount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action items */}
                                    <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0 flex-wrap">
                                        <Link href={`/marketplace/${item.id}`}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl border-slate-200 text-slate-600 font-bold text-xs h-9 px-3"
                                            >
                                                <Eye size={13} className="mr-1" />
                                                View Ad
                                            </Button>
                                        </Link>

                                        <Button
                                            onClick={() => handleStatusToggle(item.id, status)}
                                            disabled={updateStatusMutation.isPending}
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl border-slate-200 text-slate-600 font-bold text-xs h-9 px-3"
                                        >
                                            {isSold ? (
                                                <><CheckCircle2 size={13} className="mr-1 text-emerald-500" />Mark Available</>
                                            ) : (
                                                <><XCircle size={13} className="mr-1 text-slate-400" />Mark Sold</>
                                            )}
                                        </Button>

                                        {!isSold && (
                                            <Button
                                                onClick={() => handleOpenBoostModal(item.id)}
                                                className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs h-9 px-3 flex items-center gap-1 shadow-sm"
                                            >
                                                <Zap size={13} className="fill-white" />
                                                Boost Ad
                                            </Button>
                                        )}

                                        <Button
                                            onClick={() => handleDelete(item.id)}
                                            disabled={deleteMutation.isPending}
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-xl text-rose-500 hover:bg-rose-50 font-bold text-xs h-9 w-9 p-0"
                                        >
                                            {deleteMutation.isPending ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 size={14} />
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Premium Promotion/Boost Modal */}
            {showBoostModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={handleCloseBoostModal}
                    />
                    <Card className="relative z-10 w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 p-5">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-amber-50 text-amber-500 rounded-lg">
                                    <Zap size={16} className="fill-amber-500" />
                                </div>
                                <h3 className="font-extrabold text-slate-800 text-base uppercase tracking-tight">Boost Your Listing</h3>
                            </div>
                            <button 
                                onClick={handleCloseBoostModal}
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <CardContent className="p-5 space-y-4">
                            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                                Choose a promotion plan to boost the visibility of your listing in the marketplace, get priority views, and sell faster.
                            </p>

                            {promotions && promotions.length > 0 ? (
                                <div className="space-y-2">
                                    {promotions.map((promo: any) => (
                                        <label 
                                            key={promo.id}
                                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                                                selectedPromotionId === String(promo.id)
                                                    ? 'border-[#003399] bg-blue-50/20'
                                                    : 'border-slate-100 hover:border-slate-200 bg-white'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input 
                                                    type="radio" 
                                                    name="promotion_tier"
                                                    value={promo.id}
                                                    checked={selectedPromotionId === String(promo.id)}
                                                    onChange={() => setSelectedPromotionId(String(promo.id))}
                                                    className="h-4 w-4 text-[#003399]"
                                                />
                                                <div className="text-left">
                                                    <p className="text-xs font-black text-slate-800 uppercase tracking-wide">
                                                        {promo.type.replace(/_/g, ' ')}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                                        Duration: {promo.duration_days} Days
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-xs font-black text-[#003399]">
                                                {formatNaira(promo.price)}
                                            </p>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Loader2 className="h-6 w-6 animate-spin text-[#003399] mx-auto mb-2" />
                                    <p className="text-xs font-bold text-slate-400">Fetching boost packages...</p>
                                </div>
                            )}

                            <div className="flex gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={handleCloseBoostModal}
                                    className="flex-1 rounded-xl h-12 font-bold text-slate-600"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleApplyBoost}
                                    disabled={promoteMutation.isPending || !selectedPromotionId}
                                    className="flex-1 bg-[#003399] hover:bg-blue-800 text-white rounded-xl h-12 font-bold shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5"
                                >
                                    {promoteMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Zap size={14} className="fill-white" />
                                    )}
                                    Activate Boost
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
