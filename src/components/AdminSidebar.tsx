'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Utensils, ClipboardList, BarChart2 } from 'lucide-react'; // ikon menu

const navItems = [
  { name: 'Menu', href: '/menu/admin', icon: <Utensils size={18} /> },
  { name: 'Pesanan', href: '/pesanan/admin', icon: <ClipboardList size={18} /> },
  { name: 'Rekap', href: '/rekap/admin', icon: <BarChart2 size={18} /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    window.location.href = '/menu'; // frontend redirect
  };

  return (
    <aside className="w-full sm:w-64 bg-gradient-to-b from-[#884A39] to-[#5E3023] text-white min-h-screen px-6 py-10 fixed top-0 left-0 shadow-xl z-10 flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-bold mb-12 text-center font-serif uppercase tracking-widest drop-shadow">
          Admin
        </h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition group ${
                  isActive
                    ? 'bg-[#FFC26F] text-[#884A39] shadow-inner'
                    : 'hover:bg-[#A45F44]/80 hover:shadow-md'
                }`}
              >
                <span className="text-white group-hover:text-white">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Tombol Logout */}
      <button
        onClick={handleLogout}
        className="mt-10 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl transition shadow-md"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
