'use client';

import { 
    ChevronRight, 
    Mail, 
    Phone, 
    MapPin, 
    ShieldCheck, 
    UserX,
    FileText,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Info,
    User,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUserDetails } from '@/hooks/useUsers';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;

export default function UserDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: user, isLoading } = useUserDetails(id as string);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003399]"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20">
                <h3 className="text-xl font-bold text-slate-900">User not found</h3>
                <Button variant="link" onClick={() => router.back()} className="text-[#003399]">Go back</Button>
            </div>
        );
    }

    return (
        <div className="pb-20">
            <div className="max-w-6xl mx-auto space-y-8 text-slate-900">
                {/* Breadcrumbs & Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                            <Link href="/admin/users" className="hover:text-[#003399] transition-colors">Users</Link>
                            <ChevronRight size={10} />
                            <span className="text-[#003399]">User Details</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">User Details</h1>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-[#003399]/10 text-[#003399] border-0 font-bold uppercase text-[9px] tracking-widest px-2.5 py-1 pointer-events-none">
                                    ID: {user.displayId}
                                </Badge>
                                {user.status === 'active' ? (
                                    <Badge className="bg-emerald-50 text-emerald-600 border-0 font-bold uppercase text-[9px] tracking-widest px-2.5 py-1 pointer-events-none">
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge className="bg-slate-100 text-slate-500 border-0 font-bold uppercase text-[9px] tracking-widest px-2.5 py-1 pointer-events-none">
                                        {user.status}
                                    </Badge>
                                )}
                                {user.kycVerified ? (
                                    <Badge className="bg-blue-50 text-blue-600 border-0 font-bold uppercase text-[9px] tracking-widest px-2.5 py-1 pointer-events-none">
                                        KYC Verified
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-50 text-amber-600 border-0 font-bold uppercase text-[9px] tracking-widest px-2.5 py-1 pointer-events-none">
                                        KYC Unverified
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Header Card */}
                <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardContent className="p-8">
                        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                            {/* User Info */}
                            <div className="flex items-center gap-6 min-w-[300px]">
                                <Avatar className="h-20 w-20 rounded-2xl border border-slate-100 shadow-sm">
                                    {user.profile.avatar && <AvatarImage src={`${STORAGE_URL}${user.profile.avatar}`} className="object-cover" />}
                                    <AvatarFallback className="bg-slate-50 text-[#003399] font-bold text-2xl">{user.profile.fullName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1.5">
                                    <h2 className="text-lg font-bold text-slate-900 leading-tight">{user.profile.fullName}</h2>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Mail size={12} className="text-slate-400" />
                                            <span className="text-[11px] font-medium">{user.profile.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Phone size={12} className="text-slate-400" />
                                            <span className="text-[11px] font-medium">{user.profile.phoneNumber || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <MapPin size={12} className="text-slate-400" />
                                            <span className="text-[11px] font-medium">{user.profile.address || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 lg:hidden w-full">
                                {user.status === 'active' ? (
                                    <Badge className="bg-emerald-50 text-emerald-600 border-0 px-2 py-0.5 text-[9px]"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" /> Active</Badge>
                                ) : (
                                    <Badge className="bg-slate-100 text-slate-500 border-0 px-2 py-0.5 text-[9px]"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" /> {user.status}</Badge>
                                )}
                                {user.kycVerified ? (
                                    <Badge className="bg-blue-50 text-blue-600 border-0 px-2 py-0.5 text-[9px]"><ShieldCheck size={10} className="mr-1" /> Verified</Badge>
                                ) : (
                                    <Badge className="bg-amber-50 text-amber-600 border-0 px-2 py-0.5 text-[9px]"><XCircle size={10} className="mr-1" /> Unverified</Badge>
                                )}
                            </div>

                            <div className="w-full lg:w-px h-px lg:h-24 bg-slate-100" />

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-6 flex-1 w-full">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Account Type</p>
                                    <p className="text-sm font-bold text-slate-900">{user.profile.accountType}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date Joined</p>
                                    <p className="text-sm font-bold text-slate-900">{format(new Date(user.profile.dateJoined), 'dd MMM yyyy')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Total Bids</p>
                                    <p className="text-sm font-bold text-slate-900">{user.activityOverview.vehiclesPlaced}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Total Listings</p>
                                    <p className="text-sm font-bold text-slate-900">{user.activityOverview.totalListings}</p>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Last Active</p>
                                    <p className="text-sm font-bold text-emerald-600">
                                        {user.profile.lastActive ? `Today, ${format(new Date(user.profile.lastActive), 'h:mm a')}` : 'Never'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="hidden lg:flex gap-2 mt-4 pt-4 border-t border-slate-50">
                            {user.status === 'active' ? (
                                <Badge className="bg-emerald-50 text-emerald-600 border-0 px-3 py-1 font-bold text-[10px] tracking-wide"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" /> Active</Badge>
                            ) : (
                                <Badge className="bg-slate-100 text-slate-500 border-0 px-3 py-1 font-bold text-[10px] tracking-wide"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" /> {user.status}</Badge>
                            )}
                            {user.kycVerified ? (
                                <Badge className="bg-blue-50 text-blue-600 border-0 px-3 py-1 font-bold text-[10px] tracking-wide"><ShieldCheck size={12} className="mr-1.5" /> Verified</Badge>
                            ) : (
                                <Badge className="bg-amber-50 text-amber-600 border-0 px-3 py-1 font-bold text-[10px] tracking-wide"><XCircle size={12} className="mr-1.5" /> Unverified</Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Information */}
                <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="flex flex-row items-center justify-between p-6 px-8 pb-4">
                        <CardTitle className="text-base font-bold text-slate-900">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                            {[
                                { label: 'Full Name', value: user.personalInformation?.fullName || 'N/A' },
                                { label: 'Email Address', value: user.personalInformation?.emailAddress || 'N/A' },
                                { label: 'Phone Number', value: user.personalInformation?.phoneNumber || 'N/A' },
                                { label: 'Residential Address', value: user.personalInformation?.residentialAddress || 'N/A' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{item.label}</p>
                                    <p className="text-sm font-bold text-slate-900">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Account Information */}
                <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="p-6 px-8 pb-4">
                        <CardTitle className="text-base font-bold text-slate-900">Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                            {/* Account Information Items */}
                            {[
                                { label: 'User ID', value: user.accountInformation.userId },
                                { label: 'Account Type', value: user.accountInformation.accountType },
                                { label: 'Registration Date', value: format(new Date(user.accountInformation.registrationDate), 'dd MMMM yyyy, hh:mm a') },
                                { label: 'Last Login', value: user.accountInformation.lastLogin ? `Today, ${format(new Date(user.accountInformation.lastLogin), 'hh:mm a')}` : 'Never', color: user.accountInformation.lastLogin ? 'text-emerald-600' : 'text-slate-400' },
                                { label: 'Email Verification', value: user.accountInformation.emailVerification, verified: user.accountInformation.emailVerification === 'Verified' },
                                { label: 'Phone Verification', value: user.accountInformation.phoneVerification, verified: user.accountInformation.phoneVerification === 'Verified' },
                                { label: 'Account Status', value: user.accountInformation.accountStatus, status: true },
                            ].map((item, i) => (
                                <div key={i}>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{item.label}</p>
                                    <div className="flex items-center gap-2">
                                        {item.verified !== undefined && (
                                            <div className={cn("w-3 h-3 rounded-full flex items-center justify-center", item.verified ? 'bg-emerald-500' : 'bg-rose-500')}>
                                                <CheckCircle2 size={8} className="text-white" />
                                            </div>
                                        )}
                                        <p className={cn("text-sm font-bold", item.color || "text-slate-900", item.status && "text-emerald-600")}>{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* KYC Status */}
                <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="flex flex-row items-center justify-between p-6 px-8 border-b border-slate-50">
                        <CardTitle className="text-base font-bold text-slate-900">KYC Status</CardTitle>
                        {user.kycVerified ? (
                            <Badge className="bg-emerald-50 text-emerald-600 border-0 px-3 py-1 font-bold text-[10px] tracking-wide pointer-events-none">
                                <ShieldCheck size={12} className="mr-1.5" /> Verified
                            </Badge>
                        ) : (
                            <Badge className="bg-amber-50 text-amber-600 border-0 px-3 py-1 font-bold text-[10px] tracking-wide pointer-events-none">
                                <XCircle size={12} className="mr-1.5" /> Unverified
                            </Badge>
                        )}
                    </CardHeader>
                    <CardContent className="p-8">
                        {!user.kycStatus ? (
                            <div className="py-12 text-center text-slate-500">
                                <UserX size={48} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-sm font-bold text-slate-900 mb-1">No KYC Submitted</p>
                                <p className="text-xs">This user has not submitted any KYC documents for verification yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Map kycStatus fields if available */}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Activity Overview */}
                <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="p-6 px-8 pb-4 border-b border-slate-50">
                        <CardTitle className="text-base font-bold text-slate-900">Activity Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                { label: 'Total Bids', value: user.activityOverview.vehiclesPlaced || '0', color: 'text-blue-600', bg: 'bg-blue-50' },
                                { label: 'Items Listed', value: user.activityOverview.totalListings || '0', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                { label: 'Messages', value: user.activityOverview.messagesSent || '0', color: 'text-teal-600', bg: 'bg-teal-50' },
                                { label: 'Favorites', value: user.activityOverview.favoritesCount || '0', color: 'text-orange-600', bg: 'bg-orange-50' },
                                { label: 'Reviews', value: user.activityOverview.reviewsCount || '0', color: 'text-amber-600', bg: 'bg-amber-50' },
                            ].map((stat, i) => (
                                <div key={i} className={cn("p-4 rounded-2xl border-none shadow-sm flex flex-col gap-1", stat.bg)}>
                                    <p className={cn("text-2xl font-black", stat.color)}>{stat.value}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500/80">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</p>
                            {user.recentActivity.length === 0 ? (
                                <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    <Info size={24} className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-xs font-bold text-slate-500">No recent activity recorded</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {user.recentActivity.map((activity: any, i: number) => (
                                        <div key={i} className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                                            {/* Map activity item here */}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Timeline */}
                <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="p-6 px-8 pb-4 border-b border-slate-50">
                        <CardTitle className="text-base font-bold text-slate-900">Recent Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        {user.recentTimeline.length === 0 ? (
                            <div className="py-12 text-center text-slate-500">
                                <Clock size={48} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-sm font-bold text-slate-900 mb-1">No Timeline Data</p>
                                <p className="text-xs">No recent timeline events found for this user.</p>
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-slate-100 ml-4 space-y-8">
                                {user.recentTimeline.map((event: any, i: number) => (
                                    <div key={i} className="pl-8 relative">
                                        {/* Process event data here if structure was known */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
