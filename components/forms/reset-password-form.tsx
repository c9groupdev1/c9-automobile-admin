'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import api from '@/lib/api';
import { Loader2, ArrowRight, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

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
    const [showPassword, setShowPassword] = useState(false);
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
            router.push('/secured-admin/login');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Reset failed. Please check the code and try again.';
            toast.error(message);
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
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Set New Password</h2>
                <p className="text-slate-500 font-medium text-sm">
                    Verification for <span className="text-[#003399] font-bold">{email || 'your account'}</span>
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                                <FormLabel className="text-xs font-bold text-slate-700 ml-1 block text-center">6-Digit Recovery Code</FormLabel>
                                <FormControl>
                                    <div className="flex justify-center">
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup className="gap-2">
                                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                                    <InputOTPSlot
                                                        key={index}
                                                        index={index}
                                                        className="w-12 h-14 rounded-xl bg-slate-50 border-slate-100 text-slate-900 font-bold text-xl focus:ring-[#003399] focus:border-[#003399]"
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
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-xs font-bold text-slate-700 ml-1">New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                {...field}
                                                className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 px-12 font-medium transition-all"
                                            />
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#003399] transition-colors" size={18} />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password_confirmation"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-xs font-bold text-slate-700 ml-1">Confirm New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Confirm new password"
                                                {...field}
                                                className="h-14 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 px-12 font-medium transition-all"
                                            />
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#003399] transition-colors" size={18} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-bold bg-[#003399] hover:bg-blue-800 shadow-xl shadow-blue-900/10 transition-all active:scale-[0.98]" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <div className="flex items-center justify-center">
                                Reset Password
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </div>
                        )}
                    </Button>

                    <div className="text-center pt-2">
                        <Link href="/secured-admin/login" className="text-xs font-bold text-slate-500 hover:text-[#003399] transition-colors">
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
        <Suspense fallback={<div className="flex items-center justify-center p-20 bg-white rounded-[2.5rem] shadow-xl border border-slate-100"><Loader2 className="animate-spin text-[#003399]" size={40} /></div>}>
            <ResetPasswordFormContent />
        </Suspense>
    );
}
