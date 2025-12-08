import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminLayout } from "@/components/AdminLayout";
import { RevenueChart } from "@/components/RevenueChart";

interface AdminDashboardProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AdminDashboard({ searchParams }: AdminDashboardProps) {
  const session = await auth();

  // For now, redirect to home if not authenticated
  // In a real app, you'd check for admin role
  if (!session?.user?.id) {
    redirect("/");
  }

  // Get the selected time period from URL params, default to 'month'
  const period = typeof searchParams.period === 'string' ? searchParams.period : 'month';

  // Get dashboard stats
  const totalOrders = await prisma.order.count();
  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
  });

  const totalCustomers = await prisma.user.count();
  const pendingOrders = await prisma.order.count({
    where: {
      status: "PENDING",
    },
  });

  // Get recent orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  // Get revenue data based on selected period
  let revenueData;
  let chartTitle = 'Sales Overview';

  if (period === 'week') {
    // Weekly data for the last 12 weeks
    revenueData = (await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('week', "createdAt") as period,
        SUM(total) as revenue
      FROM "Order"
      WHERE "createdAt" >= NOW() - INTERVAL '12 weeks'
      GROUP BY DATE_TRUNC('week', "createdAt")
      ORDER BY period DESC
    `) as Array<{ period: Date; revenue: bigint }>;
    chartTitle = 'Weekly Sales';
  } else if (period === 'month') {
    // Monthly data for the last 12 months
    revenueData = (await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', "createdAt") as period,
        SUM(total) as revenue
      FROM "Order"
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY period DESC
    `) as Array<{ period: Date; revenue: bigint }>;
    chartTitle = 'Monthly Sales';
  } else if (period === 'year') {
    // Yearly data for the last 5 years
    revenueData = (await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('year', "createdAt") as period,
        SUM(total) as revenue
      FROM "Order"
      WHERE "createdAt" >= NOW() - INTERVAL '5 years'
      GROUP BY DATE_TRUNC('year', "createdAt")
      ORDER BY period DESC
    `) as Array<{ period: Date; revenue: bigint }>;
    chartTitle = 'Yearly Sales';
  } else {
    // Default to monthly
    revenueData = (await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', "createdAt") as period,
        SUM(total) as revenue
      FROM "Order"
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY period DESC
    `) as Array<{ period: Date; revenue: bigint }>;
    chartTitle = 'Monthly Sales';
  }

  const revenue = totalRevenue._sum.total || 0;

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Today's Revenue
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">
            ${revenue.toFixed(2)}
          </p>
          <p className="text-green-600 dark:text-green-500 text-sm font-medium">
            +5.2%
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Total Orders
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">
            {totalOrders}
          </p>
          <p className="text-red-600 dark:text-red-500 text-sm font-medium">
            -1.8%
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Total Customers
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">
            {totalCustomers}
          </p>
          <p className="text-green-600 dark:text-green-500 text-sm font-medium">
            +3.0%
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Pending Orders
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">
            {pendingOrders}
          </p>
          <p className="text-gray-500 text-sm font-medium">--</p>
        </div>
      </div>

      {/* Sales Overview */}
      <div className="mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-black dark:text-white text-lg font-bold">
              {chartTitle}
            </h2>
            <div className="flex gap-2">
              <Link
                href="/admin?period=week"
                className={`flex h-8 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors ${
                  period === 'week'
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Week
              </Link>
              <Link
                href="/admin?period=month"
                className={`flex h-8 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors ${
                  period === 'month'
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Month
              </Link>
              <Link
                href="/admin?period=year"
                className={`flex h-8 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors ${
                  period === 'year'
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Year
              </Link>
            </div>
          </div>
          {/* Revenue Chart */}
          <div className="h-80">
            <RevenueChart data={revenueData.map((item: { period: Date; revenue: bigint }) => ({
              month: item.period.toISOString(),
              revenue: Number(item.revenue)
            }))} />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-black dark:text-white text-lg font-bold">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3" scope="col">
                    Order ID
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Customer
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Date
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right" scope="col">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const statusColors: Record<string, string> = {
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
                    <tr
                      key={order.id}
                      className="bg-white dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      <th
                        className="px-6 py-4 font-medium text-black dark:text-white whitespace-nowrap"
                        scope="row"
                      >
                        #{order.id.slice(0, 8)}
                      </th>
                      <td className="px-6 py-4">
                        {order.user.name || order.user.email}
                      </td>
                      <td className="px-6 py-4">
                        {order.createdAt.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            statusColors[order.status] || statusColors.PENDING
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-black dark:text-white">
                        ${Number(order.total).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
