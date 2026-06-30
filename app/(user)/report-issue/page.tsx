'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContactSupport } from '@/hooks/useUserProfile';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
    AlertTriangle, 
    Send, 
    Loader2, 
    ChevronLeft 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ReportIssuePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const reportMutation = useContactSupport();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !details.trim()) {
            toast.error('Missing Fields', { description: 'Please explain the technical issue.' });
            return;
        }

        try {
            // Append prefix [Technical Issue] to subject
            await reportMutation.mutateAsync({
                subject: `[Technical Issue] ${title.trim()}`,
                message: details.trim()
            });
            setTitle('');
            setDetails('');
            router.push('/account');
        } catch (error) {}
    };

    return (
        <div className="space-y-8 pb-20 pt-28 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Report Bug</h2>
                    <p className="text-slate-500 font-semibold text-sm mt-1">
                        Report technical issues or feedback directly to C9X engineering
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

            <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardContent className="p-6 sm:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 ml-1">Issue Title *</label>
                            <Input
                                placeholder="e.g. Chat screen freezing on mobile"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-slate-50 h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 ml-1">Describe the Glitch *</label>
                            <Textarea
                                placeholder="Please explain what happened, steps to reproduce, and your browser/OS if possible."
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="bg-slate-50 h-36 rounded-xl"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={reportMutation.isPending}
                            className="w-full bg-[#003399] hover:bg-blue-800 text-white rounded-xl h-12 font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                        >
                            {reportMutation.isPending ? (
                                <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</>
                            ) : (
                                <><Send size={16} />Report Issue</>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
