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
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
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
            min-h-[290px] 
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
            m3-surface
            ${isDragActive 
              ? 'border-brand-saffron bg-brand-saffron/5 shadow-[0_0_25px_-5px_rgba(249,115,22,0.15)]' 
              : 'border-slate-800 bg-slate-900/10 hover:border-brand-saffron/40 hover:bg-slate-900/20'
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

          <div className="p-4.5 rounded-2xl bg-slate-950/60 border border-slate-900 text-slate-400 group-hover:text-brand-saffron group-hover:border-brand-saffron/20 transition-all duration-300 shadow-inner mb-5">
            <Upload className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
          </div>

          <h3 className="text-xl font-display font-bold mb-2 text-slate-100 group-hover:text-brand-saffron transition-colors duration-300">
            Upload Government Document
          </h3>
          <p className="text-sm text-slate-400 max-w-md mb-5 leading-relaxed font-medium">
            Drag and drop your document file here, or click to browse. Supports PDF or Images (JPG, PNG) up to 10MB.
          </p>

          <div className="flex items-center gap-6 mt-2 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-green" /> 100% Secure Local Processing
            </span>
          </div>

          {error && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 py-2.5 px-4 rounded-xl">
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
          className="w-full text-left glow-blue m3-surface"
          header={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Document Uploaded</span>
              <button
                id="remove-file-button"
                onClick={resetState}
                className="p-1.5 rounded-lg hover:bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          }
        >
          {/* File details */}
          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-brand-saffron">
              <FileText className="w-7 h-7" />
            </div>
            <div className="overflow-hidden flex-1">
              <h4 className="text-base font-display font-semibold text-slate-100 truncate pr-4">
                {fileName}
              </h4>
              <p className="text-sm text-slate-400 mt-1">{fileSize}</p>
            </div>
          </div>

          {/* Language Selector for Translation on Homepage */}
          <div className="mb-6 p-4.5 rounded-2xl bg-slate-950/60 border border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Target Language</h5>
              <p className="text-[11px] text-slate-500 font-medium">Choose which Indian language Gemma will simplify the document into.</p>
            </div>
            <LanguageSelector />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              id="analyze-document-button"
              variant="primary"
              size="lg"
              className="flex-1 font-bold tracking-wide"
              onClick={processDocument}
            >
              Analyze with Gemma AI
            </Button>
            <Button
              id="cancel-upload-button"
              variant="outline"
              size="lg"
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
