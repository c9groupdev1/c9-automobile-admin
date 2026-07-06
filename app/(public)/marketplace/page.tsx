'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserMarketplaceListings, useToggleFavorite } from '@/hooks/useUserMarketplace';
import { usePublicVehicleMakes, usePublicVehicleModels, useVehicleMetadata } from '@/hooks/useUserListings';
import { useAuthStore } from '@/store/authStore';
import { SearchableDropdown } from '@/components/ui/searchable-dropdown';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { 
    Search, 
    Heart, 
    MapPin, 
    Calendar, 
    SlidersHorizontal, 
    Sparkles, 
    ChevronLeft, 
    ChevronRight,
    Loader2,
    Car,
    X,
    ArrowUpRight,
    Gauge,
    Fuel,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function formatNaira(amount: number | string) {
    if (amount === null || amount === undefined) return '₦0';
    
    // Strip commas if amount is a string to check parsed value
    const parsedAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
    
    if (isNaN(parsedAmount)) return '₦0';
    
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(parsedAmount).replace('NGN', '₦');
}

export default function MarketplacePage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    
    // Query Parameters State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedMake, setSelectedMake] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [selectedCondition, setSelectedCondition] = useState<string>('');
    const [selectedTransmission, setSelectedTransmission] = useState<string>('');
    const [selectedFuelType, setSelectedFuelType] = useState<string>('');
    const [selectedStateId, setSelectedStateId] = useState<string | number>('');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [sort, setSort] = useState<string>('latest');
    
    // Drawer/Filters visibility on mobile
    const [showFiltersMobile, setShowFiltersMobile] = useState(false);

    // Queries
    const { data: makesData, isLoading: isLoadingMakes } = usePublicVehicleMakes();
    const { data: modelsData, isLoading: isLoadingModels } = usePublicVehicleModels(
        makesData?.find((m: any) => m.name === selectedMake)?.id
    );
    const { states, fuelTypes, transmissions } = useVehicleMetadata();
    
    // Listing query params mapping
    const queryParams = {
        page,
        perPage: 12,
        search: search || undefined,
        make: selectedMake || undefined,
        model: selectedModel || undefined,
        condition: selectedCondition || undefined,
        transmission: selectedTransmission || undefined,
        fuelType: selectedFuelType || undefined,
        stateId: selectedStateId || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        sort: sort || undefined,
    };

    const { data: listingsResponse, isLoading, isPlaceholderData } = useUserMarketplaceListings(queryParams);
    const toggleFavoriteMutation = useToggleFavorite();

    const listings = listingsResponse?.data?.data || [];
    const meta = listingsResponse?.data?.meta || { last_page: 1, current_page: 1, total: 0 };

    // Reset models when make changes
    useEffect(() => {
        setSelectedModel('');
    }, [selectedMake]);

    const handleResetFilters = () => {
        setSearch('');
        setSelectedMake('');
        setSelectedModel('');
        setSelectedCondition('');
        setSelectedTransmission('');
        setSelectedFuelType('');
        setSelectedStateId('');
        setMinPrice('');
        setMaxPrice('');
        setSort('latest');
        setPage(1);
    };

    const handleFavoriteToggle = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.error('Authentication Required', {
                description: 'Please sign in to save vehicles to your favorites.'
            });
            router.push('/login?redirect=/marketplace');
            return;
        }
        await toggleFavoriteMutation.mutateAsync(id);
    };

    // Mapping option lists
    const makeOptions = makesData?.map((m: any) => ({ label: m.name, value: m.name })) || [];
    const modelOptions = modelsData?.map((m: any) => ({ label: m.name, value: m.name })) || [];
    const stateOptions = states.data?.map((s: any) => ({ label: s.name, value: s.id })) || [];

    const getPrimaryImage = (item: any): string => {
        // 1. Direct primaryImage object (from list API response)
        if (item.primaryImage?.url) return item.primaryImage.url;
        if (item.primaryImage?.path) return item.primaryImage.path;
        // 2. images array (detail API)
        if (item.images?.length > 0) {
            const primary = item.images.find((m: any) => m.isPrimary || m.is_primary);
            return primary?.path || primary?.url || item.images[0]?.path || item.images[0]?.url || '/c9x-logo.png';
        }
        // 3. media array
        if (item.media?.length > 0) {
            const primary = item.media.find((m: any) => m.isPrimary || m.is_primary);
            return primary?.path || primary?.url || item.media[0]?.path || item.media[0]?.url || '/c9x-logo.png';
        }
        return '/c9x-logo.png';
    };

    return (
        <div className="min-h-screen bg-slate-50/50 gradient-bg pb-24 pt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                
                {/* Immersive Dark Banner Hero Header */}
                <div className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-[#002266] p-8 md:p-12 overflow-hidden shadow-2xl mb-12 border border-slate-800">
                    {/* Floating ambient radial shapes */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/3 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                        <div className="space-y-4 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20">
                                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                                <span className="text-[10px] font-black tracking-widest uppercase text-blue-300">Verified Luxury Catalog</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
                                Find Your <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Next Machine</span>
                            </h1>
                            <p className="text-slate-400 font-semibold text-sm leading-relaxed">
                                Explore Nigeria's premium marketplace for certified new and pre-owned automobiles. Backed by C9X multi-point diagnostic inspections.
                            </p>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full lg:w-auto">
                            {[
                                { val: '100%', label: 'Inspected Vehicles' },
                                { val: '5k+', label: 'Happy Customers' },
                                { val: '0%', label: 'CORS/API Downtime' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[125px] text-center shadow-inner">
                                    <div className="text-2xl font-black text-white bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">{stat.val}</div>
                                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Layout Grid */}
                <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
                    
                    {/* Desktop Filters Panel (Glassmorphic) */}
                    <aside className="hidden lg:block bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 border border-white/60 shadow-[0_10px_35px_rgba(0,0,0,0.02)] space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wider">
                                <SlidersHorizontal size={14} className="text-[#003399]" />
                                Filter Cars
                            </h3>
                            <button 
                                onClick={handleResetFilters}
                                className="text-[10px] font-black uppercase tracking-wider text-[#003399] hover:underline"
                            >
                                Reset All
                            </button>
                        </div>

                        {/* Search keyword */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Keywords</label>
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="e.g. Mercedes-Benz, G63"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                    className="pl-10 h-12 text-xs font-semibold rounded-xl bg-slate-50 border-slate-100/80 focus:bg-white transition-all shadow-sm focus:border-[#003399]"
                                />
                            </div>
                        </div>

                        {/* Brand / Make */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Brand / Make</label>
                            <SearchableDropdown
                                options={makeOptions}
                                value={selectedMake}
                                onChange={(val) => { setSelectedMake(String(val)); setPage(1); }}
                                placeholder="Select Brand"
                                loading={isLoadingMakes}
                            />
                        </div>

                        {/* Model */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Model</label>
                            <SearchableDropdown
                                options={modelOptions}
                                value={selectedModel}
                                onChange={(val) => { setSelectedModel(String(val)); setPage(1); }}
                                placeholder="Select Model"
                                disabled={!selectedMake}
                                loading={isLoadingModels}
                            />
                        </div>

                        {/* Condition */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Condition</label>
                            <select
                                value={selectedCondition}
                                onChange={(e) => { setSelectedCondition(e.target.value); setPage(1); }}
                                className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none transition-all shadow-sm focus:border-[#003399]"
                            >
                                <option value="">Any Condition</option>
                                <option value="Foreign Used">Foreign Used</option>
                                <option value="Local Used">Local Used</option>
                                <option value="Brand New">Brand New</option>
                            </select>
                        </div>

                        {/* Transmission */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Transmission</label>
                            <select
                                value={selectedTransmission}
                                onChange={(e) => { setSelectedTransmission(e.target.value); setPage(1); }}
                                className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none transition-all shadow-sm focus:border-[#003399]"
                            >
                                <option value="">Any Transmission</option>
                                {transmissions.data?.map((t: any) => {
                                    const val = typeof t === 'string' ? t : t.name || '';
                                    const key = typeof t === 'string' ? t : t.id || t.name || '';
                                    return <option key={key} value={val}>{val}</option>;
                                })}
                            </select>
                        </div>

                        {/* Fuel Type */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Fuel Type</label>
                            <select
                                value={selectedFuelType}
                                onChange={(e) => { setSelectedFuelType(e.target.value); setPage(1); }}
                                className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none transition-all shadow-sm focus:border-[#003399]"
                            >
                                <option value="">Any Fuel Type</option>
                                {fuelTypes.data?.map((f: any) => {
                                    const val = typeof f === 'string' ? f : f.name || '';
                                    const key = typeof f === 'string' ? f : f.id || f.name || '';
                                    return <option key={key} value={val}>{val}</option>;
                                })}
                            </select>
                        </div>

                        {/* State */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">State / Location</label>
                            <SearchableDropdown
                                options={stateOptions}
                                value={selectedStateId}
                                onChange={(val) => { setSelectedStateId(val); setPage(1); }}
                                placeholder="Select State"
                                loading={states.isLoading}
                            />
                        </div>

                        {/* Price Range */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Price Range (₦)</label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    placeholder="Min"
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                                    className="h-12 text-xs font-semibold rounded-xl bg-slate-50 border-slate-100/85 focus:bg-white transition-all shadow-sm focus:border-[#003399]"
                                />
                                <Input
                                    placeholder="Max"
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                                    className="h-12 text-xs font-semibold rounded-xl bg-slate-50 border-slate-100/85 focus:bg-white transition-all shadow-sm focus:border-[#003399]"
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Listings Catalog Grid */}
                    <div className="space-y-10">
                        
                        {/* Upper sorting actions toolbar */}
                        <div className="flex items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-[0_5px_15px_rgba(0,0,0,0.01)]">
                            <div className="text-slate-500 text-xs font-bold pl-2">
                                Showing <span className="text-slate-800 font-extrabold">{listings.length}</span> vehicles
                            </div>
                            <div className="flex items-center gap-3">
                                <select 
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#003399] transition-all shadow-sm cursor-pointer"
                                >
                                    <option value="latest">Latest Submissions</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="year_desc">Year: Newest First</option>
                                </select>

                                <Button
                                    variant="outline"
                                    onClick={() => setShowFiltersMobile(true)}
                                    className="lg:hidden h-11 rounded-xl flex items-center gap-2 font-bold px-4 bg-white border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50"
                                >
                                    <SlidersHorizontal size={14} className="text-[#003399]" />
                                    Filters
                                </Button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center p-32">
                                <Loader2 className="h-10 w-10 animate-spin text-[#003399] mb-4" />
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading catalog...</p>
                            </div>
                        ) : listings.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-md"
                            >
                                <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-6">
                                    <Car size={36} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No Matching Vehicles</h3>
                                <p className="text-slate-500 font-semibold text-sm max-w-sm mb-6">
                                    We couldn't find any vehicles that match your exact filters. Try broadening your criteria.
                                </p>
                                <Button
                                    onClick={handleResetFilters}
                                    className="bg-[#003399] hover:bg-blue-800 text-white rounded-xl font-bold"
                                >
                                    Reset Filters
                                </Button>
                            </motion.div>
                        ) : (
                            <>
                                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {listings.map((item: any) => {
                                        const isFavorite = item.isFavorite || item.isFavorited;
                                        return (
                                            <motion.div
                                                layout
                                                key={item.id}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                whileHover={{ y: -8 }}
                                                className="group cursor-pointer bg-white/90 backdrop-blur-sm rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_25px_50px_rgba(0,51,153,0.08)] transition-all duration-300 overflow-hidden relative flex flex-col h-full"
                                                onClick={() => router.push(`/marketplace/${item.id}`)}
                                            >
                                                {/* Favorite Toggle Button */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleFavoriteToggle(e, item.id)}
                                                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-150/40 shadow-sm text-slate-600 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all"
                                                >
                                                    <Heart 
                                                        size={18} 
                                                        className={isFavorite ? 'fill-rose-500 text-rose-500' : 'transition-colors'} 
                                                    />
                                                </button>

                                                {/* Image Frame */}
                                                <div className="h-52 overflow-hidden bg-slate-100 relative z-0">
                                                    <img
                                                        src={getPrimaryImage(item)}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/c9x-logo.png';
                                                        }}
                                                    />
                                                    
                                                    {/* Condition Badge with custom gradients */}
                                                    {item.condition && (
                                                        <span className={`absolute left-4 bottom-4 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow-sm backdrop-blur-md text-white border-0 ${
                                                            item.condition.toLowerCase().includes('brand') 
                                                                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 shadow-amber-500/10'
                                                                : item.condition.toLowerCase().includes('foreign')
                                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 shadow-blue-500/10'
                                                                    : 'bg-gradient-to-r from-emerald-600 to-teal-500 shadow-emerald-500/10'
                                                        }`}>
                                                            {item.condition}
                                                        </span>
                                                    )}

                                                    {/* Inspected check badge overlay */}
                                                    <div className="absolute right-4 bottom-4 flex items-center gap-1 bg-slate-900/60 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-md text-white text-[9px] font-bold">
                                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                                        <span>Inspected</span>
                                                    </div>
                                                </div>

                                                {/* Details Content */}
                                                <CardContent className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-slate-50/20">
                                                    <div>
                                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                                                {item.pricingAndLocation?.sellerContact?.businessName || 'Private Seller'}
                                                            </span>
                                                            <div className="flex items-center text-xs font-semibold text-slate-500">
                                                                <MapPin size={12} className="text-slate-400 mr-1" />
                                                                <span className="truncate max-w-[120px]">{item.pricingAndLocation?.location?.city || item.city || 'Lagos'}</span>
                                                            </div>
                                                        </div>
                                                        <h3 className="text-base font-black text-slate-950 line-clamp-1 group-hover:text-[#003399] transition-colors mb-2.5">
                                                            {item.title}
                                                        </h3>
                                                        <div className="flex items-baseline justify-between mb-4">
                                                            <p className="text-xl font-black text-[#003399] tracking-tight">
                                                                {formatNaira(item.amount)}
                                                            </p>
                                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
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

                                                        {/* Quick link button that fades in on hover */}
                                                        <div className="pt-2 flex items-center justify-end text-xs font-black text-[#003399] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <span className="flex items-center gap-1">
                                                                View Listing
                                                                <ArrowUpRight size={14} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Pagination Controls */}
                                {meta.last_page > 1 && (
                                    <div className="flex items-center justify-center gap-4 pt-10">
                                        <Button
                                            variant="outline"
                                            disabled={page === 1}
                                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                            className="h-10 rounded-xl flex items-center gap-2 font-bold bg-white text-slate-700 border-slate-200"
                                        >
                                            <ChevronLeft size={16} />
                                            Prev
                                        </Button>
                                        
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                            Page <span className="text-slate-800">{page}</span> of {meta.last_page}
                                        </span>

                                        <Button
                                            variant="outline"
                                            disabled={page === meta.last_page}
                                            onClick={() => setPage((p) => Math.min(p + 1, meta.last_page))}
                                            className="h-10 rounded-xl flex items-center gap-2 font-bold bg-white text-slate-700 border-slate-200"
                                        >
                                            Next
                                            <ChevronRight size={16} />
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filters Drawer Modal (Glassmorphic) */}
            <AnimatePresence>
                {showFiltersMobile && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden flex justify-end"
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="w-full max-w-xs bg-white/95 backdrop-blur-xl h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl border-l border-slate-100"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                    <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
                                        <SlidersHorizontal size={16} className="text-[#003399]" />
                                        Filters
                                    </h3>
                                    <button 
                                        onClick={() => setShowFiltersMobile(false)}
                                        className="p-1.5 text-slate-400 hover:text-slate-650 rounded-full hover:bg-slate-50 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Search keyword */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Search Keywords</label>
                                    <div className="relative">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Toyota, Camry, etc..."
                                            value={search}
                                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                            className="pl-10 h-12 text-xs font-semibold rounded-xl bg-slate-50 border-slate-100"
                                        />
                                    </div>
                                </div>

                                {/* Brand / Make */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Brand / Make</label>
                                    <SearchableDropdown
                                        options={makeOptions}
                                        value={selectedMake}
                                        onChange={(val) => { setSelectedMake(String(val)); setPage(1); }}
                                        placeholder="Select Brand"
                                        loading={isLoadingMakes}
                                    />
                                </div>

                                {/* Model */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Model</label>
                                    <SearchableDropdown
                                        options={modelOptions}
                                        value={selectedModel}
                                        onChange={(val) => { setSelectedModel(String(val)); setPage(1); }}
                                        placeholder="Select Model"
                                        disabled={!selectedMake}
                                        loading={isLoadingModels}
                                    />
                                </div>

                                {/* Condition */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Condition</label>
                                    <select
                                        value={selectedCondition}
                                        onChange={(e) => { setSelectedCondition(e.target.value); setPage(1); }}
                                        className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800"
                                    >
                                        <option value="">Any Condition</option>
                                        <option value="Foreign Used">Foreign Used</option>
                                        <option value="Local Used">Local Used</option>
                                        <option value="Brand New">Brand New</option>
                                    </select>
                                </div>

                                {/* Transmission */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Transmission</label>
                                    <select
                                        value={selectedTransmission}
                                        onChange={(e) => { setSelectedTransmission(e.target.value); setPage(1); }}
                                        className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800"
                                    >
                                        <option value="">Any Transmission</option>
                                        {transmissions.data?.map((t: any) => {
                                            const val = typeof t === 'string' ? t : t.name || '';
                                            const key = typeof t === 'string' ? t : t.id || t.name || '';
                                            return <option key={key} value={val}>{val}</option>;
                                        })}
                                    </select>
                                </div>

                                {/* Fuel Type */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Fuel Type</label>
                                    <select
                                        value={selectedFuelType}
                                        onChange={(e) => { setSelectedFuelType(e.target.value); setPage(1); }}
                                        className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800"
                                    >
                                        <option value="">Any Fuel Type</option>
                                        {fuelTypes.data?.map((f: any) => {
                                            const val = typeof f === 'string' ? f : f.name || '';
                                            const key = typeof f === 'string' ? f : f.id || f.name || '';
                                            return <option key={key} value={val}>{val}</option>;
                                        })}
                                    </select>
                                </div>

                                {/* State */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">State / Location</label>
                                    <SearchableDropdown
                                        options={stateOptions}
                                        value={selectedStateId}
                                        onChange={(val) => { setSelectedStateId(val); setPage(1); }}
                                        placeholder="Select State"
                                        loading={states.isLoading}
                                    />
                                </div>

                                {/* Price Range */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Price Range (₦)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            placeholder="Min"
                                            type="number"
                                            value={minPrice}
                                            onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                                            className="h-12 text-xs font-semibold rounded-xl bg-slate-50 border-slate-100"
                                        />
                                        <Input
                                            placeholder="Max"
                                            type="number"
                                            value={maxPrice}
                                            onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                                            className="h-12 text-xs font-semibold rounded-xl bg-slate-50 border-slate-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleResetFilters}
                                    className="flex-1 rounded-xl font-bold h-12 border-slate-200 text-slate-700"
                                >
                                    Reset
                                </Button>
                                <Button
                                    onClick={() => setShowFiltersMobile(false)}
                                    className="flex-1 bg-[#003399] hover:bg-blue-800 text-white rounded-xl font-bold h-12"
                                >
                                    Apply
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
