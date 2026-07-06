'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFavoriteListings, useToggleFavorite } from '@/hooks/useUserMarketplace';
import { formatNaira } from '@/app/(public)/page';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Heart, 
    MapPin, 
    Car, 
    Loader2, 
    ChevronLeft, 
    Calendar,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
    const router = useRouter();
    const { data: favoritesResponse, isLoading, isError } = useFavoriteListings();
    const toggleFavoriteMutation = useToggleFavorite();

    const favorites = Array.isArray(favoritesResponse?.data?.data) 
        ? favoritesResponse.data.data 
        : Array.isArray(favoritesResponse?.data)
        ? favoritesResponse.data
        : [];

    const handleRemoveFavorite = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleFavoriteMutation.mutateAsync(id);
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
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading saved vehicles...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Saved Listings</h2>
                    <p className="text-slate-500 font-semibold text-sm mt-1">
                        Vehicles you are monitoring in the marketplace
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/marketplace')}
                    className="rounded-xl border-slate-200 text-slate-600 font-bold text-xs"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Marketplace
                </Button>
            </div>

            {favorites.length === 0 ? (
                <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white py-16 text-center">
                    <CardContent className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-350">
                            <Heart size={28} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No saved vehicles</h3>
                        <p className="text-slate-500 font-semibold text-sm max-w-sm mx-auto">
                            Add listings to your favorites list while browsing the marketplace to monitor them here.
                        </p>
                        <Button 
                            onClick={() => router.push('/marketplace')}
                            className="bg-[#003399] hover:bg-blue-800 rounded-xl font-bold h-11 text-white px-6 mt-4"
                        >
                            Browse Vehicles
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((item: any) => (
                        <Link 
                            key={item.id}
                            href={`/marketplace/${item.id}`}
                            className="group block"
                        >
                            <Card className="overflow-hidden rounded-3xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-350 flex flex-col h-full">
                                {/* Image frame */}
                                <div className="h-48 overflow-hidden bg-slate-100 relative z-0">
                                    <img
                                        src={getPrimaryImage(item)}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/c9x-logo.png';
                                        }}
                                    />
                                    {/* Unfavorite Button */}
                                    <button
                                        onClick={(e) => handleRemoveFavorite(e, item.id)}
                                        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-rose-500 hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <Heart size={16} className="fill-rose-500 text-rose-500" />
                                    </button>

                                    {item.condition && (
                                        <Badge className="absolute bottom-3 left-3 bg-[#003399] text-white border-0 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 shadow-sm">
                                            {item.condition}
                                        </Badge>
                                    )}
                                </div>

                                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="font-extrabold text-slate-800 text-base leading-snug truncate group-hover:text-[#003399] transition-colors">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                                            <MapPin size={12} className="flex-shrink-0" />
                                            <span className="truncate">{item.address || 'Abuja, FCT'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
                                        <p className="text-base font-black text-[#003399]">
                                            {formatNaira(item.amount)}
                                        </p>
                                        <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-[#003399] group-hover:text-white flex items-center justify-center transition-all duration-300">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
