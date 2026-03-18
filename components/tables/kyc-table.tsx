'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { KycRequest, useKycRequests, useReviewKyc } from '@/hooks/useKyc';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export function KycTable() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useKycRequests({ page });
    const reviewKyc = useReviewKyc();
    const [selectedRequest, setSelectedRequest] = useState<KycRequest | null>(null);
    const [comments, setComments] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);

    const kycRequests = Array.isArray(data?.data?.data) ? data.data.data : (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
    const meta = data?.data || { current_page: 1, last_page: 1, total: 0 };

    const getImageUrl = (path: string | null) => {
        if (!path) return '';
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
        return `${baseUrl}/storage/${path}`;
    };

    const handleReview = async (id: string | number, status: 'approved' | 'rejected') => {
        if (!comments && status === 'rejected') {
            toast.error('Please provide comments for rejection');
            return;
        }

        setReviewLoading(true);
        try {
            await reviewKyc.mutateAsync({ id, status, comments });
            toast.success(`KYC request ${status}`);
            setSelectedRequest(null);
            setComments('');
        } catch (error) {
            toast.error('Failed to review KYC request');
        } finally {
            setReviewLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="rounded-md border">
                <div className="h-96 w-full flex flex-col gap-4 p-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Requested On</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {kycRequests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No KYC requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            kycRequests.map((request: KycRequest) => (
                                <TableRow key={request.id}>
                                    <TableCell className="font-medium">{request.user.name}</TableCell>
                                    <TableCell>{request.user.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                request.status === 'approved'
                                                    ? 'default'
                                                    : request.status === 'pending'
                                                        ? 'outline'
                                                        : 'destructive'
                                            }
                                        >
                                            {request.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(request.submittedAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))} onClick={() => {
                                                setSelectedRequest(request);
                                                setComments(request.reviewInfo?.comments || '');
                                            }}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Review
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-slate-100 shadow-3xl p-0 custom-scrollbar">
                                                <div className="bg-slate-900 px-10 py-8 text-white relative overflow-hidden rounded-t-[2.5rem]">
                                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066CC]/10 blur-[100px] -mr-32 -mt-32"></div>
                                                    <div className="relative z-10">
                                                        <h2 className="text-3xl font-bold tracking-tight font-display mb-2">KYC Protocol Review</h2>
                                                        <p className="text-slate-400 font-medium text-sm">Validating administrative clearance for <span className="text-white font-bold">{request.user.name}</span></p>
                                                    </div>
                                                </div>
                                                <div className="px-10 py-8 space-y-8">
                                                    <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#0066CC] mb-1">Residential Address</p>
                                                            <p className="font-bold text-slate-700">{request.verificationDetails.address || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#0066CC] mb-1">Contact Phone</p>
                                                            <p className="font-bold text-slate-700">{request.verificationDetails.phoneNumber}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#0066CC] mb-1">{(request.verificationDetails.meansOfIdentityType || 'Identity').replace('_', ' ')} Number</p>
                                                            <p className="font-bold text-slate-700">{request.verificationDetails.idNumber || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#0066CC] mb-1">Profile Type</p>
                                                            <p className="font-bold text-slate-700 capitalize">{request.type}</p>
                                                        </div>
                                                        {request.type === 'business' && (
                                                            <>
                                                                <div className="col-span-2 pt-2 mt-2 border-t border-slate-200/60">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Business Name</p>
                                                                    <p className="font-bold text-slate-700">{request.verificationDetails.businessInfo?.businessName || 'N/A'}</p>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Business Address</p>
                                                                    <p className="font-bold text-slate-700">{request.verificationDetails.businessInfo?.businessAddress || 'N/A'}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">RC Number</p>
                                                                    <p className="font-bold text-slate-700">{request.verificationDetails.businessInfo?.rcNumber || 'N/A'}</p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                        <div className="space-y-3 group">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#0066CC]">{(request.verificationDetails.meansOfIdentityType || 'Identity').replace('_', ' ')}</p>
                                                                <span className="text-[10px] font-black uppercase text-slate-300">Identity Document</span>
                                                            </div>
                                                            <div className="aspect-[4/3] relative rounded-2xl border-2 border-slate-100 bg-slate-50 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                                                                {request.verificationDetails.meansOfIdentity ? (
                                                                    <img
                                                                        src={getImageUrl(request.verificationDetails.meansOfIdentity)}
                                                                        alt="Identity"
                                                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs italic">No document provided</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3 group">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#0066CC]">Selfie</p>
                                                                <span className="text-[10px] font-black uppercase text-slate-300">Live Verification</span>
                                                            </div>
                                                            <div className="aspect-[4/3] relative rounded-2xl border-2 border-slate-100 bg-slate-50 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                                                                {request.verificationDetails.selfiePicture ? (
                                                                    <img
                                                                        src={getImageUrl(request.verificationDetails.selfiePicture)}
                                                                        alt="Selfie"
                                                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs italic">No selfie provided</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {request.verificationDetails.businessInfo?.rcCertificate && (
                                                            <div className="col-span-1 sm:col-span-2 space-y-3 group">
                                                                <div className="flex items-center justify-between">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">RC Certificate</p>
                                                                    <span className="text-[10px] font-black uppercase text-slate-300">Business Registration</span>
                                                                </div>
                                                                <div className="aspect-[16/9] relative rounded-2xl border-2 border-slate-100 bg-slate-50 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                                                                    <img
                                                                        src={getImageUrl(request.verificationDetails.businessInfo.rcCertificate)}
                                                                        alt="RC Certificate"
                                                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Review Annotation</label>
                                                        <Textarea
                                                            placeholder="State the reason for authorization or protocol rejection..."
                                                            value={comments}
                                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                                                            className="min-h-[120px] rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-medium p-4"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                                                        <Button
                                                            variant="ghost"
                                                            disabled={reviewLoading}
                                                            onClick={() => handleReview(request.id, 'rejected')}
                                                            className="flex-1 h-14 rounded-xl text-rose-500 hover:bg-rose-50 font-bold border-rose-100 border transition-all"
                                                        >
                                                            {reviewLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-5 w-5" />}
                                                            Deny Protocol
                                                        </Button>
                                                        <Button
                                                            variant="default"
                                                            disabled={reviewLoading}
                                                            onClick={() => handleReview(request.id, 'approved')}
                                                            className="flex-1 h-14 rounded-xl bg-[#0066CC] hover:bg-blue-700 font-bold shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
                                                        >
                                                            {reviewLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
                                                            Authorize Clearance
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2">
                <div className="text-sm text-muted-foreground flex-1">
                    Total {meta.total} KYC requests
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === meta.last_page}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
