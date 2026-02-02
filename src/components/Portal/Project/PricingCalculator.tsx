import React, { useState, useEffect } from 'react';
import { Calculator, Info, CheckCircle2 } from 'lucide-react';
import { ProjectConfiguration } from '../../../types';

interface PricingCalculatorProps {
    configurations: ProjectConfiguration[];
}

const PricingCalculator: React.FC<PricingCalculatorProps> = ({ configurations }) => {
    const [selectedConfigId, setSelectedConfigId] = useState<string>(configurations[0]?.id || '');
    const [floorRise, setFloorRise] = useState<number>(5); // Default 5th floor

    const selectedConfig = configurations.find(c => c.id === selectedConfigId);

    if (!selectedConfig) return null;

    // Calculation Logic
    // Base Cost = Area * Rate (or Fixed Base Price)
    // Floor Rise = usually increases by X amount per floor. Let's assume ₹50/sqft per floor above 1st.
    const FLOOR_RISE_RATE = 50;
    const floorRiseCost = (floorRise - 1) * FLOOR_RISE_RATE * selectedConfig.carpetArea;

    // Total Agreement Value
    const agreementValue = Number(selectedConfig.basePrice) + floorRiseCost + Number(selectedConfig.infraCharges) + Number(selectedConfig.clubhouseCharges);

    // Govt Taxes
    const stampDuty = (agreementValue * (selectedConfig.stampDutyRate / 100));
    const gst = (agreementValue * (selectedConfig.gstRate / 100));
    const registration = Number(selectedConfig.registrationCharges);

    const grandTotal = agreementValue + stampDuty + gst + registration;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
            <div className="bg-slate-900 p-4 text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg">Real-Time Cost Sheet</h3>
            </div>

            <div className="p-6 space-y-6">
                {/* Configuration Selector */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Select Unit Type</label>
                    <div className="grid grid-cols-2 gap-2">
                        {configurations.map(conf => (
                            <button
                                key={conf.id}
                                onClick={() => setSelectedConfigId(conf.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selectedConfigId === conf.id
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'
                                    }`}
                            >
                                {conf.name}
                                <span className="block text-xs opacity-80">{conf.carpetArea} sq.ft</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Floor Selection */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Select Floor <span className="text-slate-400 font-normal">(Affects Floor Rise)</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="25"
                        value={floorRise}
                        onChange={(e) => setFloorRise(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>1st Floor</span>
                        <span className="font-bold text-blue-600">{floorRise}th Floor</span>
                        <span>25th Floor</span>
                    </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Base Agreement Value</span>
                        <span className="font-medium">{formatCurrency(Number(selectedConfig.basePrice))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Floor Rise (Est.)</span>
                        <span className="font-medium text-orange-600">+{formatCurrency(floorRiseCost)}</span>
                    </div>
                    {(selectedConfig.infraCharges > 0 || selectedConfig.clubhouseCharges > 0) && (
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Infra & Amenities</span>
                            <span className="font-medium">+{formatCurrency(Number(selectedConfig.infraCharges) + Number(selectedConfig.clubhouseCharges))}</span>
                        </div>
                    )}

                    <div className="h-px bg-slate-200 my-2" />

                    {/* Compliance Section: Robust Tax Breakdown */}
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600 flex items-center gap-1">
                            Stamp Duty ({selectedConfig.stampDutyRate || 7}%)
                            <Info className="w-3 h-3 text-slate-400" />
                        </span>
                        <span className="font-medium">+{formatCurrency(stampDuty)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">GST ({selectedConfig.gstRate || 5}%)</span>
                        <span className="font-medium">+{formatCurrency(gst)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Registration</span>
                        <span className="font-medium">+{formatCurrency(registration || 30000)}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 mt-2">
                        Government taxes are subject to change. Registration is fixed at ₹30,000 for properties above ₹30L.
                    </p>
                </div>

                {/* Grand Total */}
                <div className="bg-blue-600 text-white p-4 rounded-xl shadow-md">
                    <p className="text-xs opacity-90 uppercase tracking-widest font-semibold mb-1">Estimated All Inclusive Price</p>
                    <p className="text-3xl font-bold">{formatCurrency(grandTotal)}</p>
                    <p className="text-xs opacity-70 mt-1">*Excluding maintenance & legal fees</p>
                </div>

                <button
                    onClick={() => window.open(`https://wa.me/917744009295?text=Hi, sending detailed cost sheet enquiry for ${selectedConfig.name} on floor ${floorRise} with price ${formatCurrency(grandTotal)}`, '_blank')}
                    className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-green-200"
                >
                    Get Official Cost Sheet (PDF)
                </button>
            </div>
        </div>
    );
};

export default PricingCalculator;
