'use client';

import { 
    ChevronLeft, 
    MoreVertical, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    ShieldCheck, 
    Star, 
    AlertTriangle,
    Car,
    MapPin,
    Calendar,
    Settings,
    User,
    Mail,
    Phone,
    Copy,
    ExternalLink,
    ArrowLeft,
    Share2,
    Eye,
    Tag,
    History,
    FileText,
    Activity,
    AlertCircle,
    Check,
    ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { useListing } from '@/hooks/useListings';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';

export default function ListingDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: listing, isLoading } = useListing(id as string);
    const [activeImage, setActiveImage] = useState(0);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003399]"></div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Hydrating listing details...</p>
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
                <p className="text-slate-500 max-w-xs text-center">The listing ID {id} could not be found or you do not have permission to view it.</p>
                <Button onClick={() => router.back()} variant="outline" className="mt-4 rounded-xl">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Inventory
                </Button>
            </div>
        );
    }

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return 'N/A';
        try {
            return format(parseISO(dateStr), 'MMM dd, yyyy • HH:mm');
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Navigation & Actions Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-xl bg-white border border-slate-100 shadow-sm"
                        onClick={() => router.push('/listings')}
                    >
                        <ChevronLeft size={20} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Listing ID: {listing.id.split('-')[0].toUpperCase()}</span>
                            <Badge className={cn(
                                "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-0 pointer-events-none inline-flex items-center gap-1.5",
                                listing.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 
                                listing.status === 'pending' ? 'bg-orange-50 text-orange-600' : 
                                listing.status === 'draft' ? 'bg-slate-100 text-slate-500' : 'bg-rose-50 text-rose-600'
                            )}>
                                <div className={cn("w-1.5 h-1.5 rounded-full", 
                                    listing.status === 'available' ? 'bg-emerald-600' : 
                                    listing.status === 'pending' ? 'bg-orange-600' : 'bg-slate-400'
                                )}></div>
                                {listing.status}
                            </Badge>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{listing.title}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl px-4 h-11 font-bold text-xs border-slate-200">
                        <Share2 size={16} className="mr-2" />
                        Share
                    </Button>
                    <Button variant="outline" className="rounded-xl px-4 h-11 font-bold text-xs border-slate-200">
                        <MoreVertical size={16} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Areas */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Visual Command Center (Image Gallery) */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner group">
                                {listing.mediaReview.images.length > 0 ? (
                                    <img 
                                        src={listing.mediaReview.images[activeImage]?.url} 
                                        alt={listing.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                                        <Car size={64} />
                                        <span className="text-sm font-bold uppercase tracking-[0.2em]">No official images available</span>
                                    </div>
                                )}
                                
                                <div className="absolute top-6 left-6 flex flex-col gap-2">
                                    {listing.badges.featuredListing && (
                                        <Badge className="bg-rose-500 text-white border-0 py-1.5 px-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-900/20 flex items-center gap-1.5">
                                            <Star size={12} fill="currentColor" />
                                            Featured
                                        </Badge>
                                    )}
                                    {listing.vehicleInformation.condition === 'Brand New' && (
                                        <Badge className="bg-[#003399] text-white border-0 py-1.5 px-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-900/20">
                                            Brand New
                                        </Badge>
                                    )}
                                </div>

                                <div className="absolute bottom-6 right-6">
                                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-[1.5rem] shadow-2xl flex items-center gap-4 border border-white/20">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Price</span>
                                            <span className="text-xl font-black text-[#003399]">
                                                {listing.header.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {listing.mediaReview.images.length > 1 && (
                                <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-none">
                                    {listing.mediaReview.images.map((img, idx) => (
                                        <button 
                                            key={img.id}
                                            onClick={() => setActiveImage(idx)}
                                            className={cn(
                                                "h-20 w-28 rounded-2xl overflow-hidden shrink-0 border-2 transition-all relative group",
                                                activeImage === idx ? "border-[#003399] shadow-lg shadow-blue-900/10 scale-95" : "border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-300"
                                            )}
                                        >
                                            <img src={img.url} className="w-full h-full object-cover" />
                                            {activeImage === idx && (
                                                <div className="absolute inset-0 bg-blue-900/10 flex items-center justify-center">
                                                    <div className="w-6 h-6 rounded-full bg-[#003399] text-white flex items-center justify-center">
                                                        <Check size={12} strokeWidth={3} />
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Specification Intelligence */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="px-10 pt-10 pb-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-black text-slate-900">Vehicle Intelligence</CardTitle>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                                    <Settings size={20} className="text-slate-400" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                                {[
                                    { label: 'Make', value: listing.vehicleInformation.make, icon: Car },
                                    { label: 'Model', value: listing.vehicleInformation.model, icon: Tag },
                                    { label: 'Year', value: listing.vehicleInformation.year, icon: Calendar },
                                    { label: 'Body Type', value: listing.vehicleInformation.bodyType, icon: Car },
                                    { label: 'Fuel Type', value: listing.vehicleInformation.fuelType, icon: Activity },
                                    { label: 'Transmission', value: listing.vehicleInformation.transmission, icon: Settings },
                                    { label: 'Drive', value: listing.vehicleInformation.driveType || 'N/A', icon: Activity },
                                    { label: 'Condition', value: listing.vehicleInformation.condition, icon: ShieldCheck },
                                    { label: 'Colors', value: `${listing.vehicleInformation.exteriorColor} / ${listing.vehicleInformation.interiorColor}`, icon: ShieldCheck },
                                    { label: 'Negotiable', value: listing.vehicleInformation.negotiable, icon: User },
                                    { label: 'Variant', value: listing.vehicleInformation.trimVariant || 'None', icon: Activity },
                                    { label: 'Engine', value: listing.vehicleInformation.engineType || 'N/A', icon: Settings },
                                ].map((spec, i) => (
                                    <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-100 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{spec.label}</span>
                                            <spec.icon size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-800 leading-none">{spec.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-10 border-t border-slate-50">
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Detailed Description</h4>
                                <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap">
                                    {listing.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features Hub */}
                    {listing.carFeatures.length > 0 && (
                        <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                            <CardHeader className="px-10 pt-10 pb-6">
                                <CardTitle className="text-xl font-black text-slate-900">Premium Features</CardTitle>
                            </CardHeader>
                            <CardContent className="px-10 pb-10">
                                <div className="flex flex-wrap gap-3">
                                    {listing.carFeatures.map((feature, i) => (
                                        <Badge key={i} variant="outline" className="h-10 px-5 rounded-2xl border-slate-100 bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-2 group hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-600 transition-all">
                                            <CheckCircle2 size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar Configuration */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Operations Command Center */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white sticky top-8">
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-slate-900 mb-6">Moderator Actions</h3>
                                <Button className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-lg shadow-emerald-900/10">
                                    <CheckCircle2 size={18} className="mr-2" />
                                    Approve Listing
                                </Button>
                                <Button className="w-full h-12 bg-rose-500 hover:bg-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-lg shadow-rose-900/10">
                                    <XCircle size={18} className="mr-2" />
                                    Reject Listing
                                </Button>
                                <Button className="w-full h-12 bg-amber-500 hover:bg-amber-600 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-lg shadow-amber-900/10">
                                    <Clock size={18} className="mr-2" />
                                    Request Changes
                                </Button>
                            </div>

                            <div className="pt-6 border-t border-slate-50">
                                <div className="flex flex-col gap-4">
                                    <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-100 font-bold text-slate-600 hover:bg-slate-50">
                                        <History size={18} className="mr-2 text-slate-400" />
                                        Audit History
                                    </Button>
                                    <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-100 font-bold text-slate-600 hover:bg-slate-50">
                                        <ShieldCheck size={18} className="mr-2 text-slate-400" />
                                        Compliance Check
                                    </Button>
                                    <Button variant="ghost" className="w-full h-12 rounded-2xl text-rose-500 hover:bg-rose-50 font-black text-xs uppercase tracking-widest">
                                        <AlertTriangle size={18} className="mr-2" />
                                        Suspend Account
                                    </Button>
                                </div>
                            </div>

                            {/* Stats Summary */}
                            <div className="pt-6 border-t border-slate-50 grid grid-cols-1 gap-4">
                                <div className="p-4 rounded-2xl bg-slate-50 text-center">
                                    <Eye size={18} className="mx-auto text-slate-400 mb-2" />
                                    <span className="text-lg font-black text-slate-900 block">{listing.viewCounts?.toLocaleString() || '0'}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Views</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Seller Interaction Card */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="p-8 pb-0">
                            <CardTitle className="text-lg font-black text-slate-900">Seller Validation</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <Avatar className="h-14 w-14 rounded-2xl border border-slate-100 shadow-sm">
                                    <AvatarFallback className="bg-blue-50 text-[#003399] font-black text-lg">{listing.sellerInformation.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black text-slate-900">{listing.sellerInformation.name}</span>
                                        {listing.sellerInformation.verified && (
                                            <Badge className="bg-emerald-50 text-emerald-600 border-0 p-0.5 rounded-full">
                                                <CheckCircle2 size={12} fill="currentColor" className="text-white" />
                                            </Badge>
                                        )}
                                    </div>
                                    <span className="text-xs font-medium text-slate-400">{listing.sellerInformation.sellerType}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 group border border-transparent hover:border-slate-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400">
                                            <Mail size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{listing.sellerInformation.email}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-blue-500">
                                        <Copy size={12} />
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 group border border-transparent hover:border-slate-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400">
                                            <Phone size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600">{listing.sellerInformation.phone}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-blue-500">
                                        <Copy size={12} />
                                    </Button>
                                </div>
                                <div className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 border border-transparent">
                                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 shrink-0">
                                        <MapPin size={14} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Origin Location</span>
                                        <span className="text-xs font-bold text-slate-600">{listing.sellerInformation.location}</span>
                                    </div>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full mt-6 h-11 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest text-[#003399] hover:bg-blue-50">
                                View Full Profile
                                <ArrowUpRight size={14} className="ml-2" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Metadata Card */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-slate-900 text-white">
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                                    <Activity size={20} className="text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">System Metadata</h4>
                                    <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Internal logging details</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">First Listed</span>
                                    <span className="text-xs font-black text-white">{listing.header.submittedDate}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Last Modified</span>
                                    <span className="text-xs font-black text-white">{listing.header.lastUpdated}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
