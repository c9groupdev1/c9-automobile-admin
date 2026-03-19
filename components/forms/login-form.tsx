'use client';

import { useState } from 'react';
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
import { Loader2, Mail, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

const formSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export function LoginForm() {
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
            router.push(redirect || '/admin/dashboard');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
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
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Admin Sign In</h2>
                <p className="text-slate-500 font-medium text-sm">
                    Log in to access the C9X management dashboard
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
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel className="text-xs font-bold text-slate-700 ml-1">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter password"
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
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" className="rounded-md border-slate-300" />
                            <label htmlFor="remember" className="text-xs font-bold text-slate-600 cursor-pointer">
                                Remember me
                            </label>
                        </div>
                        <Link
                            href="/auth/forgot-password"
                            className="text-xs font-bold text-[#003399] hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-bold bg-[#003399] hover:bg-blue-800 shadow-xl shadow-blue-900/10 transition-all active:scale-[0.98]" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
            </Form>

            {/* Security Notice */}
            <div className="mt-8 bg-slate-50 rounded-2xl p-4 flex items-start space-x-4 border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                    <ShieldAlert className="text-[#003399]" size={20} />
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                    <span className="font-bold text-slate-900">Security Notice:</span> This portal is restricted to authorized C9X administrators only.
                </p>
            </div>
        </div>
    );
}
