'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from '@/components/public/tilt-card';
import { Clock, ShoppingCart, ShieldCheck, MapPin, Zap, MessageSquare, BarChart3, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
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

    const modules = [
        {
            title: 'Global Auctions',
            icon: Clock,
            color: '#0066CC',
            desc: 'A proprietary bidding engine designed for high-stakes transparency. Real-time updates, competitive logic, and global accessibility.',
            features: ['Live Bidding Room', 'Automatic Proxy Bidding', 'Verified Title Verification', 'Post-Auction Escrow']
        },
        {
            title: 'Advanced Marketplace',
            icon: ShoppingCart,
            color: '#00AAFF',
            desc: 'Connect with a vetted network of sellers and buyers. From premium vehicles to high-performance components, curated for excellence.',
            features: ['Institutional Listings', 'Multi-Layer Search', 'Parts & Inventory Sync', 'Vendor Analytics']
        },
        {
            title: 'Institutional KYC',
            icon: ShieldCheck,
            color: '#004499',
            desc: 'Every participant goes through a rigorous bank-grade identity and asset verification process to maintain a trusted ecosystem.',
            features: ['Identity Shield', 'AML Compliance', 'Vetted Buyer Status', 'Secure Document Hub']
        },
        {
            title: 'Elite Service Hub',
            icon: MapPin,
            color: '#0066CC',
            desc: 'Direct access to the world’s most renowned restoration, maintenance, and logistics partners, all vetted by the C9x Protocol.',
            features: ['Verified Partners', 'Direct Booking', 'Service Audit Trail', 'Global Logistics Sync']
        }
    ];

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
                        <span>Our Modules</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-tight font-display">
                        Complete <br />
                        <span className="text-[#0066CC]">Automotive Mastery.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-medium">
                        C9x isn't just a platform; it's a modular ecosystem designed to handle every facet of the high-value automotive journey.
                    </p>
                </motion.div>
            </section>

            {/* Modules Section */}
            <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-40">
                <div className="grid lg:grid-cols-2 gap-12">
                    {modules.map((module, idx) => (
                        <TiltCard key={idx}>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={revealVariants}
                                transition={{ delay: idx * 0.1 }}
                                className="p-12 rounded-[3.5rem] glass border-slate-100 h-full flex flex-col"
                            >
                                <div className="flex items-center space-x-6 mb-10">
                                    <div className="w-20 h-20 bg-[#0066CC] rounded-3xl flex items-center justify-center text-white shadow-2xl">
                                        <module.icon size={40} />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-bold text-slate-900 tracking-tight font-display">{module.title}</h3>
                                        <div className="text-[#00AAFF] font-black text-xs uppercase tracking-widest opacity-60">Module C9-00{idx + 1}</div>
                                    </div>
                                </div>

                                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10 flex-grow">
                                    {module.desc}
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    {module.features.map((feature, fidx) => (
                                        <div key={fidx} className="flex items-center space-x-3 px-5 py-4 rounded-2xl bg-white/50 border border-slate-100 text-slate-700 font-bold text-sm">
                                            <div className="w-2 h-2 rounded-full bg-[#0066CC]"></div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </TiltCard>
                    ))}
                </div>
            </section>

            {/* Features Banner */}
            <section className="py-20 bg-slate-900 overflow-hidden relative mb-40">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex flex-wrap items-center justify-center gap-16 md:gap-24">
                        {[
                            { icon: Zap, label: 'Instant Execution' },
                            { icon: MessageSquare, label: 'Secure Negotiation' },
                            { icon: BarChart3, label: 'Advanced Analytics' },
                            { icon: Globe, label: 'Global Compliance' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <item.icon className="text-[#00AAFF]" size={36} />
                                <span className="text-white text-xl font-bold font-display">{item.label}</span>
                            </div>
                        ))}
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
                    <h2 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight font-display">Power Your Performance.</h2>
                    <p className="text-xl text-slate-500 font-medium">Ready to deploy the C9x Protocol for your collection or business? Early access is open.</p>
                    <Button onClick={() => router.push('/#waitlist')} size="lg" className="h-16 px-12 rounded-full text-xl font-bold bg-[#0066CC] hover:bg-blue-700 shadow-xl shadow-primary/20">
                        Get Started
                    </Button>
                </motion.div>
            </section>
        </div>
    );
}
