'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { ProductSearch } from './ProductSearch';

interface ProductFiltersProps {
  minPriceValue: number;
  maxPriceValue: number;
  categories: string[];
}

export function ProductFilters({ minPriceValue, maxPriceValue, categories }: ProductFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [minPrice, setMinPrice] = useState(
    searchParams.get('minPrice') || minPriceValue
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get('maxPrice') || maxPriceValue
  );
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('minPrice', String(minPrice));
    newParams.set('maxPrice', String(maxPrice));
    router.push(`/products?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="sticky top-28 flex flex-col gap-6 bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
      <div className="flex justify-between items-center">
        <h2 className="text-text-light-primary dark:text-text-dark-primary text-lg font-bold">
          Filters
        </h2>
        <Link href="/products" className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-medium hover:text-primary dark:hover:text-primary">
          Clear All
        </Link>
      </div>
      <div className="space-y-6 divide-y divide-border-light dark:divide-border-dark">
        {/* Search Filter */}
        <div className="pt-6">
          <h3 className="text-text-light-primary dark:text-text-dark-primary font-semibold mb-3">
            Search
          </h3>
          <ProductSearch />
        </div>
        {/* Category Filter */}
        <div>
          <div className="flex justify-between items-center cursor-pointer pt-6" onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
            <h3 className="text-text-light-primary dark:text-text-dark-primary font-semibold">
              Category
            </h3>
            <span className={`material-symbols-outlined transform transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}>
              expand_less
            </span>
          </div>
          {isCategoryOpen && (
            <div className="pt-4 space-y-2">
              {categories.map(category => (
                <button 
                  key={category}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams.toString());
                    newParams.set('category', category);
                    router.push(`/products?${newParams.toString()}`, { scroll: false });
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    searchParams.get('category') === category 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}>
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="pt-6">
        <h3 className="text-text-light-primary dark:text-text-dark-primary font-semibold mb-3">
          Price Range
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
              ${minPrice}
            </span>
            <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
              ${maxPrice}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="range"
              min={minPriceValue}
              max={maxPriceValue}
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <input
              type="range"
              min={minPriceValue}
              max={maxPriceValue}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleApplyFilters}
        className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-red-700 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  </div>
  );
}
