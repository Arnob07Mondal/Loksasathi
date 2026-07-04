import React from 'react';
import { FileQuestion, ShieldCheck, FileCheck, Mail, Info } from 'lucide-react';
import Card from '../common/Card';

const HelpSupport = () => {
  const faqs = [
    {
      q: "Is my document uploaded to the internet?",
      a: "No. LokSathi AI runs completely locally. It connects to your local Ollama instance on port 11434, meaning all optical characters and files are parsed on your local machine, keeping your data confidential."
    },
    {
      q: "Why does scanned document analysis take longer?",
      a: "Scanned documents do not have selectable text. LokSathi AI converts the pages into individual canvas images and transcribes the layout using Gemma Vision. This sequential process takes longer but preserves accuracy."
    },
    {
      q: "Which Indian languages are supported?",
      a: "LokSathi AI currently supports translations for English, Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, and Punjabi."
    }
  ];

  return (
    <div className="space-y-6 text-left max-w-3xl animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1 uppercase tracking-wide">Help & Support</h2>
        <p className="text-xs text-slate-500 font-semibold font-sans">Learn how to make the most of LokSathi AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Columns */}
        <div className="lg:col-span-2 space-y-4">
          {/* 1. About LokSathi AI */}
          <Card hoverEffect={false} className="border border-slate-200 bg-white p-5">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#2E8B57]" />
              About LokSathi AI
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              LokSathi AI is an expert multilingual government document assistant designed to help Indian citizens decipher official paperwork, circulars, surcharges, and billing terms. By converting bureaucratic jargon into plain-language timelines and action plans, it empowers individuals to navigate civic interfaces independently.
            </p>
          </Card>

          {/* 2. FAQ */}
          <Card hoverEffect={false} className="border border-slate-200 bg-white p-5">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-[#2E8B57]" />
              Frequently Asked Questions (FAQ)
            </h3>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">{faq.q}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{faq.a}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 3. Privacy Information */}
          <Card hoverEffect={false} className="border border-slate-200 bg-white p-5">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2E8B57]" />
              Privacy Information
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Your files never leave your computer. LokSathi AI targets a local loopback server (`http://localhost:11434`) using the Gemma model running under Ollama. Biometrics, structural numbers, consumer IDs, and signatures are processed completely offline, keeping your privacy secure.
            </p>
          </Card>
        </div>

        {/* Formats and contact sidebar */}
        <div className="space-y-4">
          {/* Supported Formats */}
          <Card hoverEffect={false} className="border border-slate-200 bg-white p-5">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#2E8B57]" />
              Supported File Formats
            </h3>
            <div className="space-y-3 font-semibold">
              <div>
                <h4 className="text-[11px] text-slate-800 font-bold uppercase">Documents</h4>
                <ul className="list-disc pl-4 text-[10px] text-slate-500 mt-1 space-y-0.5">
                  <li>PDF (.pdf) - Selectable text layers</li>
                  <li>PDF (.pdf) - Scanned templates / canvas loops</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] text-slate-800 font-bold uppercase">Images</h4>
                <ul className="list-disc pl-4 text-[10px] text-slate-500 mt-1 space-y-0.5">
                  <li>JPEG / JPG (.jpg, .jpeg)</li>
                  <li>PNG (.png)</li>
                  <li>WEBP (.webp)</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Contact Support */}
          <Card hoverEffect={false} className="border border-slate-200 bg-white p-5 text-center">
            <div className="p-3 w-10 h-10 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center mx-auto mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase">Contact Support</h3>
            <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed mb-4">
              Have questions or need assistance during hackathon tests?
            </p>
            <a
              href="mailto:support@loksathi.ai"
              className="inline-block text-[10px] font-bold bg-slate-900 text-white py-2 px-4 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Send Email
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
