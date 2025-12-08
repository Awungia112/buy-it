import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative mb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div
              className="relative flex min-h-[480px] md:min-h-[560px] flex-col gap-6 bg-gradient-to-br from-primary via-red-600 to-pink-600 rounded-2xl items-center justify-center p-8 md:p-12 text-center overflow-hidden"
            >
              <div className="flex flex-col gap-6 z-10 max-w-4xl">
                <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                  New Season Arrivals
                </h1>
                <p className="text-white/90 text-base md:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
                  Discover the latest trends and styles for this season.
                  Unveiling our new collection designed for the modern
                  trendsetter.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white text-base font-bold rounded-lg hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span className="material-symbols-outlined">
                      storefront
                    </span>
                    Shop Now
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-base font-bold rounded-lg hover:bg-white/20 transition-all duration-200 border-2 border-white/30"
                  >
                    View Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-16">
          {/* Shop by Category */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
                Shop by Category
              </h2>
              <Link
                href="/products"
                className="text-primary font-medium hover:underline flex items-center gap-1"
              >
                View All
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                {
                  name: "Men's Apparel",
                  color: "from-blue-500 to-blue-700",
                  icon: "checkroom",
                },
                {
                  name: "Women's Footwear",
                  color: "from-pink-500 to-pink-700",
                  icon: "steps",
                },
                {
                  name: "Accessories",
                  color: "from-purple-500 to-purple-700",
                  icon: "watch",
                },
                {
                  name: "New In",
                  color: "from-green-500 to-green-700",
                  icon: "new_releases",
                },
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href="/products"
                  className="group relative flex flex-col rounded-lg justify-center items-center p-6 aspect-[4/5] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br text-white"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-6xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                      {cat.icon}
                    </span>
                    <h3 className="text-xl font-bold leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-sm opacity-80 mt-2">
                      Shop Now →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Featured Products */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
                Featured Products
              </h2>
              <Link
                href="/products"
                className="text-primary font-medium hover:underline flex items-center gap-1"
              >
                View All
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group flex flex-col bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800"
                  >
                    <Link
                      href={`/products/${product.id}`}
                      className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <div className="p-4 flex flex-col flex-1">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-gray-900 dark:text-white font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-700 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <p className="text-primary text-xl font-bold">
                          ${Number(product.price).toFixed(2)}
                        </p>
                        <Link
                          href={`/products/${product.id}`}
                          className="flex items-center justify-center px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary text-sm font-bold rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-4xl text-gray-400">
                      inventory_2
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-400 mb-4">
                    No products found. Please seed the database.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-500">
                    Run: npm run seed
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Features Section */}
          <section className="border-t border-gray-200 dark:border-gray-800 pt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-primary">
                    local_shipping
                  </span>
                </div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                  Free Shipping
                </h3>
                <p className="text-gray-700 dark:text-gray-400 text-sm">
                  Free shipping on all orders over $50
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-primary">
                    verified_user
                  </span>
                </div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                  Secure Payment
                </h3>
                <p className="text-gray-700 dark:text-gray-400 text-sm">
                  100% secure payment guaranteed
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-primary">
                    support_agent
                  </span>
                </div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                  24/7 Support
                </h3>
                <p className="text-gray-700 dark:text-gray-400 text-sm">
                  Dedicated support team ready to help
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
