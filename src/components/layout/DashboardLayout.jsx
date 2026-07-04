import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, History, Bookmark, 
  Settings, HelpCircle, ArrowLeft, Menu, X, Cpu, Upload
} from 'lucide-react';
import { useDocument } from '../../contexts/DocumentContext';

const DashboardLayout = ({ 
  activeTab, 
  setActiveTab, 
  onBack, 
  children 
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { resetState, analysisResult } = useDocument();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', name: 'Upload Document', icon: Upload },
    { id: 'documents', name: 'My Documents', icon: FileText },
    { id: 'history', name: 'AI History', icon: History },
    { id: 'saved', name: 'Saved Results', icon: Bookmark },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'help', name: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-[#F6F8F7] text-slate-800 relative">
      
      {/* 1. Mobile top header bar */}
      <div className="md:hidden w-full bg-white border-b border-slate-200 h-16 px-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2E8B57] text-white">
            <Cpu className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm">LokSathi AI</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          title="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
 
      {/* 2. Left Sidebar (hidden on mobile, visible on desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-20 
        w-64 bg-white border-r border-slate-200/80 
        flex flex-col justify-between 
        transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:h-screen
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Branding Section */}
        <div className="flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8.5 h-8.5 rounded-xl bg-[#2E8B57] text-white shadow-sm shadow-[#2E8B57]/15">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-800 text-md tracking-tight">
                LokSathi <span className="text-[#2E8B57]">AI</span>
              </span>
            </div>
            {/* Close button for mobile drawer */}
            <button className="md:hidden text-slate-400 hover:text-slate-600" onClick={() => setIsMobileOpen(false)} title="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>
 
          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              let isActive = activeTab === item.id;
              
              // Smart active state targeting for Dashboard vs Upload Document tabs
              if (item.id === 'dashboard') {
                isActive = activeTab === 'dashboard' && analysisResult !== null;
              } else if (item.id === 'upload') {
                isActive = activeTab === 'dashboard' && analysisResult === null;
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'upload') {
                      resetState();
                      setActiveTab('dashboard');
                    } else {
                      setActiveTab(item.id);
                    }
                    setIsMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-[#2E8B57]/10 text-[#2E8B57]' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2E8B57]' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
 
        {/* Bottom Back Button */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all border border-slate-200/80 bg-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-slate-400" />
            <span>Back to SaaS site</span>
          </button>
        </div>
      </aside>
 
      {/* Backdrop overlay for mobile menu drawer */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-10 bg-slate-900/30 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
 
      {/* 3. Right Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
