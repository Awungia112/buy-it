"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface MultipleImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export function MultipleImageUpload({
  value = [],
  onChange,
  maxImages = 8,
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const currentCount = value.length;
    const availableSlots = maxImages - currentCount;

    if (availableSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, availableSlots);
    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...value, ...uploadedUrls];
      onChange(newImages);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = value.filter((_, index) => index !== indexToRemove);
    onChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...value];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 dark:border-gray-600 hover:border-primary"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-gray-400">
              {uploading ? "hourglass_top" : "cloud_upload"}
            </span>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {uploading
                ? "Uploading..."
                : "Drop images here or click to browse"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PNG, JPG, GIF up to 10MB each • Max {maxImages} images
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {value.length}/{maxImages} images uploaded
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || value.length >= maxImages}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? "Uploading..." : "Choose Files"}
          </button>
        </div>
      </div>

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={`${url}-${index}`} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                {/* Move Left */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    title="Move left"
                  >
                    <span className="material-symbols-outlined text-white text-sm">
                      chevron_left
                    </span>
                  </button>
                )}

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                  title="Remove image"
                >
                  <span className="material-symbols-outlined text-white text-sm">
                    delete
                  </span>
                </button>

                {/* Move Right */}
                {index < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    title="Move right"
                  >
                    <span className="material-symbols-outlined text-white text-sm">
                      chevron_right
                    </span>
                  </button>
                )}
              </div>

              {/* Image Number Badge */}
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
