import React, { useState } from 'react';
import { DocumentProvider, useDocument } from './contexts/DocumentContext';
import MainLayout from './components/layout/MainLayout';
import LandingPage from './components/layout/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import UploadZone from './components/document/UploadZone';
import LoadingScreen from './components/document/LoadingScreen';
import AnalysisPanel from './components/document/AnalysisPanel';
import MyDocuments from './components/document/MyDocuments';
import AIHistory from './components/document/AIHistory';
import SavedResults from './components/document/SavedResults';
import SettingsView from './components/document/SettingsView';
import HelpSupport from './components/document/HelpSupport';
import Card from './components/common/Card';
import Badge from './components/common/Badge';
import { Sparkles, FileText, ListTodo, ChevronRight } from 'lucide-react';

const AppContent = () => {
  const { 
    analysisResult, 
    isAnalyzing, 
    setAnalysisResult, 
    setFileName, 
    setFileSize,
    processedDocs
  } = useDocument();

  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Interactive Checklist Tasks Manager State
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [activeCategory, setActiveCategory] = useState('Unplanned');

  const handleStartAnalyzing = () => {
    setShowLanding(false);
    setActiveTab('dashboard');
  };

  const handleSelectDocument = (result, name, size) => {
    setAnalysisResult(result);
    setFileName(name);
    setFileSize(size);
    setActiveTab('dashboard');
  };

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

  // 1. Render Landing Page
  if (showLanding) {
    return (
      <MainLayout showLanding={true}>
        <LandingPage onStart={handleStartAnalyzing} />
      </MainLayout>
    );
  }

  // 2. Render Dashboard Layout
  return (
    <MainLayout showLanding={false}>
      <DashboardLayout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onBack={() => setShowLanding(true)}
      >
        {/* Workspace Action Header Bar */}
        <header className="w-full pb-6 mb-6 flex items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workspace</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {activeTab === 'dashboard'
                ? isAnalyzing
                  ? 'Analyzing...'
                  : analysisResult
                    ? 'Report Analysis'
                    : 'Document Upload'
                : activeTab === 'documents'
                  ? 'My Documents'
                  : activeTab === 'history'
                    ? 'AI History'
                    : activeTab === 'saved'
                      ? 'Saved'
                      : activeTab === 'settings'
                        ? 'Settings'
                        : 'Help & Support'
              }
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Hackathon Badge */}
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100/60 rounded-full px-3 py-1 text-[10px] font-bold text-[#2E8B57] uppercase tracking-wide">
              <Sparkles className="w-3 h-3 text-[#2E8B57] animate-pulse" />
              <span>Built with Gemma</span>
            </div>

            {/* User Profile initials */}
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100/85 flex items-center justify-center text-xs font-extrabold text-[#2E8B57] shadow-sm select-none" title="User Profile">
              AM
            </div>
          </div>
        </header>

        {/* Dynamic Tab Render Area */}
        <div className="flex-1 min-h-0">
          {activeTab === 'dashboard' && (
            isAnalyzing ? (
              <LoadingScreen />
            ) : analysisResult ? (
              <AnalysisPanel />
            ) : (
              /* Original 2-Column Dashboard Upload Workspace Layout */
              <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 text-left animate-slide-up">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight uppercase">
                    Workspace
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
                    Upload any government document and get simplified explanations, translations, and actionable next steps.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* LEFT COLUMN: Upload & Activity (spans 8 on lg) */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <Card hoverEffect={false} className="w-full border border-white/80 shadow-md p-6 bg-white">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Upload Government Document</h4>
                      <UploadZone />
                    </Card>

                    {/* Subgrid: Recent Activity & Quick Guide */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Recent Activity Card */}
                      <Card hoverEffect={false} className="border border-white/80 shadow-md p-5 bg-white">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Activity</h4>
                        
                        <div className="space-y-2.5">
                          {processedDocs.length === 0 ? (
                            <p className="text-[10px] text-slate-400 italic text-center py-4 font-semibold">
                              No recent activity. Upload a file to start.
                            </p>
                          ) : (
                            processedDocs.slice(0, 3).map((doc) => (
                              <div 
                                key={doc.id}
                                onClick={() => handleSelectDocument(doc.result, doc.name, doc.size)}
                                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/50 cursor-pointer hover:border-[#2E8B57]/30 hover:bg-slate-100/30 transition-all duration-200"
                              >
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <FileText className="w-4 h-4 text-[#2E8B57] shrink-0" />
                                  <span className="text-[10px] font-bold text-slate-700 truncate pr-2">
                                    {doc.name}
                                  </span>
                                </div>
                                <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/60 uppercase shrink-0">
                                  COMPLETED
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </Card>

                      {/* Quick Guide Card */}
                      <Card hoverEffect={false} className="border border-white/80 shadow-md p-5 bg-white">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Guide</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2.5">
                            <span className="w-4.5 h-4.5 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] border border-[#2E8B57]/15 flex items-center justify-center text-[9px] font-extrabold shrink-0 mt-0.5">1</span>
                            <div className="flex-1">
                              <h5 className="text-[10px] font-bold text-slate-700">Upload your file</h5>
                              <p className="text-[9px] text-slate-400 font-semibold leading-tight mt-0.5">PDF, JPG, PNG, WEBP (up to 10MB)</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-4.5 h-4.5 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] border border-[#2E8B57]/15 flex items-center justify-center text-[9px] font-extrabold shrink-0 mt-0.5">2</span>
                            <div className="flex-1">
                              <h5 className="text-[10px] font-bold text-slate-700">Select language</h5>
                              <p className="text-[9px] text-slate-400 font-semibold leading-tight mt-0.5">Choose from 11+ regional scripts</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="w-4.5 h-4.5 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] border border-[#2E8B57]/15 flex items-center justify-center text-[9px] font-extrabold shrink-0 mt-0.5">3</span>
                            <div className="flex-1">
                              <h5 className="text-[10px] font-bold text-slate-700">Analyze</h5>
                              <p className="text-[9px] text-slate-400 font-semibold leading-tight mt-0.5">Gemma AI decodes the parameters</p>
                            </div>
                          </div>
                        </div>
                      </Card>

                    </div>
                  </div>

                  {/* RIGHT COLUMN: Today's Tasks Manager Widget (spans 4 on lg) */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <Card hoverEffect={false} className="border border-white/80 shadow-md p-5 bg-white h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <ListTodo className="w-4 h-4 text-[#2E8B57]" />
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Tasks</h4>
                        </div>

                        {/* Category filter tabs */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-4 p-1 bg-slate-100 rounded-xl">
                          {['Unplanned', 'Without Project'].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setActiveCategory(cat)}
                              className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wide transition-colors cursor-pointer flex-1 ${activeCategory === cat ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        {/* Add new task text input box */}
                        <div className="relative mb-4">
                          <input
                            type="text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            onKeyDown={handleAddTask}
                            placeholder="+ Add new task (Press Enter)"
                            className="w-full text-xs py-2 px-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#2E8B57] focus:bg-white text-slate-800 placeholder-slate-400 transition-all font-semibold"
                          />
                        </div>

                        {/* Interactive todo checklist items */}
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {tasks.filter(t => t.category === activeCategory).length === 0 ? (
                            <p className="text-[10px] text-slate-400 italic text-center py-6 font-semibold">
                              No tasks in this category.
                            </p>
                          ) : (
                            tasks.filter(t => t.category === activeCategory).map(task => (
                              <div
                                key={task.id}
                                onClick={() => toggleTask(task.id)}
                                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${task.completed ? 'bg-slate-100/40 border-slate-200 opacity-60' : 'bg-white border-slate-200/80 hover:border-[#2E8B57]/30 hover:bg-slate-50'}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => {}} // Handled by outer click
                                  className="h-3.5 w-3.5 rounded border-slate-300 text-[#2E8B57] focus:ring-[#2E8B57] bg-white cursor-pointer"
                                />
                                <span className={`text-[10px] font-semibold text-slate-700 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                                  {task.text}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Footer statistics counters */}
                      <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Done: {tasks.filter(t => t.completed).length}</span>
                        <span>Pending: {tasks.filter(t => !t.completed).length}</span>
                      </div>
                    </Card>
                  </div>

                </div>
              </div>
            )
          )}

          {activeTab === 'documents' && (
            <MyDocuments onSelectDocument={handleSelectDocument} />
          )}

          {activeTab === 'history' && (
            <AIHistory onSelectDocument={handleSelectDocument} />
          )}

          {activeTab === 'saved' && (
            <SavedResults />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}

          {activeTab === 'help' && (
            <HelpSupport />
          )}
        </div>
      </DashboardLayout>
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
