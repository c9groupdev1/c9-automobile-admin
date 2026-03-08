'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  ShoppingCart,
  MapPin,
  ShieldCheck,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  Zap,
  Play
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TiltCard } from '@/components/public/tilt-card';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const scrollToWaitlist = () => {
    const el = document.getElementById('waitlist');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
              className="space-y-10 text-left"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#0066CC] text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 bg-[#0066CC] rounded-full animate-pulse"></span>
                <span>Launching Soon</span>
              </div>

              <h1 className="text-6xl md:text-[5.5rem] font-bold text-slate-900 leading-[1.05] tracking-tighter font-display">
                The Future of <br />
                <span className="text-[#0066CC] relative inline-block">
                  Automotive
                  <svg className="absolute -bottom-1 left-0 w-full" height="12" viewBox="0 0 200 12" preserveAspectRatio="none">
                    <path d="M0,8 Q50,0 100,8 T200,8" stroke="#0066CC" strokeWidth="4" fill="none" className="car-silhouette" />
                  </svg>
                </span>
                <br />Commerce
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 max-w-lg leading-relaxed font-medium">
                C9x is a unified ecosystem for high-stakes automotive transactions. Built for speed, secured by technology.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group">
                  <div className="pulse-ring inset-0 z-0"></div>
                  <Button size="lg" onClick={scrollToWaitlist} className="relative z-10 h-16 px-10 rounded-full text-lg shadow-2xl hover:shadow-primary/40 transition-all font-bold bg-[#0066CC] hover:bg-blue-700 hover:scale-105 transform">
                    Join Waitlist
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
                <Button size="lg" variant="ghost" className="h-16 px-8 text-slate-600 hover:text-[#0066CC] font-bold text-lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Features
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-200">
                <div>
                  <div className="text-3xl font-bold text-[#0066CC] font-display">5+</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Market Modules</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0066CC] font-display">100%</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secure KYC</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0066CC] font-display">24/7</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Support</div>
                </div>
              </div>
            </motion.div>

            {/* Visual Visual */}
            <div className="relative flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative w-full max-w-lg float"
              >
                {/* Logo Watermark */}
                <div className="absolute -top-16 -right-16 w-40 h-40 opacity-5 z-0 pointer-events-none">
                  <Logo className="w-full h-full" />
                </div>

                <div className="glass-dark rounded-[2.5rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,102,204,0.3)] border border-white/20 transform md:rotate-3 hover:rotate-0 transition-transform duration-700 relative z-10 group">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#0066CC] rounded-xl flex items-center justify-center shadow-lg">
                          <Logo className="w-6 h-6" />
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight">C9x Protocol</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Secure</span>
                      </div>
                    </div>

                    {/* Mock UI elements */}
                    <div className="space-y-4">
                      <div className="h-40 bg-linear-to-br from-[#0066CC] to-[#004499] rounded-2xl flex flex-col items-center justify-center text-white relative overflow-hidden group/card shadow-xl">
                        <div className="relative z-10 text-center">
                          <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1 font-display">Live Auctions</div>
                          <div className="text-3xl font-bold tracking-tighter">$142,500.00</div>
                        </div>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                        <Play className="absolute bottom-4 right-4 text-white/40 group-hover/card:text-white transition-colors" size={20} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-28 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer group/node shadow-lg">
                          <ShoppingCart className="mb-2 text-[#00AAFF]" size={24} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Marketplace</span>
                        </div>
                        <div className="h-28 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer group/node shadow-lg">
                          <Zap className="mb-2 text-yellow-400" size={24} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Elite Hub</span>
                        </div>
                      </div>
                      <div className="h-20 bg-white/10 rounded-2xl flex items-center px-6 space-x-4 border border-white/5 shadow-inner">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-[#00AAFF] font-black text-xs">KYC</div>
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "85%" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-full bg-linear-to-r from-[#0066CC] to-[#00AAFF]"
                          ></motion.div>
                        </div>
                        <CheckCircle2 size={18} className="text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating indicators */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -left-8 w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center rotate-12 z-20 border border-slate-100"
                >
                  <Logo className="w-12 h-12" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#0066CC] rounded-3xl shadow-2xl flex items-center justify-center -rotate-6 z-20 text-white"
                >
                  <ShieldCheck size={32} />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-40 md:py-64 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-32">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 mx-auto mb-10 bg-[#0066CC] rounded-3xl shadow-xl flex items-center justify-center"
            >
              <Logo className="w-10 h-10" />
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 font-display tracking-tight">Everything Automotive. <br /><span className="text-[#0066CC]">Unified.</span></h2>
            <p className="text-2xl text-slate-500 font-medium leading-relaxed">C9x combines marketplace, auctions, and enterprise-grade tools into a single, high-fidelity experience.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, idx) => (
              <TiltCard key={idx}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={revealVariants}
                  transition={{ delay: idx * 0.1 }}
                  className="group h-full p-10 rounded-3xl glass hover:bg-white/90 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-2 border-slate-100"
                >
                  <div className="w-16 h-16 bg-[#0066CC] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl text-white">
                    <f.icon size={30} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed text-lg">{f.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-20 md:py-40 bg-slate-900 text-white rounded-[4rem] md:rounded-[7rem] mx-4 mb-32 overflow-hidden relative">
        <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#0066CC]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-10 md:px-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
              className="space-y-12"
            >
              <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.95] font-display">Built for Trust. <br /><span className="text-[#0066CC] italic">Designed for Scale.</span></h2>
              <p className="text-2xl text-slate-400 font-medium leading-relaxed max-w-xl">
                C9x isn't just another platform. We're rebuilding automotive commerce through institutional transparency and elite user experience.
              </p>

              <div className="space-y-8">
                {[
                  { step: 1, title: 'Verify Identity', desc: 'Enterprise-grade KYC ensures a vetted community.' },
                  { step: 2, title: 'Explore Hub', desc: 'Universal access to vehicles, parts, and elite services.' },
                  { step: 3, title: 'Transact Securely', desc: 'Encrypted negotiations with full audit trails.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-6">
                    <div className="w-10 h-10 rounded-full bg-[#0066CC] flex items-center justify-center text-white font-bold text-lg flex-shrink-0 mt-1 shadow-lg ring-4 ring-blue-500/20">{item.step}</div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1 uppercase tracking-widest text-xs opacity-50">{item.title}</h4>
                      <p className="text-slate-400 font-medium text-lg leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="relative aspect-square reveal hidden lg:block">
              <div className="relative w-full h-full bg-linear-to-br from-white/10 to-transparent rounded-full flex items-center justify-center p-20 border border-white/5">
                {/* Pulse circles */}
                <div className="absolute inset-0 border-4 border-[#0066CC]/20 rounded-full animate-ping opacity-30" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-20 border-4 border-[#0066CC]/30 rounded-full animate-ping opacity-30" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>

                <div className="relative w-full h-full glass-dark rounded-[5rem] flex items-center justify-center shadow-3xl transform rotate-12">
                  <Logo className="w-48 h-48 logo-glow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-40 md:py-64 relative overflow-hidden bg-transparent">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {!isSubmitted ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={revealVariants}
              className="space-y-16"
            >
              <div className="w-24 h-24 mx-auto logo-glow shadow-primary/20 rounded-[2.5rem] bg-white flex items-center justify-center">
                <Logo className="w-14 h-14" />
              </div>

              <h2 className="text-6xl md:text-8xl font-bold text-slate-900 tracking-tighter leading-tight font-display">Be the First to <br />Experience C9<span className="text-[#0066CC]">x</span></h2>
              <p className="text-2xl text-slate-500 font-medium max-w-2xl mx-auto">Join the exclusive queue for our Q2 rollout. Early access is strictly limited.</p>

              <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto group">
                <div className="relative flex flex-col sm:flex-row items-stretch gap-4 p-3 glass rounded-[2.5rem] shadow-2xl transition-all group-focus-within:ring-4 ring-primary/10">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your professional email"
                    required
                    className="h-16 rounded-full bg-white/50 border-transparent focus:ring-0 text-xl px-8 flex-1 placeholder:text-slate-400 font-semibold"
                  />
                  <Button type="submit" className="h-16 px-12 rounded-full text-xl font-bold bg-[#0066CC] hover:bg-blue-700 text-white shadow-xl shadow-primary/20">
                    Notify Me
                  </Button>
                </div>
                <p className="mt-6 text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose">No spam. Strictly elite updates only.</p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass rounded-[4rem] p-24 text-center shadow-3xl"
            >
              <div className="w-24 h-24 bg-[#0066CC] text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl animate-bounce">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-5xl font-bold text-slate-900 mb-4 tracking-tighter">You're on the list.</h3>
              <p className="text-2xl text-slate-500 font-medium opacity-80 mb-8">Verification #Q2-002,482 confirmed.</p>
              <div className="inline-block px-8 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#0066CC] text-xs font-bold tracking-widest uppercase">Verified by C9x Protocol</div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

const features = [
  { title: 'Live Auctions', icon: Clock, desc: 'Real-time bidding on premium vehicles. Transparent, competitive, and secured by our proprietary escrow logic.' },
  { title: 'Parts Marketplace', icon: ShoppingCart, desc: 'Source genuine high-performance parts from verified global vendors. Quality assured with every procurement.' },
  { title: 'Elite Services', icon: MapPin, desc: 'Locate thoroughly vetted restoration and maintenance partners worldwide. Reviews, ratings, and instant booking.' },
  { title: 'Institutional KYC', icon: ShieldCheck, desc: 'Bank-grade identity verification ensures every participant in the ecosystem is fully vetted and trusted.' },
  { title: 'Secure Messaging', icon: MessageSquare, desc: 'End-to-end encrypted negotiation room designed for discreet, high-value asset discussions.' },
  { title: 'Enterprise Hub', icon: BarChart3, desc: 'Track your listings, bids, and fleet performance with comprehensive institutional analytics.' }
];
