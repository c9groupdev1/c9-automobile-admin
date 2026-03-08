'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TermsPage() {
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
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight font-display">Terms of Service.</h1>
                        <p className="text-slate-500 font-medium">Last Updated: March 2026</p>
                    </div>

                    <div className="glass p-10 md:p-16 rounded-[3rem] border-slate-100 shadow-xl space-y-10 text-lg text-slate-600 leading-relaxed font-medium">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 font-display">1. Protocol Access & Eligibility</h2>
                            <p>
                                Access to the C9x Protocol is restricted to individuals and institutions who have successfully undergone our mandatory KYC (Know Your Customer) verification process. We reserve the right to deny or revoke access to any participant who fails to maintain the platform's professional standards.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 font-display">2. Participant Responsibility</h2>
                            <p>
                                All participants are responsible for the accuracy of the information provided within the ecosystem. High-value automotive transactions require absolute transparency. Misrepresentation of assets, funds, or identity is strictly prohibited and may result in permanent exclusion from the protocol.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 font-display">3. Transaction Integrity</h2>
                            <p>
                                Negotiations and bids made through the C9x Marketplace and Auctions modules are considered binding commitments under the protocol. While C9x facilitates these connections, the ultimate transaction is governed by the individual purchase agreements executed between the parties, secured by our audit trails.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 font-display">4. Intellectual Sovereignty</h2>
                            <p>
                                The C9x interface, proprietary protocol logic, brand assets, and technology stack are the exclusive intellectual property of the C9x Automobile Ecosystem. Any unauthorized replication, reverse engineering, or scraping of the protocol's data is strictly forbidden.
                            </p>
                        </section>

                        <div className="pt-10 border-t border-slate-100 italic text-sm text-slate-400">
                            By accessing the C9x Protocol, you acknowledge that you have read, understood, and agreed to be bound by these institutional terms.
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
