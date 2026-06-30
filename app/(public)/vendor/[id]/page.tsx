'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useVendorProfile, useToggleFavorite } from '@/hooks/useUserMarketplace';
import { useAuthStore } from '@/store/authStore';
import { formatNaira } from '../../marketplace/page';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    User, 
    ShieldCheck, 
    MapPin, 
    Clock, 
    Briefcase, 
    Facebook, 
    Instagram, 
    Twitter, 
    Globe, 
    Heart, 
    Calendar,
    MessageSquare,
    Loader2,
    ChevronLeft,
    Car
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function VendorProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const vendorId = params.id as string;

    const [page, setPage] = useState(1);

    // Queries
    const { data: vendorData, isLoading, isError } = useVendorProfile(vendorId, { page, perPage: 9 });
    const toggleFavoriteMutation = useToggleFavorite();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 pt-28 pb-20">
                <Loader2 className="h-10 w-10 animate-spin text-[#003399] mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading Vendor profile...</p>
            </div>
        );
    }

    if (isError || !vendorData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 pt-28 pb-20 text-center px-6">
                <div className="p-4 bg-rose-50 text-rose-500 rounded-full mb-4">
                    <User size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Vendor Not Found</h3>
                <p className="text-slate-500 font-semibold text-sm max-w-sm mb-6">
                    We could not locate this vendor. They may have deactivated their account or been removed.
                </p>
                <Button onClick={() => router.push('/marketplace')} className="bg-[#003399]">
                    Back to Marketplace
                </Button>
            </div>
        );
    }

    const vendor = vendorData.vendor || {};
    const listings = vendorData.listings?.data || [];
    const meta = vendorData.listings?.meta || { last_page: 1, current_page: 1, total: 0 };
    const kyc = vendor.kyc || {};
    const vp = vendor.vendorProfile || {};

    const handleFavoriteToggle = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.error('Authentication Required', { description: 'Please sign in to save favorites.' });
            router.push('/login');
            return;
        }
        await toggleFavoriteMutation.mutateAsync(id);
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
        <div className="min-h-screen bg-slate-50 gradient-bg pb-20 pt-28">
            <div className="max-w-6xl mx-auto px-6 space-y-8">
                {/* Back Link */}
                <button
                    onClick={() => router.push('/marketplace')}
                    className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ChevronLeft size={16} />
                    Back to Marketplace
                </button>

                {/* Vendor Overview Banner */}
                <Card className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <CardContent className="p-8 md:p-12 space-y-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                            {/* Avatar */}
                            <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-tr from-[#003399] to-[#0066CC] text-white flex items-center justify-center font-bold text-3xl shadow-xl flex-shrink-0">
                                {vp.picture ? (
                                    <img src={vp.picture} alt={vendor.name} className="w-full h-full object-cover rounded-[2rem]" />
                                ) : (
                                    vendor.name?.charAt(0)
                                )}
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                                            {vendor.businessName || vendor.name}
                                        </h1>
                                        {vendor.kycVerified && (
                                            <Badge className="bg-emerald-50 text-emerald-600 border-0 flex items-center gap-1 text-[10px] font-black tracking-wider uppercase px-2 py-0.5">
                                                <ShieldCheck size={11} className="fill-emerald-50" />
                                                Verified Dealer
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-slate-550 text-xs font-semibold">
                                        {vendor.address && (
                                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" />{vendor.address}</span>
                                        )}
                                        {vp.yearsInBusiness && (
                                            <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-slate-400" />{vp.yearsInBusiness} Years Experience</span>
                                        )}
                                        {vp.openingHours && (
                                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" />{vp.openingHours}</span>
                                        )}
                                    </div>
                                </div>

                                {vp.businessDescription && (
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-2xl">
                                        {vp.businessDescription}
                                    </p>
                                )}

                                {/* Social Links */}
                                <div className="flex justify-center md:justify-start gap-3">
                                    {vp.socialMedia?.facebook && (
                                        <a href={vp.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl transition-all border border-slate-100">
                                            <Facebook size={16} />
                                        </a>
                                    )}
                                    {vp.socialMedia?.instagram && (
                                        <a href={vp.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-50 hover:bg-pink-50 text-slate-500 hover:text-pink-600 rounded-xl transition-all border border-slate-100">
                                            <Instagram size={16} />
                                        </a>
                                    )}
                                    {vp.socialMedia?.x && (
                                        <a href={vp.socialMedia.x} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl transition-all border border-slate-100">
                                            <Twitter size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Listings Grid */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        Active Showroom ({meta.total})
                    </h2>

                    {listings.length === 0 ? (
                        <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center justify-center shadow-sm">
                            <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-6">
                                <Car size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Showroom is Empty</h3>
                            <p className="text-slate-500 font-semibold text-sm max-w-sm">
                                This vendor doesn't have any active vehicle listings at the moment.
                            </p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listings.map((item: any) => {
                                const isFavorite = item.isFavorite || item.isFavorited;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => router.push(`/marketplace/${item.id}`)}
                                        className="group cursor-pointer bg-white rounded-3xl border border-slate-100/50 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 relative flex flex-col h-full"
                                    >
                                        {/* Favorite Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => handleFavoriteToggle(e, item.id)}
                                            className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-100 shadow-sm text-slate-650 hover:text-rose-500 transition-all"
                                        >
                                            <Heart size={16} className={isFavorite ? 'fill-rose-500 text-rose-500' : ''} />
                                        </button>

                                        {/* Image */}
                                        <div className="h-44 overflow-hidden bg-slate-100 relative z-0">
                                            <img
                                                src={getPrimaryImage(item)}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Content */}
                                        <CardContent className="p-5 flex-grow flex flex-col justify-between">
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
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
