'use client';

import { 
    ChevronRight, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar, 
    Clock, 
    ShieldCheck, 
    UserCheck, 
    UserX,
    MoreVertical,
    FileText,
    Car,
    MessageSquare,
    Star,
    ArrowUpRight,
    ExternalLink,
    CheckCircle2,
    XCircle,
    Info,
    Building2,
    User,
    Edit2,
    Image as ImageIcon,
    Download,
    AlertCircle,
    MailWarning,
    Gavel,
    UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
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
        <div className="space-y-6 pb-20">
            {/* Breadcrumbs & Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-widest uppercase">
                    <Link href="/users" className="hover:text-slate-900 transition-colors">Users</Link>
                    <ChevronRight size={14} className="text-slate-300" />
                    <span className="text-[#003399]">User Details</span>
                </div>
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-black text-slate-900">User Details</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-slate-400">{user.displayId}</span>
                        {user.status === 'active' ? (
                            <Badge className="bg-emerald-50 text-emerald-600 border-0 font-bold uppercase text-[9px] tracking-widest px-2.5 py-0.5 pointer-events-none">
                                Active
                            </Badge>
                        ) : (
                            <Badge className="bg-slate-100 text-slate-500 border-0 font-bold uppercase text-[9px] tracking-widest px-2.5 py-0.5 pointer-events-none">
                                {user.status}
                            </Badge>
                        )}
                        {user.kycVerified ? (
                            <Badge className="bg-blue-50 text-blue-600 border-0 font-bold uppercase text-[9px] tracking-widest px-2.5 py-0.5 pointer-events-none">
                                KYC Verified
                            </Badge>
                        ) : (
                            <Badge className="bg-amber-50 text-amber-600 border-0 font-bold uppercase text-[9px] tracking-widest px-2.5 py-0.5 pointer-events-none">
                                KYC Unverified
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Main Column */}
                <div className="xl:col-span-8 space-y-8">
                    
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
                                    {user.profile.accountType === 'Premium Verified' && (
                                        <Badge className="bg-violet-50 text-violet-600 border-0 px-2 py-0.5 text-[9px]"><Star size={10} className="mr-1" /> Premium</Badge>
                                    )}
                                </div>

                                <div className="w-full lg:w-px h-px lg:h-24 bg-slate-100" />

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 flex-1 w-full">
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Type</p>
                                        <p className="text-xs font-bold text-slate-900">{user.profile.accountType}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date Joined</p>
                                        <p className="text-xs font-bold text-slate-900">{format(new Date(user.profile.dateJoined), 'dd MMM yyyy')}</p>
                                    </div>
                                    <div className="row-start-2 md:row-start-auto">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Bids</p>
                                        <p className="text-xs font-bold text-slate-900">{user.activityOverview.vehiclesPlaced}</p>
                                    </div>
                                    <div className="row-start-2 md:row-start-auto">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Listings</p>
                                        <p className="text-xs font-bold text-slate-900">{user.activityOverview.totalListings}</p>
                                    </div>
                                    <div className="col-span-2 md:col-start-3 md:col-span-2 md:row-start-2">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Active</p>
                                        <p className="text-xs font-bold text-emerald-600">Today, {format(new Date(user.profile.lastActive), 'h:mm a')}</p>
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
                                {user.profile.accountType === 'Premium Verified' && (
                                    <Badge className="bg-violet-50 text-violet-600 border-0 px-3 py-1 font-bold text-[10px] tracking-wide"><Star size={12} className="mr-1.5" /> Premium Verified</Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Information */}
                    <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="flex flex-row items-center justify-between p-6 px-8 pb-4">
                            <CardTitle className="text-base font-bold text-slate-900">Personal Information</CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#003399] hover:bg-blue-50">
                                <Edit2 size={16} />
                            </Button>
                        </CardHeader>
                        <CardContent className="px-8 pb-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                                {[
                                    { label: 'Full Name', value: user.personalInformation?.fullName || 'N/A' },
                                    { label: 'Email Address', value: user.personalInformation?.emailAddress || 'N/A' },
                                    { label: 'Phone Number', value: user.personalInformation?.phoneNumber || 'N/A' },
                                    { label: 'Date of Birth', value: 'N/A' }, // Backend doesn't provide
                                    { label: 'Residential Address', value: user.personalInformation?.residentialAddress || 'N/A' },
                                    { label: 'State/City', value: 'N/A' }, // Backend doesn't provide natively yet
                                    { label: 'Nationality', value: 'N/A' }, // Backend doesn't provide natively yet
                                    { label: 'NIN', value: 'N/A' }, // Backend doesn't provide natively yet
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
                                {[
                                    { label: 'User ID', value: user.accountInformation.userId },
                                    { label: 'Account Type', value: user.accountInformation.accountType },
                                    { label: 'Registration Date', value: format(new Date(user.accountInformation.registrationDate), 'dd MMMM yyyy, hh:mm a') },
                                    { label: 'Last Login', value: `Today, ${format(new Date(user.accountInformation.lastLogin), 'hh:mm a')}`, color: 'text-emerald-600' },
                                    { label: 'Login Method', value: 'Email & Password' },
                                    { label: 'Device / Session', value: 'Chrome on Mac OS' },
                                    { label: 'Email Verification', value: user.accountInformation.emailVerification, verified: user.accountInformation.emailVerification === 'Verified' },
                                    { label: 'Phone Verification', value: user.accountInformation.phoneVerification, verified: user.accountInformation.phoneVerification === 'Verified' },
                                    { label: 'Account Status', value: user.accountInformation.accountStatus, status: true },
                                    { label: 'Logins (Last 30 Days)', value: '47 logins' },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{item.label}</p>
                                        <div className="flex items-center gap-2">
                                            {item.verified !== undefined && (
                                                <div className={cn("w-3 h-3 rounded-full flex items-center justify-center", item.verified ? 'bg-emerald-500' : 'bg-rose-500')}>
                                                    <CheckCircle2 size={8} className="text-white" />
                                                </div>
                                            )}
                                            <p className={cn("text-xs font-bold", item.color || "text-slate-900", item.status && "text-emerald-600")}>{item.value}</p>
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
                        <CardContent className="p-8 space-y-8">
                            {!user.kycStatus ? (
                                <div className="py-12 text-center text-slate-500">
                                    <UserX size={48} className="mx-auto text-slate-300 mb-4" />
                                    <p className="text-sm font-bold text-slate-900 mb-1">No KYC Submitted</p>
                                    <p className="text-xs">This user has not submitted any KYC documents for verification yet.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date Submitted</p>
                                    <p className="text-sm font-bold text-slate-900">{user.kycStatus?.submittedAt ? format(new Date(user.kycStatus.submittedAt), 'dd MMMM yyyy') : '14 January 2026'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Review Date</p>
                                    <p className="text-sm font-bold text-slate-900">{user.kycStatus?.reviewedAt ? format(new Date(user.kycStatus.reviewedAt), 'dd MMMM yyyy') : '12 January 2026'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reviewed By</p>
                                    <p className="text-sm font-bold text-slate-900">{user.kycStatus?.reviewedBy || 'Admin Smith Johnson'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Verification Method</p>
                                    <p className="text-sm font-bold text-slate-900">NIN + ID Document</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Documents Submitted</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="aspect-square sm:aspect-auto sm:h-40 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-[#003399] transition-colors cursor-pointer group">
                                        <FileText size={24} className="text-slate-300 group-hover:text-[#003399] transition-colors" />
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold text-slate-600">ID Document</p>
                                            <p className="text-[9px] font-medium text-slate-400">Front</p>
                                        </div>
                                    </div>
                                    <div className="aspect-square sm:aspect-auto sm:h-40 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-[#003399] transition-colors cursor-pointer group">
                                        <FileText size={24} className="text-slate-300 group-hover:text-[#003399] transition-colors" />
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold text-slate-600">ID Document</p>
                                            <p className="text-[9px] font-medium text-slate-400">Back</p>
                                        </div>
                                    </div>
                                    <div className="aspect-square sm:aspect-auto sm:h-40 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-[#003399] transition-colors cursor-pointer group">
                                        <User size={24} className="text-slate-300 group-hover:text-[#003399] transition-colors" />
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold text-slate-600">Selfie Photo</p>
                                            <p className="text-[9px] font-medium text-emerald-500">Verified</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                                <Button className="bg-[#003399] hover:bg-blue-800 rounded-xl font-bold text-xs">View Full KYC Submission</Button>
                                <Button className="bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold text-xs">Approve</Button>
                                <Button className="bg-rose-500 hover:bg-rose-600 rounded-xl font-bold text-xs">Reject</Button>
                                <Button className="bg-orange-500 hover:bg-orange-600 rounded-xl font-bold text-xs">Request Resubmission</Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

                    {/* Activity Overview */}
                    <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="p-6 px-8 pb-4 border-b border-slate-50">
                            <CardTitle className="text-base font-bold text-slate-900">Activity Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Bids Placed', value: user.activityOverview.vehiclesPlaced || '0', color: 'text-blue-600', bg: 'bg-blue-50' },
                                    { label: 'Items Listed', value: user.activityOverview.totalListings || '0', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                    { label: 'Messages Sent', value: user.activityOverview.messagesSent || '0', color: 'text-teal-600', bg: 'bg-teal-50' },
                                    { label: 'Saved/Favorites', value: user.activityOverview.favoritesCount || '0', color: 'text-orange-600', bg: 'bg-orange-50' },
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
                                <div className="space-y-3">
                                    {[
                                        { title: 'Bid placed on Toyota Camry Auction', time: '12 mins ago', icon: Gavel, iconColor: 'text-[#003399]', iconBg: 'bg-blue-50' },
                                        { title: 'Saved Lexus RX listing', time: '5 hours ago', icon: Star, iconColor: 'text-purple-600', iconBg: 'bg-purple-50' },
                                        { title: 'Contacted vendor for brake repair', time: '1 day ago', icon: MessageSquare, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
                                        { title: 'Ordered item cart from parts marketplace', time: '3 days ago', icon: Car, iconColor: 'text-orange-600', iconBg: 'bg-orange-50' },
                                    ].map((activity, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", activity.iconBg)}>
                                                <activity.icon size={16} className={activity.iconColor} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{activity.title}</p>
                                                <p className="text-[10px] font-medium text-slate-400">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="p-6 px-8 pb-4 border-b border-slate-50">
                            <CardTitle className="text-base font-bold text-slate-900">Recent Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="relative border-l-2 border-slate-100 ml-4 space-y-8">
                                {[
                                    { title: 'Placed auction bid', description: 'Bid ₦2,250,000 on Toyota Camry 2018', time: '2 hours ago', icon: User, color: 'bg-blue-500' },
                                    { title: 'Saved listing', description: 'Added Lexus RX 350 to collections', time: '5 hours ago', icon: Star, color: 'bg-purple-500' },
                                    { title: 'Logged In', description: 'Chrome on Windows • Lagos, Nigeria', time: '18 hours ago', icon: Mail, color: 'bg-emerald-500' },
                                    { title: 'KYC Approved', description: 'Identity verification completed by Admin Jane', badge: 'Verified', time: '6 days ago', icon: ShieldCheck, color: 'bg-emerald-500' },
                                    { title: 'Submitted KYC', description: 'Uploaded ID documents and selfie photo', time: '8 days ago', icon: FileText, color: 'bg-blue-500' },
                                    { title: 'Registered account', description: 'Account created via email registration', time: '14 days ago', icon: UserPlus, color: 'bg-violet-500' },
                                ].map((event, i) => (
                                    <div key={i} className="pl-8 relative">
                                        <div className={cn("absolute -left-[1.05rem] top-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm", event.color)}>
                                            <event.icon size={12} className="text-white" />
                                        </div>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                    {event.title}
                                                    {event.badge && (
                                                        <Badge className="bg-emerald-50 text-emerald-600 border-0 text-[8px] uppercase tracking-widest px-1.5 py-0.5">{event.badge}</Badge>
                                                    )}
                                                </p>
                                                <p className="text-[11px] font-medium text-slate-500 mt-1">{event.description}</p>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">{event.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Support & Issue History */}
                    <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="p-6 px-8 pb-4 border-b border-slate-50">
                            <CardTitle className="text-base font-bold text-slate-900">Support & Issue History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issue Type</th>
                                        <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Date</th>
                                        <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { type: 'Payment Issue', desc: 'Unable to complete payment', date: 'Feb 10, 2026', status: 'Resolved' },
                                        { type: 'Account Access', desc: 'Password reset request', date: 'Jan 28, 2026', status: 'Resolved' },
                                    ].map((issue, i) => (
                                        <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                                            <td className="px-8 py-4">
                                                <p className="text-sm font-bold text-slate-900">{issue.type}</p>
                                                <p className="text-[10px] font-medium text-slate-400">{issue.desc}</p>
                                            </td>
                                            <td className="px-4 py-4 text-xs font-medium text-slate-500 text-center">{issue.date}</td>
                                            <td className="px-4 py-4 text-center">
                                                <Badge className="bg-emerald-50 text-emerald-600 border-0 text-[9px] uppercase tracking-widest">
                                                    {issue.status}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <button className="text-[11px] font-bold text-[#003399] hover:underline">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="p-4 text-center border-t border-slate-50">
                                <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">See all support interactions</button>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Right Sidebar */}
                <div className="xl:col-span-4 space-y-6">
                    {/* Quick Actions */}
                    <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="p-6 px-8 border-b border-slate-50">
                            <CardTitle className="text-base font-bold text-slate-900">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-3">
                            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold h-11 text-xs">
                                <CheckCircle2 size={16} className="mr-2" /> Approve KYC
                            </Button>
                            <Button className="w-full bg-rose-500 hover:bg-rose-600 rounded-xl font-bold h-11 text-xs">
                                <XCircle size={16} className="mr-2" /> Reject KYC
                            </Button>
                            <Button className="w-full bg-orange-500 hover:bg-orange-600 rounded-xl font-bold h-11 text-xs">
                                <AlertCircle size={16} className="mr-2" /> Suspend Account
                            </Button>
                            <Button className="w-full bg-[#003399] hover:bg-blue-800 rounded-xl font-bold h-11 text-xs">
                                <ShieldCheck size={16} className="mr-2" /> Reactivate Account
                            </Button>
                            
                            <div className="h-px bg-slate-100 w-full my-4" />
                            
                            <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold h-11 text-xs justify-start pl-4">
                                <AlertCircle size={16} className="mr-3 text-slate-400" /> Mark for Review
                            </Button>
                            <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold h-11 text-xs justify-start pl-4">
                                <UserX size={16} className="mr-3 text-slate-400" /> Reset Password
                            </Button>
                            <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold h-11 text-xs justify-start pl-4">
                                <MailWarning size={16} className="mr-3 text-slate-400" /> Send Warning
                            </Button>
                            <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold h-11 text-xs justify-start pl-4">
                                <Mail size={16} className="mr-3 text-slate-400" /> Contact User
                            </Button>
                            <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold h-11 text-xs justify-start pl-4">
                                <Download size={16} className="mr-3 text-slate-400" /> Export User Record
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Risk & Admin Notes */}
                    <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="p-6 px-8 border-b border-slate-50 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-bold text-slate-900">Risk & Admin Notes</CardTitle>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Low Risk</p>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Risk Parameters</p>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Email & Phone', status: 'Verified', color: 'text-emerald-500', icon: CheckCircle2 },
                                        { label: 'KYC Attempts', status: 'Clean', color: 'text-emerald-500', icon: CheckCircle2 },
                                        { label: 'User Complaints', status: 'None', color: 'text-emerald-500', icon: CheckCircle2 },
                                        { label: 'Duplicate Accounts', status: 'Not Found', color: 'text-emerald-500', icon: CheckCircle2 },
                                    ].map((risk, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <risk.icon size={12} className={risk.color} />
                                                <span className="text-xs font-bold text-slate-600">{risk.label}</span>
                                            </div>
                                            <span className={cn("text-[10px] font-black uppercase tracking-widest", risk.color)}>{risk.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Admin Notes</p>
                                <div className="space-y-4">
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex justify-between">
                                            <span>KYC Verification Complete</span>
                                            <span>3 days ago</span>
                                        </p>
                                        <p className="text-xs font-medium text-slate-600">All documents verified successfully. NIN matches government records.</p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-2">— Admin Sarah Johnson</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex justify-between">
                                            <span>Account Review</span>
                                            <span>18 days ago</span>
                                        </p>
                                        <p className="text-xs font-medium text-slate-600">Initial review of account completed. Email and phone number confirmed.</p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-2">— System</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Textarea 
                                    placeholder="Add a new admin note..."
                                    className="resize-none rounded-xl border-slate-200 focus:border-[#003399] min-h-[100px] text-sm font-medium"
                                />
                                <Button className="w-full bg-[#003399] hover:bg-blue-800 rounded-xl font-bold h-11 text-xs">
                                    Add Note
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
