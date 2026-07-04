import React from 'react';
import { Cpu } from 'lucide-react';
import { useDocument } from '../../contexts/DocumentContext';
import Card from '../common/Card';

const LoadingScreen = () => {
  const { analysisStatus } = useDocument();

  const steps = [
    { text: 'Scanning document layout and structure...', percent: 20 },
    { text: 'Simplifying complex legal jargon & official clauses...', percent: 50 },
    { text: 'Extracting important dates, deadlines, and actions...', percent: 80 },
    { text: 'Finalizing translations and next steps checklist...', percent: 95 }
  ];

  // Map progress phases to step indices for visualization
  const getActiveStep = (status) => {
    if (!status) return 0;
    const s = status.toLowerCase();
    if (s.includes('loading') || s.includes('scan')) return 0;
    if (s.includes('converting') || s.includes('transcribing') || s.includes('ocr')) return 1;
    if (s.includes('gemma') || s.includes('analysis')) return 2;
    if (s.includes('parsing') || s.includes('results')) return 3;
    return 0;
  };

  const step = getActiveStep(analysisStatus);
  const progressPercent = steps[step]?.percent || 15;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 text-center">
      <Card hoverEffect={false} className="w-full py-12 px-8 relative overflow-hidden border border-white/80 shadow-md">
        {/* Glowing Laser Scanner Line */}
        <div className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#2E8B57] to-transparent animate-scan z-10 shadow-[0_0_12px_2px_rgba(46,139,87,0.4)]" />

        <div className="flex flex-col items-center justify-center">
          {/* Radar Scanning Ring */}
          <div className="relative mb-8 flex items-center justify-center w-28 h-28">
            {/* Outer radar ring */}
            <div className="absolute inset-0 border border-brand-saffron/10 rounded-full animate-ping" />
            <div className="absolute inset-4 border border-brand-saffron/20 rounded-full animate-pulse-slow" />
            <div className="absolute inset-8 border border-brand-saffron/40 rounded-full" />
            
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
              className="bg-gradient-to-r from-brand-saffron to-brand-saffron-dark h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_1px_rgba(249,115,22,0.3)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Active Status Display Block */}
          <div
            role="status"
            aria-live="polite"
            className="w-full max-w-xs text-left mx-auto bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3.5 shadow-sm"
          >
            {steps.map((s, index) => {
              const isActive = index === step;
              const isCompleted = index < step;
              return (
                <div key={index} className="flex items-center gap-3 transition-all duration-300">
                  <div className={`
                    w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-brand-green ring-2 ring-brand-green/20' 
                      : isActive 
                        ? 'bg-brand-saffron ring-4 ring-brand-saffron/25 animate-pulse' 
                        : 'bg-slate-300'
                    }
                  `} />
                  <span className={`
                    text-[11px] font-semibold tracking-wide transition-colors duration-300
                    ${isCompleted 
                      ? 'text-slate-400 line-through' 
                      : isActive 
                        ? 'text-brand-saffron font-bold animate-pulse' 
                        : 'text-slate-500'
                    }
                  `}>
                    {s.text}
                  </span>
                </div>
              );
            })}
          </div>
          
          {analysisStatus && (
            <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-wider">
              Live: <span className="text-[#2E8B57]">{analysisStatus}</span>
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LoadingScreen;
