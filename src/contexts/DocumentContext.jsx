import React, { createContext, useContext, useState } from 'react';
import { analyzeDocument } from '../services/api';
import { parseGemmaResponse } from '../utils/parser';
import { MOCK_ANALYSIS_DATA } from '../utils/mockData';

const DocumentContext = createContext(null);

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
];

export const DocumentProvider = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [apiError, setApiError] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [processedDocs, setProcessedDocs] = useState([]);
  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem('loksathi_model') || 'gemma4:e2b';
  });

  const updateModel = (model) => {
    setSelectedModel(model);
    localStorage.setItem('loksathi_model', model);
  };

  const uploadDocument = (file) => {
    if (!file) return;
    setUploadedFile(file);
    setFileName(file.name);
    setApiError(null);
    setAnalysisStatus('');
    
    // Format size
    const sizeInMB = file.size / (1024 * 1024);
    setFileSize(sizeInMB > 0.1 ? `${sizeInMB.toFixed(2)} MB` : `${(file.size / 1024).toFixed(1)} KB`);
    
    // Clear previous results upon new upload
    setAnalysisResult(null);
  };

  const processDocument = async () => {
    if (!uploadedFile) return;
    setApiError(null);
    setAnalysisStatus('Initiating document upload...');
    setIsAnalyzing(true);

    const activeLangObj = SUPPORTED_LANGUAGES.find(lang => lang.code === activeLanguage) || { name: 'English' };
    const targetLanguageName = activeLangObj.name;

    try {
      const data = await analyzeDocument(uploadedFile, targetLanguageName, selectedModel, (status) => {
        setAnalysisStatus(status);
      });
      const normalizedResult = parseGemmaResponse(data, activeLanguage);
      setAnalysisResult(normalizedResult);
      
      setProcessedDocs(prev => [
        {
          id: `doc-${Date.now()}`,
          name: fileName,
          size: fileSize,
          type: normalizedResult.documentType || 'Official Document',
          date: new Date().toLocaleDateString(),
          result: normalizedResult
        },
        ...prev
      ]);
    } catch (error) {
      setApiError(error.message || 'An unexpected error occurred during document parsing.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStatus('');
    }
  };

  // Demo fallback to bypass API checks for presentations
  const loadDemoData = () => {
    setApiError(null);
    setIsAnalyzing(true);
    setAnalysisStatus('Loading Aadhaar Update Consent Demo Form...');
    
    const timers = [
      setTimeout(() => setAnalysisStatus('Simplifying complex legal jargon...'), 400),
      setTimeout(() => setAnalysisStatus('Extracting important dates and deadlines...'), 805),
      setTimeout(() => setAnalysisStatus('Translating explanation summary...'), 1205),
      setTimeout(() => {
        const normalizedResult = parseGemmaResponse(MOCK_ANALYSIS_DATA, activeLanguage);
        setAnalysisResult(normalizedResult);
        setProcessedDocs(prev => [
          {
            id: `doc-demo-${Date.now()}`,
            name: 'Aadhaar_Update_Consent_Form.pdf',
            size: '1.24 MB',
            type: normalizedResult.documentType || 'Aadhaar Consent Form',
            date: new Date().toLocaleDateString(),
            result: normalizedResult
          },
          ...prev
        ]);
        setIsAnalyzing(false);
        setAnalysisStatus('');
      }, 1605)
    ];

    return () => timers.forEach(clearTimeout);
  };

  const toggleDocCheck = (id) => {
    if (!analysisResult) return;
    const updatedDocs = analysisResult.requiredDocs.map(doc => 
      doc.id === id ? { ...doc, status: doc.status === 'have' ? 'needed' : 'have' } : doc
    );
    setAnalysisResult({
      ...analysisResult,
      requiredDocs: updatedDocs
    });
  };

  const toggleDeadlineCheck = (id) => {
    if (!analysisResult) return;
    const updatedDeadlines = analysisResult.deadlines.map(dl => 
      dl.id === id ? { ...dl, completed: !dl.completed } : dl
    );
    setAnalysisResult({
      ...analysisResult,
      deadlines: updatedDeadlines
    });
  };

  const resetState = () => {
    setUploadedFile(null);
    setFileName('');
    setFileSize('');
    setIsAnalyzing(false);
    setAnalysisResult(null);
    setActiveLanguage('en');
    setApiError(null);
    setAnalysisStatus('');
  };

  return (
    <DocumentContext.Provider value={{
      uploadedFile,
      fileName,
      setFileName,
      fileSize,
      setFileSize,
      isAnalyzing,
      analysisResult,
      setAnalysisResult,
      activeLanguage,
      setActiveLanguage,
      apiError,
      setApiError,
      analysisStatus,
      processedDocs,
      selectedModel,
      setSelectedModel: updateModel,
      uploadDocument,
      processDocument,
      loadDemoData,
      toggleDocCheck,
      toggleDeadlineCheck,
      resetState
    }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};
