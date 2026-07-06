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
import { Loader2, Mail, Lock, User, Check, ArrowRight, Ticket, ShieldCheck, Key, Eye, EyeOff, Quote, Star, ArrowLeft } from 'lucide-react';
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
    const [step, setStep] = useState<2 | 3>(2); // 2: Registration details, 3: OTP Verification
    const [accountType, setAccountType] = useState<'personal' | 'vendor'>('personal');
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
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
        <div className="min-h-screen w-full flex bg-slate-50 font-sans">
            {/* Left Side: Brand / Hero Graphic */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#003399] flex-col justify-between p-12 xl:p-20 text-white">
                {/* Dynamic Background Gradients & Effects */}
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
                        Join the ultimate <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">
                            auto marketplace.
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-blue-100 text-lg xl:text-xl max-w-lg font-medium leading-relaxed"
                    >
                        Experience seamless buying and selling with verified dealers, premium listings, and top-tier support.
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
                    <AnimatePresence mode="wait">
                        {/* STEP 2: Registration Form */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <div className="mb-10">
                                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">Create Account</h2>
                                    <p className="text-slate-500 font-medium text-sm sm:text-base">
                                        Enter your details to get started with C9X.
                                    </p>
                                </div>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onRegisterSubmit)} className="space-y-5">
                                        {/* Full Name */}
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem className="space-y-1.5">
                                                    <FormLabel className="text-xs font-black text-slate-700 ml-1 uppercase tracking-widest">Full Name</FormLabel>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
                                                            <Input
                                                                placeholder="Alice Johnson"
                                                                {...field}
                                                                className="h-14 rounded-2xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 pl-12 font-semibold transition-all focus:bg-white focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 shadow-sm hover:border-slate-300"
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
                                                <FormItem className="space-y-1.5">
                                                    <FormLabel className="text-xs font-black text-slate-700 ml-1 uppercase tracking-widest">Email Address</FormLabel>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
                                                            <Input
                                                                placeholder="you@example.com"
                                                                type="email"
                                                                {...field}
                                                                className="h-14 rounded-2xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 pl-12 font-semibold transition-all focus:bg-white focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 shadow-sm hover:border-slate-300"
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
                                                <FormItem className="space-y-1.5">
                                                    <FormLabel className="text-xs font-black text-slate-700 ml-1 uppercase tracking-widest">Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
                                                            <Input
                                                                placeholder="Min. 8 chars"
                                                                type={showPassword ? 'text' : 'password'}
                                                                {...field}
                                                                className="h-14 rounded-2xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 pl-10 pr-10 font-semibold transition-all focus:bg-white focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 shadow-sm hover:border-slate-300 text-sm"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#003399] transition-colors focus:outline-none"
                                                            >
                                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-[10px] font-semibold text-rose-500 ml-1" />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Confirm Password */}
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem className="space-y-1.5">
                                                    <FormLabel className="text-xs font-black text-slate-700 ml-1 uppercase tracking-widest">Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
                                                            <Input
                                                                placeholder="Re-enter password"
                                                                type={showConfirmPassword ? 'text' : 'password'}
                                                                {...field}
                                                                className="h-14 rounded-2xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 pl-10 pr-10 font-semibold transition-all focus:bg-white focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 shadow-sm hover:border-slate-300 text-sm"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#003399] transition-colors focus:outline-none"
                                                            >
                                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-[10px] font-semibold text-rose-500 ml-1" />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Referral Code */}
                                        <FormField
                                            control={form.control}
                                            name="referralCode"
                                            render={({ field }) => (
                                                <FormItem className="space-y-1.5 pt-2">
                                                    <FormLabel className="text-xs font-black text-slate-700 ml-1 uppercase tracking-widest">Referral Code <span className="text-slate-400 font-normal lowercase tracking-normal">(Optional)</span></FormLabel>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
                                                            <Input
                                                                placeholder="e.g. ABCD1234"
                                                                {...field}
                                                                className="h-14 rounded-2xl bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 pl-12 font-semibold uppercase transition-all focus:bg-white focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 shadow-sm hover:border-slate-300"
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
                                                <FormItem className="space-y-2 pt-2">
                                                    <div className="flex items-start space-x-3 ml-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                className="mt-0.5 rounded-md border-slate-300 text-[#003399] focus:ring-[#003399] data-[state=checked]:bg-[#003399]"
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <label className="text-xs font-bold text-slate-600 leading-relaxed cursor-pointer">
                                                                I agree to the{' '}
                                                                <Link href="/terms" className="text-[#003399] hover:underline decoration-2 underline-offset-2">
                                                                    Terms of Service
                                                                </Link>{' '}
                                                                and{' '}
                                                                <Link href="/privacy" className="text-[#003399] hover:underline decoration-2 underline-offset-2">
                                                                    Privacy Policy
                                                                </Link>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <FormMessage className="text-xs font-semibold text-rose-500 ml-1" />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-[#003399] hover:bg-blue-800 text-white rounded-2xl shadow-lg shadow-[#003399]/25 h-14 font-black text-sm tracking-wide transition-all hover:-translate-y-0.5 active:translate-y-0 mt-8"
                                        >
                                            {isLoading ? (
                                                <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Registering...</>
                                            ) : (
                                                <>Create Account <ArrowRight className="ml-2 h-5 w-5" /></>
                                            )}
                                        </Button>

                                        <div className="text-center text-sm font-bold text-slate-500 mt-8 pt-6">
                                            Already have an account?{' '}
                                            <Link href="/login" className="text-[#003399] hover:underline decoration-2 underline-offset-2">
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
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <div className="flex flex-col items-center mb-8 text-center bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                                    <div className="w-20 h-20 bg-blue-50 text-[#003399] rounded-3xl flex items-center justify-center mb-8 relative">
                                        <div className="absolute inset-0 bg-[#003399] opacity-10 rounded-3xl animate-ping" />
                                        <Key size={32} />
                                    </div>
                                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-3">Verify Your Email</h2>
                                    <p className="text-slate-500 font-semibold text-sm leading-relaxed px-4">
                                        We sent a 6-digit confirmation code to <br/>
                                        <span className="text-[#003399] font-black inline-block mt-2 bg-blue-50 px-3 py-1 rounded-lg">{registeredEmail}</span>
                                    </p>

                                    <div className="space-y-8 w-full mt-10">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block text-center">Verification Code</label>
                                            <div className="relative group max-w-[280px] mx-auto">
                                                <Input
                                                    type="text"
                                                    placeholder="000000"
                                                    maxLength={6}
                                                    value={otpCode}
                                                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                                                    className="h-16 rounded-2xl bg-slate-50 border-slate-200 text-slate-900 text-center font-black tracking-[0.75em] text-2xl transition-all focus:bg-white focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 shadow-inner"
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleVerifyOtp}
                                            disabled={isVerifyingOtp || otpCode.length < 4}
                                            className="w-full bg-[#003399] hover:bg-blue-800 text-white rounded-2xl shadow-lg shadow-[#003399]/25 h-14 font-black text-sm tracking-wide transition-all hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            {isVerifyingOtp ? (
                                                <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Verifying...</>
                                            ) : (
                                                <><ShieldCheck className="mr-2 h-5 w-5" />Verify & Sign In</>
                                            )}
                                        </Button>

                                        <div className="text-center pt-4">
                                            {resendTimer > 0 ? (
                                                <p className="text-sm font-bold text-slate-500">
                                                    Resend code in <span className="text-[#003399] font-black">{resendTimer}s</span>
                                                </p>
                                            ) : (
                                                <button
                                                    onClick={handleResendOtp}
                                                    disabled={isResendingOtp}
                                                    className="text-sm font-black text-[#003399] hover:underline decoration-2 underline-offset-2 disabled:opacity-50 transition-all"
                                                >
                                                    {isResendingOtp ? 'Resending...' : 'Resend Verification Code'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
