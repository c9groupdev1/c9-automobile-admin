'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVerifyPayment } from '@/hooks/useUserBilling';
import { Loader2, CheckCircle2, XCircle, ShieldCheck, ArrowRight, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function VerifyPaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    const { mutate: verify, isPending, isSuccess, isError, data } = useVerifyPayment();
    const [hasAttempted, setHasAttempted] = useState(false);

    useEffect(() => {
        if (reference && !hasAttempted) {
            verify(reference);
            setHasAttempted(true);
        }
    }, [reference, verify, hasAttempted]);

    if (!reference) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <XCircle className="h-16 w-16 text-rose-500" />
                <h1 className="text-2xl font-black text-slate-900 uppercase">Invalid Reference</h1>
                <p className="text-slate-500 font-medium">The fiscal transaction identifier is missing or malformed.</p>
                <Link href="/account">
                    <Button variant="outline" className="rounded-xl font-bold">Return to Account</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <Card className="w-full max-w-md border-slate-100 shadow-2xl rounded-[3rem] overflow-hidden">
                <CardHeader className="text-center p-10 pb-4">
                    <div className="flex justify-center mb-6">
                        {isPending && (
                            <div className="relative">
                                <Loader2 className="h-20 w-20 animate-spin text-[#003399]" />
                                <Wallet className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-200" />
                            </div>
                        )}
                        {isSuccess && (
                            <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center">
                                <ShieldCheck className="h-10 w-10 text-emerald-600" />
                            </div>
                        )}
                        {isError && (
                            <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center">
                                <XCircle className="h-10 w-10 text-rose-600" />
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        {isPending ? 'Verifying Fiscal Data' : isSuccess ? 'Protocol Verified' : 'Verification Failed'}
                    </CardTitle>
                    <CardDescription className="font-medium text-slate-500 mt-2">
                        {isPending ? 'Synchronizing with payment gateway node...' : 
                         isSuccess ? 'Your transaction has been successfully confirmed.' : 
                         'The fiscal node rejected the transaction verification.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-4 text-center">
                    {isSuccess && (
                        <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-3 border border-slate-100">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference</span>
                                <span className="text-xs font-bold text-slate-900 truncate ml-4">{reference}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span>
                                <span className="text-xs font-bold text-emerald-600 uppercase">Successful</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <Link href="/account" className="w-full">
                            <Button className="w-full bg-[#003399] hover:bg-blue-800 text-white rounded-2xl h-12 font-bold shadow-lg shadow-blue-900/20">
                                {isSuccess ? 'Access Member Dashboard' : 'Return to Account'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        {isError && (
                            <Button 
                                variant="ghost" 
                                onClick={() => verify(reference)}
                                className="font-bold text-xs text-slate-400 hover:text-slate-600"
                            >
                                Retry Verification Protocol
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
