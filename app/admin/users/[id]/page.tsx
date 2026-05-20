'use client';

import { 
    ChevronRight, 
    Mail, 
    Phone, 
    MapPin, 
    ShieldCheck, 
    UserX,
    FileText,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Info,
    User,
    Clock,
    Key,
    Camera,
    CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ActionConfirmationModal } from '@/components/modals/ActionConfirmationModal';
import { useUserDetails, useAssignUserRole, useRemoveUserRole, useRoles, useUpdateUserStatus, useResetPassword } from '@/hooks/useUsers';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { 
    Plus, 
    Trash2, 
    Shield, 
    Loader2,
    Settings,
    Eye
} from 'lucide-react';
import { useState } from 'react';
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog';

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;

export default function UserDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: user, isLoading } = useUserDetails(id as string);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

    const assignRole = useAssignUserRole();
    const removeRole = useRemoveUserRole();
    const updateStatus = useUpdateUserStatus();
    const resetPassword = useResetPassword();
    const { data: allRoles } = useRoles();

    const handleAssignRole = async () => {
        if (!selectedRole) return;
        try {
            await assignRole.mutateAsync({ userId: id as string, role: selectedRole });
            toast.success('Role assigned successfully');
            setSelectedRole('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to assign role');
        }
    };

    const handleRemoveRole = async (role: string) => {
        try {
            await removeRole.mutateAsync({ userId: id as string, role });
            toast.success('Role removed successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to remove role');
        }
    };

    const handleUpdateStatus = async (status: string) => {
        try {
            await updateStatus.mutateAsync({ id: id as string, status });
            toast.success(`User status updated to ${status}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };
    const handleResetPassword = async () => {
        try {
            await resetPassword.mutateAsync(id as string);
            toast.success('Password reset notification sent successfully');
            setShowResetConfirm(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send password reset');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003399]"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20">
                <h3 className="text-xl font-bold text-slate-900">User not found</h3>
                <Button variant="link" onClick={() => router.back()} className="text-[#003399]">Go back</Button>
            </div>
        );
    }

    return (
        <div className="pb-20">
            <div className="max-w-6xl mx-auto space-y-8 text-slate-900">
                {/* Breadcrumbs & Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                            <Link href="/admin/users" className="hover:text-[#003399] transition-colors">Users</Link>
                            <ChevronRight size={10} />
                            <span className="text-[#003399]">User Details</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">User Details</h1>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-[#003399]/10 text-[#003399] border-0 font-bold uppercase text-[9px] tracking-widest px-2.5 py-1 pointer-events-none">
                                    ID: {user.displayId}
                                </Badge>
                                {user.status === 'active' ? (
                                    <Badge className="bg-emerald-50 text-emerald-600 border-0 font-bold uppercase text-[9px] tracking-widest px-2.5 py-1 pointer-events-none">
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge className="bg-slate-100 text-slate-500 border-0 font-bold uppercase text-[9px] tracking-widest px-2.5 py-1 pointer-events-none">
                                        {user.status}
                                    </Badge>
                                )}
                                {user.kycVerified ? (
                                    <Badge className="bg-blue-50 text-blue-600 border-0 font-bold uppercase text-[9px] tracking-widest px-2.5 py-1 pointer-events-none">
                                        KYC Verified
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-50 text-amber-600 border-0 font-bold uppercase text-[9px] tracking-widest px-2.5 py-1 pointer-events-none">
                                        KYC Unverified
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Header Card */}
                <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardContent className="p-8">
                        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                            {/* User Info */}
                            <div className="flex items-center gap-6 min-w-[300px]">
                                <Avatar className="h-20 w-20 rounded-2xl border border-slate-100 shadow-sm">
                                    {user.profile.avatar && <AvatarImage src={`${STORAGE_URL}${user.profile.avatar}`} className="object-cover" />}
                                    <AvatarFallback className="bg-slate-50 text-[#003399] font-bold text-2xl">{user.profile.fullName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1.5">
                                    <h2 className="text-lg font-bold text-slate-900 leading-tight">{user.profile.fullName}</h2>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Mail size={12} className="text-slate-400" />
                                            <span className="text-[11px] font-medium">{user.profile.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Phone size={12} className="text-slate-400" />
                                            <span className="text-[11px] font-medium">{user.profile.phoneNumber || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <MapPin size={12} className="text-slate-400" />
                                            <span className="text-[11px] font-medium">{user.profile.address || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 lg:hidden w-full">
                                {user.status === 'active' ? (
                                    <Badge className="bg-emerald-50 text-emerald-600 border-0 px-2 py-0.5 text-[9px]"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" /> Active</Badge>
                                ) : (
                                    <Badge className="bg-slate-100 text-slate-500 border-0 px-2 py-0.5 text-[9px]"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" /> {user.status}</Badge>
                                )}
                                {user.kycVerified ? (
                                    <Badge className="bg-blue-50 text-blue-600 border-0 px-2 py-0.5 text-[9px]"><ShieldCheck size={10} className="mr-1" /> Verified</Badge>
                                ) : (
                                    <Badge className="bg-amber-50 text-amber-600 border-0 px-2 py-0.5 text-[9px]"><XCircle size={10} className="mr-1" /> Unverified</Badge>
                                )}
                            </div>

                            <div className="w-full lg:w-px h-px lg:h-24 bg-slate-100" />

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-6 flex-1 w-full">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Account Type</p>
                                    <p className="text-sm font-bold text-slate-900">{user.profile.accountType}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date Joined</p>
                                    <p className="text-sm font-bold text-slate-900">{format(new Date(user.profile.dateJoined), 'dd MMM yyyy')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Total Bids</p>
                                    <p className="text-sm font-bold text-slate-900">{user.activityOverview.vehiclesPlaced}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Total Listings</p>
                                    <p className="text-sm font-bold text-slate-900">{user.activityOverview.totalListings}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Authorized Roles</p>
                                    <div className="flex flex-wrap gap-1">
                                        {user.roles && user.roles.length > 0 ? (
                                            user.roles.map((role: string) => (
                                                <Badge key={role} variant="secondary" className="bg-slate-100 text-[#003399] text-[9px] font-black uppercase px-2 py-0 border-0">
                                                    {role.replace('_', ' ')}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-xs font-bold text-slate-900 uppercase">Standard User</p>
                                        )}
                                    </div>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Last Active</p>
                                    <p className="text-sm font-bold text-emerald-600">
                                        {user.profile.lastActive ? `Today, ${format(new Date(user.profile.lastActive), 'h:mm a')}` : 'Never'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="hidden lg:flex gap-2 mt-4 pt-4 border-t border-slate-50">
                            {user.status === 'active' ? (
                                <Badge className="bg-emerald-50 text-emerald-600 border-0 px-3 py-1 font-bold text-[10px] tracking-wide"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" /> Active</Badge>
                            ) : (
                                <Badge className="bg-slate-100 text-slate-500 border-0 px-3 py-1 font-bold text-[10px] tracking-wide"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" /> {user.status}</Badge>
                            )}
                            {user.kycVerified ? (
                                <Badge className="bg-blue-50 text-blue-600 border-0 px-3 py-1 font-bold text-[10px] tracking-wide"><ShieldCheck size={12} className="mr-1.5" /> Verified</Badge>
                            ) : (
                                <Badge className="bg-amber-50 text-amber-600 border-0 px-3 py-1 font-bold text-[10px] tracking-wide"><XCircle size={12} className="mr-1.5" /> Unverified</Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Information */}
                <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="flex flex-row items-center justify-between p-6 px-8 pb-4">
                        <CardTitle className="text-base font-bold text-slate-900">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                            {[
                                { label: 'Full Name', value: user.personalInformation?.fullName || 'N/A' },
                                { label: 'Email Address', value: user.personalInformation?.emailAddress || 'N/A' },
                                { label: 'Phone Number', value: user.personalInformation?.phoneNumber || 'N/A' },
                                { label: 'Residential Address', value: user.personalInformation?.residentialAddress || 'N/A' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{item.label}</p>
                                    <p className="text-sm font-bold text-slate-900">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Account Information */}
                <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="p-6 px-8 pb-4">
                        <CardTitle className="text-base font-bold text-slate-900">Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                            {/* Account Information Items */}
                            {[
                                { label: 'User ID', value: user.accountInformation.userId },
                                { label: 'Account Type', value: user.accountInformation.accountType },
                                { label: 'Registration Date', value: format(new Date(user.accountInformation.registrationDate), 'dd MMMM yyyy, hh:mm a') },
                                { label: 'Last Login', value: user.accountInformation.lastLogin ? `Today, ${format(new Date(user.accountInformation.lastLogin), 'hh:mm a')}` : 'Never', color: user.accountInformation.lastLogin ? 'text-emerald-600' : 'text-slate-400' },
                                { label: 'Email Verification', value: user.accountInformation.emailVerification, verified: user.accountInformation.emailVerification === 'Verified' },
                                { label: 'Phone Verification', value: user.accountInformation.phoneVerification, verified: user.accountInformation.phoneVerification === 'Verified' },
                                { label: 'Account Status', value: user.accountInformation.accountStatus, status: true },
                            ].map((item, i) => (
                                <div key={i}>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{item.label}</p>
                                    <div className="flex items-center gap-2">
                                        {item.verified !== undefined && (
                                            <div className={cn("w-3 h-3 rounded-full flex items-center justify-center", item.verified ? 'bg-emerald-500' : 'bg-rose-500')}>
                                                <CheckCircle2 size={8} className="text-white" />
                                            </div>
                                        )}
                                        <p className={cn("text-sm font-bold", item.color || "text-slate-900", item.status && "text-emerald-600")}>{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-slate-50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Status Protocol</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { label: 'Activate Account', value: 'active', bg: 'bg-emerald-50', text: 'text-emerald-600', icon: CheckCircle2 },
                                            { label: 'Suspend Access', value: 'suspended', bg: 'bg-rose-50', text: 'text-rose-600', icon: UserX },
                                            { label: 'Under Review', value: 'under_review', bg: 'bg-amber-50', text: 'text-amber-600', icon: Info }
                                        ].map((status) => (
                                            <Button
                                                key={status.value}
                                                variant="ghost"
                                                onClick={() => handleUpdateStatus(status.value)}
                                                disabled={updateStatus.isPending || user.accountInformation.accountStatus.toLowerCase() === status.value.toLowerCase()}
                                                className={cn(
                                                    "h-11 rounded-xl px-4 font-bold text-xs gap-2 transition-all",
                                                    status.bg, status.text,
                                                    user.accountInformation.accountStatus.toLowerCase() === status.value.toLowerCase() && "ring-2 ring-offset-2 ring-slate-100 opacity-50"
                                                )}
                                            >
                                                <status.icon size={14} />
                                                {status.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Administrative Actions</p>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowResetConfirm(true)}
                                        disabled={resetPassword.isPending}
                                        className="h-11 rounded-xl px-6 font-bold text-xs gap-2 transition-all bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                                    >
                                        {resetPassword.isPending ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
                                        Force Password Reset
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Password Reset Confirmation */}
                        <ActionConfirmationModal
                            isOpen={showResetConfirm}
                            onClose={() => setShowResetConfirm(false)}
                            onConfirm={handleResetPassword}
                            title="Confirm Password Reset"
                            description={`Are you sure you want to force a password reset for ${user.profile.fullName}? Data protocol will send a secure reset notification to ${user.profile.email}.`}
                            confirmText="Force Reset"
                            variant="default"
                            isLoading={resetPassword.isPending}
                        />
                    </CardContent>
                </Card>

                {/* Role Management */}
                <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="flex flex-row items-center justify-between p-6 px-8 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-50 text-[#003399]">
                                <Shield size={18} />
                            </div>
                            <CardTitle className="text-base font-bold text-slate-900">Access Roles & Clearances</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="flex flex-wrap gap-2">
                            {(user.roles || []).length > 0 ? (
                                user.roles?.map((role: string) => (
                                    <Badge key={role} className="bg-slate-50 text-slate-700 border border-slate-100 px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center gap-2">
                                        {role.replace('_', ' ')}
                                        <button 
                                            onClick={() => handleRemoveRole(role)}
                                            disabled={removeRole.isPending}
                                            className="hover:text-rose-500 transition-colors disabled:opacity-30"
                                        >
                                            {removeRole.isPending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                        </button>
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400 font-medium italic">No custom roles assigned. Default protocol applies.</p>
                            )}
                        </div>

                        <div className="pt-6 border-t border-slate-50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Assign New Authorization</p>
                            <div className="flex gap-3 max-w-md">
                                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v || '')}>
                                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-transparent font-bold text-xs flex-1">
                                        <SelectValue placeholder="Select role to provision" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-100">
                                        {allRoles?.filter((r: any) => !(user.roles || []).includes(r.name)).map((role: any) => (
                                            <SelectItem key={role.id} value={role.name} className="capitalize font-bold text-xs">{role.name.replace('_', ' ')}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button 
                                    onClick={handleAssignRole}
                                    disabled={!selectedRole || assignRole.isPending}
                                    className="h-12 px-6 rounded-xl bg-[#003399] hover:bg-blue-800 font-bold text-xs shadow-lg shadow-blue-900/10"
                                >
                                    {assignRole.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={16} className="mr-2" />}
                                    Assign 
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* KYC Status */}
                <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="flex flex-row items-center justify-between p-6 px-8 border-b border-slate-50">
                        <CardTitle className="text-base font-bold text-slate-900">KYC Status</CardTitle>
                        {user.kycVerified ? (
                            <Badge className="bg-emerald-50 text-emerald-600 border-0 px-3 py-1 font-bold text-[10px] tracking-wide pointer-events-none">
                                <ShieldCheck size={12} className="mr-1.5" /> Verified
                            </Badge>
                        ) : (
                            <Badge className="bg-amber-50 text-amber-600 border-0 px-3 py-1 font-bold text-[10px] tracking-wide pointer-events-none">
                                <XCircle size={12} className="mr-1.5" /> Unverified
                            </Badge>
                        )}
                    </CardHeader>
                    <CardContent className="p-8">
                        {!user.kycStatus ? (
                            <div className="py-12 text-center text-slate-500">
                                <UserX size={48} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-sm font-bold text-slate-900 mb-1">No KYC Submitted</p>
                                <p className="text-xs">This user has not submitted any KYC documents for verification yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Metadata Grid */}
                                {(() => {
                                    const kycData = user.kycStatus;
                                    const verificationDetails = kycData?.verificationDetails || kycData;
                                    
                                    const selfie = verificationDetails?.selfiePicture || kycData?.selfiePicture;
                                    const idImage = verificationDetails?.individualInfo?.idImage || verificationDetails?.businessInfo?.rcCertificate || kycData?.idImage || kycData?.rcCertificate;
                                    const idType = verificationDetails?.individualInfo?.idType || (verificationDetails?.businessInfo ? 'Business RC' : null) || kycData?.idType;
                                    const idNumber = verificationDetails?.individualInfo?.idNumber || verificationDetails?.businessInfo?.rcNumber || kycData?.idNumber;
                                    const address = verificationDetails?.individualInfo?.address || verificationDetails?.businessInfo?.businessAddress || kycData?.address;
                                    const phone = verificationDetails?.phoneNumber || kycData?.phoneNumber;
                                    
                                    const getImageUrl = (url: string | null) => {
                                        if (!url) return '';
                                        if (url.startsWith('http') || url.startsWith('data:')) return url;
                                        return `${STORAGE_URL}${url}`;
                                    };

                                    return (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                                <div className="space-y-1.5">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Verified Phone</p>
                                                    <p className="text-sm font-bold text-slate-900">{phone || 'N/A'}</p>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Residential Address</p>
                                                    <p className="text-sm font-bold text-slate-900">{address || 'N/A'}</p>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Identification Type</p>
                                                    {idType ? (
                                                        <Badge variant="outline" className="rounded-md border-emerald-100 bg-emerald-50/30 text-emerald-700 font-bold text-[10px] uppercase">
                                                            {idType}
                                                        </Badge>
                                                    ) : (
                                                        <p className="text-sm font-bold text-slate-900">N/A</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">ID Document Number</p>
                                                    <p className="text-sm font-bold text-slate-900 font-mono">{idNumber || 'N/A'}</p>
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
                                                        <div 
                                                            className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 ring-1 ring-slate-200 group relative shadow-sm cursor-pointer"
                                                            onClick={() => selfie && setPreviewImage({ url: getImageUrl(selfie), title: `${user.profile.fullName} - Portrait Selfie` })}
                                                        >
                                                            {selfie ? (
                                                                <>
                                                                    <img 
                                                                        src={getImageUrl(selfie)} 
                                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                                                        alt="Identity Selfie" 
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white ring-1 ring-white/30 transform scale-90 group-hover:scale-100 transition-all duration-300">
                                                                            <Eye size={18} />
                                                                        </div>
                                                                        <span className="text-white text-[10px] font-black uppercase tracking-widest bg-slate-900/60 py-1.5 px-3 rounded-lg backdrop-blur-sm">Click to Preview</span>
                                                                    </div>
                                                                </>
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
                                                        <div 
                                                            className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 ring-1 ring-slate-200 group relative shadow-sm cursor-pointer"
                                                            onClick={() => idImage && setPreviewImage({ url: getImageUrl(idImage), title: `${user.profile.fullName} - Identification Document` })}
                                                        >
                                                            {idImage ? (
                                                                <>
                                                                    <img 
                                                                        src={getImageUrl(idImage)} 
                                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                                                        alt="Identification Document" 
                                                                    />
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white ring-1 ring-white/30 transform scale-90 group-hover:scale-100 transition-all duration-300">
                                                                            <Eye size={18} />
                                                                        </div>
                                                                        <span className="text-white text-[10px] font-black uppercase tracking-widest bg-slate-900/60 py-1.5 px-3 rounded-lg backdrop-blur-sm">Click to Preview</span>
                                                                    </div>
                                                                </>
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
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Activity Overview */}
                <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="p-6 px-8 pb-4 border-b border-slate-50">
                        <CardTitle className="text-base font-bold text-slate-900">Activity Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                { label: 'Total Bids', value: user.activityOverview.vehiclesPlaced || '0', color: 'text-blue-600', bg: 'bg-blue-50' },
                                { label: 'Items Listed', value: user.activityOverview.totalListings || '0', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                { label: 'Messages', value: user.activityOverview.messagesSent || '0', color: 'text-teal-600', bg: 'bg-teal-50' },
                                { label: 'Favorites', value: user.activityOverview.favoritesCount || '0', color: 'text-orange-600', bg: 'bg-orange-50' },
                                { label: 'Reviews', value: user.activityOverview.reviewsCount || '0', color: 'text-amber-600', bg: 'bg-amber-50' },
                            ].map((stat, i) => (
                                <div key={i} className={cn("p-4 rounded-2xl border-none shadow-sm flex flex-col gap-1", stat.bg)}>
                                    <p className={cn("text-2xl font-black", stat.color)}>{stat.value}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500/80">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</p>
                            {user.recentActivity.length === 0 ? (
                                <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    <Info size={24} className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-xs font-bold text-slate-500">No recent activity recorded</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {user.recentActivity.map((activity: any, i: number) => (
                                        <div key={i} className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                                            {/* Map activity item here */}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Timeline */}
                <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="p-6 px-8 pb-4 border-b border-slate-50">
                        <CardTitle className="text-base font-bold text-slate-900">Recent Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        {user.recentTimeline.length === 0 ? (
                            <div className="py-12 text-center text-slate-500">
                                <Clock size={48} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-sm font-bold text-slate-900 mb-1">No Timeline Data</p>
                                <p className="text-xs">No recent timeline events found for this user.</p>
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-slate-100 ml-4 space-y-8">
                                {user.recentTimeline.map((event: any, i: number) => (
                                    <div key={i} className="pl-8 relative">
                                        {/* Process event data here if structure was known */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
                {previewImage && (
                    <ImagePreviewDialog
                        isOpen={!!previewImage}
                        onClose={() => setPreviewImage(null)}
                        imageUrl={previewImage.url}
                        title={previewImage.title}
                    />
                )}
            </div>
        </div>
    );
}
