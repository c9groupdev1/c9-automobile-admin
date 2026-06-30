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
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { motion } from 'framer-motion';

const formSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

function UserLoginFormContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);
    const redirect = searchParams.get('redirect');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const response = await api.post('/users/login', values);
            const { user, token } = response.data;

            setAuth(user, token);
            toast.success('Login successful!');

            const hasStaffRole = user.roles?.some((role: string) =>
                !['user', 'verified_user'].includes(role.toLowerCase())
            );

            // Customer logins should direct to /account if no redirect is active
            const target = hasStaffRole ? '/admin/dashboard' : '/account';

            window.location.href = redirect || target;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100/50 w-full relative z-10"
            >
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-tr from-[#003399] to-[#0066CC] rounded-[1.5rem] flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10 relative z-10">
                        <Logo className="w-12 h-12 invert brightness-0" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Member Sign In</h2>
                    <p className="text-slate-500 font-medium text-sm">
                        Access your C9X vehicle portal, listings, and messages
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Email Address</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
                                                <Input
                                                    placeholder="name@example.com"
                                                    {...field}
                                                    className="h-13 rounded-xl bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 pl-12 font-semibold transition-all focus:bg-white focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs font-semibold text-rose-500 ml-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center justify-between ml-1">
                                            <FormLabel className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</FormLabel>
                                            <Link
                                                href="/forgot-password"
                                                className="text-xs font-bold text-[#003399] hover:underline"
                                            >
                                                Forgot?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    {...field}
                                                    className="h-13 rounded-xl bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 pl-12 pr-12 font-semibold transition-all focus:bg-white focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs font-semibold text-rose-500 ml-1" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between ml-1">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" className="rounded border-slate-300 text-[#003399] focus:ring-[#003399]" />
                                <label
                                    htmlFor="remember"
                                    className="text-xs font-bold text-slate-500 cursor-pointer select-none"
                                >
                                    Keep me signed in
                                </label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#003399] to-[#0066CC] hover:from-blue-800 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/10 h-13 font-bold text-sm tracking-wide transition-all"
                        >
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>
                            ) : (
                                <><ArrowRight className="mr-2 h-4 w-4" />Sign In</>
                            )}
                        </Button>

                        <div className="text-center text-xs font-bold text-slate-400 mt-6 pt-6 border-t border-slate-100">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-[#003399] hover:underline">
                                Register now
                            </Link>
                        </div>
                    </form>
                </Form>
            </motion.div>
        </div>
    );
}

export default function UserLoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 gradient-bg flex flex-col justify-center items-center p-6 relative">
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none z-0" />
            
            {/* Ambient gradients */}
            <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-400/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 z-0" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 z-0" />

            <Suspense fallback={
                <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-[#003399]" />
                    <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading Portal...</p>
                </div>
            }>
                <UserLoginFormContent />
            </Suspense>
        </div>
    );
}
