import React from 'react';
import { History, Clock, FileText } from 'lucide-react';
import { useDocument } from '../../contexts/DocumentContext';
import Card from '../common/Card';
import Badge from '../common/Badge';

const AIHistory = ({ onSelectDocument }) => {
  const { processedDocs } = useDocument();

  if (!processedDocs || processedDocs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="p-5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 mb-5 shadow-sm">
          <History className="w-10 h-10" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1 uppercase tracking-wide">AI History is empty</h3>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-semibold">
          Your document analysis history will be saved here once you start processing official files.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1 uppercase tracking-wide">AI History</h2>
        <p className="text-xs text-slate-500 font-semibold">A timeline of your recent document insights.</p>
      </div>

      <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-6 py-2">
        {processedDocs.map((doc) => (
          <div key={doc.id} className="relative group">
            {/* Timeline marker */}
            <span className="absolute -left-[33px] top-1.5 w-4.5 h-4.5 rounded-full bg-white border-2 border-[#2E8B57] flex items-center justify-center shadow-sm">
              <Clock className="w-2.5 h-2.5 text-[#2E8B57]" />
            </span>

            <Card 
              hoverEffect={true}
              onClick={() => onSelectDocument(doc.result, doc.name, doc.size)}
              className="border border-slate-200 bg-white p-5 max-w-2xl cursor-pointer hover:border-[#2E8B57]/20 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{doc.name}</h4>
                    <p className="text-[11px] text-[#2E8B57] font-bold mt-1">{doc.type}</p>
                  </div>
                </div>
                <Badge variant="neutral" size="sm">{doc.date}</Badge>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIHistory;
