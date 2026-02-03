
// Import React to resolve the 'React' namespace error for React.ReactNode
import React from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  problem: string;
  solution: string;
  impact: string;
}

export interface FrameworkStep {
  number: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface CaseStudy {
  id: string;
  title: string;
  challenge: string;
  strategy: string;
  results: {
    absorption: string;
    revenue: string;
    timeline: string;
  };
  image: string;
}

// -- Portal Types --

export interface Builder {
  id: string;
  name: string;
  slug: string;
  logo: string;
  heroImage: string;
  description: string;
  establishedYear: number;
  totalProjects: number;
  ongoingProjects: number;
  locations: string[]; // Keeping as string array for now unless we want relation
  // Phase 4: Trust Score
  experience?: number;
  trustScore?: number;
  isVerified?: boolean;
  mobile?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  builderId: string;
  location: string;
  priceRange: string;
  configurations: string[]; // e.g. "2 BHK", "3 BHK"
  configurationDetails?: { // Richer details for carpet area
    type: string;
    carpetArea: string;
    priceRange?: string;
  }[];
  status: 'Ready to Move' | 'Under Construction' | 'New Launch';
  type: 'Residential' | 'Commercial' | 'Plot'; // New field for categorization
  possessionDate: string;
  image: string;
  heroImage?: string;
  lat?: number;
  lng?: number;
  masterLayout?: string;
  floorPlans?: string[];
  logo?: string;
  exactPrice?: string; // Kept as string to match existing usage, or number? The error said number but file had string. Let's check usage.
  priceType?: 'L' | 'Cr' | 'K';
  reraId?: string;
  seoKeywords?: string[]; // High-ranking keywords for Google SERP
  metaDescription?: string; // Optimized meta description for CTR
  description: string;
  features: string[];
  highlights?: string[]; // Key selling points like "3-Side Open", "Vastu Compliant"
  specs: {
    label: string;
    value: string;
  }[];
  // Phase 2: Advanced Data
  verificationStatus?: 'Pending' | 'Verified' | 'Rejected';
  verificationSource?: string;
  advancedConfigurations?: ProjectConfiguration[];
  pricePerSqft?: number; // Phase 3: Deal Calculation
}

export interface ProjectConfiguration {
  id: string;
  projectId: string;
  name: string; // e.g. "2 BHK Luxury"
  carpetArea: number; // in sq ft
  balconyArea: number; // in sq ft
  bathrooms: number;
  basePrice: number; // Base agreement value
  pricePerSqft?: number; // Optional rate
  infraCharges: number; // Fixed infra/amenities charges
  clubhouseCharges: number;
  gstRate: number; // Percentage (e.g. 5)
  stampDutyRate: number; // Percentage (e.g. 7)
  registrationCharges: number; // Fixed amount
  layoutImage?: string;
  createdAt?: string;
}

export interface Locality {
  id: string;
  name: string;
  image?: string;
  projectCount?: number;
  avgPriceSqft?: number;
  appreciation_rate?: number;
  last_updated?: string;
}

export interface Lead {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  type: string; // 'Site Visit', 'Brochure', 'Callback'
  project_id?: string;
  status: 'New' | 'Contacted' | 'Closed' | 'Invalid';
  metadata?: Record<string, unknown>;
  created_at?: string;
}