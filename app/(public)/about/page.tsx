'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/logo';
import { TiltCard } from '@/components/public/tilt-card';
import { ShieldCheck, Globe, Zap, Users, Target, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
    const router = useRouter();

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

    return (
        <div className="pt-32 pb-20">
            {/* Header Section */}
            <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-32">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={revealVariants}
                    className="text-center max-w-3xl mx-auto space-y-8"
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#0066CC] text-xs font-bold uppercase tracking-widest">
                        <span>Our Vision</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-tight font-display">
                        Redefining the <br />
                        <span className="text-[#0066CC]">Automotive Standard.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium">
                        C9x was born from a simple realization: high-value automotive commerce deserves more than just an interface. It deserves a protocol.
                    </p>
                </motion.div>
            </section>

            {/* Values Grid */}
            <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-40">
                <div className="grid md:grid-cols-3 gap-10">
                    {[
                        { title: 'Institutional Trust', icon: ShieldCheck, desc: 'Every participant is vetted through a multi-layer KYC process to ensure a secure, elite community.' },
                        { title: 'Global Reach', icon: Globe, desc: 'Connecting specialized collectors and brokers across borders with unified escrow and logistics.' },
                        { title: 'High Fidelity', icon: Zap, desc: 'Our platform is designed for performance, ensuring speed and precision in every high-stakes transaction.' }
                    ].map((item, idx) => (
                        <TiltCard key={idx}>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={revealVariants}
                                transition={{ delay: idx * 0.1 }}
                                className="p-10 rounded-3xl glass border-slate-100 h-full"
                            >
                                <div className="w-14 h-14 bg-[#0066CC] rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg">
                                    <item.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                            </motion.div>
                        </TiltCard>
                    ))}
                </div>
            </section>

            {/* Story Section */}
            <section className="py-32 bg-slate-900 text-white rounded-[4rem] mx-4 overflow-hidden relative mb-40">
                <div className="absolute inset-0 grid-pattern opacity-10" />
                <div className="max-w-7xl mx-auto px-10 md:px-24 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={revealVariants}
                            className="space-y-10"
                        >
                            <h2 className="text-5xl md:text-6xl font-bold font-display tracking-tight">The C9x Evolution.</h2>
                            <p className="text-xl text-slate-400 font-medium leading-relaxed">
                                Our journey started with a group of automotive enthusiasts and technology architects who saw the fragmentation in the luxury car market. We didn't want another marketplace; we wanted an ecosystem.
                            </p>
                            <div className="space-y-6">
                                {[
                                    { icon: Users, label: 'Elite Community', text: 'Built for collectors, by collectors.' },
                                    { icon: Target, label: 'Unmatched Precision', text: 'Real-time data and institutional analytics.' },
                                    { icon: Shield, label: 'Absolute Security', text: 'Proprietary protocol for secure asset movement.' }
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center space-x-6 bg-white/5 p-4 rounded-2xl border border-white/10">
                                        <div className="w-12 h-12 rounded-xl bg-[#0066CC] flex items-center justify-center flex-shrink-0 text-white shadow-lg">
                                            <step.icon size={24} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-widest text-[#00AAFF]">{step.label}</div>
                                            <div className="text-lg font-bold">{step.text}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <div className="relative justify-center hidden lg:flex">
                            <div className="w-80 h-80 bg-linear-to-br from-[#0066CC] to-[#004499] rounded-[4rem] flex items-center justify-center p-10 transform rotate-6 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                                <Logo className="w-40 h-40 logo-glow" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={revealVariants}
                    className="space-y-12"
                >
                    <h2 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight font-display">Join the Future.</h2>
                    <p className="text-xl text-slate-500 font-medium">Ready to experience the ultimate automotive ecosystem? Be part of our Q2 rollout.</p>
                    <Button onClick={() => router.push('/#waitlist')} size="lg" className="h-16 px-12 rounded-full text-xl font-bold bg-[#0066CC] hover:bg-blue-700 shadow-xl shadow-primary/20">
                        Join Waitlist
                    </Button>
                </motion.div>
            </section>
        </div>
    );
}
