import React, { useRef, useState } from 'react';
import { useDocument } from '../../contexts/DocumentContext';
import { Upload, FileText, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import LanguageSelector from './LanguageSelector';

const UploadZone = () => {
  const {
    uploadedFile,
    fileName,
    fileSize,
    uploadDocument,
    processDocument,
    resetState
  } = useDocument();

  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateAndUpload = (file) => {
    setError('');
    if (!file) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or an Image (JPEG, PNG).');
      return;
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    uploadDocument(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto transition-all duration-300">
      {/* 1. Empty state / Dropzone */}
      {!uploadedFile && (
        <div
          id="drop-zone"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          tabIndex={0}
          role="button"
          aria-label="Upload government document. Supports PDF or Images up to 10MB."
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerFileSelect();
            }
          }}
          className={`
            relative 
            w-full 
            min-h-[260px] 
            flex 
            flex-col 
            items-center 
            justify-center 
            rounded-[28px] 
            border-2 
            border-dashed 
            transition-all 
            duration-300 
            cursor-pointer 
            group 
            p-8 
            text-center
            glass-panel
            ${isDragActive 
              ? 'border-[#2E8B57] bg-[#2E8B57]/5 shadow-[0_0_25px_-5px_rgba(46,139,87,0.1)]' 
              : 'border-slate-200/80 bg-white/45 hover:border-[#2E8B57]/40 hover:bg-white/60'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,image/png,image/jpeg,image/jpg"
            onChange={handleFileInput}
            id="document-file-input"
          />

          <div className="p-4 rounded-[16px] bg-white border border-slate-200 text-slate-400 group-hover:text-[#2E8B57] group-hover:border-[#2E8B57]/20 transition-all duration-300 shadow-sm mb-4">
            <Upload className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          </div>

          <h3 className="text-lg font-bold mb-1.5 text-slate-800 group-hover:text-[#2E8B57] transition-colors duration-300 uppercase tracking-wide">
            Drag & drop your file here
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed font-medium">
            or click to browse
          </p>

          <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100/85 text-slate-500 rounded-md border border-slate-200/40">PDF</span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100/85 text-slate-500 rounded-md border border-slate-200/40">JPG</span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100/85 text-slate-500 rounded-md border border-slate-200/40">PNG</span>
            <span className="text-[10px] font-semibold text-slate-400 ml-1">Max size: 10MB</span>
          </div>

          {error && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 text-xs font-semibold text-red-500 bg-red-50 border border-red-200/50 py-2 px-4 rounded-xl">
              <AlertTriangle className="w-3.5 h-3.5" />
              {error}
            </div>
          )}
        </div>
      )}

      {/* 2. File Selected state */}
      {uploadedFile && (
        <Card
          hoverEffect={false}
          className="w-full text-left border border-white/80 shadow-md"
          header={
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500">Document Uploaded</span>
              <button
                id="remove-file-button"
                onClick={resetState}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          }
        >
          {/* File details */}
          <div className="flex items-center gap-4 mb-5">
            <div className="p-3.5 rounded-[16px] bg-[#2E8B57]/10 border border-[#2E8B57]/15 text-[#2E8B57] shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div className="overflow-hidden flex-1">
              <h4 className="text-sm font-bold text-slate-800 truncate pr-4">
                {fileName}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">{fileSize}</p>
            </div>
          </div>

          {/* Language Selector for Translation on Homepage */}
          <div className="mb-5 p-4 rounded-[16px] bg-white/40 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">Select Language</h5>
              <p className="text-[10px] text-slate-500 font-medium">Choose target Indian language for simplification.</p>
            </div>
            <LanguageSelector />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              id="analyze-document-button"
              variant="primary"
              size="md"
              className="flex-1 font-bold tracking-wide"
              onClick={processDocument}
            >
              Analyze Document
            </Button>
            <Button
              id="cancel-upload-button"
              variant="outline"
              size="md"
              onClick={resetState}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UploadZone;
