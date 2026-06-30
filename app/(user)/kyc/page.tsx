'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
    ShieldCheck, 
    User, 
    Building2, 
    Upload, 
    Camera, 
    Loader2, 
    ChevronLeft, 
    AlertCircle, 
    CheckCircle2,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function KycPage() {
    const router = useRouter();
    const { data: profile, refetch: refetchProfile } = useUserProfile();

    // Verification classes
    const [kycType, setKycType] = useState<'individual' | 'business' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [idType, setIdType] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [rcNumber, setRcNumber] = useState('');

    // File uploads states
    const [selfieFile, setSelfieFile] = useState<File | null>(null);
    const [selfiePreview, setSelfiePreview] = useState('');
    const [idFile, setIdFile] = useState<File | null>(null);
    const [idPreview, setIdPreview] = useState('');
    const [certFile, setCertFile] = useState<File | null>(null);
    const [certPreview, setCertPreview] = useState('');

    // If KYC is already submitted or verified, show current status
    const currentKycStatus = profile?.kycStatus || profile?.kyc?.status || null;

    const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelfieFile(file);
            setSelfiePreview(URL.createObjectURL(file));
        }
    };

    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIdFile(file);
            setIdPreview(URL.createObjectURL(file));
        }
    };

    const handleCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCertFile(file);
            setCertPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!kycType || !phoneNumber || !selfieFile) {
            toast.error('Missing details', { description: 'Please fill in phone number and upload a selfie.' });
            return;
        }

        if (kycType === 'individual') {
            if (!address || !idType || !idNumber || !idFile) {
                toast.error('Missing details', { description: 'Please fill in all individual identity fields.' });
                return;
            }
        } else {
            if (!businessName || !businessAddress || !rcNumber || !certFile) {
                toast.error('Missing details', { description: 'Please fill in all business registration fields.' });
                return;
            }
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('type', kycType);
            formData.append('phoneNumber', phoneNumber);
            formData.append('selfiePicture', selfieFile as Blob);

            if (kycType === 'individual') {
                formData.append('address', address);
                formData.append('meansOfIdentityType', idType);
                formData.append('idNumber', idNumber);
                formData.append('meansOfIdentity', idFile as Blob);
            } else {
                formData.append('businessName', businessName);
                formData.append('businessAddress', businessAddress);
                formData.append('rcNumber', rcNumber);
                formData.append('rcCertificate', certFile as Blob);
            }

            const response = await api.post('/kyc/submit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success) {
                toast.success('KYC details submitted successfully!');
                refetchProfile();
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'KYC submission failed. Please try again.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    // Render KYC status screens if already verified/pending
    if (currentKycStatus === 'pending' || currentKycStatus === 'submitted') {
        return (
            <div className="min-h-screen bg-slate-50 gradient-bg pb-20 pt-28 flex flex-col justify-center items-center px-6">
                <Card className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-10 text-center shadow-sm">
                    <CardContent className="p-0 space-y-6">
                        <div className="w-16 h-16 bg-blue-50 text-[#003399] rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                            <Clock size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Verification Pending</h3>
                        <p className="text-slate-500 font-semibold text-sm leading-relaxed">
                            Your Know-Your-Customer (KYC) identity documentation has been successfully received and is currently under administrative review. This takes up to 24 hours.
                        </p>
                        <Button onClick={() => router.push('/account')} className="bg-[#003399] w-full h-12 rounded-xl font-bold">
                            Go to Account
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (currentKycStatus === 'verified' || currentKycStatus === 'approved') {
        return (
            <div className="min-h-screen bg-slate-50 gradient-bg pb-20 pt-28 flex flex-col justify-center items-center px-6">
                <Card className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-10 text-center shadow-sm">
                    <CardContent className="p-0 space-y-6">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">KYC Verified</h3>
                        <p className="text-slate-550 font-semibold text-sm leading-relaxed">
                            Congratulations! Your identity verification has been approved. You now have full access to list unlimited vehicles, parts, and services.
                        </p>
                        <Button onClick={() => router.push('/account')} className="bg-[#003399] w-full h-12 rounded-xl font-bold">
                            Go to Account
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 pt-28 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-5 h-5 text-[#003399]" />
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Security Verification</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">KYC Identity Verification</h2>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/account')}
                    className="rounded-xl border-slate-200 text-slate-650 font-bold text-xs"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Account
                </Button>
            </div>

            <AnimatePresence mode="wait">
                {/* Step 1: Select Type */}
                {!kycType && (
                    <motion.div
                        key="picker"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        <Card 
                            onClick={() => setKycType('individual')}
                            className="bg-white border border-slate-100 hover:border-[#003399] rounded-3xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                        >
                            <CardContent className="p-0 space-y-6">
                                <div className="p-4 bg-blue-50 text-[#003399] rounded-2xl w-fit group-hover:scale-105 transition-transform">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-[#003399] transition-colors">Individual Member</h3>
                                    <p className="text-slate-500 font-semibold text-xs leading-relaxed">
                                        For individual vehicle sellers. Verify your passport/ID to submit private listings.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card 
                            onClick={() => setKycType('business')}
                            className="bg-white border border-slate-100 hover:border-violet-600 rounded-3xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                        >
                            <CardContent className="p-0 space-y-6">
                                <div className="p-4 bg-violet-50 text-violet-600 rounded-2xl w-fit group-hover:scale-105 transition-transform">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-violet-600 transition-colors">Registered Dealer</h3>
                                    <p className="text-slate-500 font-semibold text-xs leading-relaxed">
                                        For registered automotive businesses. Verify your CAC certificates for showroom tools.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Step 2: Form */}
                {kycType && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden bg-white">
                            <CardContent className="p-6 sm:p-10 space-y-6">
                                <button
                                    onClick={() => setKycType(null)}
                                    className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider transition-colors w-fit mb-4"
                                >
                                    <ChevronLeft size={14} />
                                    Change Type
                                </button>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Phone Number */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 ml-1">Phone Number *</label>
                                        <Input
                                            placeholder="+234 ..."
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="bg-slate-50 h-12"
                                        />
                                    </div>

                                    {/* Individual KYC Inputs */}
                                    {kycType === 'individual' && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-700 ml-1">Residential Address *</label>
                                                <Input
                                                    placeholder="Enter your house/office address"
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    className="bg-slate-50 h-12"
                                                />
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-700 ml-1">Identity Document Type *</label>
                                                    <select
                                                        value={idType}
                                                        onChange={(e) => setIdType(e.target.value)}
                                                        className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white shadow-sm"
                                                    >
                                                        <option value="">Select ID Type</option>
                                                        <option value="driver_license">Driver License</option>
                                                        <option value="national_id">National ID Card (NIN)</option>
                                                        <option value="international_passport">International Passport</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-700 ml-1">ID Card Number *</label>
                                                    <Input
                                                        placeholder="Enter ID number"
                                                        value={idNumber}
                                                        onChange={(e) => setIdNumber(e.target.value)}
                                                        className="bg-slate-50 h-12"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Business KYC Inputs */}
                                    {kycType === 'business' && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-700 ml-1">Business Name *</label>
                                                <Input
                                                    placeholder="Enter registered business name"
                                                    value={businessName}
                                                    onChange={(e) => setBusinessName(e.target.value)}
                                                    className="bg-slate-50 h-12"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-700 ml-1">Business Office Address *</label>
                                                <Input
                                                    placeholder="Enter office address"
                                                    value={businessAddress}
                                                    onChange={(e) => setBusinessAddress(e.target.value)}
                                                    className="bg-slate-50 h-12"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-700 ml-1">RC / BN Registration Number *</label>
                                                <Input
                                                    placeholder="e.g. RC1234567"
                                                    value={rcNumber}
                                                    onChange={(e) => setRcNumber(e.target.value)}
                                                    className="bg-slate-50 h-12"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* Upload Fields: Selfie Picture */}
                                    <div className="space-y-2 border-t border-slate-100 pt-6">
                                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Upload Files</h4>
                                        
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            {/* Selfie */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Selfie Photo *</label>
                                                <div 
                                                    onClick={() => document.getElementById('selfie-input')?.click()}
                                                    className="border-2 border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50 hover:bg-blue-50/10 text-center transition-all cursor-pointer aspect-video flex flex-col items-center justify-center relative overflow-hidden"
                                                >
                                                    {selfiePreview ? (
                                                        <img src={selfiePreview} alt="Selfie preview" className="absolute inset-0 w-full h-full object-cover" />
                                                    ) : (
                                                        <>
                                                            <Camera className="h-6 w-6 text-slate-400 mb-2" />
                                                            <span className="text-[10px] font-bold text-slate-605">Upload Selfie</span>
                                                        </>
                                                    )}
                                                    <input id="selfie-input" type="file" accept="image/*" onChange={handleSelfieChange} className="hidden" />
                                                </div>
                                            </div>

                                            {/* ID card or Certificate */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                                                    {kycType === 'individual' ? 'Identity Document File *' : 'RC Certificate File *'}
                                                </label>
                                                <div 
                                                    onClick={() => document.getElementById('doc-input')?.click()}
                                                    className="border-2 border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50 hover:bg-blue-50/10 text-center transition-all cursor-pointer aspect-video flex flex-col items-center justify-center relative overflow-hidden"
                                                >
                                                    {kycType === 'individual' ? (
                                                        idPreview ? (
                                                            <img src={idPreview} alt="ID preview" className="absolute inset-0 w-full h-full object-cover" />
                                                        ) : (
                                                            <>
                                                                <Upload className="h-6 w-6 text-slate-400 mb-2" />
                                                                <span className="text-[10px] font-bold text-slate-605">Upload ID Card</span>
                                                            </>
                                                        )
                                                    ) : (
                                                        certPreview ? (
                                                            <img src={certPreview} alt="Certificate preview" className="absolute inset-0 w-full h-full object-cover" />
                                                        ) : (
                                                            <>
                                                                <Upload className="h-6 w-6 text-slate-400 mb-2" />
                                                                <span className="text-[10px] font-bold text-slate-605">Upload CAC Cert</span>
                                                            </>
                                                        )
                                                    )}
                                                    <input 
                                                        id="doc-input" 
                                                        type="file" 
                                                        accept="image/*,application/pdf" 
                                                        onChange={kycType === 'individual' ? handleIdChange : handleCertChange} 
                                                        className="hidden" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-[#003399] hover:bg-blue-800 text-white rounded-xl h-12 font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 mt-6"
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" />Submitting details...</>
                                        ) : (
                                            'Submit Verification'
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
