'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    ShieldCheck,
    Clock,
    Star,
    Car,
    MapPin,
    Calendar,
    Settings,
    User,
    Mail,
    Phone,
    Activity,
    AlertCircle,
    Check,
    Eye,
    Tag,
    Image as ImageIcon,
    FileCheck,
    Maximize2,
    Sparkles,
    ShieldAlert,
    ExternalLink,
    Zap,
    Gauge,
    Fuel,
    Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useListing, useListingImages, useUpdateListingStatus, useVerifyVin } from '@/hooks/useListings';
import { toast } from 'sonner';
import { PermissionGuard } from '@/components/auth/permission-guard';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog';

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? '';

const getImageUrl = (url: string | null | undefined): string => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('//')) return url;
    return `${STORAGE_URL}${url}`;
};

export default function ListingDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const { data: listing, isLoading } = useListing(id);
    const { data: allImages } = useListingImages(id);
    const updateStatusMutation = useUpdateListingStatus();
    const verifyVinMutation = useVerifyVin();
    
    const [activeImage, setActiveImage] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isVinModalOpen, setIsVinModalOpen] = useState(false);
    const [vinData, setVinData] = useState<any>(null);
    const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
    const thumbnailScrollRef = useRef<HTMLDivElement>(null);

    const scrollThumbnails = (dir: 'left' | 'right') => {
        thumbnailScrollRef.current?.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
    };

    const images: Array<{ id: string; url: string; isPrimary: boolean }> = (() => {
        const base = listing?.mediaReview?.images ?? [];
        if (!allImages || allImages.length === 0) return base;
        return allImages.length >= base.length ? allImages : base;
    })();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
                <div className="relative">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center relative z-10 animate-pulse border border-slate-100">
                        <Car className="w-10 h-10 text-[#003399]" />
                    </div>
                    <div className="absolute inset-0 bg-[#003399]/20 rounded-3xl blur-2xl animate-ping scale-75" />
                </div>
                <div className="flex flex-col items-center space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Loading Vehicle Intelligence</p>
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-[#003399] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 bg-[#003399] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-[#003399] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                </div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 max-w-md mx-auto text-center px-4">
                <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-xl shadow-rose-500/10">
                    <AlertCircle size={36} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Listing Unreachable</h3>
                    <p className="text-slate-500 font-medium text-sm mt-2 leading-relaxed">
                        The requested listing ID <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">{id}</span> was not found in the vehicle registry.
                    </p>
                </div>
                <Button
                    onClick={() => router.push('/admin/listings')}
                    className="bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest h-12 px-8 rounded-2xl shadow-xl shadow-slate-900/10"
                >
                    <ChevronLeft size={16} className="mr-2" />
                    Return to Inventory
                </Button>
            </div>
        );
    }

    const handleStatusUpdate = async (status: string) => {
        try {
            await updateStatusMutation.mutateAsync({
                id,
                status,
                comments: reviewComment
            });
            toast.success(`Listing status updated to ${status.toUpperCase()}`);
            setIsReviewModalOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update listing status');
        }
    };

    const handleVerifyVin = async () => {
        if (!listing.vehicleInformation.vinChassisNumber) {
            toast.error('No VIN available for verification');
            return;
        }
        try {
            const result = await verifyVinMutation.mutateAsync(listing.vehicleInformation.vinChassisNumber);
            if (result.success) {
                setVinData(result.data.data);
                setIsVinModalOpen(true);
                toast.success('VIN decoded successfully from official registry');
            } else {
                toast.error(result.message || 'VIN verification failed');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to connect to VIN Registry');
        }
    };

    const statusConfig: Record<string, { label: string; badgeStyle: string; dotStyle: string }> = {
        available: { label: 'Active & Approved', badgeStyle: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', dotStyle: 'bg-emerald-500' },
        pending: { label: 'Pending Review', badgeStyle: 'bg-amber-500/10 text-amber-600 border-amber-500/20', dotStyle: 'bg-amber-500 animate-ping' },
        suspended: { label: 'Suspended / Rejected', badgeStyle: 'bg-rose-500/10 text-rose-600 border-rose-500/20', dotStyle: 'bg-rose-500' },
        default: { label: listing.status, badgeStyle: 'bg-slate-500/10 text-slate-600 border-slate-500/20', dotStyle: 'bg-slate-500' }
    };

    const currentStatus = statusConfig[listing.status] || statusConfig.default;

    return (
        <div className="max-w-[1550px] mx-auto space-y-8 pb-24">
            
            {/* Top Navigation & Breadcrumbs */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/admin/listings')}
                    className="text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 rounded-xl px-4 h-10 transition-all"
                >
                    <ChevronLeft size={16} className="mr-1.5" />
                    Back to Inventory List
                </Button>

                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Listing ID:</span>
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">{id}</span>
                </div>
            </div>

            {/* Header Hero Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#002266] rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
                {/* Background Glow Overlay */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="space-y-4 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge className={cn("px-4 py-1.5 rounded-xl border font-black text-[11px] uppercase tracking-widest flex items-center gap-2", currentStatus.badgeStyle)}>
                                <span className={cn("w-2 h-2 rounded-full", currentStatus.dotStyle)} />
                                {currentStatus.label}
                            </Badge>
                            {listing.badges.featuredListing && (
                                <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30 px-3.5 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                                    <Sparkles size={12} className="text-amber-400" />
                                    Featured Asset
                                </Badge>
                            )}
                            {listing.badges.verifiedSeller && (
                                <Badge className="bg-emerald-400/20 text-emerald-300 border-emerald-400/30 px-3.5 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                                    <ShieldCheck size={12} className="text-emerald-400" />
                                    Verified Vendor
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                            {listing.header.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-slate-300 text-xs font-bold uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <Car size={16} className="text-blue-400" />
                                <span>{listing.header.basicSpecs}</span>
                            </div>
                            <div className="flex items-center gap-2 border-l border-slate-700 pl-6">
                                <MapPin size={16} className="text-rose-400" />
                                <span>{listing.header.location}</span>
                            </div>
                            <div className="flex items-center gap-2 border-l border-slate-700 pl-6">
                                <Activity size={16} className="text-emerald-400" />
                                <span>{listing.viewCounts} Total Views</span>
                            </div>
                        </div>
                    </div>

                    {/* Valuation & Action CTA */}
                    <div className="flex flex-col items-start lg:items-end gap-4 shrink-0 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl lg:min-w-[280px]">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Listed Valuation</span>
                            <span className="text-4xl font-black tracking-tight text-white bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                                {listing.header.price}
                            </span>
                        </div>

                        <PermissionGuard permission="listing.status_manage">
                            <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                                <DialogTrigger render={
                                    <Button className="w-full h-13 bg-[#0066CC] hover:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest px-6 shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                                        <FileCheck size={18} />
                                        <span>{listing.status === 'pending' ? 'Review & Approve' : 'Manage Status'}</span>
                                    </Button>
                                } />
                                <DialogContent className="sm:max-w-[540px] border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden bg-white">
                                    <div className="p-8 space-y-6">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#003399] flex items-center justify-center">
                                                    <FileCheck size={20} />
                                                </div>
                                                {listing.status === 'pending' ? 'Listing Audit Decision' : 'Update Asset Status'}
                                            </DialogTitle>
                                            <DialogDescription className="text-slate-500 font-medium text-sm mt-2">
                                                {listing.status === 'pending'
                                                    ? 'Review this submission. Approving publishes the vehicle live on the marketplace. Rejecting returns it to the vendor with commentary.'
                                                    : 'Change the current publication state of this listing asset.'}
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest block">Audit Commentary</label>
                                            <textarea
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                placeholder="Provide decision rationale or detailed instructions for the vendor..."
                                                className="w-full min-h-[140px] rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-[#003399]/10 focus:border-[#003399] focus:bg-white transition-all p-4 text-sm font-medium leading-relaxed resize-none text-slate-900"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            <Button
                                                onClick={() => handleStatusUpdate('available')}
                                                disabled={updateStatusMutation.isPending}
                                                className="h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                                            >
                                                <CheckCircle2 size={18} className="mr-2" />
                                                {listing.status === 'pending' ? 'Approve Listing' : 'Activate Listing'}
                                            </Button>
                                            <Button
                                                onClick={() => handleStatusUpdate('suspended')}
                                                disabled={updateStatusMutation.isPending}
                                                className="h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
                                            >
                                                <XCircle size={18} className="mr-2" />
                                                {listing.status === 'pending' ? 'Reject Submission' : 'Suspend Listing'}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 px-8 py-4 text-center border-t border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">C9X Vehicle Audit Protocol v4.2</p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </PermissionGuard>
                    </div>
                </div>
            </div>

            {/* Main Content Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Media Gallery & Specs (8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Media Studio */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2.5">
                                <ImageIcon size={20} className="text-[#003399]" />
                                Digital Media Gallery
                            </CardTitle>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-xl">
                                {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
                            </span>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            {/* Primary High-Res Viewer */}
                            <div 
                                className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 shadow-2xl group cursor-pointer border border-slate-800"
                                onClick={() => images.length > 0 && setPreviewImage({ url: getImageUrl(images[activeImage]?.url), title: `${listing.header.title} - Image ${activeImage + 1}` })}
                            >
                                {images.length > 0 ? (
                                    <>
                                        <img
                                            src={getImageUrl(images[activeImage]?.url)}
                                            alt={listing.header.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 border border-white/30 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-2xl">
                                                <Maximize2 size={18} />
                                                <span>Expand Fullscreen</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-4">
                                        <ImageIcon size={64} />
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">No vehicle images uploaded</span>
                                    </div>
                                )}

                                {/* Image Badges */}
                                {images[activeImage]?.isPrimary && (
                                    <div className="absolute top-5 left-5 z-10">
                                        <Badge className="bg-[#003399] text-white border-0 py-1.5 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                                            Primary Cover Photo
                                        </Badge>
                                    </div>
                                )}

                                <div className="absolute bottom-5 left-5 z-10">
                                    <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-widest">
                                        {activeImage + 1} / {images.length}
                                    </span>
                                </div>
                            </div>

                            {/* Thumbnail Navigation Strip */}
                            {images.length > 0 && (
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between px-1">
                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Photo Strip</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => scrollThumbnails('left')}
                                                className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-[#003399] hover:text-white text-slate-600 flex items-center justify-center transition-all shadow-sm"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                            <button
                                                onClick={() => scrollThumbnails('right')}
                                                className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-[#003399] hover:text-white text-slate-600 flex items-center justify-center transition-all shadow-sm"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        ref={thumbnailScrollRef}
                                        className="flex gap-4 overflow-x-auto pb-3 pt-1 px-1 scroll-smooth"
                                        style={{ scrollbarWidth: 'thin' }}
                                    >
                                        {images.map((img, idx) => (
                                            <button
                                                key={img.id}
                                                onClick={() => setActiveImage(idx)}
                                                className={cn(
                                                    "relative shrink-0 rounded-2xl overflow-hidden transition-all duration-300 group",
                                                    activeImage === idx
                                                        ? "h-24 w-36 ring-4 ring-[#003399] ring-offset-2 shadow-xl scale-100 opacity-100"
                                                        : "h-24 w-36 opacity-60 hover:opacity-100 hover:scale-[1.03] border border-slate-200"
                                                )}
                                            >
                                                <img
                                                    src={getImageUrl(img.url)}
                                                    className="w-full h-full object-cover"
                                                    alt={`Thumbnail ${idx + 1}`}
                                                />
                                                <div className={cn(
                                                    "absolute bottom-1.5 left-1.5 text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider",
                                                    activeImage === idx ? "bg-[#003399] text-white" : "bg-black/60 text-white"
                                                )}>
                                                    #{idx + 1}
                                                </div>
                                                {img.isPrimary && (
                                                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#003399] text-white flex items-center justify-center shadow-md border border-white">
                                                        <Check size={10} strokeWidth={4} />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Vehicle Identification & Technical Specs */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2.5">
                                <Gauge size={20} className="text-[#003399]" />
                                Technical Specifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Make', value: listing.vehicleInformation.make, icon: Car },
                                    { label: 'Model', value: listing.vehicleInformation.model, icon: Tag },
                                    { label: 'Year', value: listing.vehicleInformation.year, icon: Calendar },
                                    { label: 'Condition', value: listing.vehicleInformation.condition, icon: ShieldCheck },
                                    { label: 'Transmission', value: listing.vehicleInformation.transmission, icon: Settings },
                                    { label: 'Fuel Type', value: listing.vehicleInformation.fuelType, icon: Fuel },
                                    { label: 'Engine', value: listing.vehicleInformation.engineType, icon: Activity },
                                    { label: 'Drive Type', value: listing.vehicleInformation.driveType || 'Standard', icon: Compass },
                                    { label: 'Exterior Color', value: listing.vehicleInformation.exteriorColor, icon: Tag },
                                    { label: 'Interior Color', value: listing.vehicleInformation.interiorColor, icon: Tag },
                                    { label: 'Body Style', value: listing.vehicleInformation.bodyType, icon: Car },
                                    { label: 'Registration', value: listing.vehicleInformation.registrationStatus, icon: FileCheck },
                                    { label: 'VIN/Chassis', value: listing.vehicleInformation.vinChassisNumber || 'Not Provided', icon: ShieldCheck },
                                    { label: 'Price Negotiable', value: listing.vehicleInformation.negotiable, icon: User },
                                    { label: 'Inspection', value: listing.vehicleInformation.inspectionAccepted ? 'Accepted' : 'Declined', icon: FileCheck },
                                    { label: 'Location Address', value: listing.vehicleInformation.location.fullAddress, icon: MapPin },
                                ].map((spec, i) => (
                                    <div 
                                        key={i} 
                                        className={cn(
                                            "rounded-2xl p-4 border transition-all duration-200 space-y-1.5",
                                            spec.label === 'VIN/Chassis'
                                                ? "col-span-2 bg-blue-50/60 border-blue-200/80 hover:bg-blue-50 hover:shadow-lg"
                                                : "bg-slate-50/80 border-slate-100/80 hover:bg-white hover:shadow-lg hover:border-slate-200"
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{spec.label}</span>
                                            {spec.label === 'VIN/Chassis' && listing.vehicleInformation.vinChassisNumber && (
                                                <Button
                                                    size="sm"
                                                    onClick={handleVerifyVin}
                                                    disabled={verifyVinMutation.isPending}
                                                    className="h-7 px-3 text-[10px] font-black uppercase tracking-widest bg-[#003399] hover:bg-blue-800 text-white rounded-xl shadow-md shadow-blue-900/10 active:scale-95 transition-all shrink-0"
                                                >
                                                    <ShieldCheck size={13} className="mr-1.5" />
                                                    {verifyVinMutation.isPending ? 'Verifying...' : 'Verify VIN'}
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <spec.icon size={15} className="text-[#003399] shrink-0" />
                                            <span className={cn(
                                                "text-sm font-bold truncate",
                                                spec.label === 'VIN/Chassis' 
                                                    ? "font-mono font-black text-xs tracking-wider text-[#003399]"
                                                    : "text-slate-900"
                                            )}>
                                                {spec.value}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Seller Description */}
                            <div className="pt-6 border-t border-slate-100 space-y-3">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Vendor Description</span>
                                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 relative">
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                                        "{listing.description}"
                                    </p>
                                </div>
                            </div>

                            {/* Features Cloud */}
                            {listing.carFeatures && listing.carFeatures.length > 0 && (
                                <div className="pt-6 border-t border-slate-100 space-y-3">
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Equipped Features</span>
                                    <div className="flex flex-wrap gap-2.5">
                                        {listing.carFeatures.map((feature, i) => (
                                            <Badge key={i} variant="outline" className="h-9 px-4 rounded-xl border-slate-200 bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 shadow-sm">
                                                <Check size={14} className="text-emerald-500 stroke-[3]" />
                                                {feature}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Vendor Profile & Audit Intelligence (4 cols) */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Compliance & Quality Metrics */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                        <CardHeader className="px-8 py-6 border-b border-slate-100">
                            <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2.5">
                                <ShieldCheck size={20} className="text-[#003399]" />
                                Compliance & Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs font-bold text-slate-600">Vendor KYC Verification</span>
                                    {listing.complianceReview.kycVerified ? (
                                        <Badge className="bg-emerald-500 text-white border-0 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg">Verified</Badge>
                                    ) : (
                                        <Badge className="bg-rose-500 text-white border-0 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg">Unverified</Badge>
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs font-bold text-slate-600">VIN Registry Status</span>
                                    {listing.complianceReview.vinProvided ? (
                                        <Badge className="bg-emerald-500 text-white border-0 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg">Provided</Badge>
                                    ) : (
                                        <Badge className="bg-amber-500 text-white border-0 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg">Missing</Badge>
                                    )}
                                </div>

                                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#003399] to-[#002266] text-white shadow-xl space-y-2">
                                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest block">Digital Quality Score</span>
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-3xl font-black tracking-tight">{listing.contentQuality.descriptionProfessionalism}</span>
                                        <span className="text-xs font-bold text-blue-200 uppercase">Professional Standard</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Image Count</span>
                                        <span className="text-2xl font-black text-slate-900">{listing.contentQuality.imageCount}</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Flagged Status</span>
                                        <span className={cn("text-lg font-black uppercase tracking-wider", listing.contentQuality.isFlagged ? "text-rose-600" : "text-emerald-600")}>
                                            {listing.contentQuality.isFlagged ? 'Flagged' : 'Clean'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vendor Intelligence */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                        <CardHeader className="px-8 py-6 border-b border-slate-100">
                            <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2.5">
                                <User size={20} className="text-[#003399]" />
                                Vendor Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                                <Avatar className="h-16 w-16 rounded-2xl border-2 border-slate-100 shadow-md">
                                    <AvatarFallback className="bg-[#003399] text-white font-black text-xl uppercase">
                                        {listing.sellerInformation.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-black text-slate-900">{listing.sellerInformation.name}</h3>
                                        {listing.sellerInformation.verified && (
                                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-slate-100 text-slate-700 border-0 rounded-lg text-[9px] uppercase font-bold px-2 py-0.5">
                                            {listing.sellerInformation.sellerType}
                                        </Badge>
                                        <span className="text-xs font-bold text-slate-400">Since {listing.sellerInformation.memberSince}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: 'Primary Contact Phone', value: listing.sellerInformation.phone, icon: Phone },
                                    { label: 'Verified Email Identity', value: listing.sellerInformation.email, icon: Mail },
                                    { label: 'Origin Location', value: listing.sellerInformation.location, icon: MapPin },
                                    { label: 'Phone Status', value: listing.sellerInformation.phoneStatus, icon: ShieldCheck },
                                    { label: 'Total Inventory Listings', value: `${listing.sellerInformation.totalActiveListings} Active`, icon: ImageIcon },
                                ].map((info, i) => (
                                    <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                                        <div className="flex items-center gap-2.5">
                                            <info.icon size={15} className="text-[#003399] shrink-0" />
                                            <span className="text-xs font-bold text-slate-500">{info.label}</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-900 truncate max-w-[140px]">{info.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline Audit Cards */}
                    <div className="space-y-3">
                        {[
                            { label: 'Submission Gateway', value: listing.header.submittedDate, icon: Calendar },
                            { label: 'Publication Gateway', value: listing.header.publishedDate, icon: CheckCircle2 },
                            { label: 'Last Registry Sync', value: listing.header.lastUpdated, icon: Clock },
                        ].map((item, i) => (
                            <div key={i} className="rounded-2xl bg-white border border-slate-100 p-5 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003399] flex items-center justify-center">
                                        <item.icon size={18} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{item.label}</span>
                                        <span className="text-xs font-bold text-slate-900">{item.value}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* VIN Verification Results Modal */}
            <Dialog open={isVinModalOpen} onOpenChange={setIsVinModalOpen}>
                <DialogContent className="sm:max-w-[620px] border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden bg-white">
                    <div className="p-8 space-y-6">
                        <DialogHeader>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                                <ShieldCheck size={28} />
                            </div>
                            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Official VIN Verification</DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium text-sm">
                                Decoded technical report for VIN: <span className="text-slate-900 font-bold font-mono bg-slate-100 px-2 py-0.5 rounded-md">{listing.vehicleInformation.vinChassisNumber}</span>
                            </DialogDescription>
                        </DialogHeader>

                        {vinData && (
                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                                {[
                                    { label: 'Model Year', value: vinData.year },
                                    { label: 'Manufacturer Make', value: vinData.make },
                                    { label: 'Vehicle Model', value: vinData.model },
                                    { label: 'Body Classification', value: vinData.body_class },
                                    { label: 'Engine Fuel Type', value: vinData.fuel_type },
                                    { label: 'Official Manufacturer', value: vinData.manufacturer },
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{item.label}</span>
                                        <span className="text-sm font-black text-slate-900">{item.value || 'N/A'}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button
                                onClick={() => setIsVinModalOpen(false)}
                                className="h-12 bg-slate-900 hover:bg-black text-white rounded-2xl px-8 font-black text-xs uppercase tracking-widest shadow-xl"
                            >
                                Close Inspection Report
                            </Button>
                        </div>
                    </div>
                    <div className="bg-[#003399] p-4 text-center">
                        <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">C9X Central Registry • VIN Decoded Successfully</p>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Lightbox Modal */}
            {previewImage && (
                <ImagePreviewDialog
                    isOpen={!!previewImage}
                    onClose={() => setPreviewImage(null)}
                    imageUrl={previewImage.url}
                    title={previewImage.title}
                />
            )}
        </div>
    );
}
