
import React from 'react';
import { ShieldCheck, Star } from 'lucide-react';

interface TrustScoreProps {
    score: number; // 0 to 10
    className?: string;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const TrustScore: React.FC<TrustScoreProps> = ({ score, className = '', showLabel = true, size = 'md' }) => {
    // Normalize score to 0-10
    const normalizedScore = Math.min(Math.max(score, 0), 10);

    // Determine Color
    const getColor = (s: number) => {
        if (s >= 9) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (s >= 7) return 'text-blue-600 bg-blue-50 border-blue-200';
        return 'text-amber-600 bg-amber-50 border-amber-200';
    };

    const colorClass = getColor(normalizedScore);

    // Size Map
    const dimensions = {
        sm: 'w-8 h-8 text-xs border-2',
        md: 'w-12 h-12 text-sm border-4',
        lg: 'w-16 h-16 text-lg border-4'
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className={`relative ${dimensions[size]} flex items-center justify-center rounded-full ${normalizedScore >= 9 ? 'border-emerald-100' : 'border-blue-100'} bg-white shadow-sm`}>
                <span className={`text-sm font-extrabold ${normalizedScore >= 9 ? 'text-emerald-700' : 'text-blue-700'}`}>
                    {normalizedScore.toFixed(1)}
                </span>
                {/* SVG Progress Circle could go here for extra polish */}
            </div>

            {showLabel && (
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Trust Score</span>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-3 h-3 ${star <= normalizedScore / 2 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {normalizedScore >= 8 && (
                <div className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED
                </div>
            )}
        </div>
    );
};

export default TrustScore;
