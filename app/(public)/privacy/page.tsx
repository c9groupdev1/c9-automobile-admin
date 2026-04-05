'use client';

import { Shield, Eye, UserCheck, Share2, Lock, MessageCircle } from 'lucide-react';
import { InformationScreen } from '@/components/public/information-screen';

const SECTIONS = [
  {
    title: 'Overview',
    icon: Shield,
    content: 'C9x collects and processes user data to provide a secure automotive marketplace. By using C9x, you agree to this Privacy Policy and our commitment to protecting your personal information.'
  },
  {
    title: 'Information We Collect',
    icon: Eye,
    content: [
      'Full name and contact details',
      'Phone number and verified email address',
      'Location data for localized listings',
      'Government ID (for institutional verification)',
      'Vehicle and transaction history',
      'Device metadata and usage analytics'
    ]
  },
  {
    title: 'How We Use Information',
    icon: UserCheck,
    content: [
      'Create and manage secure accounts',
      'Enable reliable buying and selling of vehicles',
      'Verify users and prevent fraudulent activities',
      'Process secure transactions and payments',
      'Provide specialized customer support'
    ]
  },
  {
    title: 'Data Sharing',
    icon: Share2,
    content: [
      'Verified dealers or buyers during active transactions',
      'Integrated payment processors (e.g., Paystack)',
      'Logistics and inspection partners',
      'Legal authorities where required by regulatory laws'
    ]
  },
  {
    title: 'Data Security',
    icon: Lock,
    content: 'We implement institutional-grade technical and organizational measures to protect your data against unauthorized access, alteration, or disclosure. We do not sell user data to third parties.'
  },
  {
    title: 'Your Rights',
    icon: UserCheck,
    content: [
      'Access and review your personal data',
      'Request immediate corrections of inaccuracies',
      'Request permanent deletion of your account and data',
      'Withdraw consent for data processing at any time'
    ]
  },
  {
    title: 'Contact Us',
    icon: MessageCircle,
    content: 'If you have any questions about this Privacy Policy, please contact our support team at support@c9x.com.'
  }
];

export default function PrivacyPolicyRoute() {
  return (
    <InformationScreen 
      title="Privacy Policy" 
      sections={SECTIONS}
      lastUpdated="March 26, 2026" 
    />
  );
}
