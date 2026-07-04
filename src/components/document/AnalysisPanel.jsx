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
    <div className="w-full max-w-7xl mx-auto px-4 py-2 animate-slide-up">
      {/* 1. Header Navigation and actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Button
          id="back-to-upload-button"
          variant="ghost"
          size="sm"
          iconLeft={ArrowLeft}
          onClick={resetState}
          className="text-slate-400 hover:text-slate-100 self-start cursor-pointer"
        >
          Upload Another Document
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400">Viewing translation for:</span>
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
            className="w-full text-left glow-blue m3-surface"
            header={
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-blue" />
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Analyzed Document Info</span>
              </div>
            }
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <h3 className="text-xl font-display font-extrabold text-white">
                  {analysisResult.documentType}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Source file: <span className="text-slate-200">{fileName || 'gov_consent_form.pdf'}</span> ({fileSize || '1.24 MB'})
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
            className="w-full text-left m3-surface"
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <BadgeInfo className="w-5 h-5 text-brand-saffron" />
                  <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Simplified Summary</span>
                </div>
                <Button
                  id="speak-explanation-button"
                  variant="outline"
                  size="sm"
                  onClick={handleSpeak}
                  className="h-8.5 px-3 rounded-lg border-slate-800 bg-slate-900/40 hover:bg-slate-800/50 flex items-center gap-2 text-xs"
                  title={isPlayingSpeech ? "Stop playing" : "Read aloud"}
                >
                  {isPlayingSpeech ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-brand-green" />
                      <span>Read Aloud</span>
                    </>
                  )}
                </Button>
              </div>
            }
          >
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line font-sans">
                {currentTranslationText}
              </p>
            </div>
          </Card>

          {/* Card C: Important Information / Legal Warnings */}
          <Card
            hoverEffect={false}
            className="w-full text-left border-l-4 border-l-brand-saffron m3-surface glow-orange"
            header={
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-brand-saffron" />
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Critical Highlights</span>
              </div>
            }
          >
            <div className="space-y-4">
              {analysisResult.importantInfo && analysisResult.importantInfo.map((info, idx) => {
                // simple parser for **bold** text in mock info
                const parts = info.split('**');
                return (
                  <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-saffron shrink-0 mt-1.5" />
                    <p>
                      {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part)}
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
            className="w-full text-left m3-surface"
            header={
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-brand-blue" />
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Step-by-Step Action Plan</span>
              </div>
            }
          >
            <div className="relative border-l border-slate-800 ml-3 pl-6 space-y-7 py-1">
              {analysisResult.actionPlan.map((step) => (
                <div key={step.step} className="relative group">
                  {/* Circle timeline point */}
                  <span className="absolute -left-[35px] top-0.5 w-[18px] h-[18px] rounded-full bg-brand-navy border-2 border-brand-blue text-[9px] font-bold flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-slate-950 transition-colors duration-250">
                    {step.step}
                  </span>
                  
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-brand-blue transition-colors duration-200 uppercase tracking-wide">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-medium">
                    {step.description}
                  </p>
                  
                  {step.checklist && step.checklist.length > 0 && (
                    <div className="mt-2.5 bg-slate-950/60 rounded-xl p-2.5 border border-slate-900 space-y-1">
                      {step.checklist.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                          <div className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />
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
            className="w-full text-left m3-surface glow-orange"
            header={
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-brand-saffron" />
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Critical Dates & Deadlines</span>
              </div>
            }
          >
            <div className="space-y-3.5">
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
                    p-3.5 
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
                    focus-visible:ring-brand-saffron/40
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-slate-950
                    ${dl.completed 
                      ? 'bg-slate-950/20 border-slate-950 opacity-50' 
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={dl.completed}
                    onChange={() => {}} // Handled by outer container click
                    tabIndex={-1}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-800 text-brand-saffron focus:ring-brand-saffron focus:ring-offset-slate-950 cursor-pointer bg-slate-950"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${dl.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {dl.date}
                      </span>
                      <Badge variant={dl.priority === 'high' ? 'red' : dl.priority === 'medium' ? 'saffron' : 'neutral'} size="sm">
                        {dl.priority}
                      </Badge>
                    </div>
                    <p className={`text-[11px] mt-1.5 leading-relaxed font-semibold ${dl.completed ? 'line-through text-slate-500' : 'text-slate-400'}`}>
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
            className="w-full text-left m3-surface glow-green"
            header={
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-brand-green" />
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Required Documents Checklist</span>
              </div>
            }
          >
            <div className="space-y-3.5">
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
                    p-3.5 
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
                    focus-visible:ring-brand-green/40
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-slate-950
                    ${doc.status === 'have' 
                      ? 'bg-brand-green/5 border-brand-green/20' 
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={doc.status === 'have'}
                    onChange={() => {}} // Handled by outer container click
                    tabIndex={-1}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-800 text-brand-green focus:ring-brand-green focus:ring-offset-slate-950 cursor-pointer bg-slate-950"
                  />

                  <div className="flex-1">
                    <span className={`text-xs font-bold ${doc.status === 'have' ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                      {doc.name}
                    </span>
                    <p className={`text-[11px] mt-1 leading-relaxed font-medium ${doc.status === 'have' ? 'text-slate-500 line-through' : 'text-slate-400'}`}>
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
