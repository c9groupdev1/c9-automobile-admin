'use client';

import React from 'react';
import { LucideIcon, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Section {
    title: string;
    icon: LucideIcon;
    content: string | string[];
    color?: string;
    bgColor?: string;
}

interface InformationScreenProps {
    title: string;
    sections: Section[];
    lastUpdated: string;
    subtitle?: string;
}

export function InformationScreen({ title, sections, lastUpdated, subtitle }: InformationScreenProps) {
    const revealVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 pt-10 px-6">
            {/* Header */}
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={revealVariants}
                className="text-center space-y-4"
            >
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="h-[1px] w-12 bg-slate-200"></div>
                    <Badge variant="outline" className="rounded-full px-4 py-1 border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        Official Protocol
                    </Badge>
                    <div className="h-[1px] w-12 bg-slate-200"></div>
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-4 font-display">{title}</h1>
                {subtitle && <p className="text-slate-500 font-medium max-w-2xl mx-auto">{subtitle}</p>}
                <div className="flex items-center justify-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <Clock size={14} />
                    Last Updated: {lastUpdated}
                </div>
            </motion.div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={revealVariants}
                        className={cn(
                            idx === 0 && "md:col-span-2"
                        )}
                    >
                        <Card className={cn(
                            "h-full rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 group",
                            idx === 0 && "bg-slate-900 border-slate-800"
                        )}>
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300",
                                        idx === 0 ? "bg-white/10 text-white" : "bg-slate-50 text-[#0066CC]"
                                    )}>
                                        <section.icon size={24} />
                                    </div>
                                    <CardTitle className={cn(
                                        "text-xl font-black tracking-tight",
                                        idx === 0 ? "text-white" : "text-slate-900"
                                    )}>
                                        {section.title}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4">
                                {Array.isArray(section.content) ? (
                                    <ul className="space-y-4">
                                        {section.content.map((item, i) => (
                                            <li key={i} className="flex gap-4">
                                                <div className="flex-shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0066CC]" />
                                                <p className={cn(
                                                    "text-sm font-medium leading-relaxed",
                                                    idx === 0 ? "text-slate-400" : "text-slate-600"
                                                )}>{item}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className={cn(
                                        "text-sm font-medium leading-relaxed",
                                        idx === 0 ? "text-slate-300 italic" : "text-slate-600"
                                    )}>
                                        {section.content}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Footer Note */}
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={revealVariants}
                className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 flex flex-col md:flex-row items-center justify-center text-center gap-4"
            >
                <p className="text-sm font-medium text-slate-500">
                    For any inquiries regarding our policies, please contact <span className="text-[#0066CC] font-bold">legal@c9x.com</span>
                </p>
            </motion.div>
        </div>
    );
}
