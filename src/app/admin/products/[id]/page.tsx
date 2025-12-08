'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { ImageUpload } from '@/components/ImageUpload';
import { updateProduct, deleteProduct } from '../actions';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Load product data on mount
  useEffect(() => {
    params.then(async (resolvedParams) => {
      try {
        const response = await fetch(`/api/products/${resolvedParams.id}`);
        if (response.ok) {
          const productData = await response.json();
          setProduct(productData);
          setImageUrl(productData.image);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

  // Wrapper functions to handle the image URL from state
  async function handleUpdateProduct(formData: FormData) {
    const enhancedFormData = new FormData();

    // Copy all existing form data
    for (const [key, value] of formData.entries()) {
      enhancedFormData.append(key, value);
    }

    // Override the image field with the URL from state if available
    if (imageUrl) {
      enhancedFormData.set('image', imageUrl);
    }

    await updateProduct(product?.id || '', enhancedFormData);
  }

  async function handleDeleteProduct() {
    await deleteProduct(product?.id || '');
  }

  if (loading) {
    return (
      <AdminLayout title="Edit Product">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout title="Edit Product">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Product not found</h2>
          <Link href="/admin/products" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Product">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black dark:text-white">Edit Product</h1>
          <Link
            href="/admin/products"
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            ← Back to Products
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <form action={handleUpdateProduct} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={product.name}
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
                defaultValue={product.description}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-vertical"
                placeholder="Enter product description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  defaultValue={Number(product.price)}
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
                  defaultValue={product.stock}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Image <span className="text-red-500">*</span>
              </label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Update Product
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

        {/* Danger Zone */}
        <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Danger Zone</h3>
          <p className="text-red-700 dark:text-red-400 text-sm mb-4">
            Once you delete this product, there is no going back. This action cannot be undone.
          </p>
          <form action={handleDeleteProduct}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={(e) => {
                if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
                  e.preventDefault();
                }
              }}
            >
              Delete Product
            </button>
          </form>
        </div>

        {/* Product Info */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Information</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>ID:</strong> {product.id}</p>
            <p><strong>Created:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
            <p><strong>Last Updated:</strong> {new Date(product.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}