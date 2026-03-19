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
import { toast } from 'sonner';
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

    const handleReview = async (status: 'approved' | 'rejected') => {
        try {
            const response = await reviewMutation.mutateAsync({
                id,
                status,
                comments: reviewComment
            });
            toast.success(response.message || `KYC Case ${status} successfully`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update review status');
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

    const applicantName = kyc.user.name;

    return (
        <div className="pb-20">
            <div className="max-w-6xl mx-auto space-y-8 text-slate-900">
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
                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg border-slate-200 text-slate-500">
                                    {kyc.type}
                                </Badge>
                            </div>
                            <p className="text-slate-500 font-medium text-sm flex items-center gap-2 mt-1">
                                Submission ID: <span className="text-slate-900 font-bold uppercase tracking-wider">#{kyc.id}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                Received {kyc.submittedAt}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            disabled={reviewMutation.isPending || kyc.status === 'approved'}
                            onClick={() => handleReview('approved')}
                            className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white px-6 shadow-lg shadow-emerald-500/20"
                        >
                            <ShieldCheck size={16} className="mr-2" />
                            Approve Case
                        </Button>
                        <Button 
                            disabled={reviewMutation.isPending || kyc.status === 'rejected'}
                            onClick={() => handleReview('rejected')}
                            variant="outline"
                            className="h-11 rounded-xl border-rose-100 text-rose-600 hover:bg-rose-50 font-bold text-xs px-6"
                        >
                            <XCircle size={16} className="mr-2" />
                            Reject Artifacts
                        </Button>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Applicant Information */}
                    <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-50 text-[#003399]">
                                    <User size={16} />
                                </div>
                                Applicant Identification
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Legal Name</p>
                                    <p className="text-sm font-bold text-slate-900 uppercase">{kyc.user.name}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</p>
                                    <p className="text-sm font-bold text-slate-900">{kyc.user.email}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Member Since</p>
                                    <p className="text-sm font-bold text-slate-900">{kyc.user.memberSince}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Protocol ID</p>
                                    <p className="text-[11px] font-mono font-bold text-slate-500 uppercase">#{kyc.user.id.split('-')[0]}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Verification Artifacts */}
                    <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="p-8 pb-6 border-b border-slate-50">
                            <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                    <ShieldCheck size={16} />
                                </div>
                                Identity Verification Artifacts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-10">
                            {/* Metadata Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Verified Phone</p>
                                    <p className="text-sm font-bold text-slate-900">{kyc.verificationDetails.phoneNumber}</p>
                                </div>
                                <div className="space-y-1.5 col-span-1 md:col-span-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Residential Address</p>
                                    <p className="text-sm font-bold text-slate-900">
                                        {kyc.verificationDetails.individualInfo?.address || kyc.verificationDetails.businessInfo?.businessAddress || 'N/A'}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Identification Type</p>
                                    <Badge variant="outline" className="rounded-md border-emerald-100 bg-emerald-50/30 text-emerald-700 font-bold text-[10px] uppercase">
                                        {kyc.verificationDetails.individualInfo?.idType || 'Business RC'}
                                    </Badge>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">ID Document Number</p>
                                    <p className="text-sm font-bold text-slate-900 font-mono">
                                        {kyc.verificationDetails.individualInfo?.idNumber || kyc.verificationDetails.businessInfo?.rcNumber || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Media Assets */}
                            <div className="space-y-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Evidence</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Selfie Artifact */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <Camera size={14} className="text-[#003399]" />
                                            Live Portrait Match
                                        </div>
                                        <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 ring-1 ring-slate-200 group relative">
                                            {kyc.verificationDetails.selfiePicture ? (
                                                <img 
                                                    src={kyc.verificationDetails.selfiePicture} 
                                                    className="w-full h-full object-cover" 
                                                    alt="Identity Selfie" 
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                                                    <Camera size={24} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">No Portrait Artifact</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* ID Artifact */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <CreditCard size={14} className="text-emerald-600" />
                                            Primary Identity Document
                                        </div>
                                        <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 ring-1 ring-slate-200 group relative">
                                            {kyc.verificationDetails.individualInfo?.idImage || kyc.verificationDetails.businessInfo?.rcCertificate ? (
                                                <img 
                                                    src={kyc.verificationDetails.individualInfo?.idImage || kyc.verificationDetails.businessInfo?.rcCertificate} 
                                                    className="w-full h-full object-cover" 
                                                    alt="Identification Document" 
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                                                    <FileText size={24} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">No ID Artifact</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Review Commentary */}
                    <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                                    <MessageSquare size={16} />
                                </div>
                                Moderator Decision & Audit
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Vetting Officer</p>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6 rounded-lg ring-1 ring-slate-100">
                                            <AvatarFallback className="bg-slate-50 text-[#003399] font-black text-[9px]">SA</AvatarFallback>
                                        </Avatar>
                                        <p className="text-sm font-bold text-slate-900">{kyc.reviewInfo?.vettedBy || 'Awaiting Review'}</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Last Decision Update</p>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Clock size={14} />
                                        <p className="text-sm font-bold text-slate-900">{kyc.reviewInfo?.updatedAt || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal Decision Log / Comments</p>
                                <div className="p-6 rounded-2xl bg-amber-50/30 border border-amber-100/50 min-h-[100px]">
                                    <p className="text-sm font-medium text-slate-700 italic">
                                        {kyc.reviewInfo?.comments ? `"${kyc.reviewInfo.comments}"` : 'No moderator commentary recorded for this submission.'}
                                    </p>
                                </div>
                                {!kyc.reviewInfo?.comments && kyc.status === 'pending' && (
                                    <textarea 
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Add internal review notes before taking action..."
                                        className="w-full min-h-[100px] rounded-2xl bg-slate-50 border-transparent focus:ring-2 focus:ring-[#003399]/10 focus:bg-white border focus:border-slate-200 transition-all p-4 text-sm font-medium"
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
