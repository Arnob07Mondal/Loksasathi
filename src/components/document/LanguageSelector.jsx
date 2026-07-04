import React from 'react';
import { useDocument, SUPPORTED_LANGUAGES } from '../../contexts/DocumentContext';
import { Languages } from 'lucide-react';

const LanguageSelector = () => {
  const { activeLanguage, setActiveLanguage } = useDocument();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-slate-400">
        <Languages className="w-4 h-4 text-[#2E8B57]" />
        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline text-slate-500">Translate:</span>
      </div>
      
      <div className="relative">
        <select
          id="language-select-dropdown"
          value={activeLanguage}
          onChange={(e) => setActiveLanguage(e.target.value)}
          className="
            appearance-none 
            bg-white/70
            backdrop-blur-md 
            text-slate-800 
            text-xs 
            font-bold 
            py-1.5 
            pl-3.5 
            pr-8 
            rounded-xl 
            border 
            border-slate-200 
            hover:border-slate-300 
            focus:outline-none 
            focus:border-[#2E8B57] 
            focus:ring-2 
            focus:ring-[#2E8B57]/10 
            transition-all 
            duration-200
            cursor-pointer
          "
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-white text-slate-800">
              {lang.name} ({lang.nativeName})
            </option>
          ))}
        </select>
        
        {/* Custom Arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
