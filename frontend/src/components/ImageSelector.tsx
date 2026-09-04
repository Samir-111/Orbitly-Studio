'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
} from 'lucide-react';
import { uploadApi } from '../services/api';

interface ImageSelectorProps {
  label?: string;
  value: string; // The active image URL
  publicId?: string; // Optional Cloudinary publicId
  onChange: (url: string, publicId?: string) => void;
  required?: boolean;
  helpText?: string;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  label = 'Thumbnail Image',
  value,
  publicId,
  onChange,
  required = true,
  helpText = 'Choose between uploading an image from your computer or entering an external image URL.',
}) => {
  // Determine initial tab based on whether publicId exists or if value looks like Cloudinary
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal URL state when external value changes
  useEffect(() => {
    setUrlInput(value || '');
    setPreviewError(false);
    if (value && !publicId && !value.includes('cloudinary.com')) {
      setActiveTab('url');
    } else if (publicId || value.includes('cloudinary.com')) {
      setActiveTab('upload');
    }
  }, [value, publicId]);

  // Handle direct file selection
  const handleFile = async (file: File) => {
    setErrorMessage(null);
    setPreviewError(false);

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage('Invalid file format. Only JPG, JPEG, PNG, and WebP images are allowed.');
      return;
    }

    // Validate File Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File size is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadApi.uploadImage(file);
      if (res.data?.url) {
        onChange(res.data.url, res.data.publicId);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload image to Cloudinary.');
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // Reset file input value so selecting the same file again triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleUrlChange = (newUrl: string) => {
    setUrlInput(newUrl);
    setErrorMessage(null);
    setPreviewError(false);
    // Setting an external URL clears any Cloudinary publicId
    onChange(newUrl.trim(), undefined);
  };

  const handleClear = () => {
    onChange('', undefined);
    setUrlInput('');
    setErrorMessage(null);
    setPreviewError(false);
  };

  return (
    <div className="space-y-3">
      {/* Header and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-brand-400" />
          {label} {required && <span className="text-brand-400">*</span>}
        </label>

        {/* Option Tabs (Upload vs URL) */}
        <div className="flex items-center p-1 rounded-xl bg-surface border border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              setErrorMessage(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload Image
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('url');
              setErrorMessage(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'url'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Use Image URL
          </button>
        </div>
      </div>

      {/* Mode 1: File Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={onFileInputChange}
            disabled={isUploading}
          />

          {!value || activeTab !== 'upload' ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-brand-400 bg-brand-500/10'
                  : 'border-white/10 hover:border-brand-500/50 bg-surface/50 hover:bg-surface'
              } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-3 space-y-2">
                  <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                  <p className="text-xs font-semibold text-white">Uploading to Cloudinary...</p>
                  <p className="text-[11px] text-slate-400">Optimizing and storing safely</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-white">
                      Click to browse or drag & drop image here
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Supports JPG, JPEG, PNG, WebP (Max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Uploaded Image Preview Box */
            <div className="relative rounded-2xl border border-white/10 bg-surface p-3 overflow-hidden flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:w-32 h-24 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                  onError={() => setPreviewError(true)}
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1 text-left w-full">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    {publicId ? 'Cloudinary Hosted' : 'Image Ready'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 truncate font-mono" title={value}>
                  {value}
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    Replace Image
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={isUploading}
                    className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: External Image URL */}
      {activeTab === 'url' && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
              className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <p className="text-[11px] text-slate-400">
              Paste direct image link from Unsplash, CDN, or external hosting.
            </p>
          </div>

          {/* URL Live Preview */}
          {urlInput.trim() && (
            <div className="relative rounded-2xl border border-white/10 bg-surface p-3 overflow-hidden flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:w-32 h-24 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0 flex items-center justify-center">
                {previewError ? (
                  <div className="text-center p-2 text-rose-400">
                    <AlertCircle className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-[10px]">Failed to load</span>
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={urlInput}
                    alt="URL Preview"
                    className="w-full h-full object-cover"
                    onError={() => setPreviewError(true)}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1 text-left w-full">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <LinkIcon className="w-3 h-3" />
                    External URL
                  </span>
                  <a
                    href={urlInput}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Open Image"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-slate-300 truncate font-mono" title={urlInput}>
                  {urlInput}
                </p>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors pt-1 block"
                >
                  Clear URL
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error message alert */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Help text */}
      {!errorMessage && (
        <p className="text-[11px] text-slate-500">{helpText}</p>
      )}
    </div>
  );
};
