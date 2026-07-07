'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFavoriteListings, useToggleFavorite } from '@/hooks/useUserMarketplace';
import { formatNaira } from '@/app/(public)/page';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Heart, 
    MapPin, 
    Calendar, 
    ChevronLeft, 
    Loader2, 
    Car,
    X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function FavoritesPage() {
    const router = useRouter();
    const { data: favoritesResponse, isLoading, refetch } = useFavoriteListings();
    const toggleFavoriteMutation = useToggleFavorite();

    const listings = favoritesResponse?.data?.data || [];

    const handleRemoveFavorite = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await toggleFavoriteMutation.mutateAsync(id);
            toast.success('Removed from favorites');
            refetch();
        } catch (error) {}
    };

    const getPrimaryImage = (item: any) => {
        if (item.primaryImage) {
            return item.primaryImage.url || item.primaryImage.path || '/c9x-logo.png';
        }
        if (item.media && item.media.length > 0) {
            const primary = item.media.find((m: any) => m.isPrimary || m.is_primary);
            return primary ? primary.path || primary.url : item.media[0].path || item.media[0].url;
        }
        return '/c9x-logo.png';
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">My Favorites</h2>
                    <p className="text-slate-500 font-semibold text-sm mt-1">
                        Manage your bookmarked vehicle listings
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/account')}
                    className="rounded-xl border-slate-200 text-slate-600 font-bold text-xs"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Back to Account
                </Button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-32">
                    <Loader2 className="h-8 w-8 animate-spin text-[#003399] mb-4" />
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading bookmarks...</p>
                </div>
            ) : listings.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center justify-center shadow-sm">
                    <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-6">
                        <Heart size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Saved Listings</h3>
                    <p className="text-slate-500 font-semibold text-sm max-w-sm mb-6">
                        You haven't bookmarked any vehicles yet. Explore the marketplace to find matching cars.
                    </p>
                    <Button
                        onClick={() => router.push('/marketplace')}
                        className="bg-[#003399] hover:bg-blue-800 text-white rounded-xl font-bold px-6"
                    >
                        Explore Marketplace
                    </Button>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((item: any) => (
                        <motion.div
                            layout
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group cursor-pointer bg-white rounded-3xl border border-slate-100/50 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 relative flex flex-col h-full"
                            onClick={() => router.push(`/marketplace/${item.slug || item.id}`)}
                        >
                            {/* Un-favorite Toggle button */}
                            <button
                                type="button"
                                onClick={(e) => handleRemoveFavorite(e, item.id)}
                                className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-100 shadow-sm text-rose-500 hover:scale-105 transition-all"
                            >
                                <X size={16} />
                            </button>

                            {/* Image */}
                            <div className="h-44 overflow-hidden bg-slate-100 relative z-0">
                                <img
                                    src={getPrimaryImage(item)}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {item.condition && (
                                    <Badge className="absolute left-4 bottom-4 bg-[#003399] text-white border-0 text-[8px] font-black uppercase tracking-wider px-2 py-0.5">
                                        {item.condition}
                                    </Badge>
                                )}
                            </div>

                            {/* Details */}
                            <CardContent className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#003399] transition-colors mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-base font-extrabold text-[#003399] mb-4">
                                        {formatNaira(item.amount)}
                                    </p>
                                </div>

                                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                                        <MapPin size={12} className="text-slate-400" />
                                        <span className="truncate">{item.pricingAndLocation?.location?.city || item.city || 'Lagos'}, {item.pricingAndLocation?.state?.name || 'Nigeria'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={10} />
                                            {item.car?.year || item.year || '2020'}
                                        </span>
                                        {item.car?.transmission && <span>{item.car.transmission}</span>}
                                    </div>
                                </div>
                            </CardContent>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
