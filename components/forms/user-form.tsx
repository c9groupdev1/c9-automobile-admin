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
import { useCreateUser, useUpdateUser, useRoles, Role } from '@/hooks/useUsers';
import { Loader2, UserPlus, Mail, Shield, User, Save, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    role: z.string().min(1, { message: 'Please select a role' }),
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

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            role: 'user',
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                email: initialData.email,
                role: initialData.role,
            });
        }
    }, [initialData, form]);

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        try {
            if (isEdit && initialData) {
                await updateUser.mutateAsync({ 
                    id: initialData.id, 
                    data: values 
                });
                toast.success('User updated successfully');
            } else {
                await createUser.mutateAsync(values);
                toast.success('User created successfully');
            }
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} user`);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-2">
                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#0066CC] flex items-center gap-2">
                                    <User size={12} />
                                    Legal Identity
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-semibold" />
                                </FormControl>
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
                                    <Mail size={12} />
                                    Communication Endpoint
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="user@c9x.network" {...field} className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-semibold" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#0066CC] flex items-center gap-2">
                                    <Shield size={12} />
                                    Access Clearance
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={isLoadingRoles}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-semibold focus:ring-offset-0 focus:ring-1 focus:ring-[#0066CC]">
                                            <SelectValue placeholder={isLoadingRoles ? "Loading access roles..." : "Select access role"} />
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
                                                No protocol roles available
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="pt-4">
                    <Button type="submit" className="w-full h-14 rounded-2xl bg-[#0066CC] hover:bg-blue-700 font-bold shadow-lg shadow-primary/10 transition-all active:scale-[0.98]" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isEdit ? 'Updating Protocol...' : 'Provisioning User...'}
                            </>
                        ) : (
                            <>
                                {isEdit ? (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Configuration
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Initialize User Protocol
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
