import React from 'react';
import PortalNavbar from '../components/Portal/Navbar';
import Footer from '../components/Portal/Footer';
import SEO from '../components/SEO';

const About = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <SEO
                title="About Us | Pune Property Vlog"
                description="Learn about Pune's leading technology-led brokerage free real estate aggregator."
            />
            <PortalNavbar variant="colored" />

            <div className="flex-1 pt-32 pb-12 px-4">
                <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-slate-100">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-6">About Pune Property Vlog</h1>

                    <div className="prose prose-lg text-slate-600">
                        <p className="lead text-xl">
                            Pune Property Vlog is Pune's leading technology-led **BROKERAGE FREE** real estate AGGREGATOR.
                        </p>
                        <p>
                            We have 15+ years of experience driving residential sales performance through data and structure.
                            Our mission is to simplify the home buying journey by providing transparent, verified data and
                            eliminating the middleman costs.
                        </p>

                        <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Our Vision</h3>
                        <p>
                            To be the most trusted source of Real Estate Intelligence in Pune, empowering every home buyer
                            with the data they need to make the right decision.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                            <div className="bg-brand-50 p-6 rounded-xl text-center">
                                <div className="text-3xl font-bold text-brand-600 mb-2">15+</div>
                                <div className="text-sm font-bold text-brand-800">Years Experience</div>
                            </div>
                            <div className="bg-brand-50 p-6 rounded-xl text-center">
                                <div className="text-3xl font-bold text-brand-600 mb-2">5000+</div>
                                <div className="text-sm font-bold text-brand-800">Happy Families</div>
                            </div>
                            <div className="bg-brand-50 p-6 rounded-xl text-center">
                                <div className="text-3xl font-bold text-brand-600 mb-2">0%</div>
                                <div className="text-sm font-bold text-brand-800">Brokerage</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;
