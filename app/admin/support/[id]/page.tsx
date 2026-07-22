'use client';

import {
    ArrowLeft,
    Send,
    User,
    Mail,
    Calendar,
    Paperclip,
    Loader2,
    CheckCircle2,
    Clock,
    XCircle,
    MessageSquare,
    Save,
    X,
    Download,
    FileText
} from 'lucide-react';

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? '';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSupportEnquiry, useRespondToEnquiry } from '@/hooks/useSupport';
import { useParams, useRouter } from 'next/navigation';
import { useState, use } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function SupportDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const router = useRouter();
    const { data: enquiry, isLoading } = useSupportEnquiry(params.id);
    const { mutate: respond, isPending } = useRespondToEnquiry();
    
    const [status, setStatus] = useState<string | null>(null);
    const [message, setMessage] = useState<string>('');
    const [attachmentModal, setAttachmentModal] = useState(false);

    // Update local status state when enquiry data is loaded
    if (enquiry && !status) {
        setStatus(enquiry.status);
    }

    const handleRespond = () => {
        if (!status) {
            toast.error('Please select a status');
            return;
        }
        if (!message) {
            toast.error('Please enter a response message');
            return;
        }

        respond({ id: params.id, status, message }, {
            onSuccess: () => {
                toast.success('Response sent and status updated successfully');
                setMessage('');
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to send response');
            }
        });
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#003399]" />
            </div>
        );
    }

    if (!enquiry) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <XCircle className="h-12 w-12 text-rose-500" />
                <h3 className="text-xl font-bold text-slate-900">Enquiry not found</h3>
                <Link 
                    href="/admin/support"
                    className={cn(
                        buttonVariants({ variant: "default" }),
                        "bg-[#003399] rounded-xl px-6 h-12 font-bold text-xs shadow-lg shadow-blue-900/10 flex items-center justify-center"
                    )}
                >
                    Back to List
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header / Back Link */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-[#003399]"
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={16} className="mr-2" /> Back to Support Enquiries
                </Button>
                <Badge className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border-0",
                    enquiry.status === 'pending' ? 'bg-orange-50 text-orange-500' :
                    enquiry.status === 'reviewing' ? 'bg-blue-50 text-[#003399]' :
                    enquiry.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-slate-100 text-slate-400'
                )}>
                    {enquiry.status === 'pending' ? <Clock size={12} className="mr-1 inline" /> : enquiry.status === 'resolved' ? <CheckCircle2 size={12} className="mr-1 inline" /> : null}
                    {enquiry.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Enquiry Content */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="px-10 py-8 border-b border-slate-50 bg-slate-50/30">
                            <div className="space-y-4">
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                                    {enquiry.subject}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                                        <Calendar size={14} className="text-[#003399]" />
                                        {format(new Date(enquiry.created_at), 'MMMM dd, yyyy @ HH:mm')}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                                        <MessageSquare size={14} className="text-[#003399]" />
                                        Enquiry ID: {enquiry.id.split('-')[0].toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 py-10 space-y-8">
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-600 text-base leading-relaxed whitespace-pre-wrap font-medium">
                                    {enquiry.message}
                                </p>
                            </div>

                            {enquiry.attachment_path && (() => {
                                const fullUrl = enquiry.attachment_path.startsWith('http')
                                    ? enquiry.attachment_path
                                    : `${STORAGE_URL}${enquiry.attachment_path}`;
                                const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(fullUrl);
                                return (
                                    <div className="pt-8 border-t border-slate-50">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Attached Document</h4>
                                        <button
                                            onClick={() => setAttachmentModal(true)}
                                            className={cn(
                                                buttonVariants({ variant: "outline" }),
                                                "h-14 rounded-2xl border-slate-200 bg-slate-50 hover:bg-white hover:border-[#003399] hover:text-[#003399] transition-all px-6 gap-3 group flex items-center cursor-pointer"
                                            )}
                                        >
                                            <Paperclip size={20} className="text-slate-400 group-hover:text-[#003399]" />
                                            <span className="font-bold">View Attachment</span>
                                            <Badge variant="secondary" className="bg-slate-200 text-slate-600 text-[9px] font-black ml-2 uppercase">
                                                {isImage ? 'Image' : 'File'}
                                            </Badge>
                                        </button>

                                        {/* Attachment Modal */}
                                        {attachmentModal && (
                                            <div
                                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                                                onClick={() => setAttachmentModal(false)}
                                            >
                                                <div
                                                    className="relative bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {/* Modal Header */}
                                                    <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
                                                        <div className="flex items-center gap-3">
                                                            <Paperclip size={18} className="text-[#003399]" />
                                                            <span className="font-black text-slate-900 text-sm">Attachment</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <a
                                                                href={fullUrl}
                                                                download
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={cn(
                                                                    buttonVariants({ variant: 'outline' }),
                                                                    'h-9 rounded-xl text-xs font-bold gap-2 border-slate-200'
                                                                )}
                                                            >
                                                                <Download size={14} /> Download
                                                            </a>
                                                            <button
                                                                onClick={() => setAttachmentModal(false)}
                                                                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                                                            >
                                                                <X size={18} className="text-slate-600" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Modal Body */}
                                                    <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-slate-50">
                                                        {isImage ? (
                                                            <img
                                                                src={fullUrl}
                                                                alt="Support attachment"
                                                                className="max-w-full max-h-[65vh] object-contain rounded-2xl shadow-lg"
                                                            />
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-6 py-12">
                                                                <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center">
                                                                    <FileText size={40} className="text-[#003399]" />
                                                                </div>
                                                                <div className="text-center space-y-2">
                                                                    <p className="font-black text-slate-900">Document Attached</p>
                                                                    <p className="text-slate-500 text-sm font-medium">This file cannot be previewed directly.</p>
                                                                </div>
                                                                <a
                                                                    href={fullUrl}
                                                                    download
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={cn(
                                                                        buttonVariants({ variant: 'default' }),
                                                                        'h-12 rounded-2xl bg-[#003399] hover:bg-blue-800 font-bold px-8 gap-2'
                                                                    )}
                                                                >
                                                                    <Download size={16} /> Open / Download File
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {enquiry.admin_note && (
                                <div className="pt-8 border-t border-slate-50 space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Previous Administrative Response</h4>
                                    <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100 text-slate-700 text-sm font-medium leading-relaxed">
                                        {enquiry.admin_note}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Response Section */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-2xl overflow-hidden bg-white">
                        <CardHeader className="px-10 py-8 border-b border-slate-50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003399]">
                                    <Send size={24} />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black text-slate-900">Respond to Enquiry</CardTitle>
                                    <p className="text-slate-500 font-medium text-xs">Send a direct message to the user and update the enquiry status</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 py-8 space-y-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Resolution Status</label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-bold text-sm">
                                        <SelectValue placeholder="Update enquiry status..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-100">
                                        <SelectItem value="pending">Mark as Pending</SelectItem>
                                        <SelectItem value="reviewing">Under Review</SelectItem>
                                        <SelectItem value="resolved">Mark as Resolved</SelectItem>
                                        <SelectItem value="closed">Close Ticket</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Response Message / Internal Notes</label>
                                <Textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Enter your response to the customer or internal notes for resolution..."
                                    className="min-h-[200px] rounded-[2rem] bg-slate-50 border-slate-100 p-8 text-base font-medium focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                />
                            </div>

                            <Button
                                onClick={handleRespond}
                                disabled={isPending}
                                className="w-full h-16 rounded-2xl bg-[#003399] hover:bg-blue-800 text-lg font-bold shadow-xl shadow-blue-900/10 transition-all gap-3"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        Updating Enquiry...
                                    </>
                                ) : (
                                    <>
                                        <Save size={24} />
                                        Save & Submit Response
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Requester Sidebar */}
                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="px-8 py-6 border-b border-slate-50">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Requester Details</h3>
                        </CardHeader>
                        <CardContent className="px-8 py-8 space-y-8">
                            <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[#003399]">
                                    <User size={28} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-base font-black text-slate-900 truncate">{enquiry.name || 'Guest User'}</span>
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{enquiry.user ? 'Registered User' : 'Public Guest'}</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-col space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-50 text-slate-600">
                                        <Mail size={16} />
                                        <span className="text-sm font-bold truncate">{enquiry.email || 'N/A'}</span>
                                    </div>
                                </div>

                                {enquiry.user && (
                                    <div className="pt-6 border-t border-slate-50 space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400">Associated Account</label>
                                        <Link 
                                            href={`/admin/users/${enquiry.user.id}`}
                                            className={cn(
                                                buttonVariants({ variant: "outline" }),
                                                "w-full h-14 rounded-2xl justify-between border-slate-100 hover:border-[#003399] group flex items-center px-4"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#003399]">
                                                    <User size={16} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700">Account Profile</span>
                                            </div>
                                            <ArrowLeft size={14} className="rotate-180 text-slate-300 group-hover:text-[#003399]" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Support Tips / Status Info */}
                    <div className="p-8 rounded-[2.5rem] bg-[#003399] text-white space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <CheckCircle2 size={20} className="text-blue-200" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest">Resolution Best Practice</h4>
                        <p className="text-blue-100 text-xs leading-relaxed font-medium">
                            When resolving enquiries, ensure you provide a clear explanation to the user. All status changes are logged and sent via email notification to the requester.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
