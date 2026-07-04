import React, { useState } from 'react';
import { Sliders, Sparkles, RefreshCw } from 'lucide-react';
import { useDocument, SUPPORTED_LANGUAGES } from '../../contexts/DocumentContext';
import Card from '../common/Card';
import Button from '../common/Button';

const SettingsView = () => {
  const { 
    activeLanguage, 
    setActiveLanguage, 
    selectedModel, 
    setSelectedModel, 
    resetState 
  } = useDocument();

  const [theme, setTheme] = useState('light');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleReset = () => {
    resetState();
    setTheme('light');
    setReduceMotion(false);
    setActiveLanguage('en');
    setSelectedModel('gemma4:e2b');
    setToastMessage('Preferences successfully reset.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6 text-left max-w-xl animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1 uppercase tracking-wide">Settings</h2>
        <p className="text-xs text-slate-500 font-semibold font-sans">Customize your analysis workspace preferences.</p>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      <div className="space-y-4">
        {/* Card 1: Workspace Preferences */}
        <Card hoverEffect={false} className="border border-slate-200 bg-white p-5">
          <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#2E8B57]" />
            Workspace Settings
          </h3>

          <div className="space-y-4">
            {/* Target Translation Language */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Target Translation Language</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Translate explanations to this language.</p>
              </div>
              <select
                value={activeLanguage}
                onChange={(e) => setActiveLanguage(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#2E8B57] cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <hr className="border-slate-100" />

            {/* Local LLM Model */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Ollama AI Model</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Gemma version targeted on your local server.</p>
              </div>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#2E8B57] cursor-pointer"
              >
                <option value="gemma4:e2b">gemma4:e2b (Recommended)</option>
                <option value="gemma:2b">gemma:2b</option>
                <option value="gemma2:9b">gemma2:9b</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Card 2: Interface Preferences */}
        <Card hoverEffect={false} className="border border-slate-200 bg-white p-5">
          <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2E8B57]" />
            UI Preferences
          </h3>

          <div className="space-y-4">
            {/* Theme Selector */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Interface Theme</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Switch visual mode settings.</p>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#2E8B57] cursor-pointer"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode (Disabled)</option>
                <option value="system">System Default</option>
              </select>
            </div>

            <hr className="border-slate-100" />

            {/* Reduce Motion */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Reduce Motion</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Disable loading laser lines and ping animations.</p>
              </div>
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={(e) => setReduceMotion(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#2E8B57] focus:ring-[#2E8B57] cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Reset Action */}
        <div className="pt-2 flex justify-end">
          <Button
            id="reset-preferences-btn"
            variant="outline"
            size="md"
            onClick={handleReset}
            iconLeft={RefreshCw}
            className="text-xs font-bold border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
          >
            Reset Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
