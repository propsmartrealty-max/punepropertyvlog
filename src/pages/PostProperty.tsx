import React, { useState } from 'react';
import PortalNavbar from '../components/Portal/Navbar';
import Footer from '../components/Portal/Footer';
import SEO from '../components/SEO';
import { Building2, Send, CheckCircle } from 'lucide-react';

const PostProperty = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            type: formData.get('type') as string,
            name: formData.get('name') as string,
            mobile: formData.get('mobile') as string,
            status: 'New',
            metadata: {
                property_type: formData.get('propertyType') as string,
                location: formData.get('location') as string,
                price: formData.get('price') as string
            }
        };

        try {
            const { supabase } = await import('../services/supabase');
            const { error } = await supabase.from('leads').insert([data]);

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }
            setSubmitted(true);
        } catch (err) {
            alert('Failed to submit. Please check your connection or try again.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <SEO
                title="Post Your Property | Pune Property Vlog"
                description="Sell or Rent your property in Pune with Pune Property Vlog. Free listing for owners."
            />
            <PortalNavbar variant="colored" />

            <div className="flex-1 pt-28 pb-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Sell or Rent Your Property</h1>
                        <p className="text-slate-600">Join thousands of owners who trust Pune Property Vlog to find the right buyers.</p>
                    </div>

                    {submitted ? (
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Details Submitted!</h3>
                            <p className="text-slate-600">Our team will verify your details and get back to you within 24 hours.</p>
                            <button onClick={() => setSubmitted(false)} className="mt-6 text-brand-600 font-bold hover:underline">
                                Post Another Property
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">I want to</label>
                                    <select name="type" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                                        <option value="Sell Property">Sell Property</option>
                                        <option value="Rent Out Property">Rent Out Property</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Property Type</label>
                                    <select name="propertyType" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                                        <option value="Apartment">Apartment</option>
                                        <option value="Villa / Bungalow">Villa / Bungalow</option>
                                        <option value="Plot">Plot</option>
                                        <option value="Office Space">Office Space</option>
                                        <option value="Shop / Showroom">Shop / Showroom</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Property Location</label>
                                <input name="location" required type="text" placeholder="e.g. Baner, Wakad, Hinjewadi" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Expected Price</label>
                                    <input name="price" required type="text" placeholder="e.g. 85 Lacs" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                                    <input name="name" required type="text" placeholder="Owner Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
                                <input name="mobile" required type="tel" placeholder="+91" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
                            </div>

                            <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-200 transition-all flex items-center justify-center gap-2">
                                <Send className="w-5 h-5" />
                                Submit Listing
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PostProperty;
