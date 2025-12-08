import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { SortSelect } from "@/components/SortSelect";
import { Pagination } from "@/components/Pagination";
import { ProductSearch } from "@/components/ProductSearch";
import { ProductFilters } from '@/components/ProductFilters';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "newest";
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;
  const minPrice = typeof params.minPrice === "string" ? parseFloat(params.minPrice) : undefined;
  const maxPrice = typeof params.maxPrice === "string" ? parseFloat(params.maxPrice) : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;

  const ITEMS_PER_PAGE = 20;

  // Build orderBy based on sort parameter
  let orderBy: { createdAt?: "desc" | "asc"; price?: "desc" | "asc" } = {
    createdAt: "desc",
  }; // default: newest

  switch (sort) {
    case "price-low":
      orderBy = { price: "asc" };
      break;
    case "price-high":
      orderBy = { price: "desc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  // Build where clause for filtering
  const where: any = {};
  
  // Add search filter
  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive',
    };
  }

  // Add price range filter
  const priceFilter: any = {};
  if (minPrice !== undefined) priceFilter.gte = minPrice;
  if (maxPrice !== undefined) priceFilter.lte = maxPrice;
  if (Object.keys(priceFilter).length > 0) {
    where.price = priceFilter;
  }

  // Add category filter
  if (category) {
    where.category = category;
  }

  // Get total count for pagination with applied filters
  const totalProducts = await prisma.product.count({ where });

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  // Fetch products with applied filters, sorting, and pagination
  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  // Calculate price range for the slider
  const priceRange = await prisma.product.aggregate({
    _min: { price: true },
    _max: { price: true },
  });
  const minPriceValue = Math.floor(Number(priceRange._min.price) || 0);
  const maxPriceValue = Math.ceil(Number(priceRange._max.price) || 1000);

  // Get all unique categories for the filter
  const categories = await prisma.product.findMany({
    select: {
      category: true,
    },
    distinct: ['category' as const],
  });
  const categoryList = categories.map(c => c.category).filter(Boolean) as string[];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/"
            className="text-black dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary"
          >
            Home
          </Link>
          <span className="text-black dark:text-gray-500 text-sm font-medium leading-normal">
            /
          </span>
          <span className="text-black dark:text-white text-sm font-medium leading-normal">
            Products
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SideNavBar / Filters */}
          <aside className="lg:col-span-1">
            <ProductFilters minPriceValue={minPriceValue} maxPriceValue={maxPriceValue} categories={categoryList} />
          </aside>

          {/* Main Content / Product Grid */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-light-primary dark:text-text-dark-primary mb-4 sm:mb-0">
                All Products
              </h1>
              <SortSelect
                currentSort={sort}
                searchQuery={search}
                currentPage={page}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden aspect-[4/5]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                        <Link
                          href={`/products/${product.id}`}
                          className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-red-700"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 p-4">
                      <h3 className="text-base font-semibold text-text-light-primary dark:text-text-dark-primary truncate">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-primary">
                        ${Number(product.price).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <span className="material-symbols-outlined !text-base">
                          star
                        </span>
                        <span className="material-symbols-outlined !text-base">
                          star
                        </span>
                        <span className="material-symbols-outlined !text-base">
                          star
                        </span>
                        <span className="material-symbols-outlined !text-base">
                          star
                        </span>
                        <span className="material-symbols-outlined !text-base">
                          star_half
                        </span>
                        <span className="text-xs text-text-light-secondary dark:text-text-dark-secondary ml-1">
                          (42)
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No products found matching your search.
                </div>
              )}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              searchQuery={search}
              sortQuery={sort}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
