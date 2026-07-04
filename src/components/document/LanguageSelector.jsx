import React from 'react';
import { useDocument, SUPPORTED_LANGUAGES } from '../../contexts/DocumentContext';
import { Languages } from 'lucide-react';

const LanguageSelector = () => {
  const { activeLanguage, setActiveLanguage } = useDocument();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Languages className="w-4 h-4 text-brand-saffron" />
        <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Translate:</span>
      </div>
      
      <div className="relative">
        <select
          id="language-select-dropdown"
          value={activeLanguage}
          onChange={(e) => setActiveLanguage(e.target.value)}
          className="
            appearance-none 
            bg-slate-900/80 
            backdrop-blur-md 
            text-slate-100 
            text-sm 
            font-semibold 
            py-2 
            pl-4 
            pr-10 
            rounded-xl 
            border 
            border-slate-800 
            hover:border-slate-700 
            focus:outline-none 
            focus:border-brand-saffron 
            focus:ring-2 
            focus:ring-brand-saffron/20 
            transition-all 
            duration-200
            cursor-pointer
          "
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-slate-950 text-slate-100">
              {lang.name} ({lang.nativeName})
            </option>
          ))}
        </select>
        
        {/* Custom Arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
