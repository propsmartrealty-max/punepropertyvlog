import React, { useState } from 'react';
import { X, Loader2, CheckCircle2, Phone, ArrowRight, MessageCircle } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface LeadFormProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'Site Visit' | 'Brochure' | 'Offer';
    projectTitle: string;
    projectId?: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ isOpen, onClose, type, projectTitle, projectId }) => {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            await supabase.from('leads').insert([{
                name: formData.name,
                mobile: formData.mobile,
                email: formData.email,
                type: type,
                project_id: projectId, // Can be ID or Slug
                metadata: {
                    source: window.location.pathname,
                    project: projectTitle
                }
            }]);

            setStatus('success');
            // Auto-close after 2 seconds
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ name: '', mobile: '', email: '' });
            }, 2500);

        } catch (error) {
            console.error('Lead submit error:', error);
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 md:p-8 animate-in zoom-in-50 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {status === 'success' ? (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in spin-in-12 duration-500">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h3>
                        <p className="text-slate-600 mb-6">Your request for <strong>{type}</strong> has been received. Our expert will call you shortly.</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.open(`https://wa.me/917744009295?text=Hi, I just inquired about ${projectTitle}. Can we chat?`, '_blank')}
                                className="w-full py-3 rounded-xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-200"
                            >
                                <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                            </button>
                            <button onClick={onClose} className="text-slate-400 font-bold hover:text-slate-600 text-sm">Close</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 font-bold text-xs rounded-full uppercase tracking-wider mb-2">
                                {type}
                            </span>
                            <h3 className="text-2xl font-bold text-slate-800">
                                {type === 'Site Visit' ? 'Book a Site Visit' : type === 'Brochure' ? 'Download Brochure' : 'Get Best Offer'}
                            </h3>
                            <p className="text-slate-500 text-sm mt-1">
                                Enter details to get instant access for <strong>{projectTitle}</strong>.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="tel"
                                        required
                                        pattern="[0-9]{10}"
                                        value={formData.mobile}
                                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
                                        placeholder="10-digit number"
                                    />
                                </div>
                            </div>
                            {type === 'Brochure' && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Email ID</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
                                        placeholder="To receive the brochure"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'submitting' ? (
                                    <> <Loader2 className="w-5 h-5 animate-spin" /> Processing... </>
                                ) : (
                                    <> {type === 'Brochure' ? 'Download Now' : 'Submit Request'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> </>
                                )}
                            </button>

                            <p className="text-[10px] text-center text-slate-400">
                                By submitting, you agree to receive updates via WhatsApp/Call.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default LeadForm;
