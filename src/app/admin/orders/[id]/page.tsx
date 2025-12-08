import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AdminLayout } from "@/components/AdminLayout";

interface AdminOrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderPage({ params }: AdminOrderPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  const resolvedParams = await params;

  // Get order with full details
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    redirect('/admin/orders');
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <AdminLayout title={`Order #${order.id.slice(0, 8)}`}>
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link href="/admin" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary">Dashboard</Link>
        <span className="text-gray-400 dark:text-gray-500">/</span>
        <Link href="/admin/orders" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary">Orders</Link>
        <span className="text-gray-400 dark:text-gray-500">/</span>
        <span className="text-gray-900 dark:text-white text-sm font-medium">#{order.id.slice(0, 8)}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Order #{order.id.slice(0, 8)}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Placed on {order.createdAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[order.status] || statusColors.PENDING}`}>
                {order.status}
              </span>
            </div>

            {/* Order Actions */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/admin/orders/${order.id}/edit`}
                className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm font-medium"
              >
                Edit Order
              </Link>
              <button className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-sm font-medium">
                Mark as Shipped
              </button>
              <button className="px-4 py-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors text-sm font-medium">
                Send Invoice
              </button>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Contact Details</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p><span className="font-medium">Name:</span> {order.user.name || 'N/A'}</p>
                  <p><span className="font-medium">Email:</span> {order.user.email}</p>
                  <p><span className="font-medium">User ID:</span> {order.user.id.slice(0, 8)}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Order History</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p><span className="font-medium">Total Orders:</span> 1</p>
                  <p><span className="font-medium">Member Since:</span> {order.user.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/products/${item.product.id}`}
                      className="font-medium text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {item.product.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${Number(item.price).toFixed(2)} each
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${order.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium text-gray-900 dark:text-white">$5.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${(order.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0) * 0.1).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-xl text-primary">${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-white">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                  Print Invoice
                </button>
                <button className="w-full px-3 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                  Send Tracking Info
                </button>
                <button className="w-full px-3 py-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-colors">
                  Cancel Order
                </button>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Order Timeline</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Order Placed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {order.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {order.status !== 'PENDING' && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Processing</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">In progress</p>
                    </div>
                  </div>
                )}
                {(order.status === 'SHIPPED' || order.status === 'COMPLETED') && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Shipped</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Order dispatched</p>
                    </div>
                  </div>
                )}
                {order.status === 'COMPLETED' && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Delivered</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Order completed</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Orders
        </Link>
      </div>
    </AdminLayout>
  );
}