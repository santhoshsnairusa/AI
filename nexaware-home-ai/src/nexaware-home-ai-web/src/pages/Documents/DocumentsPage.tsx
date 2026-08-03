import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle, Type, Save, Download } from 'lucide-react';
import api, { DEMO_HOUSEHOLD_ID, DEMO_USER_ID } from '../../services/api';

interface Document {
  id: string;
  originalFileName: string;
  category: string;
  status: string;
  uploadedOn: string;
  fileSize: number;
}

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [textContent, setTextContent] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
    // Poll for status updates every 5 seconds
    const interval = setInterval(loadDocuments, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadDocuments = async () => {
    try {
      const res = await api.get(`/documents?householdId=${DEMO_HOUSEHOLD_ID}`);
      setDocuments(res.data);
    } catch (err) {
      console.error('Failed to load documents', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('householdId', DEMO_HOUSEHOLD_ID);
    formData.append('userId', DEMO_USER_ID);
    formData.append('category', 'General');

    try {
      await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await loadDocuments();
    } catch (err) {
      console.error('Failed to upload document', err);
      alert('Failed to upload document.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleTextSave = () => {
    if (!textContent.trim()) return;
    const title = textTitle.trim() || `Note-${new Date().getTime()}`;
    const safeTitle = title.endsWith('.txt') ? title : `${title}.txt`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const file = new File([blob], safeTitle, { type: 'text/plain' });
    
    uploadFile(file);
    
    setTextContent('');
    setTextTitle('');
    setInputMode('file');
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text">Documents</h1>
        <p className="text-text-muted mt-1">Upload and manage household documents for AI context.</p>
      </div>

      <div className="flex gap-4 mb-4">
        <button 
          onClick={() => setInputMode('file')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${inputMode === 'file' ? 'bg-primary text-white' : 'bg-surfaceHighlight text-text hover:bg-surfaceHighlight/70'}`}
        >
          <Upload size={18} /> Upload File
        </button>
        <button 
          onClick={() => setInputMode('text')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${inputMode === 'text' ? 'bg-primary text-white' : 'bg-surfaceHighlight text-text hover:bg-surfaceHighlight/70'}`}
        >
          <Type size={18} /> Write Text
        </button>
      </div>

      {inputMode === 'file' ? (
        <div 
          className={`glass-panel p-10 border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 ${isDragging ? 'border-primary bg-primary/10' : 'border-surfaceHighlight hover:border-primary/50'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-primary/20 text-primary' : 'bg-surfaceHighlight text-text-muted'}`}>
            <Upload size={32} />
          </div>
          <h3 className="text-lg font-semibold text-text mb-1">Click or drag file to this area to upload</h3>
          <p className="text-text-muted text-sm">Support for a single PDF or text file.</p>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".pdf,.txt,.md"
            onChange={handleFileSelect}
          />
          {isUploading && <p className="text-primary text-sm font-medium mt-4 animate-pulse">Uploading...</p>}
        </div>
      ) : (
        <div className="glass-panel p-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Document Title (e.g. WiFi Password)"
            value={textTitle}
            onChange={(e) => setTextTitle(e.target.value)}
            className="w-full bg-surfaceHighlight/30 border border-surfaceHighlight rounded-lg px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            disabled={isUploading}
          />
          <textarea
            placeholder="Type your document content here..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            rows={6}
            className="w-full bg-surfaceHighlight/30 border border-surfaceHighlight rounded-lg px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            disabled={isUploading}
          />
          <div className="flex justify-end">
            <button
              onClick={handleTextSave}
              disabled={isUploading || !textContent.trim()}
              className="primary-button flex items-center gap-2"
            >
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Document
            </button>
          </div>
        </div>
      )}

      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-4 border-b border-surfaceHighlight bg-surface/50 backdrop-blur-md">
          <h2 className="font-semibold text-lg text-text">Uploaded Documents</h2>
        </div>
        <div className="divide-y divide-surfaceHighlight">
          {documents.length === 0 ? (
            <div className="p-8 text-center text-text-muted">
              <FileText size={48} className="mx-auto mb-4 opacity-20" />
              <p>No documents uploaded yet.</p>
            </div>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-surfaceHighlight/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-3 rounded-lg text-primary">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text">{doc.originalFileName}</h4>
                    <div className="text-xs text-text-muted flex items-center gap-3 mt-1">
                      <span>{formatSize(doc.fileSize)}</span>
                      <span>•</span>
                      <span>{new Date(doc.uploadedOn).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {doc.status === 'Processed' && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                      <CheckCircle2 size={14} /> Processed
                    </span>
                  )}
                  {doc.status === 'Pending' && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                      <Loader2 size={14} className="animate-spin" /> Indexing...
                    </span>
                  )}
                  {doc.status === 'Error' && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-rose-400 bg-rose-400/10 px-3 py-1 rounded-full border border-rose-400/20">
                      <AlertCircle size={14} /> Error
                    </span>
                  )}
                  <a 
                    href={`${api.defaults.baseURL}/documents/${doc.id}/download?householdId=${DEMO_HOUSEHOLD_ID}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors ml-2"
                    title="View Document"
                  >
                    <Download size={18} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
