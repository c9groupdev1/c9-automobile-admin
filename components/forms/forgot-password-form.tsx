'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import api from '@/lib/api';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/logo';

const formSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
});

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            await api.post('/users/forgot-password', values);
            toast.success('Reset code sent to your email.');
            router.push(`/secured-admin/reset-password?email=${encodeURIComponent(values.email)}`);
        } catch (error: any) {
            toast.error('Failed to send reset code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 w-full">
            <div className="flex flex-col items-center mb-10 text-center">
                <div className="w-16 h-16 bg-[#003399] rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                    <Logo className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Recover Access</h2>
                <p className="text-slate-500 font-medium text-sm">
                    Enter your email to receive a secure recovery code
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-xs font-bold text-slate-700 ml-1">Email Address</FormLabel>
                                <FormControl>
                                    <div className="relative group">
                                        <Input
                                            placeholder="admin@c9x.com"
                                            {...field}
                                            className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 px-12 font-medium transition-all"
                                        />
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#003399] transition-colors" size={18} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-bold bg-[#003399] hover:bg-blue-800 shadow-xl shadow-blue-900/10 transition-all active:scale-[0.98]" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            "Send Recovery Code"
                        )}
                    </Button>

                    <div className="text-center pt-2">
                        <Link href="/secured-admin/login" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-[#003399] transition-colors">
                            <ArrowLeft size={14} className="mr-2" />
                            Return to Login
                        </Link>
                    </div>
                </form>
            </Form>
        </div>
    );
}
