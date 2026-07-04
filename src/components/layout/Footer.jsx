import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900/60 mt-auto py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Branding & description */}
        <div className="text-center md:text-left">
          <p className="text-sm font-display font-bold text-slate-300">
            LokSathi <span className="text-brand-saffron">AI</span>
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
            Empowering citizens by translating complex government letters, certificates, and forms into clear, actionable advice.
          </p>
        </div>

        {/* Tech stack badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Built using:</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">React 19</span>
            <span className="text-[11px] font-semibold bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">Tailwind v4</span>
            <span className="text-[11px] font-semibold bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">Gemma</span>
          </div>
        </div>

        {/* Copyright or Hackathon info */}
        <div className="text-center md:text-right">
          <p className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} LokSathi AI. All rights reserved.
          </p>
          <p className="text-[10px] text-brand-saffron/80 mt-1 font-semibold">
            Google "Build with Gemma" Hackathon Entry
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
