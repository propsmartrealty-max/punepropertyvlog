
import React from 'react';
import { TrendingDown, TrendingUp, CheckCircle2 } from 'lucide-react';

interface DealBadgeProps {
    pricePerSqft: number; // Project Price
    localityAvg: number;  // Market Benchmark
    className?: string;   // Allow external styling override
}

const DealBadge: React.FC<DealBadgeProps> = ({ pricePerSqft, localityAvg, className = '' }) => {
    if (!pricePerSqft || !localityAvg) return null;

    const ratio = pricePerSqft / localityAvg;
    const diff = Math.round(((pricePerSqft - localityAvg) / localityAvg) * 100);
    const absDiff = Math.abs(diff);

    // Logic:
    // < 0.90 : Great Deal (Green)
    // 0.90 - 1.10 : Fair Price (Blue)
    // > 1.10 : Premium (Yellow/Gold)

    if (ratio < 0.94) {
        return (
            <div className={`inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-2 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-bold border border-green-200 ${className}`}>
                <TrendingDown className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span>Great Deal ({absDiff}% Lower)</span>
            </div>
        );
    }

    if (ratio > 1.10) {
        return (
            <div className={`inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-2 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-bold border border-yellow-200 ${className}`}>
                <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span>Premium ({diff}% Higher)</span>
            </div>
        );
    }

    // Default: Fair Price
    return (
        <div className={`inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-bold border border-blue-100 ${className}`}>
            <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span>Fair Market Price</span>
        </div>
    );
};

export default DealBadge;
