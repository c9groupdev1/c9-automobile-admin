'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
    const revealVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut" as any
            }
        }
    };

    return (
        <div className="pt-40 pb-32">
            <section className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={revealVariants}
                    className="space-y-12"
                >
                    <div className="space-y-4">
                        <div className="text-[#0066CC] font-black text-xs uppercase tracking-widest">Legal / Protocol v0.4.2</div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight font-display">Privacy Policy.</h1>
                        <p className="text-slate-500 font-medium">Last Updated: March 2026</p>
                    </div>

                    <div className="glass p-10 md:p-16 rounded-[3rem] border-slate-100 shadow-xl space-y-10 text-lg text-slate-600 leading-relaxed font-medium">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 font-display">1. Data Architecture</h2>
                            <p>
                                C9x operates under a "Security First" protocol. We collect only the information necessary to facilitate institutional automotive transactions and ensure the integrity of our vetted community. This includes identity verification data (KYC), professional contact details, and transaction-related metadata.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 font-display">2. Encryption & Security</h2>
                            <p>
                                All sensitive data transmitted through the C9x Protocol is encrypted using bank-grade AES-256 standards. Interaction logs and negotiation data are stored in isolated, encrypted environments with strict audit trails.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 font-display">3. Third-Party Integration</h2>
                            <p>
                                We do not sell or trade your data to third parties. Data sharing is limited to essential service providers (e.g., identity verification partners, escrow services) who are strictly bound by our security protocols and confidentiality agreements.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 font-display">4. Your Sovereignty</h2>
                            <p>
                                As a participant in the C9x Ecosystem, you retain full rights to your data. You may request data access, rectification, or complete removal from the protocol at any time through our secure messaging hub or priority support line.
                            </p>
                        </section>

                        <div className="pt-10 border-t border-slate-100 italic text-sm text-slate-400">
                            For institutional inquiries regarding our data governance, please contact our Compliance Officer at legal@c9automobile.com.
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
