import React from 'react';
import { Bookmark } from 'lucide-react';

const SavedResults = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="p-5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 mb-5 shadow-sm">
        <Bookmark className="w-10 h-10" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1 uppercase tracking-wide">No saved results yet</h3>
      <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-semibold">
        Analyses you bookmark in the future will appear here. Start by analyzing a document in your workspace.
      </p>
    </div>
  );
};

export default SavedResults;
