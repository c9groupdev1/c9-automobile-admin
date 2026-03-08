'use client';

import { useState } from 'react';
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
import { useCreateUser } from '@/hooks/useUsers';
import { Loader2, UserPlus, Mail, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    role: z.string().min(1, { message: 'Please select a role' }),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const createUser = useCreateUser();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            role: 'user',
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        try {
            await createUser.mutateAsync(values);
            toast.success('User created successfully');
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create user');
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
                        render={({ field }: { field: ControllerRenderProps<FormValues, 'name'> }) => (
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
                        render={({ field }: { field: ControllerRenderProps<FormValues, 'email'> }) => (
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
                        render={({ field }: { field: ControllerRenderProps<FormValues, 'role'> }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#0066CC] flex items-center gap-2">
                                    <Shield size={12} />
                                    Access Clearance
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-semibold focus:ring-offset-0 focus:ring-1 focus:ring-[#0066CC]">
                                            <SelectValue placeholder="Select access role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                        <SelectItem value="user" className="font-semibold py-3 rounded-lg">Standard User</SelectItem>
                                        <SelectItem value="admin" className="font-semibold py-3 rounded-lg">Protocol Admin</SelectItem>
                                        <SelectItem value="moderator" className="font-semibold py-3 rounded-lg">Asset Moderator</SelectItem>
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
                                Provisioning User...
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Initialize User Protocol
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
