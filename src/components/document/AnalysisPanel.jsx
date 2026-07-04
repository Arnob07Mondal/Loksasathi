import React, { useState } from 'react';
import { useDocument } from '../../contexts/DocumentContext';
import {
  FileText, Calendar, CheckSquare, ListChecks,
  Volume2, VolumeX, ArrowLeft, CalendarDays,
  FileCheck2, ShieldAlert, BadgeInfo, Play, Square, Languages
} from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';
import LanguageSelector from './LanguageSelector';

const AnalysisPanel = () => {
  const {
    fileName,
    fileSize,
    analysisResult,
    activeLanguage,
    toggleDocCheck,
    toggleDeadlineCheck,
    resetState
  } = useDocument();

  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);

  if (!analysisResult) return null;

  const currentTranslationText = analysisResult.translations[activeLanguage] || analysisResult.simplifiedText;

  // Accessibility: Read simplified text aloud using browser SpeechSynthesis
  const handleSpeak = () => {
    if (isPlayingSpeech) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
      return;
    }

    const textToSpeak = currentTranslationText;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Guess voice based on active language code
    const voices = window.speechSynthesis.getVoices();
    let langCode = 'en-IN';
    if (activeLanguage === 'hi') langCode = 'hi-IN';
    else if (activeLanguage === 'bn') langCode = 'bn-IN';
    else if (activeLanguage === 'mr') langCode = 'mr-IN';
    else if (activeLanguage === 'te') langCode = 'te-IN';
    else if (activeLanguage === 'ta') langCode = 'ta-IN';
    else if (activeLanguage === 'gu') langCode = 'gu-IN';

    utterance.lang = langCode;
    const matchedVoice = voices.find(voice => voice.lang.startsWith(activeLanguage));
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onend = () => {
      setIsPlayingSpeech(false);
    };
    utterance.onerror = () => {
      setIsPlayingSpeech(false);
    };

    setIsPlayingSpeech(true);
    window.speechSynthesis.speak(utterance);
  };

  React.useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [activeLanguage]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-2 transition-all duration-300">
      {/* 1. Header Navigation and actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Button
          id="back-to-upload-button"
          variant="ghost"
          size="sm"
          iconLeft={ArrowLeft}
          onClick={resetState}
          className="text-slate-500 hover:text-slate-800 self-start cursor-pointer font-bold"
        >
          Upload Another Document
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Viewing translation:</span>
          <LanguageSelector />
        </div>
      </div>

      {/* 2. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Summary & Information (Spans 7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Card A: Document Type */}
          <Card
            hoverEffect={false}
            className="w-full text-left border border-white/80 shadow-md"
            header={
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2E8B57]" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Document Type</span>
              </div>
            }
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {analysisResult.documentType}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-semibold">
                  Source: <span className="text-slate-700 font-bold">{fileName || 'gov_consent_form.pdf'}</span> ({fileSize || '1.24 MB'})
                </p>
              </div>
              <Badge variant="green" size="md" showDot={true}>
                Gemma Analysis Complete
              </Badge>
            </div>
          </Card>

          {/* Card B: AI Summary */}
          <Card
            hoverEffect={false}
            className="w-full text-left border border-white/80 shadow-md"
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <BadgeInfo className="w-4 h-4 text-[#2E8B57]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Simplified Summary</span>
                </div>
                <Button
                  id="speak-explanation-button"
                  variant="outline"
                  size="sm"
                  onClick={handleSpeak}
                  className="h-8.5 px-3 rounded-lg border-slate-200 bg-white/40 hover:bg-white/80 flex items-center gap-2 text-[10px]"
                  title={isPlayingSpeech ? "Stop playing" : "Read aloud"}
                >
                  {isPlayingSpeech ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#2E8B57]" />
                      <span>Read Aloud</span>
                    </>
                  )}
                </Button>
              </div>
            }
          >
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line font-medium font-sans">
                {currentTranslationText}
              </p>
            </div>
          </Card>

          {/* Card C: Important Information / Legal Warnings */}
          <Card
            hoverEffect={false}
            className="w-full text-left border-l-4 border-l-[#2E8B57] border-white/85 shadow-md"
            header={
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#2E8B57]" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Critical Highlights</span>
              </div>
            }
          >
            <div className="space-y-3.5">
              {analysisResult.importantInfo && analysisResult.importantInfo.map((info, idx) => {
                // simple parser for **bold** text in mock info
                const parts = info.split('**');
                return (
                  <div key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-600 font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2E8B57] shrink-0 mt-1.5" />
                    <p>
                      {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-slate-800 font-extrabold">{part}</strong> : part)}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Action Steps & Checklists (Spans 5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Card D: Next Steps / Action Plan */}
          <Card
            hoverEffect={false}
            className="w-full text-left border border-white/80 shadow-md"
            header={
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-[#5FAF7B]" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Step-by-Step Action Plan</span>
              </div>
            }
          >
            <div className="relative border-l border-slate-200 ml-2.5 pl-5 space-y-6 py-1">
              {analysisResult.actionPlan.map((step) => (
                <div key={step.step} className="relative group">
                  {/* Circle timeline point */}
                  <span className="absolute -left-[30px] top-0.5 w-[16px] h-[16px] rounded-full bg-white border-2 border-[#5FAF7B] text-[9px] font-bold flex items-center justify-center text-[#2E8B57] group-hover:bg-[#5FAF7B] group-hover:text-white transition-colors duration-250">
                    {step.step}
                  </span>
                  
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#2E8B57] transition-colors duration-200 uppercase tracking-wide">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-semibold">
                    {step.description}
                  </p>
                  
                  {step.checklist && step.checklist.length > 0 && (
                    <div className="mt-2.5 bg-slate-50 rounded-xl p-2.5 border border-slate-200/60 space-y-1">
                      {step.checklist.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                          <div className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Card E: Deadlines */}
          <Card
            hoverEffect={false}
            className="w-full text-left border border-white/80 shadow-md"
            header={
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#2E8B57]" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Critical Dates & Deadlines</span>
              </div>
            }
          >
            <div className="space-y-3">
              {analysisResult.deadlines.map((dl) => (
                <div
                  key={dl.id}
                  onClick={() => toggleDeadlineCheck(dl.id)}
                  tabIndex={0}
                  role="checkbox"
                  aria-checked={dl.completed}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleDeadlineCheck(dl.id);
                    }
                  }}
                  className={`
                    p-3 
                    rounded-2xl 
                    border 
                    transition-all 
                    duration-200 
                    cursor-pointer 
                    flex 
                    items-start 
                    gap-3
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#2E8B57]/40
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-white
                    ${dl.completed 
                      ? 'bg-slate-100/50 border-slate-200 opacity-50' 
                      : 'bg-white/40 border-slate-200/80 hover:border-[#2E8B57]/30 hover:bg-white/70'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={dl.completed}
                    onChange={() => {}} // Handled by outer container click
                    tabIndex={-1}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#2E8B57] focus:ring-[#2E8B57] focus:ring-offset-white cursor-pointer bg-white"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${dl.completed ? 'line-through text-slate-400' : 'text-slate-800 font-extrabold'}`}>
                        {dl.date}
                      </span>
                      <Badge variant={dl.priority === 'high' ? 'red' : dl.priority === 'medium' ? 'saffron' : 'neutral'} size="sm">
                        {dl.priority}
                      </Badge>
                    </div>
                    <p className={`text-[10px] mt-1 leading-relaxed ${dl.completed ? 'line-through text-slate-400 font-medium' : 'text-slate-600 font-bold'}`}>
                      {dl.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Card F: Required Documents */}
          <Card
            hoverEffect={false}
            className="w-full text-left border border-white/80 shadow-md"
            header={
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Required Documents Checklist</span>
              </div>
            }
          >
            <div className="space-y-3">
              {analysisResult.requiredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => toggleDocCheck(doc.id)}
                  tabIndex={0}
                  role="checkbox"
                  aria-checked={doc.status === 'have'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleDocCheck(doc.id);
                    }
                  }}
                  className={`
                    p-3 
                    rounded-2xl 
                    border 
                    transition-all 
                    duration-200 
                    cursor-pointer 
                    flex 
                    items-start 
                    gap-3
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#2E8B57]/40
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-white
                    ${doc.status === 'have' 
                      ? 'bg-emerald-50/50 border-emerald-200/50' 
                      : 'bg-white/40 border-slate-200/80 hover:border-[#2E8B57]/30 hover:bg-white/70'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={doc.status === 'have'}
                    onChange={() => {}} // Handled by outer container click
                    tabIndex={-1}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-white cursor-pointer bg-white"
                  />

                  <div className="flex-1">
                    <span className={`text-[11px] font-bold ${doc.status === 'have' ? 'text-slate-400 line-through' : 'text-slate-800 font-extrabold'}`}>
                      {doc.name}
                    </span>
                    <p className={`text-[10px] mt-0.5 leading-relaxed ${doc.status === 'have' ? 'text-slate-400 line-through' : 'text-slate-500 font-semibold'}`}>
                      {doc.purpose}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;
