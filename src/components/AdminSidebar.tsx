'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Menu', href: '/menu/admin' },
  { name: 'Pesanan', href: '/pesanan/admin' },
  { name: 'Rekap', href: '/rekap/admin' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full sm:w-64 bg-[#884A39] text-white min-h-screen px-6 py-10 fixed top-0 left-0 shadow-lg z-10">
      <h2 className="text-3xl font-bold mb-12 text-center font-serif uppercase">Admin</h2>
      <nav className="flex flex-col gap-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-3 rounded-lg font-medium transition ${
                isActive
                  ? 'bg-[#FFC26F] text-[#884A39]'
                  : 'hover:bg-[#A45F44] hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
