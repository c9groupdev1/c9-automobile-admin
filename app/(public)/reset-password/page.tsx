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
import api from '@/lib/api';
import { Loader2, Mail, Lock, Key, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { motion } from 'framer-motion';

const formSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    code: z.string().min(4, { message: 'Code must be at least 4 characters' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

function ResetPasswordFormContent() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailParam = searchParams.get('email') || '';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: emailParam,
            code: '',
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const payload = {
                email: values.email,
                code: values.code,
                password: values.password,
                password_confirmation: values.confirmPassword,
            };

            const response = await api.post('/users/reset-password', payload);
            if (response.data.success) {
                toast.success('Password reset successful! You can now log in.');
                router.replace('/login');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to reset password. Please try again.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <Link
                    href="/forgot-password"
                    className="mb-8 hover:bg-slate-100 text-slate-500 transition-colors inline-flex items-center gap-1 text-xs font-bold py-2 px-3 rounded-xl -ml-3"
                >
                    <ArrowLeft size={16} />
                    Change Email
                </Link>

                <div className="mb-10 text-left">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Reset Password</h2>
                    <p className="text-slate-500 font-medium text-sm">
                        Please enter the verification code sent to your email and your new password.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Email Address</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <Input
                                                placeholder="you@example.com"
                                                type="email"
                                                {...field}
                                                className="h-13 rounded-xl bg-slate-100 border-transparent text-slate-500 font-semibold cursor-not-allowed pl-12"
                                                disabled
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs font-semibold text-rose-500 ml-1" />
                                </FormItem>
                            )}
                        />

                        {/* Verification Code */}
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Verification Code</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#003399]" />
                                            <Input
                                                placeholder="Enter 6-digit code"
                                                type="text"
                                                {...field}
                                                className="h-13 rounded-xl bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 pl-12 font-semibold transition-all focus:bg-white focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs font-semibold text-rose-500 ml-1" />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#003399]" />
                                            <Input
                                                placeholder="Min. 8 characters"
                                                type="password"
                                                {...field}
                                                className="h-13 rounded-xl bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 pl-12 font-semibold transition-all focus:bg-white focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs font-semibold text-rose-500 ml-1" />
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Confirm New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#003399]" />
                                            <Input
                                                placeholder="Re-enter password"
                                                type="password"
                                                {...field}
                                                className="h-13 rounded-xl bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 pl-12 font-semibold transition-all focus:bg-white focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs font-semibold text-rose-500 ml-1" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#003399] hover:bg-blue-800 text-white rounded-xl shadow-lg shadow-blue-500/10 h-13 font-bold text-sm tracking-wide transition-all mt-6"
                        >
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Resetting password...</>
                            ) : (
                                <><ShieldCheck className="mr-2 h-4 w-4" />Reset Password</>
                            )}
                        </Button>
                    </form>
                </Form>
            </motion.div>
        </div>
    );
}

export default function UserResetPasswordPage() {
    return (
        <div className="min-h-screen w-full flex bg-slate-50 font-sans">
            {/* Left Side: Brand / Hero Graphic */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#003399] flex-col justify-between p-12 xl:p-20 text-white">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/40 blur-[100px] animate-pulse-slow" />
                    <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-400/30 blur-[100px]" />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#003399]/20 to-[#002266]/80" />
                </div>
                
                <div className="relative z-10">
                    <Link href="/" className="inline-block transition-transform hover:scale-105 active:scale-95 bg-white p-2 rounded-xl shadow-lg">
                        <Logo className="w-14 h-14" />
                    </Link>
                </div>
                
                <div className="relative z-10 space-y-8 mt-auto mb-12">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl xl:text-6xl font-black tracking-tight leading-[1.1]"
                    >
                        Secure <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">
                            account recovery.
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-blue-100 text-lg xl:text-xl max-w-lg font-medium leading-relaxed"
                    >
                        Regain access to your premium automotive trading account quickly and securely.
                    </motion.p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-20 relative">
                {/* Mobile Back to Home */}
                <Link href="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm z-50 transition-colors">
                    <ArrowLeft size={16} /> Home
                </Link>

                <div className="w-full max-w-md relative z-10 mt-12 lg:mt-0">
                    <Suspense fallback={
                        <div className="flex flex-col items-center justify-center">
                            <Loader2 className="h-10 w-10 animate-spin text-[#003399]" />
                            <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading form...</p>
                        </div>
                    }>
                        <ResetPasswordFormContent />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
