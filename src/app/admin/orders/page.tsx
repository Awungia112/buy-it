import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminLayout } from "@/components/AdminLayout";

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  // Get all orders with user and product details
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
  const completedOrders = orders.filter(order => order.status === 'COMPLETED').length;

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <AdminLayout title="Orders Management">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Orders</p>
          <p className="text-black dark:text-white text-3xl font-bold">{totalOrders}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
          <p className="text-black dark:text-white text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pending Orders</p>
          <p className="text-black dark:text-white text-3xl font-bold">{pendingOrders}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completed Orders</p>
          <p className="text-black dark:text-white text-3xl font-bold">{completedOrders}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <input
          type="date"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="From Date"
        />
        <input
          type="date"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="To Date"
        />
        <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors">
          Filter
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3" scope="col">Order ID</th>
                <th className="px-6 py-3" scope="col">Customer</th>
                <th className="px-6 py-3" scope="col">Items</th>
                <th className="px-6 py-3" scope="col">Date</th>
                <th className="px-6 py-3" scope="col">Status</th>
                <th className="px-6 py-3 text-right" scope="col">Total</th>
                <th className="px-6 py-3" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <th className="px-6 py-4 font-medium text-black dark:text-white whitespace-nowrap" scope="row">
                    #{order.id.slice(0, 8)}
                  </th>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.user.name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {order.items.slice(0, 2).map((item, index) => (
                        <p key={index} className="text-sm">
                          {item.quantity}x {item.product.name}
                        </p>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          +{order.items.length - 2} more items
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {order.createdAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || statusColors.PENDING}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-black dark:text-white">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        View
                      </Link>
                      <button className="px-3 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">shopping_cart</span>
            <p className="text-gray-600 dark:text-gray-400">No orders found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}