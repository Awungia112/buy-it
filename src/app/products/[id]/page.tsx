import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { addToCart } from "./actions";
import { ProductRating } from "@/components/ProductRating";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductDetailSkeleton } from "@/components/SkeletonLoader";
import { Suspense } from "react";

async function ProductContent({ id }: { id: string }) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products (just 4 random ones excluding current)
  const relatedProducts = await prisma.product.findMany({
    where: { NOT: { id: product.id } },
    take: 4,
  });

  return (
    <>
      {/* Breadcrumbs */}
      <div className="mb-6 flex flex-wrap gap-2 text-sm">
        <Link
          href="/"
          className="text-black dark:text-gray-400 hover:text-primary"
        >
          Home
        </Link>
        <span className="text-black dark:text-gray-500">/</span>
        <Link
          href="/products"
          className="text-black dark:text-gray-400 hover:text-primary"
        >
          Products
        </Link>
        <span className="text-black dark:text-gray-500">/</span>
        <span className="text-red-600 dark:text-red-400 font-medium">
          {product.name}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Image Gallery Column */}
        <ProductImageGallery
          mainImage={product.image}
          additionalImages={product.images || []}
          productName={product.name}
        />

        {/* Product Information Column */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-text-light-primary dark:text-text-dark-primary">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <ProductRating
                productId={product.id}
                currentRating={4.2}
                totalRatings={121}
              />
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              {product.description}
            </p>
          </div>

          <p className="text-4xl font-bold text-red-600 dark:text-red-400">
            ${Number(product.price).toFixed(2)}
          </p>

          {/* Available Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-black dark:text-white">Available Colors</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, index) => (
                  <div
                    key={`${color}-${index}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{
                        backgroundColor: color.startsWith('#') ? color : undefined,
                        background: !color.startsWith('#') ? color : undefined
                      }}
                    />
                    <span className="text-sm font-medium text-black dark:text-white">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-6">
            <form action={addToCart}>
              <input type="hidden" name="productId" value={product.id} />

              {/* Variant Selector: Size (Static for now) */}
              <div className="mb-6">
                <label
                  className="block text-base font-semibold text-black dark:text-white mb-3"
                  htmlFor="size"
                >
                  Size
                </label>
                <select
                  className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary text-base py-3 px-4"
                  id="size"
                  name="size"
                  aria-describedby="size-help"
                >
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
                <p id="size-help" className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Select your preferred size
                </p>
              </div>

              {/* Action Panel */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                  <select
                    name="quantity"
                    className="h-full border-none bg-transparent focus:ring-0 py-2 pl-3 pr-8"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="submit"
                  className="flex h-12 w-full flex-1 min-w-[150px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary text-white text-base font-bold shadow-md hover:bg-red-700 dark:hover:bg-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined">
                    add_shopping_cart
                  </span>
                  <span>Add to Cart</span>
                </button>
              </div>
            </form>
          </div>

          {/* Accordion for Details */}
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <details className="group" open>
              <summary className="flex justify-between items-center cursor-pointer list-none py-3 px-1 text-black dark:text-white hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                <span className="font-semibold text-base">
                  Full Description
                </span>
                <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-gray-600 dark:text-gray-400">
                  expand_more
                </span>
              </summary>
              <p className="text-gray-800 dark:text-gray-300 mt-3 text-base leading-relaxed pl-1">
                {product.description}
              </p>
            </details>
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none py-3 px-1 text-black dark:text-white hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                <span className="font-semibold text-base">
                  Shipping & Returns
                </span>
                <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-gray-600 dark:text-gray-400">
                  expand_more
                </span>
              </summary>
              <p className="text-gray-800 dark:text-gray-300 mt-3 text-base leading-relaxed pl-1">
                Free standard shipping on all orders. We accept returns within
                30 days of purchase for a full refund, provided the item is in
                its original, unworn condition.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16 md:mt-24">
        <h3 className="text-2xl font-bold mb-6 text-text-light-primary dark:text-text-dark-primary">
          You Might Also Like
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((related) => (
            <Link
              key={related.id}
              href={`/products/${related.id}`}
              className="flex flex-col gap-3 group"
            >
              <div className="w-full relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <Image
                  src={related.image}
                  alt={related.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="font-semibold text-text-light-primary dark:text-text-dark-primary group-hover:text-primary transition-colors">
                  {related.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ${Number(related.price).toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background">
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductContent id={id} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
