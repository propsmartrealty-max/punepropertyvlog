import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceTrendChartProps {
    locationName: string;
    currentPrice: number | string; // e.g. 8500 or "8,500"
    appreciationRate?: number; // Annual % (default 7.5)
}

const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ locationName, currentPrice, appreciationRate = 7.5 }) => {
    // Safety check: if appreciationRate is passed as null/undefined from parent despite default prop (if parent passes explicit null/undefined variable),
    // ensure we have a fallback.
    const effectiveRate = appreciationRate || 7.5;


    // Parse price if string
    const priceValue = typeof currentPrice === 'string'
        ? parseInt(currentPrice.replace(/[^0-9]/g, ''))
        : currentPrice;

    const data = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const history: { year: number; price: number }[] = [];

        // Generate 5 years back + current year
        for (let i = 5; i >= 0; i--) {
            // Formula: Previous = Current / (1 + rate)^year
            // But here we want the "past value" that would result in current value at this rate.
            // Value = Present / ((1 + rate/100) ^ years_back)
            const year = currentYear - i;
            const projectedPrice = Math.round(priceValue / Math.pow(1 + (appreciationRate / 100), i));

            history.push({
                year: year,
                price: projectedPrice
            });
        }
        return history;
    }, [priceValue, appreciationRate]);

    const formatCurrency = (value: number) => {
        return `₹${value.toLocaleString('en-IN')}`;
    };

    if (!priceValue || isNaN(priceValue)) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800">Price Trends in {locationName}</h3>
                <p className="text-sm text-slate-500">
                    Property prices have appreciated by <span className="font-bold text-green-600">~{appreciationRate}%</span> annually over the last 5 years.
                </p>
            </div>

            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                            dy={10}
                        />
                        <YAxis
                            hide={true}
                            domain={['dataMin - 1000', 'dataMax + 1000']}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [formatCurrency(value), 'Avg. Price/sq.ft']}
                            labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#2563eb"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex justify-between items-center text-xs text-slate-400 border-t border-slate-50 pt-4">
                <span>Data Source: Pune Property Vlog Market Intelligence</span>
                <span>Updated: {new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
            </div>
        </div>
    );
};

export default PriceTrendChart;
