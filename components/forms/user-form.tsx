'use client';

import { useState, useEffect } from 'react';
import { useForm, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCreateUser, useUpdateUser, useRoles, Role, useUserDetails } from '@/hooks/useUsers';
import { Loader2, UserPlus, Mail, Shield, User, Save, ShieldAlert, Phone, MapPin, Activity, ShieldCheck, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    role: z.string().min(1, { message: 'Please select a role' }),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    status: z.enum(['active', 'suspended', 'under_review']).optional(),
    kycVerified: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UserFormProps {
    initialData?: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    onSuccess: () => void;
}

export function UserForm({ initialData, onSuccess }: UserFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const { data: roles, isLoading: isLoadingRoles } = useRoles();
    const isEdit = !!initialData;

    const { data: userDetails, isLoading: isLoadingDetails } = useUserDetails(initialData?.id || '');

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            role: 'user',
            phoneNumber: '',
            address: '',
            status: 'active',
            kycVerified: false,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                email: initialData.email,
                role: initialData.role,
                phoneNumber: '',
                address: '',
                status: 'active',
                kycVerified: false,
            });
        }
    }, [initialData, form]);

    useEffect(() => {
        if (userDetails) {
            form.reset({
                name: userDetails.profile.fullName || '',
                email: userDetails.profile.email || '',
                role: userDetails.profile.accountType || 'user',
                phoneNumber: userDetails.profile.phoneNumber || '',
                address: userDetails.profile.address || '',
                status: (userDetails.status as any) || 'active',
                kycVerified: !!userDetails.kycVerified,
            });
        }
    }, [userDetails, form]);

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        try {
            if (isEdit && initialData) {
                await updateUser.mutateAsync({ 
                    id: initialData.id, 
                    data: {
                        name: values.name,
                        email: values.email,
                        role: values.role,
                        phoneNumber: values.phoneNumber,
                        phone_number: values.phoneNumber,
                        address: values.address,
                        residentialAddress: values.address,
                        status: values.status,
                        kycVerified: values.kycVerified,
                        kyc_verified: values.kycVerified,
                    } 
                });
                toast.success('User updated successfully');
            } else {
                await createUser.mutateAsync({
                    name: values.name,
                    email: values.email,
                    role: values.role,
                });
                toast.success('User created successfully');
            }
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} user`);
        } finally {
            setIsLoading(false);
        }
    }

    if (isEdit && isLoadingDetails) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#0066CC]" />
                <p className="text-xs font-semibold text-slate-500">Loading user profile...</p>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
                {/* Live Preview Header Card (Edit Mode Only) */}
                {isEdit && (
                    <div className="bg-gradient-to-br from-blue-50/40 via-slate-50 to-transparent p-6 rounded-[2rem] border border-slate-100/80 flex items-center gap-4 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#0066CC]/5 rounded-full blur-2xl pointer-events-none" />
                        <Avatar className="h-16 w-16 rounded-2xl border-2 border-white shadow-md flex-shrink-0">
                            <AvatarFallback className="bg-[#003399] text-white font-bold text-xl">
                                {form.watch('name')?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-black text-slate-900 truncate max-w-[200px]" title={form.watch('name')}>
                                    {form.watch('name') || 'Unnamed User'}
                                </h4>
                                {form.watch('kycVerified') ? (
                                    <Badge className="bg-emerald-50 text-emerald-600 border-0 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md pointer-events-none">
                                        KYC Verified
                                    </Badge>
                                ) : (
                                    <Badge className="bg-amber-50 text-amber-600 border-0 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md pointer-events-none">
                                        KYC Pending
                                    </Badge>
                                )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-semibold truncate max-w-[220px]">{form.watch('email') || 'no-email@c9x.network'}</p>
                            <div className="flex gap-1.5 flex-wrap">
                                <Badge className="bg-blue-50 text-[#003399] border-0 text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md pointer-events-none capitalize">
                                    {form.watch('role')?.replace('_', ' ') || 'User'}
                                </Badge>
                                {form.watch('status') && (
                                    <Badge className={cn(
                                        "border-0 text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md pointer-events-none capitalize",
                                        form.watch('status') === 'active' ? 'bg-emerald-50 text-emerald-600' :
                                        form.watch('status') === 'suspended' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                    )}>
                                        {form.watch('status')?.replace('_', ' ')}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Section 1: Profile & Contact Details */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6 shadow-xs">
                        <div className="border-b border-slate-50 pb-3 flex items-center gap-2">
                            <div className="p-1.5 bg-blue-50 rounded-lg text-[#0066CC]">
                                <User size={14} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Profile & Identity</h3>
                        </div>

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#0066CC] flex items-center gap-2">
                                            Full Name
                                        </FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input 
                                                    placeholder="John Doe" 
                                                    {...field} 
                                                    disabled={isEdit} 
                                                    className="h-12 pr-10 rounded-xl bg-slate-50 border-slate-100 focus:bg-white disabled:bg-slate-100/60 disabled:text-slate-400 disabled:cursor-not-allowed transition-all font-semibold" 
                                                />
                                            </FormControl>
                                            {isEdit && (
                                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                                    <Lock size={14} />
                                                </div>
                                            )}
                                        </div>
                                        {isEdit && (
                                            <p className="text-[9px] font-medium text-slate-400">Full name is locked. Contact identity support to modify.</p>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#0066CC] flex items-center gap-2">
                                            Email Address
                                        </FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input 
                                                    placeholder="user@c9x.network" 
                                                    {...field} 
                                                    disabled={isEdit} 
                                                    className="h-12 pr-10 rounded-xl bg-slate-50 border-slate-100 focus:bg-white disabled:bg-slate-100/60 disabled:text-slate-400 disabled:cursor-not-allowed transition-all font-semibold" 
                                                />
                                            </FormControl>
                                            {isEdit && (
                                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                                    <Lock size={14} />
                                                </div>
                                            )}
                                        </div>
                                        {isEdit && (
                                            <p className="text-[9px] font-medium text-slate-400">Email address is locked. Contact identity support to modify.</p>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {isEdit && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#0066CC] flex items-center gap-2">
                                                    Phone Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+2348012345678" {...field} className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-semibold" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#0066CC] flex items-center gap-2">
                                                    Residential Address
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123 Main St" {...field} className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-semibold" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Section 2: Roles & Permissions */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6 shadow-xs">
                        <div className="border-b border-slate-50 pb-3 flex items-center gap-2">
                            <div className="p-1.5 bg-blue-50 rounded-lg text-[#0066CC]">
                                <Shield size={14} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Clearances & Controls</h3>
                        </div>

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#0066CC] flex items-center gap-2">
                                            Access Role
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={isLoadingRoles}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-semibold focus:ring-offset-0 focus:ring-1 focus:ring-[#0066CC]">
                                                    <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "Select role"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                                {isLoadingRoles ? (
                                                    <div className="flex items-center justify-center py-6">
                                                        <Loader2 className="h-4 w-4 animate-spin text-[#0066CC]" />
                                                    </div>
                                                ) : roles && roles.length > 0 ? (
                                                    roles.map((role: Role) => (
                                                        <SelectItem key={role.id} value={role.name} className="font-semibold py-3 rounded-lg capitalize">
                                                            {role.name.replace('_', ' ')}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                                                        <ShieldAlert size={12} />
                                                        No roles available
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {isEdit && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#0066CC] flex items-center gap-2">
                                                    Account Status
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-semibold focus:ring-offset-0 focus:ring-1 focus:ring-[#0066CC]">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                                        <SelectItem value="active" className="font-semibold py-3 rounded-lg capitalize">Active</SelectItem>
                                                        <SelectItem value="suspended" className="font-semibold py-3 rounded-lg capitalize">Suspended</SelectItem>
                                                        <SelectItem value="under_review" className="font-semibold py-3 rounded-lg capitalize">Under Review</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="kycVerified"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 shadow-2xs">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                                        <ShieldCheck size={14} className="text-emerald-500" />
                                                        KYC Verified
                                                    </FormLabel>
                                                    <p className="text-[9px] font-medium text-slate-400">Toggles customer KYC clearance.</p>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex-shrink-0">
                    <Button type="submit" className="w-full h-14 rounded-2xl bg-[#0066CC] hover:bg-blue-700 font-bold shadow-lg shadow-primary/10 transition-all active:scale-[0.98]" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isEdit ? 'Saving Changes...' : 'Creating User...'}
                            </>
                        ) : (
                            <>
                                {isEdit ? (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Create User
                                    </>
                                )}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
