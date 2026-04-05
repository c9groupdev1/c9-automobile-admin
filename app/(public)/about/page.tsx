'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Target, Award } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Verified Vendors', value: '500+' },
    { label: 'Transactions', value: '₦2B+' },
    { label: 'States Covered', value: '36' },
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-40 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8 text-[#003399]">
            Driving the Future of <span className="text-blue-600">Auto Commerce</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            C9X is Nigeria's most trusted automotive ecosystem, connecting buyers, sellers, and service providers through a secure, high-fidelity platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">Our Mission</h2>
              <p className="text-2xl font-bold text-slate-900 leading-tight">
                To power Africa’s automotive economy by digitizing vehicle transactions, optimizing supply chains, and enabling seamless access to premium vehicles across the continent.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">Our Vision</h2>
              <ul className="space-y-3">
                {[
                  'Building Africa’s Automotive Commerce Infrastructure',
                  'Digitizing premium vehicle trade across Africa',
                  'Creating the dominant automotive ecosystem platform'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg text-slate-600 font-medium leading-relaxed">
                    <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              {stats.map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-3xl font-black text-[#003399] mb-1">{stat.value}</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative aspect-square bg-[#003399] rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center p-20 text-white/10">
              <Shield size={300} strokeWidth={1} />
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: 'Community Driven', desc: 'Built for Nigerians, by Nigerians who understand the auto market.' },
            { icon: Target, title: 'Precision Auctions', desc: 'Our unique bidding system ensures fair value for every asset.' },
            { icon: Award, title: 'Verified Quality', desc: 'Every vendor and listing undergoes a multi-step KYC process.' },
          ].map((item, i) => (
            <div key={i} className="p-10 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#003399] mb-8">
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
