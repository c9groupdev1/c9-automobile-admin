'use client';

import { 
    Award, 
    Briefcase, 
    CheckSquare, 
    MessageCircle, 
    DollarSign, 
    ShieldAlert 
} from 'lucide-react';
import { InformationScreen } from '@/components/public/information-screen';

const SECTIONS = [
  {
    title: 'Introduction',
    icon: Award,
    content: 'As a vendor on C9x, you represent the quality and integrity of our global automotive marketplace. These guidelines are designed to help you succeed while maintaining the highest level of trust with our buyers.'
  },
  {
    title: 'Business Verification',
    icon: Briefcase,
    content: [
      'All regular vendors must complete the Business KYC process',
      'Valid business registration documents are required',
      'Verified status increases your visibility and trust rating',
      'Failure to maintain verification may result in account limits'
    ]
  },
  {
    title: 'Accurate Representations',
    icon: CheckSquare,
    content: [
      'All vehicles must be described with absolute accuracy',
      'All known mechanical or cosmetic faults must be disclosed',
      'High-quality, recent, and non-misleading photos are mandatory',
      'VIN/Chassis numbers must match the physical vehicle'
    ]
  },
  {
    title: 'Response & Communication',
    icon: MessageCircle,
    content: [
      'Aim to respond to buyer inquiries within 12-24 hours',
      'Maintain professional and courteous communication',
      'Provide clear information regarding viewing and inspection',
      'All critical transaction details should be documented on-platform'
    ]
  },
  {
    title: 'Market-Fair Pricing',
    icon: DollarSign,
    content: 'Price your vehicles competitively based on current market value, mileage, and condition. Unrealistically low "bait" prices or excessive hidden fees are strictly prohibited.'
  },
  {
    title: 'Ethical Conduct',
    icon: ShieldAlert,
    content: [
      'Harassment or deceptive behavior is grounds for termination',
      'Honoring agreed-upon prices and viewing appointments',
      'Disclosing any third-party interests in the vehicle',
      'Zero tolerance for odometer tampering or title fraud'
    ]
  }
];

export default function VendorGuidelinesRoute() {
  return (
    <InformationScreen 
      title="Vendor Guidelines" 
      sections={SECTIONS}
      lastUpdated="March 17, 2026" 
      subtitle="Elite protocols for professional automotive merchants within the C9x Protocol."
    />
  );
}
