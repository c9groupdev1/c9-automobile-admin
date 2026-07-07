'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Loader2, Mail, ArrowLeft, Key } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { motion } from 'framer-motion';

const formSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
});

export default function UserForgotPasswordPage() {
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
            const response = await api.post('/users/forgot-password', values);
            if (response.data.success) {
                toast.success('Password recovery code sent to your email.');
                // Redirect to reset password with email prefilled
                router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to send recovery code. Please try again.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 gradient-bg flex flex-col justify-center items-center p-6 relative">
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none z-0" />
            
            {/* Back to Home Link */}
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm z-50 transition-colors">
                <ArrowLeft size={16} /> Home
            </Link>

            {/* Ambient gradients */}
            <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-400/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 z-0" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 z-0" />

            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <Link
                        href="/login"
                        className="mb-8 hover:bg-slate-100 text-slate-500 transition-colors inline-flex items-center gap-1 text-xs font-bold py-2 px-3 rounded-xl -ml-3"
                    >
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>

                    <div className="mb-10 text-left">
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Forgot Password</h2>
                        <p className="text-slate-500 font-medium text-sm">
                            Enter your email address and we'll send you a code to reset your password.
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                                    type="email"
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
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending code...</>
                                ) : (
                                    'Send Recovery Code'
                                )}
                            </Button>
                        </form>
                    </Form>
                </motion.div>
            </div>
        </div>
    );
}
