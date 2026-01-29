
import React, { useState, useEffect } from 'react';
import { IndianRupee } from 'lucide-react';

const EMICalculator = ({ priceRange }: { priceRange: string }) => {
    // Parse base price from string (e.g., "65 L - 1.5 Cr") -> default to 6500000
    const parsePrice = (priceStr: string) => {
        const match = priceStr.match(/(\d+\.?\d*)\s*(L|Cr)/i);
        if (!match) return 5000000;
        const val = parseFloat(match[1]);
        const unit = match[2];
        return unit === 'Cr' ? val * 10000000 : val * 100000;
    };

    const [loanAmount, setLoanAmount] = useState(parsePrice(priceRange));
    const [interestRate, setInterestRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);
    const [emi, setEmi] = useState(0);

    useEffect(() => {
        const r = interestRate / 12 / 100;
        const n = tenure * 12;
        const calcEmi = loanAmount * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
        setEmi(Math.round(calcEmi));
    }, [loanAmount, interestRate, tenure]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <IndianRupee className="w-6 h-6 text-blue-600" />
                EMI Calculator
            </h3>

            <div className="space-y-6">
                {/* Loan Amount */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-slate-600 font-medium">Loan Amount</label>
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded font-bold">{formatCurrency(loanAmount)}</span>
                    </div>
                    <input
                        type="range"
                        min="1000000"
                        max="50000000"
                        step="100000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                {/* Interest Rate */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-slate-600 font-medium">Interest Rate (%)</label>
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded font-bold">{interestRate} %</span>
                    </div>
                    <input
                        type="range"
                        min="6"
                        max="14"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                {/* Tenure */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-slate-600 font-medium">Loan Tenure (Years)</label>
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded font-bold">{tenure} Years</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="30"
                        step="1"
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                {/* Result */}
                <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500">Monthly EMI</span>
                        <span className="text-3xl font-bold text-slate-800">{formatCurrency(emi)}</span>
                    </div>
                    <button className="w-full mt-4 bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">
                        Check Loan Eligibility
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EMICalculator;
