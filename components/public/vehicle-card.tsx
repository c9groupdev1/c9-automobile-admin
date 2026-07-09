import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Gauge, Fuel, ArrowUpRight, Heart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export const formatNaira = (amount: number | string) => {
    if (!amount) return '₦0';
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(amount));
};

export const getPrimaryImage = (item: any): string => {
    if (item.primaryImage?.url) return item.primaryImage.url;
    if (item.primaryImage?.path) return item.primaryImage.path;
    if (item.media && item.media.length > 0) return item.media[0].url || item.media[0].path;
    if (item.images && item.images.length > 0) return item.images[0].url || item.images[0].path;
    return '/c9x-logo.png';
};

export const VehicleCard = ({ item, router, handleFavoriteToggle }: { item: any, router: any, handleFavoriteToggle: any }) => {
    const [isFav, setIsFav] = React.useState(item.isFavorite || item.isFavorited);

    React.useEffect(() => {
        setIsFav(item.isFavorite || item.isFavorited);
    }, [item.isFavorite, item.isFavorited]);

    const onFavoriteClick = (e: React.MouseEvent) => {
        setIsFav(!isFav);
        handleFavoriteToggle(e, item.id);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
        >
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => router.push(`/marketplace/${item.slug || item.id}`)}>
                <Image 
                    src={getPrimaryImage(item)}
                    alt={item.title || 'Vehicle'} 
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { 
                        (e.currentTarget as HTMLImageElement).srcset = '';
                        (e.currentTarget as HTMLImageElement).src = '/c9x-logo.png'; 
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <button 
                    onClick={onFavoriteClick}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur shadow-sm hover:scale-110 active:scale-95 transition-all text-slate-400 hover:text-rose-500 z-10"
                >
                    <Heart size={16} className={isFav ? "fill-rose-500 text-rose-500" : ""} />
                </button>
                
                <div className="absolute bottom-3 left-3 flex gap-2">
                    {item.isBoosted && (
                        <div className="bg-amber-500 text-white font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 text-[10px] uppercase tracking-wider">
                            <Zap size={10} /> Boosted
                        </div>
                    )}
                    <div className="bg-emerald-500 text-white font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 text-[10px] uppercase tracking-wider">
                        <span>Inspected</span>
                    </div>
                </div>
            </div>
            <CardContent className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-slate-50/20">
                <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {item.pricingAndLocation?.sellerContact?.businessName || 'Private Seller'}
                        </span>
                        <div className="flex items-center text-xs font-semibold text-slate-500">
                            <MapPin size={12} className="text-slate-400 mr-1" />
                            <span className="truncate max-w-[120px]">{item.pricingAndLocation?.location?.city || item.address || item.city || 'Lagos'}</span>
                        </div>
                    </div>
                    <h3 className="text-base font-black text-slate-950 line-clamp-1 group-hover:text-[#003399] transition-colors mb-2.5">
                        {item.title}
                    </h3>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 mb-4">
                        <p className="text-xl font-black text-[#003399] tracking-tight truncate max-w-[65%]">
                            {formatNaira(item.amount)}
                        </p>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 whitespace-nowrap">
                            Direct Deal
                        </span>
                    </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-slate-100/80">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            <Calendar size={12} className="text-[#003399]" />
                            {item.car?.year || item.year || '2020'}
                        </span>
                        {item.car?.transmission && (
                            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                <Gauge size={12} className="text-[#003399]" />
                                {item.car?.transmission}
                            </span>
                        )}
                        {item.car?.fuelType && (
                            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                <Fuel size={12} className="text-[#003399]" />
                                {item.car?.fuelType}
                            </span>
                        )}
                    </div>
                    <div className="pt-2 flex items-center justify-end text-xs font-black text-[#003399] transition-colors duration-300 group-hover:text-blue-700">
                        <span className="flex items-center gap-1 cursor-pointer" onClick={() => router.push(`/marketplace/${item.slug || item.id}`)}>
                            View Listing
                            <ArrowUpRight size={14} />
                        </span>
                    </div>
                </div>
            </CardContent>
        </motion.div>
    );
};
