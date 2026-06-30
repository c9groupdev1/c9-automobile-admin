'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContactSupport } from '@/hooks/useUserProfile';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
    HelpCircle, 
    Send, 
    Loader2, 
    ChevronLeft, 
    FileText,
    AlertTriangle,
    BookOpen,
    ArrowRight,
    MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SupportPage() {
    const router = useRouter();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'hub' | 'ticket'>('hub');
    const contactSupportMutation = useContactSupport();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) {
            toast.error('Missing Fields', { description: 'Please fill in all ticket details.' });
            return;
        }

        try {
            await contactSupportMutation.mutateAsync({
                subject: subject.trim(),
                message: message.trim()
            });
            setSubject('');
            setMessage('');
            setActiveTab('hub');
        } catch (error) {}
    };

    return (
        <div className="space-y-8 pb-20 pt-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Help Center</h2>
                    <p className="text-slate-500 font-semibold text-sm mt-1">
                        Find answers, read policies, or get assistance from C9X staff
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/account')}
                    className="rounded-xl border-slate-200 text-slate-655 font-bold text-xs"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Account
                </Button>
            </div>

            {activeTab === 'hub' ? (
                <div className="space-y-8">
                    {/* Grid Options */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Help Desk / General Enquiry */}
                        <Card 
                            onClick={() => setActiveTab('ticket')}
                            className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white hover:border-[#003399]/40 hover:shadow-md cursor-pointer transition-all duration-300 group"
                        >
                            <CardContent className="p-6 space-y-4">
                                <div className="p-3 bg-blue-50 text-[#003399] rounded-2xl w-fit group-hover:scale-105 transition-transform">
                                    <MessageSquare size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-1">
                                        Submit Support Ticket
                                        <ArrowRight size={16} className="text-slate-300 group-hover:text-[#003399] ml-1 transition-colors" />
                                    </h3>
                                    <p className="text-slate-500 font-semibold text-xs leading-relaxed">
                                        Send inquiries about transactions, subscriptions, kyc checks, or account issues.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Report Bug / Technical Issue */}
                        <Link href="/report-issue">
                            <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white hover:border-amber-500/40 hover:shadow-md cursor-pointer transition-all duration-300 h-full group">
                                <CardContent className="p-6 space-y-4">
                                    <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl w-fit group-hover:scale-105 transition-transform">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-1">
                                            Report Technical Issue
                                            <ArrowRight size={16} className="text-slate-300 group-hover:text-amber-500 ml-1 transition-colors" />
                                        </h3>
                                        <p className="text-slate-500 font-semibold text-xs leading-relaxed">
                                            Experiencing loading issues, page glitches, or mobile interface errors? Tell us.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Marketplace Guidelines */}
                        <Link href="/guidelines">
                            <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white hover:border-slate-300 hover:shadow-md cursor-pointer transition-all duration-300 h-full group">
                                <CardContent className="p-6 space-y-4">
                                    <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl w-fit group-hover:scale-105 transition-transform">
                                        <BookOpen size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-1">
                                            Marketplace Guidelines
                                            <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-650 ml-1 transition-colors" />
                                        </h3>
                                        <p className="text-slate-500 font-semibold text-xs leading-relaxed">
                                            Rules and policies for buying, listing, and completing trades safely inside the catalog.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Vendor Guidelines */}
                        <Link href="/vendor-guidelines">
                            <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white hover:border-slate-300 hover:shadow-md cursor-pointer transition-all duration-300 h-full group">
                                <CardContent className="p-6 space-y-4">
                                    <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl w-fit group-hover:scale-105 transition-transform">
                                        <FileText size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-1">
                                            Vendor Guidelines
                                            <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-650 ml-1 transition-colors" />
                                        </h3>
                                        <p className="text-slate-500 font-semibold text-xs leading-relaxed">
                                            Commercial verification steps, dealership configurations, and sales policies.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    {/* FAQ Quick CTA */}
                    <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white py-10 px-6 sm:px-10 text-center">
                        <CardContent className="space-y-4 p-0">
                            <div className="mx-auto w-12 h-12 bg-blue-50 text-[#003399] rounded-full flex items-center justify-center">
                                <HelpCircle size={22} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Frequently Asked Questions</h3>
                            <p className="text-slate-500 font-semibold text-sm max-w-md mx-auto">
                                Check our quick reference guides to resolve instant questions regarding payments, bidding timelines, and seller tools.
                            </p>
                            <Button 
                                onClick={() => router.push('/faq')}
                                className="bg-[#003399] hover:bg-blue-800 rounded-xl font-bold h-11 text-white px-6 mt-2"
                            >
                                Open FAQ Directory
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="space-y-6 max-w-2xl mx-auto">
                    <div className="flex justify-between items-center">
                        <h3 className="font-extrabold text-slate-800 text-xl uppercase tracking-tight">Submit general ticket</h3>
                        <Button 
                            variant="ghost"
                            onClick={() => setActiveTab('hub')}
                            className="text-xs font-bold text-[#003399]"
                        >
                            Cancel
                        </Button>
                    </div>
                    <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
                        <CardContent className="p-6 sm:p-10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1">Subject / Issue Title *</label>
                                    <Input
                                        placeholder="e.g. Inquiry about subscription plans"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="bg-slate-50 h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1">Message Description *</label>
                                    <Textarea
                                        placeholder="Explain your inquiry in detail. Include any listing IDs or relevant timestamps."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="bg-slate-50 h-36 rounded-xl"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={contactSupportMutation.isPending}
                                    className="w-full bg-[#003399] hover:bg-blue-800 text-white rounded-xl h-12 font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                                >
                                    {contactSupportMutation.isPending ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" />Sending...</>
                                    ) : (
                                        <><Send size={16} />Submit Ticket</>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
