'use client';

import { useState } from 'react';

type MenuFront = {
  id: number;
  menu_name: string;
  price: number;
  stock: number;
  photo: string | null;
  category: {
    category_name: string;
  };
};

// Dummy data
const dummyMenus: MenuFront[] = [
  {
    id: 1,
    menu_name: 'Espresso',
    price: 18000,
    stock: 10,
    photo: 'gambar1.png',
    category: { category_name: 'Kopi' },
  },
  {
    id: 2,
    menu_name: 'Latte',
    price: 22000,
    stock: 8,
    photo: 'gambar2.png',
    category: { category_name: 'Kopi' },
  },
  {
    id: 3,
    menu_name: 'Cappuccino',
    price: 23000,
    stock: 5,
    photo: 'gambar1.png',
    category: { category_name: 'Kopi' },
  },
  {
    id: 4,
    menu_name: 'Matcha Latte',
    price: 25000,
    stock: 12,
    photo: 'gambar2.png',
    category: { category_name: 'Non-Kopi' },
  },
  {
    id: 5,
    menu_name: 'Red Velvet',
    price: 26000,
    stock: 7,
    photo: 'gambar1.png',
    category: { category_name: 'Non-Kopi' },
  },
  {
    id: 6,
    menu_name: 'Croissant',
    price: 15000,
    stock: 20,
    photo: 'gambar2.png',
    category: { category_name: 'Snack' },
  },
  {
    id: 7,
    menu_name: 'Donat',
    price: 12000,
    stock: 15,
    photo: 'gambar1.png',
    category: { category_name: 'Snack' },
  },
  {
    id: 8,
    menu_name: 'Ice Tea',
    price: 10000,
    stock: 25,
    photo: 'gambar2.png',
    category: { category_name: 'Minuman' },
  },
  {
    id: 9,
    menu_name: 'Lemonade',
    price: 12000,
    stock: 18,
    photo: 'gambar1.png',
    category: { category_name: 'Minuman' },
  },
  {
    id: 10,
    menu_name: 'Americano',
    price: 20000,
    stock: 10,
    photo: 'gambar2.png',
    category: { category_name: 'Kopi' },
  },
];

export default function MenuFront() {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = ['Semua', ...Array.from(new Set(dummyMenus.map(m => m.category.category_name)))];

  const filteredMenus =
    activeCategory === 'Semua'
      ? dummyMenus
      : dummyMenus.filter(menu => menu.category.category_name === activeCategory);

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
                  src={`/images/${menu.photo}`} 
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
