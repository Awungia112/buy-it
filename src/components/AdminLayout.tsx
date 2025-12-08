'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { name: 'Orders', href: '/admin/orders', icon: 'shopping_cart' },
    { name: 'Products', href: '/admin/products', icon: 'inventory_2' },
    { name: 'Customers', href: '/admin/customers', icon: 'group' },
    { name: 'Analytics', href: '/admin/analytics', icon: 'pie_chart' },
  ];

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center gap-3 mb-8 px-2">
          <span className="material-symbols-outlined text-primary text-3xl">local_mall</span>
          <h1 className="text-xl font-bold text-black dark:text-white">Buy It</h1>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">person</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-black dark:text-white text-base font-medium leading-normal">
              {session?.user?.name || 'Admin'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
              {session?.user?.email}
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                pathname === item.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="material-symbols-outlined fill-1">{item.icon}</span>
              <p className="text-sm font-semibold">{item.name}</p>
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium">Back to Store</p>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-8">
            <h2 className="text-black dark:text-white text-xl font-bold">{title}</h2>
          </div>
          <div className="flex flex-1 justify-end items-center gap-6">
            <label className="relative flex-grow max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                className="form-input flex w-full min-w-0 flex-1 rounded-lg text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border-transparent focus:border-primary focus:ring-primary h-10 placeholder:text-gray-500 pl-10 text-sm"
                placeholder="Search..."
              />
            </label>
            <button className="flex items-center justify-center rounded-full h-10 w-10 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">person</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}