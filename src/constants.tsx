
import React from 'react';
import { 
  Building2, 
  Target, 
  Search, 
  ShieldCheck, 
  Cpu,
  BrainCircuit,
  Bot,
  Sparkles,
  Zap,
  Workflow,
  Users2,
  HardHat,
  Trophy,
  Scale,
  Eye,
  Megaphone,
  Network,
  Presentation
} from 'lucide-react';
import { Service, FrameworkStep, CaseStudy } from './types';

export const COLORS = {
  primary: '#0F172A',
  secondary: '#334155',
  accent: '#14B8A6',
  light: '#F8FAFC'
};

export const CORE_PILLARS = [
  {
    id: 'market-research',
    title: 'Market Research',
    description: 'Deep micro-market intelligence covering demand-supply gaps and pricing bands across Hinjewadi, Baner, and PCMC corridors.',
    icon: <Search className="w-8 h-8" />,
    metrics: '98% Data Accuracy'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    description: 'Performance marketing using predictive modeling to target high-intent segments with zero lead wastage.',
    icon: <Megaphone className="w-8 h-8" />,
    metrics: '40% Lower CPL'
  },
  {
    id: 'cp-network',
    title: 'Channel Network',
    description: 'Institutional-grade CP management across 5000+ activated partners in Pune.',
    icon: <Network className="w-8 h-8" />,
    metrics: 'Rapid Activation'
  },
  {
    id: 'sales-strategy',
    title: 'Sales Strategy',
    description: 'Strategic inventory modeling designed to maintain premiums while ensuring sales velocity.',
    icon: <Target className="w-8 h-8" />,
    metrics: '3X Absorption'
  },
  {
    id: 'expert-sales-team',
    title: 'Expert Sales Team',
    description: 'Closing specialists trained in consultative selling and high-conversion institutional closures.',
    icon: <Presentation className="w-8 h-8" />,
    metrics: 'High Closing Ratio'
  }
];

export const FRAMEWORK: FrameworkStep[] = [
  { number: 1, title: 'AI-Audit', description: 'Algorithmic analysis of micro-market demand vs current project unit mix.' },
  { number: 2, title: 'Smart Pricing', description: 'ML-based pricing architecture simulated across historical Pune supply data.' },
  { number: 3, title: 'Auto-Positioning', description: 'High-impact branding optimized for specific Pune home-buyer personas.' },
  { number: 4, title: 'Bot Deployment', description: '24/7 AI qualification bots live across WhatsApp and social channels.' },
  { number: 5, title: 'Funnel Healing', description: 'Automated diagnostic tools to fix conversion leakages in real-time.' },
  { number: 6, title: 'Exit Optimization', description: 'Predictive inventory liquidation for final phase high-velocity closures.' }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    title: 'Elite Residency, Baner',
    challenge: 'Stagnant sales for 14 months with over 60 units unsold.',
    strategy: 'Implemented AI-Lead Scoring to prioritize high-intent backlogged leads.',
    results: { absorption: '85% Growth', revenue: '₹75Cr', timeline: '7 Months' },
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'IT Hub Enclave, Hinjewadi',
    challenge: 'Inefficient marketing spend with poor lead-to-visit ratios.',
    strategy: 'Dynamic AI-ad placement and automated WhatsApp site-visit scheduling.',
    results: { absorption: 'Launch Record', revenue: '₹140Cr', timeline: '12 Months' },
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Wakad Skyline Township',
    challenge: 'Inventory blockage in 3BHK premium segments due to competitor price cuts.',
    strategy: 'Value-based positioning shift and CP-exclusive rapid liquidation mandate.',
    results: { absorption: 'Sold Out', revenue: '₹210Cr', timeline: '15 Months' },
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
  }
];
