'use client';

import { useEffect, useState } from 'react';
import { apiUrl } from '@/lib/api';

type Menu = {
  id: number;
  menu_name: string;
  price: number;
  stock: number;
  photo: string | null;
  category: {
    category_name: string;
  };
};

export default function MenuList() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${apiUrl}/menus`)
      .then(res => res.json())
      .then(data => {
        setMenus(data);
        const uniqueCategories: string[] = Array.from(
          new Set(data.map((menu: Menu) => menu.category.category_name))
        );
        setCategories(['Semua', ...uniqueCategories]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Gagal ambil data menu:', err);
        setLoading(false);
      });
  }, []);

  const filteredMenus =
    activeCategory === 'Semua'
      ? menus
      : menus.filter(menu => menu.category.category_name === activeCategory);

  if (loading) return <p className="p-6 text-center text-lg">Memuat menu...</p>;

  return (
    <div className="min-h-screen bg-[#F9E0BB] py-14 px-6 sm:px-20">
      <h1 className="text-5xl font-extrabold text-center text-[#884A39] mb-10 tracking-wider font-serif drop-shadow-md">
        MOROOKOPI
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`backdrop-blur px-5 py-2 rounded-full font-semibold transition shadow-md ${
              activeCategory === cat
                ? 'bg-[#884A39] text-white scale-105'
                : 'bg-white text-[#884A39] hover:bg-[#FFC26F]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Cards */}
     <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {filteredMenus.map(menu => (
            <div
            key={menu.id}
            className="relative bg-white/40 backdrop-blur-md border border-[#FFC26F]/40 rounded-3xl pt-20 pb-6 px-6 shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
            {/* Floating Image */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#FFC26F] shadow-md">
                <img
                    src={`http://127.0.0.1:8000/storage/${menu.photo}`}
                    alt={menu.menu_name}
                    className="w-full h-full object-cover"
                />
                </div>
            </div>

            {/* Content */}
            <div className="text-center flex flex-col flex-1 justify-start">
                <h2 className="text-xl font-extrabold text-[#884A39] tracking-wide min-h-[2.5rem]">
                {menu.menu_name}
                </h2>
                <p className="text-sm italic text-[#C38154] mb-2">
                {menu.category.category_name}
                </p>

                {/* Push price to bottom */}
                <div className="mt-auto">
                <span className="inline-block bg-gradient-to-r from-[#FFC26F] to-[#F9E0BB] text-[#884A39] font-semibold px-4 py-1 rounded-full text-sm shadow-sm">
                    Rp{menu.price.toLocaleString()}
                </span>
                <p className="text-xs text-gray-600 mt-1">Stok: {menu.stock}</p>
                </div>
            </div>
            </div>
        ))}
    </div>
    </div>
  );
}
