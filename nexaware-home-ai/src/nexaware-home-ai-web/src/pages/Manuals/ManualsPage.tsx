import React, { useState, useEffect, useRef } from 'react';
import { Upload, BookOpen, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import api, { DEMO_HOUSEHOLD_ID, DEMO_USER_ID } from '../../services/api';

interface Document {
  id: string;
  originalFileName: string;
  category: string;
  status: string;
  uploadedOn: string;
  fileSize: number;
}

export function ManualsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
      // Filter for manuals
      const manuals = res.data.filter((d: Document) => d.category === 'Manual');
      setDocuments(manuals);
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
    // Explicitly set category to Manual
    formData.append('category', 'Manual');

    try {
      await api.post('/documents', formData);
      await loadDocuments();
    } catch (err) {
      console.error('Failed to upload document', err);
      alert('Failed to upload document.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
        <h1 className="text-3xl font-bold tracking-tight text-text">Service Manuals</h1>
        <p className="text-text-muted mt-1">Upload and read service manuals for your household appliances.</p>
      </div>

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
        <h3 className="text-lg font-semibold text-text mb-1">Upload a Service Manual</h3>
        <p className="text-text-muted text-sm">Drop a PDF manual here or click to browse.</p>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept=".pdf,.txt,.md"
          onChange={handleFileSelect}
        />
        {isUploading && <p className="text-primary text-sm font-medium mt-4 animate-pulse">Uploading...</p>}
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-4 border-b border-surfaceHighlight bg-surface/50 backdrop-blur-md">
          <h2 className="font-semibold text-lg text-text">Your Manuals</h2>
        </div>
        <div className="divide-y divide-surfaceHighlight">
          {documents.length === 0 ? (
            <div className="p-8 text-center text-text-muted">
              <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
              <p>No service manuals uploaded yet.</p>
            </div>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-surfaceHighlight/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-3 rounded-lg text-primary">
                    <BookOpen size={24} />
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
                <div>
                  {doc.status === 'Processed' && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                      <CheckCircle2 size={14} /> Ready to Query
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
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
