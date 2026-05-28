import { useState, useEffect } from 'react';
import { useUserProfile, useUpdateVendorProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Mail, Phone, MapPin, Save, Building2, ShieldCheck, ShieldAlert, Facebook, Instagram, Twitter, Clock, Briefcase, Globe } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export function ProfileSettings() {
    const { data: profile, isLoading } = useUserProfile();
    const updateRegisteredProfile = useUpdateVendorProfile();

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
                contact_number: (profile as any).kyc?.phoneNumber || '',
                address: (profile as any).kyc?.address || '',
                ...((profile as any).vendorProfile ? {
                    years_in_business: (profile as any).vendorProfile.years_in_business ?? (profile as any).vendorProfile.yearsInBusiness ?? '',
                    business_description: (profile as any).vendorProfile.business_description ?? (profile as any).vendorProfile.businessDescription ?? '',
                    opening_hours: (profile as any).vendorProfile.opening_hours ?? (profile as any).vendorProfile.openingHours ?? '',
                    facebook_url: (profile as any).vendorProfile.facebook_url ?? (profile as any).vendorProfile.facebookUrl ?? '',
                    instagram_url: (profile as any).vendorProfile.instagram_url ?? (profile as any).vendorProfile.instagramUrl ?? '',
                    x_url: (profile as any).vendorProfile.x_url ?? (profile as any).vendorProfile.xUrl ?? '',
                    tiktok_url: (profile as any).vendorProfile.tiktok_url ?? (profile as any).vendorProfile.tiktokUrl ?? ''
                } : {})
            }));
        }
    }, [profile]);

    const handleRegisteredSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...registeredData,
            years_in_business: registeredData.years_in_business
                ? parseInt(String(registeredData.years_in_business), 10)
                : null
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

    const isVendor = (profile as any)?.kyc?.type !== 'individual' && (profile as any)?.kyc?.type !== null;

    return (
        <div className="space-y-10">
            <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24 rounded-3xl border-4 border-slate-50 shadow-sm">
                                <AvatarImage src={(profile as any)?.kyc?.selfiePicture || ''} />
                                <AvatarFallback className="bg-[#003399] text-white text-2xl font-bold uppercase">
                                    {profile?.name?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                                {(profile as any)?.kycStatus === 'verified' ? (
                                    <ShieldCheck className="text-emerald-500 h-5 w-5" />
                                ) : (
                                    <ShieldAlert className="text-amber-500 h-5 w-5" />
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900">{profile?.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
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

                <CardContent className="p-8 pt-2">
                    <form onSubmit={handleRegisteredSubmit} className="grid gap-6 md:grid-cols-2">

                        {/* Name */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    value={registeredData.name}
                                    onChange={(e) => setRegisteredData({ ...registeredData, name: e.target.value })}
                                    className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
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

                        {/* Vendor-only fields */}
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
                                className="bg-[#003399] hover:bg-blue-800 rounded-xl px-8 font-bold shadow-lg shadow-blue-900/10 h-12 transition-all"
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
    );
}
