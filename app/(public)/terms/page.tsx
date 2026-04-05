'use client';

import { 
    CheckCircle2, 
    Shield, 
    User, 
    Car, 
    AlertTriangle, 
    CreditCard, 
    Truck, 
    Scale, 
    RefreshCw 
} from 'lucide-react';
import { InformationScreen } from '@/components/public/information-screen';

const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    icon: CheckCircle2,
    content: 'By accessing and using the C9x platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.'
  },
  {
    title: 'Our Role as a Marketplace',
    icon: Shield,
    content: 'C9x acts as a facilitator connecting buyers and sellers. We do not own, inspect, or sell the vehicles listed on the platform. All transactions are directly between the buyer and the seller.'
  },
  {
    title: 'Account Responsibilities',
    icon: User,
    content: [
      'You must provide accurate and complete registration info',
      'You are responsible for maintaining account confidentiality',
      'C9x reserves the right to suspend accounts for policy violations',
      'Institutional verification is required for certain features'
    ]
  },
  {
    title: 'Vehicle Listings',
    icon: Car,
    content: [
      'All listings must represent legitimate vehicles',
      'Descriptions and images must be accurate and truthful',
      'Sellers must have the legal right to sell the vehicle',
      'Duplicate or misleading listings are strictly prohibited'
    ]
  },
  {
    title: 'Prohibited Activities',
    icon: AlertTriangle,
    content: [
      'Posting fake, cloned, or stolen vehicle listings',
      'Engaging in fraudulent schemes or deceptive practices',
      'Attempting to bypass platform fees through off-platform deals',
      'Harassment or unprofessional conduct towards other users'
    ]
  },
  {
    title: 'Payments & Fees',
    icon: CreditCard,
    content: [
      'C9x may charge service or transaction fees for platform use',
      'Payments may be processed via integrated partners (e.g. Paystack)',
      'Escrow or fund-holding services are subject to specific rules',
      'Off-platform payments are not protected by C9x policies'
    ]
  },
  {
    title: 'Logistics & Delivery',
    icon: Truck,
    content: 'Vehicle delivery is handled by independent third-party logistics providers. Risk of loss and title transfer are subject to the specific terms of the logistics partner selected.'
  },
  {
    title: 'Dispute Resolution',
    icon: Scale,
    content: 'Disputes arising from transactions must be reported via the C9x Help Center. We may, at our discretion, facilitate a resolution process based on provided evidence and documentation.'
  },
  {
    title: 'Policy Updates',
    icon: RefreshCw,
    content: 'C9x reserves the right to update these terms at any time. Continued use of the platform after updates constitutes acceptance of the modified Terms of Service.'
  }
];

export default function TermsOfServiceRoute() {
  return (
    <InformationScreen 
      title="Terms of Service" 
      sections={SECTIONS}
      lastUpdated="March 26, 2026" 
      subtitle="The official governance framework for the C9x Automobile Ecosystem."
    />
  );
}
