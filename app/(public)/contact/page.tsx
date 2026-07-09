'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Paperclip, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSendSupportEnquiry } from '@/hooks/useSupport';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [file, setFile] = useState<File | null>(null);
  const { mutate: sendEnquiry, isPending } = useSendSupportEnquiry();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('subject', data.subject);
    formData.append('message', data.message);
    if (file) {
      if (file.size > 500 * 1024) {
        toast.error('Attachment size must not exceed 500KB');
        return;
      }
      formData.append('attachment', file);
    }

    sendEnquiry(formData, {
      onSuccess: () => {
        toast.success('Your message has been sent successfully!');
        reset();
        setFile(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
      },
    });
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-40 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8 text-[#003399]">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Have questions about the C9X ecosystem? Our team is here to help you navigate the future of automotive commerce.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
              <h3 className="text-xl font-bold mb-6">Contact Info</h3>
              <div className="space-y-6">
                {[
                  { icon: Mail, label: 'Email Us', value: 'support@thec9group.com' },
                  { icon: Phone, label: 'Call Us', value: '+234 800 C9X AUTO' },
                  { icon: MapPin, label: 'Headquarters', value: 'Abuja, Nigeria' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#003399]">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</div>
                      <div className="text-base font-bold text-slate-900">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#003399] text-white">
              <h3 className="text-xl font-bold mb-4">Support Hours</h3>
              <p className="text-blue-200 text-sm leading-relaxed mb-6">
                Our support team is available 24/7 to assist with any technical issues or transaction inquiries.
              </p>
              <div className="text-2xl font-black">24/7</div>
              <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mt-1">Live Support</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 p-10 md:p-12 rounded-[3rem] bg-white border border-slate-100 shadow-2xl"
          >
            <form className="grid md:grid-cols-2 gap-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="John Doe"
                  className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {errors.name && <p className="text-xs font-bold text-rose-600 ml-1">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="john@example.com"
                  className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {errors.email && <p className="text-xs font-bold text-rose-600 ml-1">{errors.email.message}</p>}
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                <input
                  type="text"
                  {...register('subject')}
                  placeholder="General Inquiry"
                  className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {errors.subject && <p className="text-xs font-bold text-rose-600 ml-1">{errors.subject.message}</p>}
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Message</label>
                <textarea
                  {...register('message')}
                  placeholder="How can we help you?"
                  rows={5}
                  className="w-full p-6 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                ></textarea>
                {errors.message && <p className="text-xs font-bold text-rose-600 ml-1">{errors.message.message}</p>}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Attachment (Max 500KB)</label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      id="attachment"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="attachment"
                      className="flex items-center gap-3 w-full h-14 px-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 hover:border-blue-500 cursor-pointer transition-all text-slate-500 font-medium"
                    >
                      <Paperclip size={20} />
                      {file ? file.name : 'Click to upload a file'}
                    </label>
                  </div>
                  {file && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setFile(null)}
                      className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                    >
                      <X size={24} />
                    </Button>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  size="lg"
                  className="w-full h-16 rounded-2xl text-xl font-bold bg-[#003399] hover:bg-blue-700 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={24} /> Processing...
                    </>
                  ) : (
                    <>
                      <Send size={24} /> Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
