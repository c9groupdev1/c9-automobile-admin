'use client';

import { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import api from '@/lib/api';
import { Loader2, Mail, Lock, User, Check, ArrowRight, ArrowLeft, Building2, Ticket, ShieldCheck, Key } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
    referralCode: z.string().optional(),
    agreedToTerms: z.boolean().refine(val => val === true, {
        message: 'You must agree to the Terms and Conditions',
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export default function UserRegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Account Type, 2: Registration details, 3: OTP Verification
    const [accountType, setAccountType] = useState<'personal' | 'vendor' | null>(null);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // OTP State
    const [otpCode, setOtpCode] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [isResendingOtp, setIsResendingOtp] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            referralCode: '',
            agreedToTerms: false,
        },
    });

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleAccountTypeSelect = (type: 'personal' | 'vendor') => {
        setAccountType(type);
        setStep(2);
    };

    async function onRegisterSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const payload = {
                name: values.name,
                email: values.email,
                password: values.password,
                password_confirmation: values.confirmPassword,
                referralCode: values.referralCode || undefined,
            };

            const response = await api.post('/users/register', payload);
            if (response.data.success) {
                toast.success('Registration successful! Please verify your email.');
                setRegisteredEmail(values.email);
                setStep(3);
                setResendTimer(60);
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleVerifyOtp() {
        if (!otpCode || otpCode.length < 4) {
            toast.error('Please enter a valid OTP verification code');
            return;
        }

        setIsVerifyingOtp(true);
        try {
            const response = await api.post('/users/verify-email', {
                email: registeredEmail,
                code: otpCode,
            });

            if (response.data.success) {
                toast.success('Email verified successfully! You can now sign in.');
                router.replace('/login');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Verification failed. Please check the code.';
            toast.error(message);
        } finally {
            setIsVerifyingOtp(false);
        }
    }

    async function handleResendOtp() {
        if (resendTimer > 0) return;
        setIsResendingOtp(true);
        try {
            const response = await api.post('/users/resend-otp', {
                email: registeredEmail,
            });
            if (response.data.success) {
                toast.success('Verification code resent successfully.');
                setResendTimer(60);
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to resend code. Please try again.';
            toast.error(message);
        } finally {
            setIsResendingOtp(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 gradient-bg flex flex-col justify-center items-center p-6 relative">
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none z-0" />
            
            {/* Ambient gradients */}
            <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-400/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 z-0" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 z-0" />

            <div className="w-full max-w-2xl flex flex-col items-center">
                <AnimatePresence mode="wait">
                    {/* STEP 1: Account Type Selection */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100/50 w-full relative z-10 max-w-xl"
                        >
                            <div className="flex flex-col items-center mb-10 text-center">
                                <div className="w-20 h-20 bg-gradient-to-tr from-[#003399] to-[#0066CC] rounded-[1.5rem] flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10">
                                    <Logo className="w-12 h-12 invert brightness-0" />
                                </div>
                                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Create Your Account</h2>
                                <p className="text-slate-500 font-medium text-sm">
                                    Choose how you want to interact with C9X
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Personal Account Card */}
                                <div
                                    onClick={() => handleAccountTypeSelect('personal')}
                                    className="group cursor-pointer bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-[#003399] hover:bg-blue-50/10 transition-all shadow-sm hover:shadow-md flex items-start gap-5"
                                >
                                    <div className="p-4 bg-blue-50 text-[#003399] rounded-2xl group-hover:scale-105 transition-transform duration-300">
                                        <User size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-[#003399] transition-colors">Personal Account</h3>
                                        <p className="text-slate-500 font-semibold text-xs leading-relaxed mb-4">
                                            Buy premium vehicles, chat with verified dealers, save favorites, and list cars as an individual.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Save favorites', 'Chat with sellers', 'Sell occasionally'].map(f => (
                                                <span key={f} className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{f}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Vendor Account Card */}
                                <div
                                    onClick={() => handleAccountTypeSelect('vendor')}
                                    className="group cursor-pointer bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-violet-600 hover:bg-violet-50/10 transition-all shadow-sm hover:shadow-md flex items-start gap-5"
                                >
                                    <div className="p-4 bg-violet-50 text-violet-600 rounded-2xl group-hover:scale-105 transition-transform duration-300">
                                        <Building2 size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors">Vendor / Dealer Account</h3>
                                            <span className="text-[9px] font-black tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">KYC Verification Required</span>
                                        </div>
                                        <p className="text-slate-500 font-semibold text-xs leading-relaxed mb-4">
                                            List vehicles, parts, and services as a business. Gain professional vendor badges and unlimited postings.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {['Unlimited listings', 'Service directory catalog', 'Verified business profile'].map(f => (
                                                <span key={f} className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{f}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center text-xs font-bold text-slate-400 mt-8 pt-6 border-t border-slate-100">
                                Already have an account?{' '}
                                <Link href="/login" className="text-[#003399] hover:underline">
                                    Sign In
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Registration Form */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100/50 w-full relative z-10 max-w-xl"
                        >
                            <button
                                onClick={() => setStep(1)}
                                className="absolute left-6 top-8 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors flex items-center gap-1 text-xs font-bold"
                            >
                                <ArrowLeft size={16} />
                                Back
                            </button>
                            
                            <div className="flex flex-col items-center mb-10 text-center">
                                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Create {accountType === 'vendor' ? 'Vendor' : 'Personal'} Account</h2>
                                <p className="text-slate-500 font-medium text-sm">
                                    Fill in your details below to register
                                </p>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onRegisterSubmit)} className="space-y-6">
                                    <div className="space-y-4">
                                        {/* Full Name */}
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Full Name</FormLabel>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
                                                            <Input
                                                                placeholder="Alice Johnson"
                                                                {...field}
                                                                className="h-13 rounded-xl bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 pl-12 font-semibold transition-all focus:bg-white focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-xs font-semibold text-rose-500 ml-1" />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Email */}
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
                                                                placeholder="you@example.com"
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

                                        {/* Password */}
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
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
                                                    <FormLabel className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
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

                                        {/* Referral Code */}
                                        <FormField
                                            control={form.control}
                                            name="referralCode"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Referral Code (Optional)</FormLabel>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
                                                            <Input
                                                                placeholder="e.g. ABCD1234"
                                                                {...field}
                                                                className="h-13 rounded-xl bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 pl-12 font-semibold uppercase transition-all focus:bg-white focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-xs font-semibold text-rose-500 ml-1" />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Terms Checkbox */}
                                        <FormField
                                            control={form.control}
                                            name="agreedToTerms"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <div className="flex items-start space-x-3 mt-4 ml-1">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                className="mt-0.5 rounded border-slate-300 text-[#003399] focus:ring-[#003399]"
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <label className="text-xs font-bold text-slate-500 leading-normal">
                                                                I agree to the{' '}
                                                                <Link href="/terms" className="text-[#003399] hover:underline">
                                                                    Terms of Service
                                                                </Link>{' '}
                                                                and{' '}
                                                                <Link href="/privacy" className="text-[#003399] hover:underline">
                                                                    Privacy Policy
                                                                </Link>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <FormMessage className="text-xs font-semibold text-rose-500 ml-1" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-[#003399] to-[#0066CC] hover:from-blue-800 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/10 h-13 font-bold text-sm tracking-wide transition-all mt-6"
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Registering...</>
                                        ) : (
                                            <><ArrowRight className="mr-2 h-4 w-4" />Create Account</>
                                        )}
                                    </Button>

                                    <div className="text-center text-xs font-bold text-slate-400 mt-6 pt-6 border-t border-slate-100">
                                        Already have an account?{' '}
                                        <Link href="/login" className="text-[#003399] hover:underline">
                                            Sign In
                                        </Link>
                                    </div>
                                </form>
                            </Form>
                        </motion.div>
                    )}

                    {/* STEP 3: OTP Verification */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100/50 w-full relative z-10 max-w-md"
                        >
                            <div className="flex flex-col items-center mb-8 text-center">
                                <div className="w-16 h-16 bg-[#EFF6FF] text-[#003399] rounded-2xl flex items-center justify-center mb-6">
                                    <Key size={28} />
                                </div>
                                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2">Verify Your Email</h2>
                                <p className="text-slate-500 font-semibold text-xs leading-relaxed px-4">
                                    We sent a 6-digit confirmation code to <span className="text-slate-800 font-bold block mt-1">{registeredEmail}</span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block text-center mb-2">Verification Code</label>
                                    <div className="relative group max-w-[240px] mx-auto">
                                        <Input
                                            type="text"
                                            placeholder="Code"
                                            maxLength={6}
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                                            className="h-13 rounded-xl bg-slate-50/50 border-slate-200 text-slate-900 text-center font-bold tracking-[0.6em] text-xl transition-all focus:bg-white focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleVerifyOtp}
                                    disabled={isVerifyingOtp || otpCode.length < 4}
                                    className="w-full bg-[#003399] hover:bg-blue-800 text-white rounded-xl shadow-lg shadow-blue-500/10 h-13 font-bold text-sm tracking-wide transition-all"
                                >
                                    {isVerifyingOtp ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</>
                                    ) : (
                                        <><ShieldCheck className="mr-2 h-4 w-4" />Verify & Sign In</>
                                    )}
                                </Button>

                                <div className="text-center">
                                    {resendTimer > 0 ? (
                                        <p className="text-xs font-bold text-slate-400">
                                            Resend code in <span className="text-[#003399] font-black">{resendTimer}s</span>
                                        </p>
                                    ) : (
                                        <button
                                            onClick={handleResendOtp}
                                            disabled={isResendingOtp}
                                            className="text-xs font-black text-[#003399] hover:underline disabled:opacity-50"
                                        >
                                            {isResendingOtp ? 'Resending...' : 'Resend Verification Code'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
