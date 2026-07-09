'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, Suspense } from 'react';
import { useInfiniteUserMarketplaceListings, useToggleFavorite, useRecommendedListings, useHomeExploration } from '@/hooks/useUserMarketplace';
import { usePublicVehicleMakes, usePublicVehicleModels, useVehicleMetadata } from '@/hooks/useUserListings';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { SearchableDropdown } from '@/components/ui/searchable-dropdown';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import Image from 'next/image';
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
    ShieldCheck,
    Smartphone,
    Star,
    Zap,
    ShieldAlert
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

export const getPrimaryImage = (item: any): string => {
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

export const VehicleCard = ({ item, router, handleFavoriteToggle }: { item: any; router: any; handleFavoriteToggle: any }) => {
    const isFavorite = item.isFavorite || item.isFavorited;
    return (
        <motion.div
            layout
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="group cursor-pointer bg-white/90 backdrop-blur-sm rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_25px_50px_rgba(0,51,153,0.08)] transition-all duration-300 overflow-hidden relative flex flex-col h-full"
            onClick={() => router.push(`/marketplace/${item.slug || item.id}`)}
        >
            <button
                type="button"
                onClick={(e) => handleFavoriteToggle(e, item.id)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-150/40 shadow-sm text-slate-600 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all"
                aria-label="Toggle favorite"
            >
                <Heart
                    size={18}
                    className={isFavorite ? 'fill-rose-500 text-rose-500' : 'transition-colors'}
                />
            </button>
            <div className="h-52 overflow-hidden bg-slate-100 relative z-0">
                <Image
                    src={getPrimaryImage(item) || '/c9x-logo.png'}
                    alt={item.title || 'Vehicle'}
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).srcset = '';
                        (e.currentTarget as HTMLImageElement).src = '/c9x-logo.png';
                    }}
                />
                {item.condition && (
                    <span className={`absolute left-4 bottom-4 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow-sm backdrop-blur-md text-white border-0 ${item.condition.toLowerCase().includes('brand')
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-600 shadow-amber-500/10'
                            : item.condition.toLowerCase().includes('foreign')
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 shadow-blue-500/10'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-500 shadow-emerald-500/10'
                        }`}>
                        {item.condition}
                    </span>
                )}
                <div className="absolute right-4 bottom-4 flex items-center gap-1 bg-slate-900/60 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-md text-white text-[9px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Inspected</span>
                </div>
            </div>
            <CardContent className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-slate-50/20">
                <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
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
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 whitespace-nowrap">
                            Direct Deal
                        </span>
                    </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-slate-100/80">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {(item.car?.year || item.year) && (
                            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                <Calendar size={12} className="text-[#003399]" />
                                {item.car?.year || item.year}
                            </span>
                        )}
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
                        <span className="flex items-center gap-1">
                            View Listing
                            <ArrowUpRight size={14} />
                        </span>
                    </div>
                </div>
            </CardContent>
        </motion.div>
    );
};

