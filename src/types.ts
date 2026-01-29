
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
  locations: string[];
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
  masterLayout?: string;
  floorPlans?: string[];
  logo?: string;
  exactPrice?: string;
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
}

export interface Location {
  id: string;
  name: string;
  image: string;
  projectCount: number;
}