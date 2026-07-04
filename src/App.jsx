import React from 'react';
import { DocumentProvider, useDocument } from './contexts/DocumentContext';
import MainLayout from './components/layout/MainLayout';
import UploadZone from './components/document/UploadZone';
import LoadingScreen from './components/document/LoadingScreen';
import AnalysisPanel from './components/document/AnalysisPanel';
import { Compass, FileText, ShieldCheck, Languages } from 'lucide-react';
import Card from './components/common/Card';

const AppContent = () => {
  const { analysisResult, isAnalyzing } = useDocument();

  return (
    <MainLayout>
      {/* 1. Page Hero Banner - Display only when NOT viewing results and NOT loading */}
      {!analysisResult && !isAnalyzing && (
        <section className="text-center max-w-3xl mx-auto mb-12 px-4 animate-fade-in">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-saffron/10 border border-brand-saffron/20 rounded-full px-4.5 py-1.5 mb-6 text-brand-saffron font-bold text-xs uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>Build with Gemma Entry</span>
          </div>

          {/* Main Title */}
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-white mb-6 leading-tight">
            Understand Every Government Document <span className="text-brand-saffron font-extrabold">in Your Language.</span>
          </h2>

          {/* Subtext Tagline */}
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
            Millions struggle with complex legal notices, government forms, and official letters. Upload your file, select an Indian language, and get a simplified summary, checklists, and action dates.
          </p>
        </section>
      )}

      {/* 2. Interactive Page Router State */}
      <section className="w-full flex justify-center mb-16 min-h-[300px]">
        {isAnalyzing ? (
          <LoadingScreen />
        ) : analysisResult ? (
          <AnalysisPanel />
        ) : (
          <UploadZone />
        )}
      </section>

      {/* 3. Promotional Value Cards - Display only on Home state */}
      {!analysisResult && !isAnalyzing && (
        <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 animate-slide-up">
          {/* Card 1: Jargon Decoder */}
          <Card
            hoverEffect={true}
            className="text-left bg-slate-905/30 border-slate-800 m3-surface"
            header={
              <div className="p-2 rounded-xl bg-brand-saffron/10 text-brand-saffron border border-brand-saffron/10">
                <FileText className="w-5 h-5" />
              </div>
            }
          >
            <h3 className="text-sm font-display font-bold text-slate-100 mb-2 uppercase tracking-wide">
              Official Jargon Decoder
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Complex legal terminology and bureaucratic language are converted into clear, simple sentences that any citizen can understand.
            </p>
          </Card>

          {/* Card 2: Multilingual Support */}
          <Card
            hoverEffect={true}
            className="text-left bg-slate-905/30 border-slate-800 m3-surface"
            header={
              <div className="p-2 rounded-xl bg-brand-green/10 text-brand-green border border-brand-green/10">
                <Languages className="w-5 h-5" />
              </div>
            }
          >
            <h3 className="text-sm font-display font-bold text-slate-100 mb-2 uppercase tracking-wide">
              11+ Regional Languages
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Read simplified explanations in Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, and other regional scripts instantly.
            </p>
          </Card>

          {/* Card 3: Checklist generator */}
          <Card
            hoverEffect={true}
            className="text-left bg-slate-905/30 border-slate-800 m3-surface"
            header={
              <div className="p-2 rounded-xl bg-brand-blue/10 text-brand-blue border border-brand-blue/10">
                <ShieldCheck className="w-5 h-5" />
              </div>
            }
          >
            <h3 className="text-sm font-display font-bold text-slate-100 mb-2 uppercase tracking-wide">
              Timelines & Checklists
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              LokSathi parses the document to generate a step-by-step next steps guide, required proof checklists, and warns you of critical dates.
            </p>
          </Card>
        </section>
      )}
    </MainLayout>
  );
};

const App = () => {
  return (
    <DocumentProvider>
      <AppContent />
    </DocumentProvider>
  );
};

export default App;
