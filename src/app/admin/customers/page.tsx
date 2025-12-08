import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminLayout } from "@/components/AdminLayout";

export default async function AdminCustomersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  // Get all users
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Get all orders to calculate customer stats
  const allOrders = await prisma.order.findMany({
    include: {
      items: true,
    },
  });

  // Calculate customer stats
  const customersWithStats = users.map((user) => {
    const userOrders = allOrders.filter((order) => order.userId === user.id);
    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );
    const lastOrder =
      userOrders.length > 0
        ? userOrders.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0]
        : null;

    return {
      ...user,
      totalOrders,
      totalSpent,
      lastOrderDate: lastOrder?.createdAt,
    };
  });

  const totalCustomers = users.length;
  const activeCustomers = customersWithStats.filter(
    (customer) => customer.totalOrders > 0
  ).length;
  const totalRevenue = customersWithStats.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0
  );

  return (
    <AdminLayout title="Customers Management">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-400 text-sm font-medium">
            Total Customers
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">
            {totalCustomers}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-400 text-sm font-medium">
            Active Customers
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">
            {activeCustomers}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-400 text-sm font-medium">
            Total Revenue
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-400 text-sm font-medium">
            Avg. Order Value
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">
            $
            {totalCustomers > 0
              ? (totalRevenue / totalCustomers).toFixed(2)
              : "0.00"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search customers..."
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex-1"
        />
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option>All Customers</option>
          <option>With Orders</option>
          <option>Without Orders</option>
          <option>Recent Signups</option>
        </select>
        <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors">
          Filter
        </button>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3" scope="col">
                  Customer
                </th>
                <th className="px-6 py-3" scope="col">
                  Email
                </th>
                <th className="px-6 py-3" scope="col">
                  Orders
                </th>
                <th className="px-6 py-3" scope="col">
                  Total Spent
                </th>
                <th className="px-6 py-3" scope="col">
                  Last Order
                </th>
                <th className="px-6 py-3" scope="col">
                  Joined
                </th>
                <th className="px-6 py-3" scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customersWithStats.map((customer) => (
                <tr
                  key={customer.id}
                  className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
                          person
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-black dark:text-white">
                          {customer.name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-400">
                          ID: {customer.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-black dark:text-white">
                      {customer.email}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs font-medium">
                      {customer.totalOrders}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-black dark:text-white">
                      ${customer.totalSpent.toFixed(2)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {customer.lastOrderDate ? (
                      <p className="text-sm text-gray-700 dark:text-gray-400">
                        {customer.lastOrderDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-600">
                        Never
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      {customer.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                      >
                        View
                      </Link>
                      <button className="px-3 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {customersWithStats.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">
              group
            </span>
            <p className="text-gray-700 dark:text-gray-400">
              No customers found
            </p>
          </div>
        )}
      </div>

      {/* Customer Insights */}
      {customersWithStats.length > 0 && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-black dark:text-white font-semibold mb-4">
              Top Customers
            </h3>
            <div className="space-y-3">
              {customersWithStats
                .filter((customer) => customer.totalSpent > 0)
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 5)
                .map((customer, index) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <span className="text-black dark:text-white">
                        {customer.name || customer.email}
                      </span>
                    </div>
                    <span className="font-medium text-black dark:text-white">
                      ${customer.totalSpent.toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-black dark:text-white font-semibold mb-4">
              Recent Signups
            </h3>
            <div className="space-y-3">
              {customersWithStats
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 5)
                .map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm text-gray-600 dark:text-gray-400">
                          person
                        </span>
                      </div>
                      <div>
                        <p className="text-black dark:text-white text-sm">
                          {customer.name || "N/A"}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-400">
                      {customer.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
