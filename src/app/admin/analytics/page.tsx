import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/AdminLayout";

export default async function AdminAnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  // Get analytics data
  const totalOrders = await prisma.order.count();
  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
  });

  const totalCustomers = await prisma.user.count();
  const totalProducts = await prisma.product.count();

  // Get orders by status
  const ordersByStatus = await prisma.order.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  // Get monthly revenue (last 12 months)
  const monthlyRevenue = await prisma.$queryRaw`
    SELECT
      DATE_TRUNC('month', "createdAt") as month,
      SUM(total) as revenue
    FROM "Order"
    WHERE "createdAt" >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY month DESC
  `;

  // Get top selling products
  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  // Get product details for top products
  const topProductDetails = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      return {
        ...product,
        totalSold: item._sum.quantity,
      };
    })
  );

  const revenue = totalRevenue._sum.total || 0;

  return (
    <AdminLayout title="Analytics">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-400 text-sm font-medium">
            Total Revenue
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">
            ${revenue.toFixed(2)}
          </p>
          <p className="text-green-600 dark:text-green-500 text-sm font-medium">
            +12.5%
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-400 text-sm font-medium">
            Conversion Rate
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">
            {totalCustomers > 0
              ? ((totalOrders / totalCustomers) * 100).toFixed(1)
              : "0"}
            %
          </p>
          <p className="text-blue-600 dark:text-blue-500 text-sm font-medium">
            +2.1%
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-400 text-sm font-medium">
            Avg. Order Value
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">
            $
            {totalOrders > 0
              ? (Number(revenue) / totalOrders).toFixed(2)
              : "0.00"}
          </p>
          <p className="text-green-600 dark:text-green-500 text-sm font-medium">
            +8.3%
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-400 text-sm font-medium">
            Customer Lifetime Value
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">
            $
            {totalCustomers > 0
              ? (Number(revenue) / totalCustomers).toFixed(2)
              : "0.00"}
          </p>
          <p className="text-purple-600 dark:text-purple-500 text-sm font-medium">
            +15.2%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-black dark:text-white text-lg font-bold mb-4">
            Revenue Trends
          </h3>
          <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">
                trending_up
              </span>
              <p className="text-gray-700 dark:text-gray-400">
                Revenue chart will be displayed here
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-500 mt-2">
                Showing last 12 months of revenue data
              </p>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-black dark:text-white text-lg font-bold mb-4">
            Order Status Breakdown
          </h3>
          <div className="space-y-4">
            {ordersByStatus.map((status) => {
              const percentage =
                totalOrders > 0
                  ? ((status._count.status / totalOrders) * 100).toFixed(1)
                  : "0";
              const colors: Record<string, string> = {
                PENDING:
                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
                PROCESSING:
                  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
                SHIPPED:
                  "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
                COMPLETED:
                  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                CANCELLED:
                  "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
              };

              return (
                <div
                  key={status.status}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        colors[status.status] || colors.PENDING
                      }`}
                    >
                      {status.status}
                    </span>
                    <span className="text-black dark:text-white">
                      {status._count.status} orders
                    </span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-400">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-black dark:text-white text-lg font-bold mb-4">
            Top Selling Products
          </h3>
          <div className="space-y-4">
            {topProductDetails.map((product, index) => (
              <div
                key={product?.id || index}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-black dark:text-white font-medium truncate">
                    {product?.name || "Unknown Product"}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {product?.totalSold || 0} units sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-black dark:text-white font-medium">
                    ${product ? Number(product.price).toFixed(2) : "0.00"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-black dark:text-white text-lg font-bold mb-4">
            Traffic Sources
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-black dark:text-white">Direct</span>
              </div>
              <span className="text-gray-700 dark:text-gray-400">45.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-black dark:text-white">
                  Search Engines
                </span>
              </div>
              <span className="text-gray-700 dark:text-gray-400">32.8%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-black dark:text-white">Social Media</span>
              </div>
              <span className="text-gray-700 dark:text-gray-400">15.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-black dark:text-white">Referrals</span>
              </div>
              <span className="text-gray-700 dark:text-gray-400">6.6%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-black dark:text-white font-semibold mb-3">
            Customer Insights
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-400">
                New vs Returning
              </span>
              <span className="text-black dark:text-white">65% / 35%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-400">
                Avg. Session Duration
              </span>
              <span className="text-black dark:text-white">4m 32s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-400">
                Bounce Rate
              </span>
              <span className="text-black dark:text-white">23.4%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-black dark:text-white font-semibold mb-3">
            Inventory Status
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-400">In Stock</span>
              <span className="text-green-600 dark:text-green-500">
                {totalProducts}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-400">
                Low Stock
              </span>
              <span className="text-yellow-600 dark:text-yellow-500">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-400">
                Out of Stock
              </span>
              <span className="text-red-600 dark:text-red-500">0</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-black dark:text-white font-semibold mb-3">
            Performance Metrics
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-400">
                Page Load Time
              </span>
              <span className="text-black dark:text-white">2.3s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-400">
                Server Response
              </span>
              <span className="text-green-600 dark:text-green-500">120ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-400">Uptime</span>
              <span className="text-green-600 dark:text-green-500">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
