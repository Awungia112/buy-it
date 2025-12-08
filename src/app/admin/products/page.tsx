import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AdminLayout } from "@/components/AdminLayout";
import { DeleteProductButton } from "@/components/DeleteProductButton";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  // Get all products
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Calculate stats
  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + Number(product.price),
    0
  );
  const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;

  return (
    <AdminLayout title="Products Management">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Total Products
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">
            {totalProducts}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Total Value
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">
            ${totalValue.toFixed(2)}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Average Price
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">
            ${averagePrice.toFixed(2)}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Low Stock
          </p>
          <p className="text-black dark:text-white text-3xl font-bold">0</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-black dark:text-white text-xl font-bold">
          All Products
        </h2>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Add Product
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-black dark:text-white mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-primary">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {product.id.slice(0, 8)}
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded text-center text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  Edit
                </Link>
                <Link
                  href={`/products/${product.id}`}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded text-center text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  View
                </Link>
                <div className="flex-shrink-0">
                  <DeleteProductButton productId={product.id} productName={product.name} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">
            inventory_2
          </span>
          <h3 className="text-black dark:text-white text-lg font-semibold mb-2">
            No products found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get started by adding your first product
          </p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Add First Product
          </Link>
        </div>
      )}

      {/* Bulk Actions */}
      {products.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-black dark:text-white font-semibold mb-2">
            Bulk Actions
          </h3>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
              Import Products
            </button>
            <button className="px-4 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors">
              Update Prices
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
