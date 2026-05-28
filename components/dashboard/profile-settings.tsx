import { useState, useEffect } from 'react';
import { useUserProfile, useUpdateProfile, useUpdateVendorProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Mail, Phone, MapPin, Save, Building2, ShieldCheck, ShieldAlert, FileText, Facebook, Instagram, Twitter, Clock, Briefcase, Globe } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ProfileSettings() {
    const { data: profile, isLoading } = useUserProfile();
    const updateProfile = useUpdateProfile();
    const updateRegisteredProfile = useUpdateVendorProfile();

    const isVerified = profile?.roles?.some(role => role.toLowerCase() === 'verified_user');

    const getFriendlyRoleName = (role?: string) => {
        if (!role) return 'Member';
        const normalized = role.toLowerCase();
        if (normalized === 'vendor' || normalized === 'dealer') {
            return 'Verified Registered';
        }
        if (normalized === 'verified_user') {
            return 'Verified Member';
        }
        return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const getFriendlyKycType = (type?: string) => {
        if (!type) return '';
        const normalized = type.toLowerCase();
        if (normalized === 'business') {
            return 'Standard';
        }
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: ''
    });

    const [registeredData, setRegisteredData] = useState({
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
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                phoneNumber: profile.kyc?.phoneNumber || '',
                address: profile.kyc?.address || ''
            });

            if (profile.vendorProfile) {
                setRegisteredData({
                    years_in_business: profile.vendorProfile.years_in_business ?? profile.vendorProfile.yearsInBusiness ?? '',
                    business_description: profile.vendorProfile.business_description ?? profile.vendorProfile.businessDescription ?? '',
                    opening_hours: profile.vendorProfile.opening_hours ?? profile.vendorProfile.openingHours ?? '',
                    facebook_url: profile.vendorProfile.facebook_url ?? profile.vendorProfile.facebookUrl ?? '',
                    instagram_url: profile.vendorProfile.instagram_url ?? profile.vendorProfile.instagramUrl ?? '',
                    x_url: profile.vendorProfile.x_url ?? profile.vendorProfile.xUrl ?? '',
                    tiktok_url: profile.vendorProfile.tiktok_url ?? profile.vendorProfile.tiktokUrl ?? ''
                });
            }
        }
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateProfile.mutateAsync(formData);
    };

    const handleRegisteredSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isVerified) {
            toast.error('Action Restricted', {
                description: 'You must be a verified user to update registered details.'
            });
            return;
        }

        const payload = {
            ...registeredData,
            years_in_business: registeredData.years_in_business ? parseInt(String(registeredData.years_in_business), 10) : null
        };

        await updateRegisteredProfile.mutateAsync(payload);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#003399]" />
            </div>
        );
    }

    const isVendor = profile?.kyc?.type !== 'individual' && profile?.kyc?.type !== null;

    return (
        <div className="space-y-10">
            {/* Profile Overview Card */}
            <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <Avatar className="h-24 w-24 rounded-3xl border-4 border-slate-50 shadow-sm">
                                    <AvatarImage src={profile?.kyc?.selfiePicture || ''} />
                                    <AvatarFallback className="bg-[#003399] text-white text-2xl font-bold uppercase">
                                        {profile?.name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                                    {profile?.kycStatus === 'verified' ? (
                                        <ShieldCheck className="text-emerald-500 h-5 w-5" />
                                    ) : (
                                        <ShieldAlert className="text-amber-500 h-5 w-5" />
                                    )}
                                </div>
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black text-slate-900">{profile?.name}</CardTitle>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <Badge className="bg-blue-50 text-[#003399] border-0 text-[10px] font-black uppercase tracking-widest px-2">
                                        {getFriendlyRoleName(profile?.roles?.[0])}
                                    </Badge>
                                    <Badge className={cn(
                                        "border-0 text-[10px] font-black uppercase tracking-widest px-2",
                                        profile?.kycStatus === 'verified' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                    )}>
                                        KYC {profile?.kycStatus}
                                    </Badge>
                                    {profile?.kyc?.type && (
                                        <Badge className="bg-slate-100 text-slate-600 border-0 text-[10px] font-black uppercase tracking-widest px-2">
                                            Type: {getFriendlyKycType(profile.kyc.type)}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs border-slate-200 h-10 px-6">
                            Change Protocol Avatar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Identifier</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="pl-11 h-12 rounded-xl bg-slate-100 border-transparent font-semibold cursor-not-allowed text-slate-500"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Contact Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
                                    placeholder="+234 ..."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Primary Residence</Label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
                                    placeholder="City, State, Country"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2 flex justify-end pt-4">
                            <Button
                                type="submit"
                                disabled={updateProfile.isPending}
                                className="bg-[#003399] hover:bg-blue-800 rounded-xl px-8 font-bold shadow-lg shadow-blue-900/10 h-12 transition-all"
                            >
                                {updateProfile.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Synchronizing...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Update Personal Profile
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Registered / Account Info Card (Conditional) */}
            {isVendor && (
                <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Building2 className="text-[#003399] h-5 w-5" />
                            <CardTitle className="text-xl font-bold text-slate-900">Registered Credentials</CardTitle>
                        </div>
                        <CardDescription className="text-slate-500 font-medium pl-8">
                            Management of organizational parameters and verified partner entities.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleRegisteredSubmit} className="grid gap-6 md:grid-cols-2">
                            {!isVerified && (
                                <div className="md:col-span-2 bg-amber-50/60 border border-amber-200/60 rounded-2xl p-5 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
                                    <div className="bg-amber-100 p-2 rounded-xl text-amber-600 shrink-0">
                                        <ShieldAlert className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-amber-900 tracking-tight">Verification Required</h4>
                                        <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                            Your partner account is not yet fully verified. Registered profile updates are restricted until your account is upgraded to verified_user.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Years of Experience</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="number"
                                        value={registeredData.years_in_business}
                                        onChange={(e) => setRegisteredData({ ...registeredData, years_in_business: e.target.value })}
                                        disabled={!isVerified}
                                        className={cn(
                                            "pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold transition-all",
                                            !isVerified && "opacity-60 cursor-not-allowed bg-slate-100"
                                        )}
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
                                        disabled={!isVerified}
                                        className={cn(
                                            "pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold transition-all",
                                            !isVerified && "opacity-60 cursor-not-allowed bg-slate-100"
                                        )}
                                        placeholder="e.g. Mon-Fri: 9am-5pm"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Registered Overview</Label>
                                <Textarea
                                    value={registeredData.business_description}
                                    onChange={(e) => setRegisteredData({ ...registeredData, business_description: e.target.value })}
                                    disabled={!isVerified}
                                    className={cn(
                                        "h-32 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold transition-all",
                                        !isVerified && "opacity-60 cursor-not-allowed bg-slate-100"
                                    )}
                                    placeholder="Provide a detailed description of your registered profile, services, and specialization..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Facebook URL</Label>
                                <div className="relative">
                                    <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="url"
                                        value={registeredData.facebook_url}
                                        onChange={(e) => setRegisteredData({ ...registeredData, facebook_url: e.target.value })}
                                        disabled={!isVerified}
                                        className={cn(
                                            "pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold transition-all",
                                            !isVerified && "opacity-60 cursor-not-allowed bg-slate-100"
                                        )}
                                        placeholder="https://facebook.com/your-brand"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Instagram URL</Label>
                                <div className="relative">
                                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="url"
                                        value={registeredData.instagram_url}
                                        onChange={(e) => setRegisteredData({ ...registeredData, instagram_url: e.target.value })}
                                        disabled={!isVerified}
                                        className={cn(
                                            "pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold transition-all",
                                            !isVerified && "opacity-60 cursor-not-allowed bg-slate-100"
                                        )}
                                        placeholder="https://instagram.com/your-brand"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">X (Twitter) URL</Label>
                                <div className="relative">
                                    <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="url"
                                        value={registeredData.x_url}
                                        onChange={(e) => setRegisteredData({ ...registeredData, x_url: e.target.value })}
                                        disabled={!isVerified}
                                        className={cn(
                                            "pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold transition-all",
                                            !isVerified && "opacity-60 cursor-not-allowed bg-slate-100"
                                        )}
                                        placeholder="https://x.com/your-brand"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">TikTok URL</Label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="url"
                                        value={registeredData.tiktok_url}
                                        onChange={(e) => setRegisteredData({ ...registeredData, tiktok_url: e.target.value })}
                                        disabled={!isVerified}
                                        className={cn(
                                            "pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold transition-all",
                                            !isVerified && "opacity-60 cursor-not-allowed bg-slate-100"
                                        )}
                                        placeholder="https://tiktok.com/@your-brand"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={updateRegisteredProfile.isPending || !isVerified}
                                    className="bg-slate-900 hover:bg-slate-800 rounded-xl px-8 font-bold shadow-lg shadow-slate-900/10 h-11 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updateRegisteredProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Registered Profile"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
