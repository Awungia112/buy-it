'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className = '' }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      const imageUrl = result.url;
      setPreviewUrl(imageUrl);
      onChange(imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      uploadFile(imageFile);
    } else if (files.length > 0) {
      setUploadError('Please drop an image file');
    }
  }, [uploadFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);

  const handleUrlSubmit = useCallback(() => {
    const url = urlInputRef.current?.value;
    if (url) {
      setPreviewUrl(url);
      onChange(url);
      setUploadError(null);
    }
  }, [onChange]);

  const handleUrlKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUrlSubmit();
    }
  }, [handleUrlSubmit]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* URL Input */}
      <div className="flex gap-2">
        <input
          ref={urlInputRef}
          type="url"
          placeholder="Or paste image URL here..."
          defaultValue={previewUrl && !previewUrl.startsWith('/uploads/') ? previewUrl : ''}
          onKeyPress={handleUrlKeyPress}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        />
        <button
          type="button"
          onClick={handleUrlSubmit}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Use URL
        </button>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragOver
            ? 'border-primary bg-primary/5 dark:bg-primary/10'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
                onError={() => setPreviewUrl(null)}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click to change image or drag & drop a new one
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewUrl(null);
                  onChange('');
                }}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove image
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isUploading ? (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {isDragOver ? 'Drop image here' : 'Click to upload or drag & drop'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    PNG, JPG, WebP, GIF up to 5MB
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-300">{uploadError}</p>
        </div>
      )}
    </div>
  );
}