'use client';

import { 
    ShieldCheck, 
    UserCheck, 
    UserX, 
    FileText, 
    Clock, 
    User, 
    CheckCircle2, 
    XCircle, 
    RotateCcw, 
    AlertCircle, 
    Building2, 
    CreditCard, 
    Camera,
    MapPin,
    Calendar,
    Mail,
    Phone,
    ArrowLeft,
    ExternalLink,
    AlertTriangle,
    Eye,
    MessageSquare,
    ChevronDown,
    MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useState, use } from 'react';
import { useKycRequest, useReviewKyc } from '@/hooks/useKyc';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;

interface KYCReviewPageProps {
    params: Promise<{ id: string }>;
}

export default function KYCReviewPage({ params }: KYCReviewPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [reviewComment, setReviewComment] = useState('');
    
    const { data: kycResponse, isLoading } = useKycRequest(id);
    const reviewMutation = useReviewKyc();

    const kyc = kycResponse?.data;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '...';
        try {
            return format(parseISO(dateStr), 'MMM dd, yyyy');
        } catch (e) {
            return dateStr;
        }
    };

    const handleReview = async (status: 'approved' | 'rejected') => {
        try {
            await reviewMutation.mutateAsync({
                id,
                status,
                comments: reviewComment
            });
            // router.push('/kyc'); // Keep on page or redirect? Usually redirect after action
        } catch (error) {
            console.error('Review failed:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003399]"></div>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Retrieving identity artifacts...</span>
                </div>
            </div>
        );
    }

    if (!kyc) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-500">
                        <AlertTriangle size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Submission Not Found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">The KYC submission you are looking for might have been archived or removed.</p>
                    </div>
                    <Button onClick={() => router.back()} variant="outline" className="rounded-xl border-slate-200">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const applicantName = kyc.verificationDetails.businessInfo?.businessName || kyc.user.name;

    return (
        <div className="space-y-8 pb-20">
            {/* Nav Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => router.back()}
                        className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-100 text-slate-600 hover:text-[#003399]"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Review Identity</h2>
                            <Badge className={cn(
                                "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border-0",
                                kyc.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                                kyc.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                                'bg-rose-50 text-rose-600'
                            )}>
                                {kyc.status}
                            </Badge>
                        </div>
                        <p className="text-slate-500 font-medium text-sm flex items-center gap-2 mt-1">
                            Submission ID: <span className="text-slate-900 font-bold uppercase tracking-wider">#{kyc.id}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            Received {formatDate(kyc.submittedAt)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 rounded-xl border-slate-200 font-bold text-xs">
                        <MessageSquare size={16} className="mr-2" />
                        Ask for Info
                    </Button>
                    <Button 
                        disabled={reviewMutation.isPending || kyc.status === 'approved'}
                        onClick={() => handleReview('approved')}
                        className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white px-6 shadow-lg shadow-emerald-500/20"
                    >
                        <ShieldCheck size={16} className="mr-2" />
                        Approve Case
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Identity Core */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="px-10 pt-10 pb-6">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <UserCheck className="text-[#003399]" size={20} />
                                Applicant Identity Artifacts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 space-y-10">
                            {/* Primary Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ring-1 ring-slate-50 p-8 rounded-[2rem] bg-slate-50/30">
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Legal Name</label>
                                        <p className="font-black text-slate-900 text-lg uppercase">{applicantName}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Type</label>
                                            <div className="font-bold text-slate-700 flex items-center gap-2">
                                                {kyc.type.toLowerCase() === 'business' ? <Building2 size={14} /> : <User size={14} />}
                                                <span className="capitalize">{kyc.type}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Ref.</label>
                                            <p className="font-bold text-slate-700">{kyc.verificationDetails.phoneNumber}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 border-l border-slate-100 md:pl-8">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Email</label>
                                        <p className="font-bold text-slate-900 underline decoration-slate-200">{kyc.user.email}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Physical Address</label>
                                        <p className="font-medium text-slate-600 text-sm">{kyc.verificationDetails.businessInfo?.businessAddress || 'No address provided'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Document Grid */}
                            <div className="space-y-6">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={14} className="text-[#003399]" />
                                    Verification Documents
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Selfie / Portrait Match */}
                                    <div className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-100 ring-1 ring-slate-200">
                                        {kyc.verificationDetails.selfiePicture ? (
                                            <>
                                                <img 
                                                    src={kyc.verificationDetails.selfiePicture.startsWith('http') ? kyc.verificationDetails.selfiePicture : `${STORAGE_URL}${kyc.verificationDetails.selfiePicture}`} 
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                    alt="Identity Selfie" 
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                <div className="absolute bottom-4 left-4">
                                                    <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">Identity Artifact</p>
                                                    <p className="text-xs font-bold text-white uppercase">Live Portrait Match</p>
                                                </div>
                                                <Button size="icon" className="absolute top-4 right-4 h-8 w-8 rounded-xl bg-white/20 backdrop-blur-md text-white border-0 hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100">
                                                    <Eye size={14} />
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                                                <Camera size={24} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">No Portrait Artifact</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Means of Identity */}
                                    <div className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-100 ring-1 ring-slate-200">
                                        {kyc.verificationDetails.meansOfIdentity ? (
                                            <>
                                                <img 
                                                    src={kyc.verificationDetails.meansOfIdentity.startsWith('http') ? kyc.verificationDetails.meansOfIdentity : `${STORAGE_URL}${kyc.verificationDetails.meansOfIdentity}`} 
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                    alt="Means of Identity" 
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                <div className="absolute bottom-4 left-4">
                                                    <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">{kyc.verificationDetails.meansOfIdentityType?.replace('_', ' ') || 'ID Card'}</p>
                                                    <p className="text-xs font-bold text-white uppercase">Primary ID Artifact</p>
                                                </div>
                                                <Button size="icon" className="absolute top-4 right-4 h-8 w-8 rounded-xl bg-white/20 backdrop-blur-md text-white border-0 hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100">
                                                    <Eye size={14} />
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                                                <CreditCard size={24} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">No Primary ID Artifact</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* CAC / Business Certificate */}
                                    {/* CAC / Business Certificate */}
                                    {kyc.type.toLowerCase() === 'business' && (
                                        <div className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-100 ring-1 ring-slate-200">
                                            {kyc.verificationDetails.businessInfo?.rcCertificate ? (
                                                <>
                                                    <img 
                                                        src={kyc.verificationDetails.businessInfo.rcCertificate.startsWith('http') ? kyc.verificationDetails.businessInfo.rcCertificate : `${STORAGE_URL}${kyc.verificationDetails.businessInfo.rcCertificate}`} 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                        alt="Business Registration" 
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                    <div className="absolute bottom-4 left-4">
                                                        <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">RC: {kyc.verificationDetails.businessInfo.rcNumber}</p>
                                                        <p className="text-xs font-bold text-white uppercase">Corporate Credentials</p>
                                                    </div>
                                                    <Button size="icon" className="absolute top-4 right-4 h-8 w-8 rounded-xl bg-white/20 backdrop-blur-md text-white border-0 hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100">
                                                        <Eye size={14} />
                                                    </Button>
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                                                    <FileText size={24} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">No RC Certificate</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Review Commentary */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="px-10 py-8 border-b border-slate-50">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <MessageSquare className="text-blue-500" size={20} />
                                Moderator Review & Decisions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Moderator Comments</label>
                                <textarea 
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Add detailed reasoning for internal audit or user communication..."
                                    className="w-full min-h-[120px] rounded-[1.5rem] bg-slate-50 border-transparent focus:ring-2 focus:ring-[#003399]/10 focus:bg-white border focus:border-slate-200 transition-all p-6 text-sm font-medium"
                                />
                            </div>
                            {kyc.reviewInfo?.comments && (
                                <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock size={14} className="text-blue-500" />
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Previous Feedback</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 italic">"{kyc.reviewInfo?.comments}"</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Status Summary */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white border-b-4 border-b-[#003399]/20">
                        <CardHeader className="p-8 pb-0">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Verification Pulse</h3>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Personal ID</span>
                                    <Badge className={cn("rounded-lg", kyc.verificationDetails.meansOfIdentity ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600")}>
                                        {kyc.verificationDetails.meansOfIdentity ? "Artifact Present" : "Missing"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Portrait Match</span>
                                    <Badge className={cn("rounded-lg", kyc.verificationDetails.selfiePicture ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600")}>
                                        {kyc.verificationDetails.selfiePicture ? "Active" : "Incomplete"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Account Link</span>
                                    <Badge className="bg-emerald-50 text-emerald-600 rounded-lg">Verified</Badge>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50 space-y-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Vetting Officer</label>
                                    <div className="flex items-center gap-2 py-2">
                                        <Avatar className="h-6 w-6 rounded-lg ring-1 ring-slate-100">
                                            <AvatarFallback className="bg-slate-100 text-slate-600 font-black text-[10px]">AD</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs font-bold text-slate-900 group-hover:text-[#003399] cursor-pointer transition-colors uppercase tracking-tight truncate">
                                            {kyc.reviewInfo?.vettedBy || 'Awaiting Assignment'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Trust Score</label>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                                        <div className="bg-[#003399] h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(0,51,153,0.3)]"></div>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-900 mt-1 uppercase tracking-tighter">85/100 · High Integrity</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Moderator Controls */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="p-8 pb-0">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Security Directives</h3>
                        </CardHeader>
                        <CardContent className="p-8 space-y-3">
                            <Button 
                                disabled={reviewMutation.isPending || kyc.status === 'approved'}
                                onClick={() => handleReview('approved')}
                                className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black text-xs text-white uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                            >
                                <ShieldCheck size={16} className="mr-2" />
                                Approve Entity
                            </Button>
                            <Button 
                                disabled={reviewMutation.isPending || kyc.status === 'rejected'}
                                onClick={() => handleReview('rejected')}
                                variant="outline" 
                                className="w-full h-12 rounded-2xl border-rose-100 text-rose-600 hover:bg-rose-50 font-black text-xs uppercase tracking-widest"
                            >
                                <XCircle size={16} className="mr-2" />
                                Reject Artifacts
                            </Button>
                            <Button variant="ghost" className="w-full h-12 rounded-2xl text-slate-400 hover:text-slate-600 font-bold text-xs">
                                <RotateCcw size={16} className="mr-2" />
                                Reset Review State
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <div className="px-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Audit Timeline</h3>
                            <Button variant="link" className="h-auto p-0 text-[10px] font-black uppercase text-[#003399] tracking-widest">Full History</Button>
                        </div>
                        <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
                            <div className="flex gap-4 relative">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm ring-1 ring-emerald-100 z-10 shrink-0"></div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Identity Vetted</span>
                                    <span className="text-[10px] font-medium text-slate-400">{formatDate(kyc.reviewInfo?.updatedAt || undefined)}</span>
                                </div>
                            </div>
                            <div className="flex gap-4 relative opacity-50">
                                <div className="w-4 h-4 rounded-full bg-[#003399] border-4 border-white shadow-sm ring-1 ring-blue-100 z-10 shrink-0"></div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Artifacts Uploaded</span>
                                    <span className="text-[10px] font-medium text-slate-400">{formatDate(kyc.submittedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
