
import React, { useState, useEffect } from 'react';
import { X, Phone, MessageCircle } from 'lucide-react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="bg-slate-900 p-6 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Enquire Now</h3>
                        <p className="text-slate-400 text-sm">{title}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <a href="tel:+919876543210" className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-blue-700">
                            <Phone className="w-6 h-6 mb-2" />
                            <span className="font-bold text-sm">Call Now</span>
                        </a>
                        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-green-700">
                            <MessageCircle className="w-6 h-6 mb-2" />
                            <span className="font-bold text-sm">WhatsApp</span>
                        </a>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or Request a Callback</span>
                        </div>
                    </div>

                    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert('Request Sent!'); onClose(); }}>
                        <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500" />
                        <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500" />
                        <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">
                            Submit Request
                        </button>
                    </form>

                    <p className="text-xs text-center text-slate-400 mt-4">
                        By submitting, you agree to our Terms & Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
