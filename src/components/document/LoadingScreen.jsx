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
    <div className="w-full max-w-xl mx-auto px-4 py-8 text-center">
      <Card hoverEffect={false} className="w-full py-12 px-8 relative overflow-hidden border border-white/80 shadow-md">
        {/* Glowing Laser Scanner Line */}
        <div className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#2E8B57] to-transparent animate-scan z-10 shadow-[0_0_12px_2px_rgba(46,139,87,0.4)]" />

        <div className="flex flex-col items-center justify-center">
          {/* Radar Scanning Ring */}
          <div className="relative mb-6 flex items-center justify-center w-24 h-24">
            {/* Outer radar ring */}
            <div className="absolute inset-0 border border-[#2E8B57]/10 rounded-full animate-ping" />
            <div className="absolute inset-3 border border-[#2E8B57]/20 rounded-full animate-pulse-slow" />
            <div className="absolute inset-6 border border-[#2E8B57]/30 rounded-full" />
            
            {/* Center Glowing Icon */}
            <div className="relative p-4.5 rounded-[18px] bg-white border border-[#2E8B57]/20 text-[#2E8B57] shadow-md">
              <Cpu className="w-8 h-8 animate-pulse-slow" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-wide uppercase">
            Analyzing Document
          </h3>
          
          <p className="text-xs text-slate-500 max-w-xs mb-6 font-semibold">
            Gemma is reading, translating, and organizing your government document into clear sections.
          </p>

          {/* Progress Bar Container */}
          <div className="w-full bg-slate-100 border border-slate-200/80 rounded-full h-2 mb-6 overflow-hidden relative shadow-inner">
            <div
              className="bg-gradient-to-r from-[#2E8B57] to-[#5FAF7B] h-full rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${steps[step].percent}%` }}
            />
          </div>

          {/* Dynamic Progress Steps Checklist */}
          <div
            role="status"
            aria-live="polite"
            className="w-full max-w-xs text-left mx-auto bg-white/45 p-4 rounded-[20px] border border-slate-200/60 space-y-2.5 shadow-sm"
          >
            {steps.map((s, index) => {
              const isActive = index === step;
              const isCompleted = index < step;
              return (
                <div key={index} className="flex items-center gap-2.5 transition-all duration-300">
                  <div className={`
                    w-2 h-2 rounded-full shrink-0 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-[#5FAF7B] ring-2 ring-[#5FAF7B]/20' 
                      : isActive 
                        ? 'bg-[#2E8B57] ring-4 ring-[#2E8B57]/20 animate-pulse' 
                        : 'bg-slate-300'
                    }
                  `} />
                  <span className={`
                    text-[10px] font-bold uppercase tracking-wider transition-colors duration-300
                    ${isCompleted 
                      ? 'text-slate-400 line-through' 
                      : isActive 
                        ? 'text-[#2E8B57]' 
                        : 'text-slate-400'
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
