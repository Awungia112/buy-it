'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { MultipleImageUpload } from '@/components/MultipleImageUpload';
import { ColorSelector } from '@/components/ColorSelector';
import { createProduct } from '../actions';

export default function NewProductPage() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  // Wrapper function to include the image URLs and colors from state
  async function handleCreateProduct(formData: FormData) {
    // Create a new FormData with the image URLs and colors from state
    const enhancedFormData = new FormData();

    // Copy all existing form data
    for (const [key, value] of formData.entries()) {
      enhancedFormData.append(key, value);
    }

    // Set the main image (first image) and additional images
    if (imageUrls.length > 0) {
      enhancedFormData.set('image', imageUrls[0]);
      enhancedFormData.set('images', JSON.stringify(imageUrls.slice(1)));
    }

    // Set the colors
    enhancedFormData.set('colors', JSON.stringify(colors));

    await createProduct(enhancedFormData);
  }

  return (
    <AdminLayout title="Add New Product">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black dark:text-white">Add New Product</h1>
          <Link
            href="/admin/products"
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            ← Back to Products
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <form action={handleCreateProduct} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-vertical"
                placeholder="Enter product description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="e.g., Apparel, Footwear"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Images <span className="text-red-500">*</span>
              </label>
              <MultipleImageUpload value={imageUrls} onChange={setImageUrls} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available Colors
              </label>
              <ColorSelector value={colors} onChange={setColors} />
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Create Product
              </button>
              <Link
                href="/admin/products"
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Form Tips */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Tips for Adding Products</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>• Upload images by dragging & dropping or clicking to browse</li>
            <li>• Or paste a direct image URL in the URL field</li>
            <li>• Use high-quality images (at least 500x500px)</li>
            <li>• Write clear, detailed descriptions</li>
            <li>• Set competitive prices based on market research</li>
            <li>• Ensure stock quantities are accurate</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}