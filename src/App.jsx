import React, { useState } from 'react';
import { DocumentProvider, useDocument } from './contexts/DocumentContext';
import MainLayout from './components/layout/MainLayout';
import UploadZone from './components/document/UploadZone';
import LoadingScreen from './components/document/LoadingScreen';
import AnalysisPanel from './components/document/AnalysisPanel';
import LanguageSelector from './components/document/LanguageSelector';
import Card from './components/common/Card';
import Button from './components/common/Button';
import Badge from './components/common/Badge';
import { 
  Compass, FileText, ShieldCheck, Languages, 
  LayoutDashboard, Upload, History, Heart, Settings, 
  HelpCircle, Sun, User, Sparkles, ChevronRight,
  Plus, CheckSquare, ListTodo, AlertCircle, RefreshCw, Eye
} from 'lucide-react';

const AppContent = () => {
  const { analysisResult, isAnalyzing, resetState } = useDocument();
  const [showLanding, setShowLanding] = useState(true);
  
  // Interactive checklist tasks state
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Verify HoF Aadhaar credentials', category: 'Unplanned', completed: false },
    { id: 2, text: 'Print UIDAI self-declaration sheet', category: 'Unplanned', completed: false },
    { id: 3, text: 'Get ration card photo copy', category: 'Without Project', completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const [activeCategory, setActiveCategory] = useState('Unplanned');

  const handleAddTask = (e) => {
    if (e.key === 'Enter' && newTaskText.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: newTaskText.trim(),
        category: activeCategory,
        completed: false
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Switch to application dashboard
  const handleStartAnalyzing = () => {
    setShowLanding(false);
  };

  // --- LANDING PAGE RENDER ---
  if (showLanding) {
    return (
      <MainLayout showLanding={true}>
        {/* Floating Glass Navigation Bar */}
        <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sticky top-0 z-50">
          <div className="glass-panel px-6 py-3 rounded-[24px] flex items-center justify-between border-white/70 shadow-sm">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2E8B57] to-[#5FAF7B] flex items-center justify-center text-white shadow-sm">
                <Compass className="w-4.5 h-4.5" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-800 tracking-tight leading-none">
                  LokSathi <span className="text-[#2E8B57]">AI</span>
                </h1>
                <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5 hidden sm:block">
                  Understand Every Government Document
                </p>
              </div>
            </div>

            {/* Nav Menu Links */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-xs font-bold text-[#2E8B57] hover:text-[#2E8B57] transition-colors">Home</a>
              <a href="#features" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Features</a>
              <a href="#how-it-works" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">How It Works</a>
              <a href="#about" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">About</a>
              <a href="#contact" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Contact</a>
            </div>

            {/* Top Right Badges & Selectors */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                <Sparkles className="w-3 h-3 text-[#2E8B57]" />
                <span className="text-[10px] font-bold text-[#2E8B57] uppercase tracking-wide">
                  Built with Gemma
                </span>
              </div>
              <div className="bg-white/50 rounded-xl p-0.5 border border-slate-200/60 scale-90">
                <LanguageSelector />
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-6 py-12">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 mb-6 text-[#2E8B57] font-bold text-[10px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Document Understanding</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-800 mb-6 leading-tight max-w-3xl">
            Understand Every Government Document <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E8B57] to-[#5FAF7B]">in Your Language.</span>
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed font-semibold mb-8">
            Millions struggle with complex legal notices, government forms, and official letters. Upload your file, select an Indian language, and get a simplified summary, checklists, and action dates.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <span className="text-[10px] font-bold px-3 py-1 bg-white/60 border border-slate-200/50 rounded-full text-slate-600 shadow-sm">
              ✨ AI Powered
            </span>
            <span className="text-[10px] font-bold px-3 py-1 bg-white/60 border border-slate-200/50 rounded-full text-slate-600 shadow-sm">
              🔒 100% Private
            </span>
            <span className="text-[10px] font-bold px-3 py-1 bg-white/60 border border-slate-200/50 rounded-full text-slate-600 shadow-sm">
              🌐 Supports 11+ Indian Languages
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-3">
            <Button
              id="start-analyzing-cta"
              variant="primary"
              size="lg"
              onClick={handleStartAnalyzing}
              className="w-48 font-bold"
            >
              Start Analyzing
            </Button>
            <Button
              id="learn-more-cta"
              variant="secondary"
              size="lg"
              className="w-48 font-bold"
              onClick={() => {
                const el = document.getElementById("stats-section");
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold mb-12">Supports PDF, JPG, PNG files up to 10MB</p>
        </section>

        {/* Stats Section */}
        <section id="stats-section" className="w-full border-t border-slate-200/60 bg-white/20 py-8 px-6 mt-auto">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-800">1M+</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Documents Processed</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-800">11+</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Languages Supported</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-800">100%</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">AI Powered</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-800">Secure</p>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Local Processing</p>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  // --- APPLICATION DASHBOARD RENDER ---
  return (
    <MainLayout showLanding={false}>
      <div className="flex w-full h-screen overflow-hidden">
        {/* Left Sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 border-r border-slate-200/50 bg-white/45 backdrop-blur-xl flex-col p-5 justify-between h-full z-10">
          <div className="flex flex-col gap-6">
            {/* Branding Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2E8B57] to-[#5FAF7B] flex items-center justify-center text-white shadow-sm cursor-pointer" onClick={() => setShowLanding(true)}>
                <Compass className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 tracking-tight leading-none">
                  LokSathi <span className="text-[#2E8B57]">AI</span>
                </h2>
                <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                  Government Document AI
                </p>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="flex flex-col gap-1.5 mt-2">
              <button className="flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl bg-[#2E8B57]/10 text-[#2E8B57] border border-[#2E8B57]/10 text-left transition-colors">
                <LayoutDashboard className="w-4 h-4 text-[#2E8B57]" />
                <span>Dashboard</span>
              </button>
              <button className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-xl text-left transition-colors cursor-pointer" onClick={resetState}>
                <Upload className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
              <button className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-xl text-left transition-colors cursor-pointer">
                <FileText className="w-4 h-4" />
                <span>My Documents</span>
              </button>
              <button className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-xl text-left transition-colors cursor-pointer">
                <History className="w-4 h-4" />
                <span>AI History</span>
              </button>
              <button className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-xl text-left transition-colors cursor-pointer">
                <Heart className="w-4 h-4" />
                <span>Saved Results</span>
              </button>
              <button className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-xl text-left transition-colors cursor-pointer">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-xl text-left transition-colors cursor-pointer">
                <HelpCircle className="w-4 h-4" />
                <span>Help & Support</span>
              </button>
            </div>
          </div>

          {/* Bottom Security Card */}
          <div className="p-4 rounded-[20px] bg-emerald-50/50 border border-emerald-100/80">
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#2E8B57] uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Secure</span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold mt-1.5 leading-relaxed">
              Your documents are processed locally. Nothing is stored on our servers.
            </p>
          </div>
        </aside>

        {/* Right Content Pane */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          
          {/* Top row action header bar */}
          <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200/50 bg-white/20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <button className="md:hidden w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mr-2" onClick={() => setShowLanding(true)}>
                <Compass className="w-4.5 h-4.5" />
              </button>
              <span className="text-xs font-bold text-slate-400">Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-xs font-bold text-slate-700">
                {isAnalyzing ? "Analyzing Document..." : analysisResult ? "Analysis Report" : "Document Dashboard"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Gemma Indicator */}
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100/60 rounded-full px-3 py-1 text-[10px] font-bold text-[#2E8B57] uppercase tracking-wide">
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">Built with Gemma</span>
              </div>

              {/* Theme Settings Sun Icon */}
              <button className="p-2 rounded-xl bg-white/60 hover:bg-white border border-slate-200/60 text-slate-600 hover:text-slate-800 transition-colors shadow-sm">
                <Sun className="w-4 h-4" />
              </button>

              {/* User profile avatar initials */}
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xs font-extrabold text-[#2E8B57] shadow-sm" title="Arnob Mondal">
                AM
              </div>
            </div>
          </header>

          {/* Main workspace scrollable content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {isAnalyzing ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <LoadingScreen />
              </div>
            ) : analysisResult ? (
              <AnalysisPanel />
            ) : (
              /* EMPTY STATE DASHBOARD LAYOUT */
              <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
                
                {/* Greeting Title */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-500">Good morning, Arnob 👋</h3>
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-1">
                    How can we <span className="text-[#2E8B57]">help you</span> today?
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
                    Upload any government document and get simplified explanations, translations, and actionable next steps.
                  </p>
                </div>

                {/* 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column (Upload and details) */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <Card hoverEffect={false} className="w-full border border-white/80 shadow-md">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">Upload Government Document</h4>
                      <UploadZone />
                    </Card>

                    {/* Subgrid beneath Upload Zone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Recent Activity Mock Card */}
                      <Card hoverEffect={false} className="border border-white/80 shadow-md">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Activity</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/50">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="w-4 h-4 text-[#2E8B57] shrink-0" />
                              <span className="text-[10px] font-bold text-slate-700 truncate pr-2">Ration Card Notice.pdf</span>
                            </div>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/60 uppercase">Completed</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/50">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="w-4 h-4 text-[#2E8B57] shrink-0" />
                              <span className="text-[10px] font-bold text-slate-700 truncate pr-2">Income Certificate.jpg</span>
                            </div>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/60 uppercase">Completed</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/50">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="w-4 h-4 text-[#2E8B57] shrink-0" />
                              <span className="text-[10px] font-bold text-slate-700 truncate pr-2">Land Record.png</span>
                            </div>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/60 uppercase">Completed</span>
                          </div>
                        </div>
                      </Card>

                      {/* Quick Guide Card */}
                      <Card hoverEffect={false} className="border border-white/80 shadow-md">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Guide</h4>
                        <div className="space-y-2.5">
                          <div className="flex items-start gap-2.5">
                            <span className="w-4.5 h-4.5 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] border border-[#2E8B57]/15 flex items-center justify-center text-[9px] font-extrabold shrink-0 mt-0.5">1</span>
                            <div className="flex-1">
                              <h5 className="text-[10px] font-bold text-slate-700">Upload your file</h5>
                              <p className="text-[9px] text-slate-400 font-semibold leading-tight">Supports PDF, JPG, PNG (up to 10MB)</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-4.5 h-4.5 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] border border-[#2E8B57]/15 flex items-center justify-center text-[9px] font-extrabold shrink-0 mt-0.5">2</span>
                            <div className="flex-1">
                              <h5 className="text-[10px] font-bold text-slate-700">Select language</h5>
                              <p className="text-[9px] text-slate-400 font-semibold leading-tight">Choose from 11+ regional Indian options</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-4.5 h-4.5 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] border border-[#2E8B57]/15 flex items-center justify-center text-[9px] font-extrabold shrink-0 mt-0.5">3</span>
                            <div className="flex-1">
                              <h5 className="text-[10px] font-bold text-slate-700">Analyze document</h5>
                              <p className="text-[9px] text-slate-400 font-semibold leading-tight">Gemma AI will simplify and translate instantly</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Right Column (Checklist Tasks manager card) */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <Card hoverEffect={false} className="border border-white/80 shadow-md">
                      <div className="flex items-center gap-2 mb-3">
                        <ListTodo className="w-4 h-4 text-[#2E8B57]" />
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Tasks</h4>
                      </div>

                      {/* category tab togglers */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-4 p-1 bg-slate-100 rounded-xl">
                        {['Unplanned', 'Without Project'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wide transition-colors cursor-pointer ${activeCategory === cat ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Add new task input */}
                      <div className="relative mb-4">
                        <input
                          type="text"
                          value={newTaskText}
                          onChange={(e) => setNewTaskText(e.target.value)}
                          onKeyDown={handleAddTask}
                          placeholder="+ Add new task (Press Enter to save)"
                          className="w-full text-xs py-2 px-3 pr-10 border border-slate-200 rounded-xl bg-white/60 focus:outline-none focus:border-[#2E8B57] focus:bg-white text-slate-800 placeholder-slate-400 transition-all font-semibold"
                        />
                      </div>

                      {/* Tasks lists */}
                      <div className="space-y-2">
                        {tasks.filter(t => t.category === activeCategory).length === 0 ? (
                          <p className="text-[10px] text-slate-400 italic text-center py-4 font-semibold">No tasks in this category.</p>
                        ) : (
                          tasks.filter(t => t.category === activeCategory).map(task => (
                            <div
                              key={task.id}
                              onClick={() => toggleTask(task.id)}
                              className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${task.completed ? 'bg-slate-100/40 border-slate-200 opacity-60' : 'bg-white/40 border-slate-200/80 hover:border-[#2E8B57]/30 hover:bg-white/70'}`}
                            >
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => {}}
                                className="h-3.5 w-3.5 rounded border-slate-300 text-[#2E8B57] focus:ring-[#2E8B57] bg-white cursor-pointer"
                              />
                              <span className={`text-[10px] font-semibold text-slate-700 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                                {task.text}
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Bottom static states */}
                      <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Scheduled: 0</span>
                        <span>Done: {tasks.filter(t => t.completed).length}</span>
                        <span>Todos: {tasks.filter(t => !t.completed).length}</span>
                      </div>
                    </Card>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
