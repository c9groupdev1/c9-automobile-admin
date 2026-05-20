'use client';

import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    ShieldCheck,
    Clock,
    Star,
    AlertTriangle,
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
    FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { useListing, useListingImages, useUpdateListingStatus, useVerifyVin } from '@/hooks/useListings';
import { format, parseISO } from 'date-fns';
import { useState, useRef, use } from 'react';
import { toast } from 'sonner';
import { PermissionGuard } from '@/components/auth/permission-guard';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
    // Fetch all images separately in case the show endpoint paginates/limits media
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
        thumbnailScrollRef.current?.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
    };

    // Merge images: prefer allImages if it has more entries (handles server-side pagination)
    const images: Array<{ id: string; url: string; isPrimary: boolean }> = (() => {
        const base = listing?.mediaReview?.images ?? [];
        if (!allImages || allImages.length === 0) return base;
        return allImages.length >= base.length ? allImages : base;
    })();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003399]"></div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest text-[#003399]">Synchronizing Listing Intelligence...</p>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Listing Not Found</h3>
                <p className="text-slate-500 max-w-xs text-center">The requested listing {id} could not be retrieved from the central repository.</p>
                <Button onClick={() => router.back()} variant="outline" className="mt-4 rounded-xl border-slate-200">
                    <ChevronLeft size={16} className="mr-2" />
                    Back to Inventory
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
            toast.success(`Listing status updated to ${status}`);
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
                toast.success('VIN decoded successfully');
            } else {
                toast.error(result.message || 'VIN verification failed');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to connect to VIN Registry');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header: Centered Identity */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div className="space-y-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/admin/listings')}
                        className="p-0 h-auto font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em] text-[10px]"
                    >
                        <ChevronLeft size={14} className="mr-1" />
                        Back to Inventory Management
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-black tracking-tight text-slate-900">{listing.header.title}</h2>
                            <Badge className={cn(
                                "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-0 pointer-events-none",
                                listing.status === 'available' ? 'bg-emerald-50 text-emerald-600' :
                                    listing.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                                        listing.status === 'suspended' ? 'bg-rose-50 text-rose-600' :
                                            'bg-slate-50 text-slate-600'
                            )}>
                                {listing.status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                            <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest">
                                <Car size={14} />
                                {listing.header.basicSpecs}
                            </div>
                            <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest border-l border-slate-200 pl-4">
                                <MapPin size={14} />
                                {listing.header.location}
                            </div>
                            <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest border-l border-slate-200 pl-4">
                                <Activity size={14} />
                                {listing.viewCounts} Total Views
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-2 md:mt-0">
                    <div className="flex flex-col md:hidden w-full mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Valuation</span>
                        <span className="text-2xl font-black text-[#003399] tracking-tight">{listing.header.price}</span>
                    </div>
                    <div className="text-right mr-4 hidden md:block">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Valuation</span>
                        <span className="text-3xl font-black text-[#003399] tracking-tight">{listing.header.price}</span>
                    </div>
                    {/* {(listing.status === 'pending' || listing.status === 'suspended') && ( */}
                    <PermissionGuard permission="listing.status_manage">
                        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                            <DialogTrigger render={
                                <Button className="h-11 md:h-12 bg-[#003399] hover:bg-[#002266] rounded-2xl font-black text-xs uppercase tracking-widest px-8 shadow-lg shadow-blue-900/10">
                                    <FileCheck size={16} className="mr-2" />
                                    {listing.status === 'pending' ? 'Review Vehicle Listing' : 'Manage Listing Status'}
                                </Button>
                            } />
                            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                                <div className="p-8 space-y-6">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                                            {listing.status === 'pending' ? 'Review Decision' : 'Status Management'}
                                        </DialogTitle>
                                        <DialogDescription className="text-slate-500 font-medium">
                                            {listing.status === 'pending'
                                                ? 'Provide a final decision for this vehicle submission. Rejection requires a descriptive comment for the vendor.'
                                                : 'Update the current status of this suspended asset. You can reactivate it or update the suspension notes.'}
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-[#003399] uppercase tracking-widest">Decision Commentary</label>
                                        <textarea
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            placeholder="Enter review notes or detailed rejection reason..."
                                            className="w-full min-h-[140px] rounded-[1.5rem] bg-slate-50 border-slate-100 focus:ring-4 focus:ring-[#003399]/5 focus:bg-white border focus:border-[#003399]/20 transition-all p-5 text-sm font-medium leading-relaxed resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <Button
                                            onClick={() => handleStatusUpdate('available')}
                                            disabled={updateStatusMutation.isPending}
                                            className="h-14 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/10 transition-all active:scale-[0.98]"
                                        >
                                            <CheckCircle2 size={18} className="mr-2" />
                                            {listing.status === 'pending' ? 'Approve Asset' : 'Re-activate Asset'}
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate('suspended')}
                                            disabled={updateStatusMutation.isPending}
                                            className="h-14 bg-rose-500 hover:bg-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-900/10 transition-all active:scale-[0.98]"
                                        >
                                            <XCircle size={18} className="mr-2" />
                                            {listing.status === 'pending' ? 'Reject Asset' : 'Suspend Asset'}
                                        </Button>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Digital Registry Protocol • C9X Admin v4.2</p>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </PermissionGuard>
                    {/* // )} */}
                </div>
            </div>

            <div className="space-y-8">

                {/* Section 1: Interior & Exterior Digital Artifacts */}
                <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="px-10 pt-10 pb-6 border-b border-slate-50">
                        <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Digital Media Review</CardTitle>
                    </CardHeader>
                    <CardContent className="px-10 py-10">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                            <div className="md:col-span-8 space-y-4">
                                <div 
                                    className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner group cursor-pointer"
                                    onClick={() => images.length > 0 && setPreviewImage({ url: getImageUrl(images[activeImage]?.url), title: `${listing.header.title} - Image ${activeImage + 1}` })}
                                >
                                    {images.length > 0 ? (
                                        <>
                                            <img
                                                src={getImageUrl(images[activeImage]?.url)}
                                                alt={listing.header.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white ring-1 ring-white/30 transform scale-90 group-hover:scale-100 transition-all duration-300">
                                                    <Eye size={24} />
                                                </div>
                                                <span className="text-white text-xs font-black uppercase tracking-widest bg-slate-900/60 py-2 px-4 rounded-xl backdrop-blur-sm">Click to Fully Preview</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                                            <ImageIcon size={64} />
                                            <span className="text-sm font-bold uppercase tracking-[0.2em]">No official images available</span>
                                        </div>
                                    )}
                                    {images[activeImage]?.isPrimary && (
                                        <div className="absolute top-6 left-6">
                                            <Badge className="bg-[#003399] text-white border-0 py-1.5 px-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20">
                                                Primary Display Image
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {/* Image count + scroll hint */}
                                    <div className="flex items-center justify-between px-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {images.length} {images.length === 1 ? 'Image' : 'Images'}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => scrollThumbnails('left')}
                                                className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-[#003399] hover:text-white text-slate-500 flex items-center justify-center transition-all"
                                            >
                                                <ChevronLeft size={14} />
                                            </button>
                                            <button
                                                onClick={() => scrollThumbnails('right')}
                                                className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-[#003399] hover:text-white text-slate-500 flex items-center justify-center transition-all"
                                            >
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Scrollable strip with fade masks */}
                                    <div className="relative">
                                        {/* Left fade */}
                                        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />
                                        {/* Right fade */}
                                        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10" />

                                        <div
                                            ref={thumbnailScrollRef}
                                            className="flex gap-3 overflow-x-auto pb-2 px-1 scroll-smooth"
                                            style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}
                                        >
                                            {images.map((img, idx) => (
                                                <button
                                                    key={img.id}
                                                    onClick={() => setActiveImage(idx)}
                                                    className={cn(
                                                        "relative shrink-0 rounded-2xl overflow-hidden transition-all duration-200 group",
                                                        activeImage === idx
                                                            ? "h-24 w-36 ring-[3px] ring-[#003399] ring-offset-2 shadow-lg shadow-blue-900/20 opacity-100"
                                                            : "h-24 w-36 ring-1 ring-slate-200 opacity-50 hover:opacity-90 hover:ring-slate-400 hover:scale-[1.03]"
                                                    )}
                                                >
                                                    <img
                                                        src={getImageUrl(img.url)}
                                                        className="w-full h-full object-cover"
                                                        alt={`Image ${idx + 1}`}
                                                    />
                                                    {/* Index badge */}
                                                    <div className={cn(
                                                        "absolute bottom-1.5 left-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider",
                                                        activeImage === idx
                                                            ? "bg-[#003399] text-white"
                                                            : "bg-black/40 text-white/80"
                                                    )}>
                                                        {idx + 1}
                                                    </div>
                                                    {/* Primary badge */}
                                                    {img.isPrimary && (
                                                        <div className="absolute top-1.5 right-1.5">
                                                            <div className="w-4 h-4 rounded-full bg-[#003399] text-white flex items-center justify-center ring-2 ring-white shadow">
                                                                <Check size={8} strokeWidth={4} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-4 flex flex-col justify-center gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <ShieldCheck size={16} />
                                            Compliance & Trust
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">KYC Status</span>
                                                {listing.complianceReview.kycVerified ? (
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-0 rounded-lg">Verified</Badge>
                                                ) : (
                                                    <Badge className="bg-rose-50 text-rose-600 border-0 rounded-lg">Unverified</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">VIN Compliance</span>
                                                {listing.complianceReview.vinProvided ? (
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-0 rounded-lg">Success</Badge>
                                                ) : (
                                                    <Badge className="bg-rose-50 text-rose-600 border-0 rounded-lg">Missing</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <ImageIcon size={16} />
                                            Content Quality
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#003399] text-white shadow-xl shadow-blue-900/10 border-0">
                                                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Digital Health</span>
                                                <span className="text-sm font-black">{listing.contentQuality.descriptionProfessionalism} Score</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Images</span>
                                                    <span className="text-xl font-bold text-slate-900">{listing.contentQuality.imageCount}</span>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Flagged</span>
                                                    <span className={cn("text-xl font-bold", listing.contentQuality.isFlagged ? "text-rose-500" : "text-emerald-500")}>
                                                        {listing.contentQuality.isFlagged ? 'Yes' : 'No'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Section 2: Vehicle Specification Intelligence */}
                <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="px-10 pt-10 pb-6 border-b border-slate-50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Vehicle Identification</CardTitle>
                            <div className="flex gap-2">
                                {listing.badges.verifiedSeller && (
                                    <Badge className="bg-emerald-50 text-emerald-600 border-0 rounded-lg font-bold text-[9px] uppercase tracking-widest">Verified Seller</Badge>
                                )}
                                {listing.badges.featuredListing && (
                                    <Badge className="bg-[#003399]/10 text-[#003399] border-0 rounded-lg font-bold text-[9px] uppercase tracking-widest">Featured</Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-10 py-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: 'Make', value: listing.vehicleInformation.make, icon: Car },
                                { label: 'Model', value: listing.vehicleInformation.model, icon: Tag },
                                { label: 'Year', value: listing.vehicleInformation.year, icon: Calendar },
                                { label: 'Condition', value: listing.vehicleInformation.condition, icon: ShieldCheck },
                                { label: 'Transmission', value: listing.vehicleInformation.transmission, icon: Settings },
                                { label: 'Fuel Type', value: listing.vehicleInformation.fuelType, icon: Activity },
                                { label: 'Engine', value: listing.vehicleInformation.engineType, icon: Settings },
                                { label: 'Drive Type', value: listing.vehicleInformation.driveType || 'N/A', icon: Activity },
                                { label: 'Exterior Color', value: listing.vehicleInformation.exteriorColor, icon: Tag },
                                { label: 'Interior Color', value: listing.vehicleInformation.interiorColor, icon: Tag },
                                { label: 'Body Type', value: listing.vehicleInformation.bodyType, icon: Car },
                                { label: 'Registration', value: listing.vehicleInformation.registrationStatus, icon: FileCheck },
                                { label: 'VIN/Chassis', value: listing.vehicleInformation.vinChassisNumber || 'No VIN provided', icon: ShieldCheck },
                                { label: 'Negotiable', value: listing.vehicleInformation.negotiable, icon: User },
                                { label: 'Inspection', value: listing.vehicleInformation.inspectionAccepted ? 'Accepted' : 'Declined', icon: FileCheck },
                                { label: 'Address', value: listing.vehicleInformation.location.fullAddress, icon: MapPin },
                            ].map((spec, i) => (
                                <div key={i} className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{spec.label}</span>
                                    <div className="flex items-center gap-2">
                                        <spec.icon size={14} className="text-slate-300" />
                                        <span className="text-sm font-bold text-slate-900">{spec.value}</span>
                                        {spec.label === 'VIN/Chassis' && listing.vehicleInformation.vinChassisNumber && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleVerifyVin}
                                                disabled={verifyVinMutation.isPending}
                                                className="h-6 px-2 text-[9px] font-black uppercase tracking-widest bg-blue-50 text-[#003399] hover:bg-blue-100 rounded-lg ml-2"
                                            >
                                                {verifyVinMutation.isPending ? 'Checking...' : 'Verify'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-10 border-t border-slate-50 space-y-6">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Seller Description</span>
                                <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-4xl italic">"{listing.description}"</p>
                            </div>

                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Premium Features</span>
                                <div className="flex flex-wrap gap-2">
                                    {listing.carFeatures.map((feature, i) => (
                                        <Badge key={i} variant="outline" className="h-8 px-4 rounded-xl border-slate-100 bg-slate-50 text-slate-600 font-bold text-[10px] flex items-center gap-1.5 pointer-events-none">
                                            <Check size={12} className="text-[#003399]" />
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>



                {/* Section 3: Verified Seller Intelligence */}
                <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="px-10 pt-10 pb-6 border-b border-slate-50">
                        <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Seller Verification</CardTitle>
                    </CardHeader>
                    <CardContent className="px-10 py-10">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="flex items-center gap-6 md:border-r border-slate-50 md:pr-12">
                                <Avatar className="h-24 w-24 rounded-[2rem] border border-slate-100 shadow-md">
                                    <AvatarFallback className="bg-blue-50 text-[#003399] font-black text-2xl uppercase">{listing.sellerInformation.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-2xl font-black text-slate-900">{listing.sellerInformation.name}</h3>
                                        {listing.sellerInformation.verified && (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                                <CheckCircle2 size={12} fill="currentColor" className="text-emerald-500" strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-slate-100 text-slate-600 border-0 rounded-lg text-[10px] uppercase font-bold">{listing.sellerInformation.sellerType}</Badge>
                                        <span className="text-xs font-bold text-slate-400">Member Since {listing.sellerInformation.memberSince}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { label: 'Primary Contact', value: listing.sellerInformation.phone, icon: Phone },
                                    { label: 'Email Identity', value: listing.sellerInformation.email, icon: Mail },
                                    { label: 'Origin Location', value: listing.sellerInformation.location, icon: MapPin },
                                    { label: 'Registry Status', value: listing.sellerInformation.phoneStatus, icon: ShieldCheck },
                                    { label: 'Active Listings', value: listing.sellerInformation.totalActiveListings, icon: ImageIcon },
                                ].map((info, i) => (
                                    <div key={i} className="space-y-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{info.label}</span>
                                        <div className="flex items-center gap-2">
                                            <info.icon size={14} className="text-slate-300" />
                                            <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{info.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 4: Audit Timeline Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Submission Gateway', value: listing.header.submittedDate, icon: Calendar },
                        { label: 'Publication Gateway', value: listing.header.publishedDate, icon: CheckCircle2 },
                        { label: 'Last Registry Sync', value: listing.header.lastUpdated, icon: Clock },
                    ].map((item, i) => (
                        <div key={i} className="rounded-2xl bg-white border border-slate-100 p-6 flex flex-col gap-1 items-center text-center">
                            <item.icon size={18} className="text-[#003399] mb-2" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                            <span className="text-xs font-bold text-slate-900">{item.value}</span>
                        </div>
                    ))}
                </div>

                {/* VIN Verification Results Modal */}
                <Dialog open={isVinModalOpen} onOpenChange={setIsVinModalOpen}>
                    <DialogContent className="sm:max-w-[600px] border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                        <div className="p-8 space-y-6">
                            <DialogHeader>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                                    <ShieldCheck size={24} />
                                </div>
                                <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Verification Results</DialogTitle>
                                <DialogDescription className="text-slate-500 font-medium">
                                    Official technical decoding for VIN: <span className="text-slate-900 font-bold font-mono">{listing.vehicleInformation.vinChassisNumber}</span>
                                </DialogDescription>
                            </DialogHeader>

                            {vinData && (
                                <div className="grid grid-cols-2 gap-x-8 gap-y-5 py-4 border-y border-slate-50">
                                    {[
                                        { label: 'Year', value: vinData.year },
                                        { label: 'Make', value: vinData.make },
                                        { label: 'Model', value: vinData.model },
                                        { label: 'Body Class', value: vinData.body_class },
                                        { label: 'Fuel Type', value: vinData.fuel_type },
                                        { label: 'Manufacturer', value: vinData.manufacturer },
                                    ].map((item, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{item.label}</span>
                                            <span className="text-sm font-bold text-slate-900">{item.value || 'N/A'}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button
                                    onClick={() => setIsVinModalOpen(false)}
                                    className="h-12 bg-slate-900 hover:bg-black text-white rounded-2xl px-8 font-black text-xs uppercase tracking-widest"
                                >
                                    Close Record
                                </Button>
                            </div>
                        </div>
                        <div className="bg-[#003399] p-4 text-center">
                            <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Digital Registry Protocol • Authentication Success</p>
                        </div>
                    </DialogContent>
                </Dialog>
                {previewImage && (
                    <ImagePreviewDialog
                        isOpen={!!previewImage}
                        onClose={() => setPreviewImage(null)}
                        imageUrl={previewImage.url}
                        title={previewImage.title}
                    />
                )}
            </div>
        </div>
    );
}
