
import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, Building2, Phone, Mail, ChevronRight, LayoutGrid, ShieldCheck } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Capabilities', href: '#services' },
    { name: 'Framework', href: '#framework' },
    { name: 'AI Simulator', href: '#simulator' },
    { name: 'Case Studies', href: '#results' },
    { name: 'Corporate', href: '#about' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsOpen(false);
    }
  };

  return (
    <header className="fixed w-full z-50 transition-all duration-500">
      {/* Top Utility Bar: Structured Meta Information */}
      <div className={`hidden lg:block bg-slate-900 border-b border-white/5 transition-all duration-500 overflow-hidden ${isScrolled ? 'max-h-0' : 'max-h-12'}`}>
        <div className="max-w-7xl mx-auto px-10 h-10 flex justify-between items-center">
          <div className="flex items-center space-x-10">
            <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest group cursor-pointer hover:text-white transition-colors">
              <Phone size={11} className="text-teal-500 group-hover:scale-110 transition-transform" />
              +91 77440 09295
            </div>
            <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest group cursor-pointer hover:text-white transition-colors">
              <Mail size={11} className="text-teal-500 group-hover:scale-110 transition-transform" />
              salesmandate@propsmart.digital
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <ShieldCheck size={11} className="text-teal-500" />
              MahaRERA: <span className="text-white">A031262401295</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
              <div className="text-[9px] font-black text-teal-500 uppercase tracking-[0.3em]">
                AI-Engine Status: Active (v4.2.0)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand Navigation Bar */}
      <nav className={`transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-2xl py-3 border-b border-slate-100' : 'bg-transparent py-7'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center">
            
            {/* Structured Logo Layout */}
            <div className="flex-shrink-0">
              <a href="#hero" onClick={(e) => handleLinkClick(e, '#hero')} className="flex items-center gap-4 group">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 ${isScrolled ? 'bg-slate-900 text-teal-400 shadow-xl' : 'bg-white/10 backdrop-blur-lg text-teal-400 border border-white/20'}`}>
                  <Building2 size={24} className="group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col">
                  <span className={`text-2xl font-black tracking-tighter transition-colors duration-500 leading-none ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                    PROPSMART<span className="text-teal-500">REALTY</span>
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-[1px] w-3 bg-teal-500/50"></span>
                    <span className={`text-[9px] font-black uppercase tracking-[0.45em] leading-none transition-colors duration-500 ${isScrolled ? 'text-slate-400' : 'text-slate-300'}`}>
                      Sales Mandates
                    </span>
                  </div>
                </div>
              </a>
            </div>

            {/* Structured Desktop Menu Group */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center space-x-10 mr-14">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`text-[10px] font-black uppercase tracking-[0.35em] transition-all hover:text-teal-500 relative group py-2 ${isScrolled ? 'text-slate-600' : 'text-slate-100'}`}
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ))}
              </div>
              
              {/* Secondary Actions Area */}
              <div className="flex items-center gap-4 border-l border-white/10 pl-10">
                <a
                  href="#contact"
                  onClick={(e) => handleLinkClick(e, '#contact')}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all transform hover:-translate-y-1 active:scale-95 shadow-2xl ${isScrolled ? 'bg-slate-900 text-white shadow-slate-900/20' : 'bg-white text-slate-900 shadow-white/5'}`}
                >
                  Discuss Mandate <ChevronRight size={14} className="text-teal-500" />
                </a>
              </div>
            </div>

            {/* Mobile Navigation Interface */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center ${isScrolled ? 'text-slate-900 bg-slate-100 shadow-inner' : 'text-white bg-white/10 backdrop-blur-xl border border-white/20'}`}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Structured Mobile Navigation Drawer */}
        <div className={`lg:hidden absolute w-full bg-white shadow-2xl transition-all duration-500 ease-in-out overflow-hidden border-t border-slate-100 ${isOpen ? 'max-h-screen opacity-100 py-10' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <div className="px-10 space-y-3">
            <div className="flex items-center gap-2 mb-8 ml-2">
                <LayoutGrid size={14} className="text-teal-500" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Site Directory</p>
            </div>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="flex items-center justify-between px-8 py-5 text-[11px] font-black text-slate-800 uppercase tracking-[0.3em] hover:bg-slate-50 hover:text-teal-500 rounded-[1.5rem] transition-all group"
              >
                {link.name}
                <ChevronRight size={16} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-teal-500" />
              </a>
            ))}
            
            <div className="pt-10 mt-6 border-t border-slate-100 space-y-8">
               <div className="px-8 grid grid-cols-1 gap-6">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-teal-500">
                        <Phone size={14} />
                    </div>
                    +91 77440 09295
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-teal-500">
                        <Mail size={14} />
                    </div>
                    salesmandate@propsmart.digital
                  </div>
               </div>
               <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, '#contact')}
                className="flex items-center justify-center gap-4 w-full bg-slate-900 text-white py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-xl active:scale-95"
              >
                Discuss Mandate <Zap size={16} className="text-teal-400" />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
