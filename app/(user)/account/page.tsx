'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecuritySettings } from '@/components/dashboard/security-settings';
import { BillingSettings } from '@/components/dashboard/billing-settings';
import {
    User,
    ShieldCheck,
    CreditCard,
    Loader2,
    Mail,
    Phone,
    MapPin,
    Save,
    Building2,
    ShieldAlert,
    Facebook,
    Instagram,
    Twitter,
    Clock,
    Briefcase,
    Globe,
    Camera
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUserProfile, useUpdateVendorProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export default function AccountPage() {
    const { user } = useAuthStore();
    const isVerified = user?.roles?.some(role => role.toLowerCase() === 'verified_user');

    const { data: profile, isLoading } = useUserProfile();
    const updateRegisteredProfile = useUpdateVendorProfile();

    const [activeTab, setActiveTab] = useState('profile');

    const getFriendlyRoleName = (role?: string) => {
        if (!role) return 'Member';
        const normalized = role.toLowerCase();
        if (normalized === 'vendor' || normalized === 'dealer') return 'Verified Registered';
        if (normalized === 'verified_user') return 'Verified Member';
        return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const getFriendlyKycType = (type?: string) => {
        if (!type) return '';
        if (type.toLowerCase() === 'business') return 'Standard';
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const [registeredData, setRegisteredData] = useState({
        name: '',
        contact_number: '',
        address: '',
        years_in_business: '',
        business_description: '',
        opening_hours: '',
        facebook_url: '',
        instagram_url: '',
        x_url: '',
        tiktok_url: ''
    });

    useEffect(() => {
        if (profile) {
            setRegisteredData(prev => ({
                ...prev,
                name: profile.name || '',
                contact_number: (profile as any).kyc?.phoneNumber || (profile as any).phoneNumber || (profile as any).phone_number || (profile as any).contact_number || '',
                address: (profile as any).kyc?.address || (profile as any).address || '',
                ...((profile as any).vendorProfile ? {
                    years_in_business: (profile as any).vendorProfile.years_in_business ?? (profile as any).vendorProfile.yearsInBusiness ?? '',
                    business_description: (profile as any).vendorProfile.business_description ?? (profile as any).vendorProfile.businessDescription ?? '',
                    opening_hours: (profile as any).vendorProfile.opening_hours ?? (profile as any).vendorProfile.openingHours ?? '',
                    facebook_url: (profile as any).vendorProfile.facebook_url ??
                        (profile as any).vendorProfile.facebook ??
                        (profile as any).vendorProfile.socialMedia?.facebook ?? '',
                    instagram_url: (profile as any).vendorProfile.instagram_url ??
                        (profile as any).vendorProfile.instagram ??
                        (profile as any).vendorProfile.socialMedia?.instagram ?? '',
                    x_url: (profile as any).vendorProfile.x_url ??
                        (profile as any).vendorProfile.x ??
                        (profile as any).vendorProfile.socialMedia?.x ??
                        (profile as any).vendorProfile.socialMedia?.twitter ?? '',
                    tiktok_url: (profile as any).vendorProfile.tiktok_url ??
                        (profile as any).vendorProfile.tiktok ??
                        (profile as any).vendorProfile.socialMedia?.tiktok ?? ''
                } : {})
            }));

            setSelectedFile(null);
            setPreviewUrl('');

            const isUserVendor =
                ((profile as any)?.kyc?.type !== 'individual' && (profile as any)?.kyc?.type !== null) ||
                profile?.roles?.some(role => role.toLowerCase() === 'verified_user');

            if (!isUserVendor) {
                setActiveTab('security');
            }
        }
    }, [profile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRegisteredSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', registeredData.name || profile?.name || '');
        formData.append('contact_number', registeredData.contact_number);
        formData.append('address', registeredData.address);
        if (registeredData.years_in_business !== '') {
            formData.append('years_in_business', String(parseInt(String(registeredData.years_in_business), 10)));
        }
        formData.append('business_description', registeredData.business_description);
        formData.append('opening_hours', registeredData.opening_hours);
        formData.append('facebook_url', registeredData.facebook_url);
        formData.append('instagram_url', registeredData.instagram_url);
        formData.append('x_url', registeredData.x_url);
        formData.append('tiktok_url', registeredData.tiktok_url);

        if (selectedFile) {
            formData.append('profile_picture', selectedFile);
        }

        await updateRegisteredProfile.mutateAsync(formData);
    };

    const isVendor =
        ((profile as any)?.kyc?.type !== 'individual' && (profile as any)?.kyc?.type !== null) ||
        profile?.roles?.some(role => role.toLowerCase() === 'verified_user');

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">My Account</h2>
                    <p className="text-slate-500 font-medium">
                        Manage your membership credentials and security.
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-slate-100/50 rounded-2xl p-1 gap-1 h-14 w-full md:w-fit flex mb-8">
                    {isVendor && (
                        <TabsTrigger
                            value="profile"
                            className="flex-1 md:flex-none rounded-xl px-3 sm:px-8 h-12 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#003399]"
                        >
                            <User size={16} className="mr-2" />
                            Profile
                        </TabsTrigger>
                    )}
                    <TabsTrigger
                        value="security"
                        className="flex-1 md:flex-none rounded-xl px-3 sm:px-8 h-12 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#003399]"
                    >
                        <ShieldCheck size={16} className="mr-2" />
                        Security
                    </TabsTrigger>
                    {isVerified && (
                        <TabsTrigger
                            value="billing"
                            className="flex-1 md:flex-none rounded-xl px-3 sm:px-8 h-12 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#003399]"
                        >
                            <CreditCard size={16} className="mr-2" />
                            Billing
                        </TabsTrigger>
                    )}
                </TabsList>

                {isVendor && (
                    <TabsContent value="profile" className="focus-visible:outline-none">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-20">
                                <Loader2 className="h-8 w-8 animate-spin text-[#003399]" />
                            </div>
                        ) : (
                            <div className="space-y-10">
                                <Card className="border-slate-100 shadow-sm rounded-2xl sm:rounded-[2rem] overflow-hidden">
                                    <CardHeader className="p-4 sm:p-8 pb-4">
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left w-full">
                                            <div className="relative group cursor-pointer" onClick={() => document.getElementById('vendor-profile-input')?.click()}>
                                                <Avatar className="h-24 w-24 rounded-3xl border-4 border-slate-50 shadow-sm transition-all group-hover:opacity-95">
                                                    <AvatarImage src={previewUrl || (profile as any)?.vendorProfile?.profilePicture || (profile as any)?.vendorProfile?.picture || (profile as any)?.kyc?.selfiePicture || ''} className="object-cover" />
                                                    <AvatarFallback className="bg-[#003399] text-white text-2xl font-bold uppercase">
                                                        {profile?.name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Camera className="text-white w-6 h-6" />
                                                </div>
                                                <input
                                                    type="file"
                                                    id="vendor-profile-input"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                                <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                                                    {(profile as any)?.kycStatus === 'verified' ? (
                                                        <ShieldCheck className="text-emerald-500 h-5 w-5" />
                                                    ) : (
                                                        <ShieldAlert className="text-amber-500 h-5 w-5" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                <h3 className="text-2xl font-black text-slate-900">{profile?.name}</h3>
                                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                                                    <Badge className="bg-blue-50 text-[#003399] border-0 text-[10px] font-black uppercase tracking-widest px-2">
                                                        {getFriendlyRoleName(profile?.roles?.[0])}
                                                    </Badge>
                                                    <Badge className={cn(
                                                        "border-0 text-[10px] font-black uppercase tracking-widest px-2",
                                                        (profile as any)?.kycStatus === 'verified' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                                    )}>
                                                        KYC {(profile as any)?.kycStatus}
                                                    </Badge>
                                                    {(profile as any)?.kyc?.type && (
                                                        <Badge className="bg-slate-100 text-slate-600 border-0 text-[10px] font-black uppercase tracking-widest px-2">
                                                            Type: {getFriendlyKycType((profile as any).kyc.type)}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-4 sm:p-8 pt-2">
                                        <form onSubmit={handleRegisteredSubmit} className="grid gap-6 md:grid-cols-2">

                                            {/* Name */}
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        value={registeredData.name}
                                                        disabled
                                                        className="pl-11 h-12 rounded-xl bg-slate-100 border-transparent font-semibold cursor-not-allowed text-slate-500"
                                                        placeholder="Enter your full name"
                                                    />
                                                </div>
                                            </div>

                                            {/* Email (read-only) */}
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Identifier</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        type="email"
                                                        value={profile?.email || ''}
                                                        disabled
                                                        className="pl-11 h-12 rounded-xl bg-slate-100 border-transparent font-semibold cursor-not-allowed text-slate-500"
                                                    />
                                                </div>
                                            </div>

                                            {/* Contact Number */}
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Contact Number</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        value={registeredData.contact_number}
                                                        onChange={(e) => setRegisteredData({ ...registeredData, contact_number: e.target.value })}
                                                        className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
                                                        placeholder="+234 ..."
                                                    />
                                                </div>
                                            </div>

                                            {/* Address */}
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Address</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        value={registeredData.address}
                                                        onChange={(e) => setRegisteredData({ ...registeredData, address: e.target.value })}
                                                        className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
                                                        placeholder="City, State, Country"
                                                    />
                                                </div>
                                            </div>

                                            {/* Registered-only fields */}
                                            {isVendor && (
                                                <>
                                                    <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Building2 className="text-[#003399] h-4 w-4" />
                                                            <span className="text-sm font-bold text-slate-700">Registered Details</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Years of Experience</Label>
                                                        <div className="relative">
                                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                            <Input
                                                                type="number"
                                                                value={registeredData.years_in_business}
                                                                onChange={(e) => setRegisteredData({ ...registeredData, years_in_business: e.target.value })}
                                                                className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
                                                                placeholder="e.g. 5"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Opening Hours</Label>
                                                        <div className="relative">
                                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                            <Input
                                                                value={registeredData.opening_hours}
                                                                onChange={(e) => setRegisteredData({ ...registeredData, opening_hours: e.target.value })}
                                                                className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
                                                                placeholder="e.g. Mon-Fri: 9am-5pm"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="md:col-span-2 space-y-2">
                                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Registered Overview</Label>
                                                        <Textarea
                                                            value={registeredData.business_description}
                                                            onChange={(e) => setRegisteredData({ ...registeredData, business_description: e.target.value })}
                                                            className="h-32 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
                                                            placeholder="Describe your services and specialization..."
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Facebook URL</Label>
                                                        <div className="relative">
                                                            <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                            <Input type="url" value={registeredData.facebook_url}
                                                                onChange={(e) => setRegisteredData({ ...registeredData, facebook_url: e.target.value })}
                                                                className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
                                                                placeholder="https://facebook.com/your-brand" />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Instagram URL</Label>
                                                        <div className="relative">
                                                            <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                            <Input type="url" value={registeredData.instagram_url}
                                                                onChange={(e) => setRegisteredData({ ...registeredData, instagram_url: e.target.value })}
                                                                className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
                                                                placeholder="https://instagram.com/your-brand" />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">X (Twitter) URL</Label>
                                                        <div className="relative">
                                                            <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                            <Input type="url" value={registeredData.x_url}
                                                                onChange={(e) => setRegisteredData({ ...registeredData, x_url: e.target.value })}
                                                                className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
                                                                placeholder="https://x.com/your-brand" />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">TikTok URL</Label>
                                                        <div className="relative">
                                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                            <Input type="url" value={registeredData.tiktok_url}
                                                                onChange={(e) => setRegisteredData({ ...registeredData, tiktok_url: e.target.value })}
                                                                className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
                                                                placeholder="https://tiktok.com/@your-brand" />
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Submit */}
                                            <div className="md:col-span-2 flex justify-end pt-4">
                                                <Button
                                                    type="submit"
                                                    disabled={updateRegisteredProfile.isPending}
                                                    className="w-full sm:w-auto bg-[#003399] hover:bg-blue-800 rounded-xl px-8 font-bold shadow-lg shadow-blue-900/10 h-12 transition-all"
                                                >
                                                    {updateRegisteredProfile.isPending ? (
                                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                                                    ) : (
                                                        <><Save className="mr-2 h-4 w-4" />Update Profile</>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </TabsContent>
                )}

                <TabsContent value="security" className="focus-visible:outline-none">
                    <SecuritySettings />
                </TabsContent>

                {isVerified && (
                    <TabsContent value="billing" className="focus-visible:outline-none">
                        <BillingSettings />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
