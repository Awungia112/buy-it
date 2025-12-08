 'use client';

import { updateOrderStatus } from '@/app/admin/orders/actions';
import { useState } from 'react';

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: string;
}

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      // The page will redirect after successful update
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={isUpdating}
      className="px-3 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {statusOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}