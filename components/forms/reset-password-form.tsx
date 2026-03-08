'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import api from '@/lib/api';
import { Loader2, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
    code: z.string().min(6, { message: 'Reset code must be 6 digits' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});

function ResetPasswordFormContent() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: '',
            password: '',
            password_confirmation: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!email) {
            toast.error('Email is missing. Please try the forgot password flow again.');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/users/reset-password', {
                email,
                code: values.code,
                password: values.password,
                password_confirmation: values.password_confirmation,
            });
            toast.success('Password reset successful! You can now login with your new password.');
            router.push('/auth/login');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Reset failed. Please check the code and try again.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white tracking-tight font-display">Set New Secret.</h1>
                <p className="text-slate-400 font-medium leading-relaxed">Verification protocol for <span className="text-[#00AAFF] font-bold">{email || 'your account'}</span>.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, 'code'> }) => (
                            <FormItem className="space-y-4">
                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">6-Digit Recovery Code</FormLabel>
                                <FormControl>
                                    <div className="flex justify-center">
                                        <InputOTP maxLength={6} {...field} className="gap-2">
                                            <InputOTPGroup className="gap-2">
                                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                                    <InputOTPSlot
                                                        key={index}
                                                        index={index}
                                                        className="w-12 h-14 rounded-xl bg-white/5 border-white/10 text-white font-bold text-xl focus:ring-[#0066CC] focus:border-[#0066CC] shadow-inner"
                                                    />
                                                ))}
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, 'password'> }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">New Secret Key</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                                className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:ring-[#0066CC] focus:border-[#0066CC] px-6 font-semibold shadow-inner"
                                            />
                                            <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password_confirmation"
                            render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, 'password_confirmation'> }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Confirm New Secret</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                                className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:ring-[#0066CC] focus:border-[#0066CC] px-6 font-semibold shadow-inner"
                                            />
                                            <ShieldCheck className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-bold bg-[#0066CC] hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Updating Protocol...
                            </>
                        ) : (
                            <>
                                Reset Secret Key
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </>
                        )}
                    </Button>

                    <div className="text-center">
                        <Link href="/auth/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[#0066CC] transition-colors">
                            Return to Login
                        </Link>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export function ResetPasswordForm() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center p-20"><Loader2 className="animate-spin text-[#0066CC]" size={40} /></div>}>
            <ResetPasswordFormContent />
        </Suspense>
    );
}
