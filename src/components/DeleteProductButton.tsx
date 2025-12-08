'use client';

import { deleteProduct } from '@/app/admin/products/actions';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      try {
        await deleteProduct(productId);
        // The page will redirect after successful deletion
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="w-full px-3 py-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded text-center text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
      title={`Delete ${productName}`}
    >
      <span className="material-symbols-outlined text-sm">delete</span>
    </button>
  );
}