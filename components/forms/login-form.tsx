'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

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
            router.push('/dashboard');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white tracking-tight font-display">Welcome Back.</h1>
                <p className="text-slate-400 font-medium">Log in to the C9x Admin Control.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, "email"> }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Access Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="admin@c9automobile.com"
                                            {...field}
                                            className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:ring-[#0066CC] focus:border-[#0066CC] px-6 font-semibold shadow-inner"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, "password"> }) => (
                                <FormItem className="space-y-3">
                                    <div className="flex items-center justify-between ml-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Secret Key</FormLabel>
                                        <Link
                                            href="/auth/forgot-password"
                                            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066CC] hover:text-[#00AAFF] transition-colors"
                                        >
                                            Forgot?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            {...field}
                                            className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:ring-[#0066CC] focus:border-[#0066CC] px-6 font-semibold shadow-inner"
                                        />
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
                                Authenticating...
                            </>
                        ) : (
                            <>
                                Initialize Access
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
