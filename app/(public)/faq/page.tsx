'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FAQPage() {
  const faqs = [
    { q: 'How do I download the C9X mobile app?', a: 'You can download C9X on the Apple App Store and Google Play Store. Simply search for "C9X" or visit the download links in the mobile section of our site.' },
    { q: 'Is registration free?', a: 'Yes! Creating an account on C9X is completely free for all buyers. Verified sellers may have specific tier-based options available inside the app.' },
    { q: 'What is the KYC process?', a: 'KYC (Know Your Customer) is our identity verification protocol. To ensure trust, all sellers must provide proof of identity and business registration before listing vehicles.' },
    { q: 'How secure is the auction system?', a: 'C9X uses a high-fidelity, transparent auction system. Every bid is timestamped and recorded, ensuring a fair and secure experience for all participants.' },
    { q: 'How do I contact a seller?', a: 'Once you find an item you like on the mobile app, you can use our secure messaging system to communicate directly with the verified vendor.' },
  ];

  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-40 text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8 text-[#003399]">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Everything you need to know about navigating the C9X ecosystem.
          </p>
        </motion.div>

        <div className="relative mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input 
            type="text" 
            placeholder="Search for answers..." 
            className="w-full h-20 pl-16 pr-8 rounded-3xl bg-white border border-slate-100 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
          />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-3xl border transition-all overflow-hidden ${openIndex === i ? 'bg-white border-blue-500 shadow-2xl' : 'bg-white border-slate-100 border-transparent shadow-sm'}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-8 flex items-center justify-between text-left group"
              >
                <span className={`text-xl font-bold tracking-tight transition-colors ${openIndex === i ? 'text-[#003399]' : 'text-slate-800 group-hover:text-blue-600'}`}>
                  {faq.q}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === i ? 'bg-[#003399] text-white rotate-180' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                  {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              {openIndex === i && (
                <div className="px-8 pb-8">
                  <div className="h-px bg-slate-100 mb-6" />
                  <p className="text-lg text-slate-500 leading-relaxed font-medium">
                    {faq.a}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-10 rounded-[3rem] bg-[#003399] text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-blue-200 mb-8 font-medium">We're always here to help. Reach out to our support team.</p>
          <Button size="lg" className="rounded-xl px-10 h-14 bg-white text-[#003399] font-bold hover:bg-slate-100">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