export const CategoryRow = ({ title, icon, items, router, handleFavoriteToggle }: { title: string; icon: React.ReactNode; items: any[]; router: any; handleFavoriteToggle: any }) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-gradient-to-br from-[#003399]/10 to-[#003399]/5 text-[#003399] rounded-xl ring-1 ring-[#003399]/10">
                        {icon}
                    </div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-[#003399] hover:underline flex items-center gap-1">
                    View All <ArrowUpRight size={12} />
                </button>
            </div>
            <div className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory gap-6 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {items.slice(0, 10).map((item: any) => (
                    <div key={item.id} className="flex-none w-[85vw] sm:w-[320px] lg:w-[300px] xl:w-[320px] snap-start h-full">
                        <VehicleCard
                            item={item}
                            router={router}
                            handleFavoriteToggle={handleFavoriteToggle}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

function MarketplaceContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, user } = useAuthStore();

    // Query Parameters State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedMake, setSelectedMake] = useState<string>(searchParams.get('make') || '');
    const [selectedModel, setSelectedModel] = useState<string>(searchParams.get('model') || '');
    const [selectedCondition, setSelectedCondition] = useState<string>(searchParams.get('condition') || '');
    const [selectedTransmission, setSelectedTransmission] = useState<string>('');
    const [selectedFuelType, setSelectedFuelType] = useState<string>('');
    const [selectedStateId, setSelectedStateId] = useState<string | number>('');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<string>('desc');
    const [hideKycBanner, setHideKycBanner] = useState(false);

    // Drawer/Filters visibility on mobile
    const [showFiltersMobile, setShowFiltersMobile] = useState(false);

    // App Download Popup State
    const [deviceOS, setDeviceOS] = useState<'ios' | 'android' | 'desktop'>('desktop');
    const [showAppPopup, setShowAppPopup] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hidden = sessionStorage.getItem('c9x_hide_kyc_banner');
            if (hidden) setHideKycBanner(true);
        }
        const hasSeenPopup = sessionStorage.getItem('c9x_app_popup_seen');
        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setShowAppPopup(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
        if (/android/i.test(userAgent)) {
            setDeviceOS('android');
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
            setDeviceOS('ios');
        } else {
            setDeviceOS('desktop');
        }
    }, []);

    // Queries
    const { data: makesData, isLoading: isLoadingMakes } = usePublicVehicleMakes();
    const { data: modelsData, isLoading: isLoadingModels } = usePublicVehicleModels(
        makesData?.find((m: any) => m.name === selectedMake)?.id
    );
    const { states, fuelTypes, transmissions } = useVehicleMetadata();

    // Listing query params mapping
    const queryParams = {
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
        sortOrder: sortOrder || undefined,
    };

    const {
        data: listingsResponse,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteUserMarketplaceListings(queryParams);

    const loadMoreRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1, rootMargin: '400px' }
        );
        const el = loadMoreRef.current;
        if (el) observer.observe(el);
        return () => { if (el) observer.unobserve(el); };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
    const { data: recommendedResponse, isLoading: isLoadingRecommended } = useRecommendedListings({ page: 1, perPage: 15 });
    const { data: homeExploration, isLoading: isLoadingHome } = useHomeExploration();
    const toggleFavoriteMutation = useToggleFavorite();

    const hasActiveFilters = Boolean(
        search || selectedMake || selectedModel || selectedCondition ||
        selectedTransmission || selectedFuelType || selectedStateId ||
        minPrice || maxPrice || sortOrder !== 'desc' || page > 1
    );

    const featuredCars = homeExploration?.featuredVehicles || [];
    const boostedCars = homeExploration?.boostedVehicles || [];
    const mostViewedCars = homeExploration?.mostViewedVehicles || [];
    const recentlyAddedCars = homeExploration?.recentlyAdded || [];

    const listings = listingsResponse?.pages.flatMap((page: any) =>
        page?.data?.data || page?.data || []
    ) || [];
    const meta = listingsResponse?.pages[0]?.data?.meta || listingsResponse?.pages[0]?.meta || { last_page: 1, current_page: 1, total: 0 };

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
        setSortOrder('desc');
        setPage(1);
    };

    const handleFavoriteToggle = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
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

    return (
        <div className="min-h-screen bg-slate-50/50 gradient-bg pb-24 pt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

                {/* Marketplace Header */}
                <h1 className="text-3xl font-extrabold text-slate-900 mb-8 mt-4 px-2">Marketplace</h1>

                {/* KYC Prompt Banner for Unverified Users */}
                {isAuthenticated && user && (user.kycStatus === 'pending' || !user.kycStatus || user.kycStatus === 'rejected') && !hideKycBanner && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <ShieldAlert size={120} />
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-full hidden sm:block">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="text-amber-900 font-bold text-lg">Verify your identity</h3>
                                <p className="text-amber-700/80 font-medium text-sm mt-1 max-w-2xl">
                                    You are currently unverified. Complete your KYC verification to unlock full access to the C9X Marketplace, including posting vehicles and messaging sellers securely.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                            <Button
                                variant="outline"
                                className="border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800 bg-transparent font-bold whitespace-nowrap"
                                onClick={() => {
                                    sessionStorage.setItem('c9x_hide_kyc_banner', 'true');
                                    setHideKycBanner(true);
                                }}
                            >
                                Do KYC Later
                            </Button>
                            <Link href="/account/kyc">
                                <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold whitespace-nowrap shadow-md">
                                    Complete KYC Now
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* Main Content Layout Grid */}
                <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">

                    {/* Desktop Filters Panel (Glassmorphic) */}
                    <aside className="hidden lg:block bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 border border-white/60 shadow-[0_10px_35px_rgba(0,0,0,0.02)] space-y-6 sticky top-28 self-start max-h-[calc(100vh-120px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                                <option value="foreign_used">Foreign Used</option>
                                <option value="local_used">Local Used</option>
                                <option value="brand_new">Brand New</option>
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
                                {/* Showing <span className="text-slate-800 font-extrabold">{listings.length}</span> vehicles */}
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#003399] transition-all shadow-sm cursor-pointer"
                                >
                                    <option value="desc">Latest Submissions</option>
                                    <option value="asc">Oldest Submissions</option>
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
                                    {listings.map((item: any) => (
                                        <VehicleCard
                                            key={item.id}
                                            item={item}
                                            router={router}
                                            handleFavoriteToggle={handleFavoriteToggle}
                                        />
                                    ))}
                                </div>

                                {/* Infinite Scroll Loader */}
                                {(hasNextPage || isFetchingNextPage) && (
                                    <div ref={loadMoreRef} className="flex justify-center items-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-[#003399]" />
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
                                        <option value="foreign_used">Foreign Used</option>
                                        <option value="local_used">Local Used</option>
                                        <option value="brand_new">Brand New</option>
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


            <AnimatePresence>
                {showAppPopup && (
                    <div
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
                        onClick={() => {
                            setShowAppPopup(false);
                            sessionStorage.setItem('c9x_app_popup_seen', 'true');
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="relative w-full max-w-lg overflow-hidden bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Dynamic light glows */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none" />

                            {/* Close Button */}
                            <button
                                onClick={() => {
                                    setShowAppPopup(false);
                                    sessionStorage.setItem('c9x_app_popup_seen', 'true');
                                }}
                                className="absolute right-4 top-4 z-50 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="relative z-10 space-y-6">
                                {/* Header Badge */}
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-black uppercase tracking-wider">
                                    <Star size={12} className="fill-blue-400" />
                                    <span>C9X Mobile Experience</span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase leading-tight">
                                        Get a Better <br />
                                        Experience on Mobile
                                    </h3>
                                    <p className="text-slate-400 font-semibold text-sm leading-relaxed">
                                        Unlock instant push notifications, real-time trackers, and direct chat rooms with vetted sellers.
                                    </p>
                                </div>

                                {/* Mobile Mockup representation inside details */}
                                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                                        <Smartphone size={24} />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-bold">Official App Store Verified</h5>
                                        <p className="text-xs text-slate-500 font-medium">Safe & secure download under 30MB</p>
                                    </div>
                                </div>

                                {/* Download Actions */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    {(deviceOS === 'ios' || deviceOS === 'desktop') && (
                                        <a
                                            href="https://apps.apple.com/ng/app/c9x/id6762285536"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => {
                                                setShowAppPopup(false);
                                                sessionStorage.setItem('c9x_app_popup_seen', 'true');
                                            }}
                                            className="flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-950 px-5 py-3 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg font-black text-sm w-full"
                                        >
                                            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z" />
                                            </svg>
                                            <span>iOS App Store</span>
                                        </a>
                                    )}

                                    {(deviceOS === 'android' || deviceOS === 'desktop') && (
                                        <a
                                            href="https://play.google.com/store/apps/details?id=com.c9x.automobile&pli=1"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => {
                                                setShowAppPopup(false);
                                                sessionStorage.setItem('c9x_app_popup_seen', 'true');
                                            }}
                                            className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 text-white px-5 py-3 rounded-xl transition-all hover:-translate-y-0.5 active:translate-y-0 border border-white/10 font-black text-sm w-full"
                                        >
                                            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                                                <path d="M5.25 3.375c-.247 0-.495.068-.712.203l11.437 11.438 2.625-1.5c.712-.412 1.15-1.125 1.15-1.938s-.438-1.525-1.15-1.938L6.47 3.633c-.368-.21-.8-.328-1.22-.328zm-1.5 1.125C3.275 4.8 3 5.4 3 6.1v11.8c0 .7.275 1.3.75 1.6l8.25-8.25-8.25-8.25zm9.5 9.5l-2.25-2.25-8.25 8.25c.212.075.45.125.7.125.287 0 .563-.075.812-.212l8.988-5.138z" />
                                            </svg>
                                            <span>Google Play Store</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function MarketplacePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#003399]" /></div>}>
            <MarketplaceContent />
        </Suspense>
    );
}
