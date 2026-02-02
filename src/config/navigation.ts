
import { Home, Building2, Key, Rocket, MapPin, Users, Calculator, FileText, Phone } from 'lucide-react';

export interface NavItem {
    name: string;
    path?: string;
    icon?: any;
    highlight?: boolean;
    children?: NavItem[];
}

export const NAVIGATION_CONFIG: NavItem[] = [
    {
        name: 'Buy',
        icon: Home,
        children: [
            { name: 'Residential Properties', path: '/search?type=residential&intent=buy' },
            { name: 'Commercial Properties', path: '/search?type=commercial&intent=buy' },
            { name: 'Plots / Land', path: '/search?type=plot&intent=buy' },
        ]
    },
    {
        name: 'Rent',
        icon: Key,
        children: [
            { name: 'Residential for Rent', path: '/search?type=residential&intent=rent' },
            { name: 'Commercial for Rent', path: '/search?type=commercial&intent=rent' },
        ]
    },
    {
        name: 'New Projects',
        path: '/search?type=new-launch',
        icon: Rocket
    },
    {
        name: 'Directory',
        icon: Users,
        children: [
            { name: 'Verified Builders', path: '/directory' },
            { name: 'Localities', path: '/admin/localities' }, // Assuming public access or redirect
        ]
    },
    {
        name: 'More',
        icon: FileText,
        children: [
            { name: 'About Us', path: '/about' },
            { name: 'Contact Us', path: '/contact' },
        ]
    },
    {
        name: 'Post Property',
        path: '/post-property',
        highlight: true,
        icon: Building2
    }
];
