'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/logo';
import { Mail, MessageSquare, MapPin, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const revealVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.21, 1, 0.36, 1] as any
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="pt-32 pb-20">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-32">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={revealVariants}
                    className="text-center max-w-3xl mx-auto space-y-8"
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#0066CC] text-xs font-bold uppercase tracking-widest">
                        <span>Get in Touch</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-tight font-display">
                        Connect with <br />
                        <span className="text-[#0066CC]">Excellence.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium">
                        Whether you're a high-stakes collector, a specialized broker, or an institutional partner, we're ready to discuss the future.
                    </p>
                </motion.div>
            </section>

            {/* Contact Grid */}
            <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-40">
                <div className="grid lg:grid-cols-5 gap-16 items-start">
                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="space-y-8">
                            <h3 className="text-3xl font-bold text-slate-900 tracking-tight font-display">Global HQ</h3>
                            <div className="space-y-6">
                                {[
                                    { icon: MapPin, label: 'Location', text: '100 Protocol Way, Silicon Valley, CA' },
                                    { icon: Mail, label: 'Professional Inquiries', text: 'excellence@c9automobile.com' },
                                    { icon: MessageSquare, label: 'Press & Media', text: 'media@c9automobile.com' },
                                    { icon: Globe, label: 'Global Access', text: 'Operating in 45+ jurisdictions' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-6 group">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[#0066CC] shadow-sm group-hover:shadow-md transition-shadow">
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</div>
                                            <div className="text-lg font-bold text-slate-700">{item.text}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 grid-pattern opacity-10" />
                            <div className="relative z-10 space-y-4">
                                <Logo className="w-10 h-10 mb-4" />
                                <h4 className="text-xl font-bold font-display">24/7 Priority Support</h4>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    Our institutional partners receive dedicated account managers and 24/7 priority secure line access.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        {!submitted ? (
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={revealVariants}
                                className="glass p-12 rounded-[3.5rem] border-slate-100 shadow-3xl"
                            >
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Full Name</label>
                                            <Input required placeholder="John Doe" className="h-16 rounded-3xl bg-white/50 border-slate-100 focus:ring-[#0066CC] text-lg px-8 font-semibold shadow-inner" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Email Address</label>
                                            <Input required type="email" placeholder="john@company.com" className="h-16 rounded-3xl bg-white/50 border-slate-100 focus:ring-[#0066CC] text-lg px-8 font-semibold shadow-inner" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Subject</label>
                                        <Input required placeholder="Partnership Inquiry / Institutional Access" className="h-16 rounded-3xl bg-white/50 border-slate-100 focus:ring-[#0066CC] text-lg px-8 font-semibold shadow-inner" />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Message</label>
                                        <Textarea required placeholder="How can we assist your automotive journey?" className="min-h-[200px] rounded-[2rem] bg-white/50 border-slate-100 focus:ring-[#0066CC] text-lg p-8 font-semibold shadow-inner resize-none" />
                                    </div>

                                    <Button type="submit" className="w-full h-18 rounded-3xl text-xl font-bold bg-[#0066CC] hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all transform hover:scale-[1.02]">
                                        Transmit Inquiry
                                        <ArrowRight className="ml-2 w-6 h-6" />
                                    </Button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="glass p-20 rounded-[3.5rem] border-slate-100 shadow-3xl text-center space-y-10"
                            >
                                <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                                    <CheckCircle2 size={48} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-5xl font-bold text-slate-900 tracking-tight font-display">Transmission Received.</h3>
                                    <p className="text-xl text-slate-500 font-medium">Our protocol specialists will review your inquiry and reach out within 12 standard business hours.</p>
                                </div>
                                <div className="inline-block px-8 py-3 rounded-full bg-blue-50 border border-blue-100 text-[#0066CC] text-xs font-black tracking-widest uppercase">Encryption Key: C9-SEC-VAL-882</div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
