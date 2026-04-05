'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Car,
  Settings,
  Wrench,
  Gavel,
  Store,
  UserPlus,
  Search,
  Handshake,
  Check,
  Users,
  User,
  Lock,
  Zap,
  Play,
  MessageSquare,
  MapPin,
  Clock,
  Shield,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TiltCard } from '@/components/public/tilt-card';
import { Logo } from '@/components/logo';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden bg-[#003399] text-white">
        {/* Background Patterns - Circle as seen in screenshot */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white">
                Nigeria's Automotive <br />
                Marketplace for <br />
                Cars and Auctions
              </h1>
              <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed max-w-lg">
                Connect with thousands of buyers and sellers in Nigeria’s most trusted automotive ecosystem.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Button 
                  size="lg" 
                  onClick={() => router.push('/auth/login')}
                  className="w-full sm:w-auto h-12 px-10 rounded-xl text-base font-bold bg-white text-[#003399] hover:bg-slate-100 transition-all"
                >
                  Login
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => router.push('/about')}
                  className="w-full sm:w-auto h-12 px-10 rounded-xl text-base font-bold border-white/30 bg-transparent hover:bg-white/10 text-white"
                >
                  About Us
                </Button>
              </div>
              
              <div className="flex items-center space-x-2 text-sm font-semibold opacity-70">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Over 10,000 active users this month</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative hidden lg:block"
            >
              {/* Large Circle visual from screenshot */}
              <div className="w-[500px] h-[500px] bg-white/5 rounded-full border border-white/10 flex items-center justify-center p-20">
                <div className="w-full h-full bg-white/5 rounded-full blur-3xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section - Simplified to focus on core platform */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="text-center max-w-3xl mx-auto mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
              Everything Automotive in <span className="text-[#0066CC]">One Platform</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <TiltCard>
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all h-full group">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg">
                  <Car className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">Cars Marketplace</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-6">
                  Secure high-quality vehicles from verified dealerships and private sellers across the federation.
                </p>
                <Button variant="ghost" className="p-0 text-[#0066CC] font-bold hover:bg-transparent hover:translate-x-1 transition-transform">
                  Explore Now <ChevronRight size={18} className="ml-1" />
                </Button>
              </div>
            </TiltCard>
            <TiltCard>
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all h-full group">
                <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg">
                  <Gavel className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">Vehicle Auctions</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-6">
                  Real-time bidding on top-tier assets. Transparent, fair, and high-fidelity experience.
                </p>
                <Button variant="ghost" className="p-0 text-[#0066CC] font-bold hover:bg-transparent hover:translate-x-1 transition-transform">
                  Explore Now <ChevronRight size={18} className="ml-1" />
                </Button>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="text-center max-w-3xl mx-auto mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">How C9x Works</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {workflowSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center space-y-6"
              >
                <div className={`w-16 h-16 mx-auto rounded-xl ${step.color} flex items-center justify-center text-white text-2xl font-bold shadow-xl`}>
                  {i + 1}
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Promo */}
      <section className="py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-center" id="seller-promo">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
              className="space-y-10"
            >
              <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                Sell Cars to Thousands of Buyers
              </h2>
              <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
                Connect with brokers, dealers, mechanics, and car enthusiasts across Nigeria in the most trusted ecosystem.
              </p>
              <ul className="space-y-4">
                {[
                  'Trust worthy',
                  'Security',
                  'Universal Access',
                  'Proven ROI workshop',
                  'Audited listings'
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-slate-700 font-bold">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                size="lg" 
                onClick={() => router.push('/auth/login')}
                className="h-12 px-10 rounded-xl text-base font-bold bg-[#003399] hover:bg-blue-800 text-white shadow-xl shadow-blue-900/10"
              >
                Explore More
              </Button>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/3] bg-slate-200 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-8 border-white">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                  <Car className="w-32 h-32 text-slate-400 opacity-50" />
                </div>
              </div>
              <div className="absolute -bottom-10 -left-10 glass p-8 rounded-3xl shadow-2xl border border-white/50 max-w-xs">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-[#0066CC] rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="text-xl font-bold tracking-tight">24k+</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Buyers</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Use C9x */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
            className="text-center max-w-3xl mx-auto mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Why Use C9x</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {whyC9x.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all h-full"
              >
                <div className={`w-12 h-12 ${item.color} bg-opacity-10 rounded-xl flex items-center justify-center mb-6`}>
                  <item.icon className={item.textColor} size={24} />
                </div>
                <h4 className="text-xl font-bold mb-3 tracking-tight">{item.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Referral */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#FF9900] to-[#FF6600] rounded-[3rem] p-12 md:p-20 text-white text-center shadow-3xl shadow-orange-500/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8">
                <Users size={40} className="text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Earn by Referring Others</h2>
              <p className="text-xl text-white/80 font-medium mb-10 max-w-xl mx-auto">
                Invite friends and colleagues to join C9x and earn points with every trade.
              </p>
              <Button size="lg" className="h-16 px-12 rounded-xl text-xl font-bold bg-white text-[#FF6600] hover:bg-slate-100 shadow-xl transition-all">
                Start Referring
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-slate-900 text-white rounded-[4rem] mx-4 mb-32 overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 grid-pattern opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={revealVariants}
             className="space-y-12"
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
              Start Buying, Selling and Bidding Today
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" onClick={() => router.push('/auth/login')} className="h-14 px-10 rounded-xl text-lg font-bold bg-[#003399] hover:bg-blue-700 shadow-xl">
                Login to Portal
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Data
const services = [
  { title: 'Cars Marketplace', icon: Car, color: 'bg-blue-600', desc: 'Secure high-quality vehicles from verified dealerships and private sellers across the federation.' },
  { title: 'Car Parts Marketplace', icon: Settings, color: 'bg-orange-600', desc: 'Find genuine spare parts and performance upgrades for every makes and models.' },
  { title: 'Auto Services', icon: Wrench, color: 'bg-green-600', desc: 'Discover thoroughly vetted car maintenance and repair services near you.' },
  { title: 'Vehicle Auctions', icon: Gavel, color: 'bg-purple-600', desc: 'Real-time bidding on top-tier assets. Transparent, fair, and high-fidelity experience.' },
  { title: 'C9 Store', icon: Store, color: 'bg-blue-500', desc: 'Official C9x merchandise, gadgets and proprietary tools for automotive enthusiasts.' }
];

const workflowSteps = [
  { title: 'Download App', color: 'bg-[#003399]', desc: 'Download the seamless C9X mobile application on iOS or Android and verify your identity.' },
  { title: 'Explore Marketplace', color: 'bg-[#FF9900]', desc: 'Browse through an extensive list of cars and elite automotive auctions.' },
  { title: 'Connect and Trade', color: 'bg-green-600', desc: 'Connect with verified partners, negotiate securely and close deals faster.' }
];

const whyC9x = [
  { icon: ShieldCheck, color: 'bg-blue-500', textColor: 'text-blue-600', title: 'Verified Vendors and Listings', desc: 'Every car and vendor undergoes rigorous background checks to insure trust.' },
  { icon: UserPlus, color: 'bg-green-500', textColor: 'text-green-600', title: 'KYC Verification', desc: 'Ensure you are trading with real, verified people and institutions.' },
  { icon: Lock, color: 'bg-orange-500', textColor: 'text-orange-600', title: 'End to End Encryption', desc: 'Your personal data and trade communications are protected by top-tier protocols.' },
  { icon: MessageSquare, color: 'bg-purple-500', textColor: 'text-purple-600', title: 'Easy Messaging', desc: 'Secure, real-time communication between buyers and sellers.' },
  { icon: MapPin, color: 'bg-red-500', textColor: 'text-red-600', title: 'Location-Based Discovery', desc: 'Find the best deals and services closest to your current location.' },
  { icon: FileCheck, color: 'bg-blue-400', textColor: 'text-blue-500', title: 'Slower Auction Systems', desc: 'A more thoughtful bidding process that ensures quality over quantity.' }
];
