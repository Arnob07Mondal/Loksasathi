import React, { useState, useEffect } from 'react';
import { Compass, FileText, Cpu } from 'lucide-react';
import Card from '../common/Card';

const LoadingScreen = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: 'Scanning document layout and structure...', percent: 20 },
    { text: 'Simplifying complex legal jargon & official clauses...', percent: 50 },
    { text: 'Extracting important dates, deadlines, and actions...', percent: 80 },
    { text: 'Finalizing translations and next steps checklist...', percent: 95 }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 600);
    const timer2 = setTimeout(() => setStep(2), 1200);
    const timer3 = setTimeout(() => setStep(3), 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 animate-fade-in text-center">
      <Card hoverEffect={false} className="w-full py-12 px-8 relative overflow-hidden glow-saffron m3-surface">
        {/* Material 3 Glowing Laser Scanner Line */}
        <div className="absolute left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-brand-saffron to-transparent animate-scan z-10 shadow-[0_0_15px_3px_rgba(249,115,22,0.6)]" />

        <div className="flex flex-col items-center justify-center">
          {/* Radar Scanning Ring */}
          <div className="relative mb-8 flex items-center justify-center w-28 h-28">
            {/* Outer radar ring */}
            <div className="absolute inset-0 border border-brand-saffron/10 rounded-full animate-ping" />
            <div className="absolute inset-4 border border-brand-saffron/20 rounded-full animate-pulse-slow" />
            <div className="absolute inset-8 border border-brand-saffron/40 rounded-full" />
            
            {/* Center Glowing Icon */}
            <div className="relative p-5 rounded-2xl bg-slate-900 border border-brand-saffron/30 text-brand-saffron shadow-lg shadow-brand-saffron/10">
              <Cpu className="w-10 h-10 animate-pulse-slow" />
            </div>
          </div>

          <h3 className="text-xl font-display font-extrabold text-slate-100 mb-3 tracking-wide">
            LokSathi AI is Processing
          </h3>
          
          <p className="text-sm text-slate-400 max-w-sm mb-8 font-medium">
            Gemma is reading, translating, and organizing your government document into clear sections.
          </p>

          {/* Progress Bar Container */}
          <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2 mb-8 overflow-hidden relative">
            <div
              className="bg-gradient-to-r from-brand-saffron to-brand-saffron-dark h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_1px_rgba(249,115,22,0.3)]"
              style={{ width: `${steps[step].percent}%` }}
            />
          </div>

          {/* Dynamic Progress Steps Checklist */}
          <div
            role="status"
            aria-live="polite"
            className="w-full max-w-xs text-left mx-auto bg-slate-950/60 p-5 rounded-2xl border border-slate-900/80 space-y-3.5 shadow-inner"
          >
            {steps.map((s, index) => {
              const isActive = index === step;
              const isCompleted = index < step;
              return (
                <div key={index} className="flex items-center gap-3 transition-all duration-300">
                  <div className={`
                    w-2 h-2 rounded-full shrink-0 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-brand-green ring-2 ring-brand-green/20' 
                      : isActive 
                        ? 'bg-brand-saffron ring-4 ring-brand-saffron/25 animate-pulse' 
                        : 'bg-slate-700'
                    }
                  `} />
                  <span className={`
                    text-[11px] font-semibold tracking-wide transition-colors duration-300
                    ${isCompleted 
                      ? 'text-slate-400 line-through' 
                      : isActive 
                        ? 'text-brand-saffron font-bold' 
                        : 'text-slate-600'
                    }
                  `}>
                    {s.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoadingScreen;
