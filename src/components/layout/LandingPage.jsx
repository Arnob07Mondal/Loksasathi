import React from 'react';
import { 
  FileText, Languages, ShieldCheck, CalendarDays, 
  FileCheck2, ListChecks, ArrowRight, ChevronRight, 
  Mail, ShieldAlert, Cpu
} from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

const LandingPage = ({ onStart }) => {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 flex flex-col font-sans text-slate-800 bg-[#F6F8F7]">
      {/* 1. Landing Navbar */}
      <nav className="w-full sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleScroll('hero')}>
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#2E8B57] text-white shadow-sm shadow-[#2E8B57]/15">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              LokSathi <span className="text-[#2E8B57]">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleScroll('hero')} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">Home</button>
            <button onClick={() => handleScroll('features')} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">Features</button>
            <button onClick={() => handleScroll('workflow')} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">How It Works</button>
            <button onClick={() => handleScroll('about')} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">About</button>
            <button onClick={() => handleScroll('contact')} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">Contact</button>
          </div>

          <Button 
            id="nav-start-btn"
            variant="primary" 
            size="sm" 
            onClick={onStart}
            className="font-bold tracking-wide"
          >
            Start Analyzing
          </Button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section id="hero" className="relative pt-20 pb-24 px-6 text-center max-w-5xl mx-auto">
        {/* Minimal Feature Badges */}
        <div className="flex items-center justify-center gap-3.5 flex-wrap mb-8">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E8B57] bg-[#2E8B57]/5 border border-[#2E8B57]/15 rounded-full px-3.5 py-1">
            AI Powered
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E8B57] bg-[#2E8B57]/5 border border-[#2E8B57]/15 rounded-full px-3.5 py-1">
            Private & Secure
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E8B57] bg-[#2E8B57]/5 border border-[#2E8B57]/15 rounded-full px-3.5 py-1">
            11+ Indian Languages
          </span>
        </div>

        {/* Main Header */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
          Understand Every Government Document <br />
          <span className="bg-gradient-to-r from-[#2E8B57] to-[#49885e] bg-clip-text text-transparent">
            in Your Regional Language.
          </span>
        </h1>

        {/* Short Description */}
        <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Millions of Indian citizens struggle to understand official files due to complex legal terminology. 
          LokSathi AI decodes your documents into plain language summaries, timelines, and checklist action steps.
        </p>

        {/* CTA triggers */}
        <div className="flex items-center justify-center gap-4 flex-col sm:flex-row">
          <Button 
            id="hero-start-btn"
            variant="primary" 
            size="lg" 
            onClick={onStart}
            className="w-full sm:w-auto font-bold tracking-wide shadow-md"
            iconRight={ArrowRight}
          >
            Start Analyzing
          </Button>
          <Button 
            id="hero-learn-btn"
            variant="outline" 
            size="lg" 
            onClick={() => handleScroll('features')}
            className="w-full sm:w-auto font-bold text-slate-700 bg-white shadow-sm border-slate-200"
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 px-6 bg-white border-t border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4 uppercase">
              Everything You Need to Understand Government Documents
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-semibold">
              LokSathi AI simplifies complex government documents into clear, actionable guidance using Google's Gemma model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border border-slate-200 bg-slate-50/50 hover:bg-white text-left p-6 transition-all duration-300">
              <div className="p-3 w-12 h-12 rounded-xl bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2 uppercase tracking-wide">Document Summary</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Decodes dense, jargon-heavy bureaucracy rules into simple sentences that any citizen can understand instantly.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="border border-slate-200 bg-slate-50/50 hover:bg-white text-left p-6 transition-all duration-300">
              <div className="p-3 w-12 h-12 rounded-xl bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center mb-6">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2 uppercase tracking-wide">Regional Language Translation</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Translates official summaries into Hindi, Bengali, Marathi, Telugu, Tamil, and other regional scripts for local accessibility.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="border border-slate-200 bg-slate-50/50 hover:bg-white text-left p-6 transition-all duration-300">
              <div className="p-3 w-12 h-12 rounded-xl bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2 uppercase tracking-wide">Important Information Extraction</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Locates applicant names, reference numbers, consumer IDs, and issuing authorities automatically.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="border border-slate-200 bg-slate-50/50 hover:bg-white text-left p-6 transition-all duration-300">
              <div className="p-3 w-12 h-12 rounded-xl bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center mb-6">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2 uppercase tracking-wide">Deadlines & Important Dates</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Identifies registration deadlines, bill due dates, and expiry dates to avoid delayed submissions.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="border border-slate-200 bg-slate-50/50 hover:bg-white text-left p-6 transition-all duration-300">
              <div className="p-3 w-12 h-12 rounded-xl bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center mb-6">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2 uppercase tracking-wide">Required Documents</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Extracts clean checklist tables of supporting proofs, certificates, and ID documents needed for submission.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="border border-slate-200 bg-slate-50/50 hover:bg-white text-left p-6 transition-all duration-300">
              <div className="p-3 w-12 h-12 rounded-xl bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center mb-6">
                <ListChecks className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2 uppercase tracking-wide">Step-by-Step Action Plan</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Lays out step-by-step guides showing citizens how to proceed, which office to visit, and what tasks can be done online.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="workflow" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4 uppercase">
              How It Works
            </h2>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              LokSathi AI processes documents locally and securely in four clear steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white border border-slate-200 text-[#2E8B57] font-bold text-lg mb-6 shadow-sm group-hover:border-[#2E8B57]/30 transition-all duration-300">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase">Upload Document</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs font-semibold">
                Drag and drop your PDF form or image (JPEG, PNG, WEBP) directly into the app dashboard workspace.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white border border-slate-200 text-[#2E8B57] font-bold text-lg mb-6 shadow-sm group-hover:border-[#2E8B57]/30 transition-all duration-300">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase">AI Analysis</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs font-semibold">
                Gemma 4 model decodes selectable text layers or renders scanned layouts page-by-page.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white border border-slate-200 text-[#2E8B57] font-bold text-lg mb-6 shadow-sm group-hover:border-[#2E8B57]/30 transition-all duration-300">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase">Simplified Results</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs font-semibold">
                Review plain translations, deadlines, amounts, and warnings mapped cleanly in separate cards.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center group">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white border border-slate-200 text-[#2E8B57] font-bold text-lg mb-6 shadow-sm group-hover:border-[#2E8B57]/30 transition-all duration-300">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase">Take Action</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs font-semibold">
                Follow the generated steps checklist, gather required documents, and track dates to complete tasks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. About Section */}
      <section id="about" className="py-20 px-6 bg-white border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto text-left">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4 uppercase">
              Why LokSathi AI?
            </h2>
          </div>
          
          <div className="space-y-6 text-sm text-slate-600 font-semibold leading-relaxed">
            <p>
              Millions of Indian citizens face structural barriers when dealing with government departments because documents are written in formal legalese and are rarely available in regional languages. 
              <strong> LokSathi AI</strong> bridges this gap by acting as an intelligent, empathetic citizen assistant.
            </p>
            <p>
              By leveraging Google's powerful <strong>Gemma model</strong> running locally via Ollama, LokSathi AI translates and simplifies notices, certificates, billing forms, and directives completely privately. 
              Your documents never leave your computer, ensuring complete data sovereignty and trust.
            </p>
            <p>
              Whether it is updating an Aadhaar card address, understanding a utility bill surcharge, or following a scholarship application timeline, LokSathi AI extracts actionable information so citizens know exactly what to do next, which documents to carry, and what deadlines to watch.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Footer Section */}
      <footer id="contact" className="py-16 px-6 bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Col 1 */}
          <div className="space-y-4">
            <span className="text-md font-bold text-white tracking-wider uppercase">
              LokSathi AI
            </span>
            <p className="text-xs leading-relaxed max-w-sm">
              Simplifying official paperwork for Indian citizens using Google's Gemma model. Secure, local, and accessible.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            <span className="text-md font-bold text-white tracking-wider uppercase">
              Project Information
            </span>
            <div className="text-xs flex flex-col gap-2 font-semibold">
              <p>Build with Gemma Hackathon Entry</p>
              <p>Made using React, Vite and Tailwind CSS.</p>
            </div>
          </div>

          {/* Col 3 */}
          <div className="space-y-4">
            <span className="text-md font-bold text-white tracking-wider uppercase">
              Legal & Privacy
            </span>
            <div className="text-xs flex flex-col gap-2 font-semibold">
              <p>Privacy Notice: Local execution only. No documents are uploaded to cloud servers.</p>
              <div className="flex items-center gap-3.5 mt-2">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  aria-label="GitHub Repository"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
                <a 
                  href="mailto:support@loksathi.ai" 
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} LokSathi AI. All rights reserved.</p>
          <p className="text-[10px] tracking-wide uppercase font-bold text-slate-500">
            Build with Gemma Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
