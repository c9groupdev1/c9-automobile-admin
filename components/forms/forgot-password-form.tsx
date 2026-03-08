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
import api from '@/lib/api';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
            router.push(`/auth/reset-password?email=${encodeURIComponent(values.email)}`);
        } catch (error: any) {
            toast.error('Failed to send reset code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-2 text-center md:text-left">
                <Link href="/auth/login" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[#0066CC] transition-colors mb-4">
                    <ArrowLeft size={12} className="mr-2" />
                    Back to Login
                </Link>
                <h1 className="text-4xl font-bold text-white tracking-tight font-display">Recover Access.</h1>
                <p className="text-slate-400 font-medium leading-relaxed">Enter your institutional email to receive a secure recovery code.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, 'email'> }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Institutional Email</FormLabel>
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

                    <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-bold bg-[#0066CC] hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Sending Code...
                            </>
                        ) : (
                            <>
                                Transmit Recovery Code
                                <Mail className="ml-2 w-5 h-5" />
                            </>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
