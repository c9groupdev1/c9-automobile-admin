'use client';

import {
    Star,
    Search,
    Camera,
    Shield,
    MessageSquare,
    CreditCard,
    Heart
} from 'lucide-react';
import { InformationScreen } from '@/components/public/information-screen';

const SECTIONS = [
  {
    title: 'Welcome to C9x',
    icon: Star,
    content: 'Welcome to the C9x Marketplace! To ensure a safe, transparent, and successful experience for everyone, please follow these core guidelines when browsing or listing vehicles.'
  },
  {
    title: 'Honesty is Key',
    icon: Search,
    content: [
      'Ensure all listing info (engine, mileage, features) is 100% accurate',
      'Intentional misrepresentation is grounds for immediate suspension',
      'Disclose any minor accidents or cosmetic repairs',
      'Verify the V5C/Logbook details before listing'
    ]
  },
  {
    title: 'High-Fidelity Photos',
    icon: Camera,
    content: [
      'Upload clear, well-lit photos of the interior and exterior',
      'Include shots of the engine bay, tire treads, and dashboard',
      'Avoid using stock images or heavily filtered photos',
      'Capture any specific areas of wear or damage'
    ]
  },
  {
    title: 'Safe Inspections',
    icon: Shield,
    content: [
      'Always choose a public, well-lit location for vehicle viewings',
      'We recommend bringing a friend or a qualified mechanic',
      'Verify the seller\'s identity and vehicle documents in person',
      'Never send deposits before a physical inspection'
    ]
  },
  {
    title: 'Secure Communications',
    icon: MessageSquare,
    content: [
      'Keep all initial negotiations within the C9x secure chat',
      'Avoid sharing personal contact info too early in the process',
      'Report any suspicious behavior or "too good to be true" offers',
      'Document all agreed-upon terms within the platform'
    ]
  },
  {
    title: 'Transactions & Payments',
    icon: CreditCard,
    content: [
      'Vehicle payments are handled directly between buyer and seller',
      'Use secure bank transfers for large amounts where possible',
      'Ensure you receive a signed receipt and all vehicle keys',
      'Off-platform transactions are at your own risk'
    ]
  },
  {
    title: 'Community Trust',
    icon: Heart,
    content: 'Our marketplace thrives on mutual respect. Please honor viewing appointments and respond promptly to serious offers to maintain a high community rating.'
  }
];

export default function GuidelinesPage() {
    return (
        <InformationScreen 
            title="Marketplace Guidelines"
            sections={SECTIONS}
            lastUpdated="March 17, 2026"
            subtitle="Follow these core protocols to ensure a safe and transparent automotive trading experience."
        />
    );
}
