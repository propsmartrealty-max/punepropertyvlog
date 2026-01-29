import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonPulse = ({ className }: { className?: string }) => (
    <motion.div
        className={`bg-slate-200 rounded ${className}`}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
);

export const PropertyCardSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
        <div className="h-48 relative bg-slate-100">
            <SkeletonPulse className="absolute inset-0" />
            <div className="absolute top-4 left-4 flex gap-2">
                <SkeletonPulse className="w-16 h-6 rounded-full" />
                <SkeletonPulse className="w-16 h-6 rounded-full" />
            </div>
        </div>
        <div className="p-5 space-y-4 flex-1 flex flex-col">
            <div className="space-y-2">
                <SkeletonPulse className="w-3/4 h-6" />
                <SkeletonPulse className="w-1/2 h-4" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                    <SkeletonPulse className="w-12 h-3" />
                    <SkeletonPulse className="w-20 h-5" />
                </div>
                <div className="space-y-1">
                    <SkeletonPulse className="w-12 h-3" />
                    <SkeletonPulse className="w-20 h-5" />
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                <SkeletonPulse className="w-24 h-8 rounded-lg" />
                <SkeletonPulse className="w-24 h-8 rounded-lg" />
            </div>
        </div>
    </div>
);

export const DetailSkeleton = () => (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-pulse">
        {/* Hero Skeleton */}
        <div className="h-[450px] md:h-[550px] w-full bg-slate-200 rounded-2xl mb-8 relative">
            <div className="absolute bottom-12 left-12 space-y-4 w-1/2">
                <div className="h-4 bg-slate-300 w-1/4 rounded"></div>
                <div className="h-12 bg-slate-300 w-3/4 rounded"></div>
                <div className="h-6 bg-slate-300 w-1/2 rounded"></div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
                {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-4">
                        <div className="h-8 bg-slate-200 w-1/4 rounded"></div>
                        <div className="h-4 bg-slate-200 w-full rounded"></div>
                        <div className="h-4 bg-slate-200 w-full rounded"></div>
                        <div className="h-4 bg-slate-200 w-3/4 rounded"></div>
                    </div>
                ))}
            </div>
            <div className="lg:col-span-1">
                <div className="h-96 bg-slate-200 rounded-2xl"></div>
            </div>
        </div>
    </div>
);

export const ErrorState = ({ message, onRetry }: { message?: string, onRetry?: () => void }) => (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <div className="w-8 h-8 text-red-500">⚠️</div>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h3>
        <p className="text-slate-500 mb-6 max-w-md">{message || "We couldn't load the properties. Please check your connection and try again."}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
                Try Again
            </button>
        )}
    </div>
);
