'use client';

import { useState } from 'react';

type Category = string;

type MenuItem = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
};

export default function MenuAdmin() {
  const [categories, setCategories] = useState<Category[]>(['Makanan', 'Minuman', 'Snack']);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [form, setForm] = useState<Partial<MenuItem>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddMenu = () => {
    if (!form.name || !form.category || !form.price || !form.stock) return;

    const newMenu: MenuItem = {
      id: Date.now(),
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
    };

    setMenus([...menus, newMenu]);
    setForm({});
    setShowForm(false);
  };

  const handleEdit = (menu: MenuItem) => {
    setForm(menu);
    setEditingId(menu.id);
    setShowForm(true);
  };

  const handleUpdateMenu = () => {
    setMenus(
      menus.map((m) =>
        m.id === editingId
          ? {
              ...m,
              name: form.name || '',
              price: Number(form.price),
              stock: Number(form.stock),
              category: form.category || '',
            }
          : m
      )
    );
    setEditingId(null);
    setForm({});
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setMenus(menus.filter((m) => m.id !== id));
  };

  const handleAddCategory = () => {
    const newCategory = prompt('Masukkan nama kategori baru:');
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

return (
  <div className="min-h-screen bg-[#F9E0BB] py-14 px-6 sm:px-20 text-[#884A39]">
    <h1 className="text-5xl uppercase font-extrabold text-center mb-12 tracking-wide drop-shadow-md">
      Daftar Menu
    </h1>

    {/* Toggle Form */}
    <div className="text-center mb-10">
      <button
        onClick={() => {
          setShowForm(!showForm);
          setForm({});
          setEditingId(null);
        }}
        className="inline-block bg-[#884A39] text-white px-6 py-2 rounded-full hover:bg-[#A45F44] transition font-medium shadow-md"
      >
        {showForm ? 'Tutup Form' : 'Tambah Menu'}
      </button>
    </div>

    {/* Form */}
    {showForm && (
      <div className="bg-white/90 backdrop-blur border border-[#FFC26F]/40 p-8 rounded-2xl shadow-lg max-w-2xl mx-auto mb-16 space-y-6">
        <h2 className="text-2xl font-bold font-serif text-[#884A39]">
          {editingId ? 'Edit Menu' : 'Form Menu'}
        </h2>
        <input
          name="name"
          type="text"
          placeholder="Nama menu"
          value={form.name || ''}
          onChange={handleChange}
          className="w-full border border-[#FFC26F]/50 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC26F]"
        />
        <input
          name="price"
          type="number"
          placeholder="Harga"
          value={form.price || ''}
          onChange={handleChange}
          className="w-full border border-[#FFC26F]/50 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC26F]"
        />
        <input
          name="stock"
          type="number"
          placeholder="Stok"
          value={form.stock || ''}
          onChange={handleChange}
          className="w-full border border-[#FFC26F]/50 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC26F]"
        />
        <div className="flex gap-2">
          <select
            name="category"
            value={form.category || ''}
            onChange={handleChange}
            className="flex-1 border border-[#FFC26F]/50 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC26F]"
          >
            <option value="">Pilih kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddCategory}
            className="bg-[#FFC26F] text-[#884A39] px-4 py-2 rounded-lg hover:bg-[#ffbb4d] transition shadow"
          >
            + Kategori
          </button>
        </div>
        <button
          onClick={editingId ? handleUpdateMenu : handleAddMenu}
          className="w-full bg-[#884A39] text-white py-3 rounded-full hover:bg-[#A45F44] transition shadow"
        >
          {editingId ? 'Update Menu' : 'Tambah Menu'}
        </button>
      </div>
    )}

    {/* List */}
    <div className="max-w-5xl mx-auto">
      {/* <h2 className="text-3xl font-bold font-serif mb-6">Daftar Menu</h2> */}
      <div className="space-y-6">
        {menus.length === 0 ? (
          <p className="text-center text-[#C38154] italic">Belum ada menu.</p>
        ) : (
          menus.map((menu) => (
            <div
              key={menu.id}
              className="bg-white/70 backdrop-blur-md border border-[#FFC26F]/30 rounded-2xl px-6 py-5 shadow-sm hover:shadow-lg transition flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-semibold">{menu.name}</h3>
                <p className="text-sm text-[#C38154] italic">{menu.category}</p>
                <p className="text-sm mt-1">Harga: Rp{menu.price.toLocaleString()}</p>
                <p className="text-sm">Stok: {menu.stock}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(menu)}
                  className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(menu.id)}
                  className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);



}
