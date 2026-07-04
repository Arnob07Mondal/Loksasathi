import React from 'react';
import { FileText, Inbox } from 'lucide-react';
import { useDocument } from '../../contexts/DocumentContext';
import Card from '../common/Card';
import Badge from '../common/Badge';

const MyDocuments = ({ onSelectDocument }) => {
  const { processedDocs } = useDocument();

  if (!processedDocs || processedDocs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="p-5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 mb-5 shadow-sm">
          <Inbox className="w-10 h-10" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1 uppercase tracking-wide">No analyzed documents yet.</h3>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-semibold">
          Your analyzed documents will appear here after successful document processing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-1 uppercase tracking-wide">My Documents</h2>
        <p className="text-xs text-slate-500 font-semibold">Processed documents from your active session.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {processedDocs.map((doc) => (
          <Card 
            key={doc.id}
            hoverEffect={true}
            onClick={() => onSelectDocument(doc.result, doc.name, doc.size)}
            className="border border-slate-200 bg-white p-5 flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-[#2E8B57]/10 text-[#2E8B57] shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="overflow-hidden flex-1">
                <h4 className="text-sm font-bold text-slate-800 truncate pr-4">{doc.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 font-semibold">{doc.type}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-2">
              <span className="text-[10px] text-slate-400 font-bold">{doc.date} • {doc.size}</span>
              <Badge variant="green" size="sm">View Analysis</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyDocuments;
