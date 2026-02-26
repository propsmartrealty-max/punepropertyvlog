import React, { useState } from 'react';
import PortalNavbar from '../components/Portal/Navbar';
import Footer from '../components/Portal/Footer';
import SEO from '../components/SEO';
import { Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '../services/supabase';
import { sendLeadEmailNotification } from '../utils/emailUtils';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            name: formData.get('name') as string,
            mobile: formData.get('mobile') as string,
            type: 'Contact Us',
            status: 'New',
            metadata: {
                message: formData.get('message') as string
            }
        };

        try {
            const { error } = await supabase.from('leads').insert([data]);
            if (error) throw error;

            await sendLeadEmailNotification(data);
            if (error) throw error;
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            alert('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <SEO
                title="Contact Us | Pune Property Vlog"
                description="Get in touch with us for any queries regarding Pune Real Estate."
            />
            <PortalNavbar variant="colored" />

            <div className="flex-1 pt-32 pb-12 px-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-10 text-center">Get in Touch</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-100 p-3 rounded-lg text-brand-600">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase mb-1">Phone</p>
                                        <a href="tel:+917744009295" className="text-lg font-bold text-slate-900 hover:text-brand-600">+91 7744009295</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-100 p-3 rounded-lg text-brand-600">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase mb-1">Email</p>
                                        <a href="mailto:connect@punepropertyvlog.in" className="text-lg font-bold text-slate-900 hover:text-brand-600">connect@punepropertyvlog.in</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-100 p-3 rounded-lg text-brand-600">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-500 uppercase mb-1">Office</p>
                                        <p className="text-lg font-bold text-slate-900">Baner, Pune, Maharashtra 411045</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h3>

                            {submitted ? (
                                <div className="text-center py-8 bg-green-50 rounded-xl border border-green-100">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Mail className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-800 mb-2">Message Sent!</h4>
                                    <p className="text-slate-600 text-sm">Thanks for reaching out. We'll reply shortly.</p>
                                    <button onClick={() => setSubmitted(false)} className="mt-4 text-brand-600 font-bold text-sm hover:underline">Send Another</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                                        <input required name="name" type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500" placeholder="Your Name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Mobile</label>
                                        <input required name="mobile" type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500" placeholder="Your Number" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                                        <textarea required name="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500" placeholder="How can we help you?" />
                                    </div>
                                    <button disabled={loading} className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-70">
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
