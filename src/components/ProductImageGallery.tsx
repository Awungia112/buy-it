'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
  mainImage: string;
  additionalImages: string[];
  productName: string;
}

export function ProductImageGallery({
  mainImage,
  additionalImages = [],
  productName
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage);

  // Combine main image with additional images, ensuring main image is first
  const allImages = [mainImage, ...additionalImages.filter(img => img !== mainImage)];

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Display */}
      <div className="w-full relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={selectedImage}
          alt={`${productName} - selected view`}
          fill
          className="object-cover transition-opacity duration-300"
          priority
        />
      </div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {allImages.slice(0, 8).map((imageUrl, index) => (
            <button
              key={`${imageUrl}-${index}`}
              onClick={() => handleImageClick(imageUrl)}
              className={`w-full relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                selectedImage === imageUrl
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-gray-900 shadow-lg scale-105'
                  : 'opacity-70 hover:opacity-100 hover:scale-105'
              }`}
              aria-label={`View ${productName} image ${index + 1}`}
            >
              <Image
                src={imageUrl}
                alt={`${productName} view ${index + 1}`}
                fill
                className="object-cover"
              />
              {selectedImage === imageUrl && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm">check</span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}