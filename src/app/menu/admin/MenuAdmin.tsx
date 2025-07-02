'use client';

import api from '@/lib/api2';
import { Pencil, Trash, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';

type Category = {
  id: number;
  category_name: string;
};


type MenuItem = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string; // tampilkan gambar
};

export default function MenuAdmin() {
  // const [categories, setCategories] = useState<Category[]>;
  const [categories, setCategories] = useState<Category[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [form, setForm] = useState<Partial<MenuItem> & { image?: File }>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showCategoryList, setShowCategoryList] = useState(false);
  useEffect(() => {
  fetchMenus();
}, []);

useEffect(() => {
  fetchMenus();
  fetchCategories();
}, []);

const fetchCategories = async () => {
  try {
    const res = await api.get('/categories');
    setCategories(res.data);
  } catch (error) {
    console.error('Gagal ambil kategori:', error);
  }
};

const handleDeleteCategory = async (id: number) => {
  if (!confirm('Hapus kategori ini?')) return;
  try {
    await api.delete(`/categories/${id}`);
    fetchCategories();
  } catch (error) {
    console.error('Gagal hapus kategori:', error);
  }
};

const fetchMenus = async () => {
  try {
    const res = await api.get('/menus');
     const data = res.data.map((item: any) => ({
        id: item.id,
        name: item.menu_name,
        price: item.price,
        stock: item.stock,
        category: item.category?.category_name || 'Unknown',
        image_url: item.photo ? `http://127.0.0.1:8000/storage/${item.photo}` : null,
      }));


    setMenus(data);
  } catch (error) {
    console.error('Failed to fetch menus:', error);
  }
};


    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value, files } = e.target as HTMLInputElement;

      if (name === 'image' && files?.[0]) {
        setForm({ ...form, image: files[0] });
      } else {
        setForm({ ...form, [name]: value });
      }
    };

    const handleAddMenu = async () => {
      if (!form.name || !form.category || !form.price || !form.stock) return;

      try {
        const categoryId = categories.find((cat) => cat.category_name === form.category)?.id;
    if (!categoryId) {
      alert("Kategori tidak valid");
      return;
    }

    const formData = new FormData();
    formData.append('menu_name', form.name);
    formData.append('category_id', categoryId.toString());
    formData.append('price', form.price.toString());
    formData.append('stock', form.stock.toString());
    if (form.image) {
      formData.append('photo', form.image);
    }


    await api.post('/menus', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    fetchMenus();
    setForm({});
    setShowForm(false);
  } catch (error) {
    console.error('Failed to add menu:', error);
  }
};

  const handleEdit = (menu: MenuItem) => {
    setForm(menu);
    setEditingId(menu.id);
    setShowForm(true);
  };

  const handleUpdateMenu = async () => {
    if (!editingId || !form.name || !form.category || !form.price || !form.stock)
      return;

    try {
      const categoryId = categories.find((cat) => cat.category_name === form.category)?.id;
  if (!categoryId) {
    alert("Kategori tidak valid");
    return;
  }

    const formData = new FormData();
    formData.append('menu_name', form.name);
    formData.append('category_id', categoryId.toString());
    formData.append('price', form.price.toString());
    formData.append('stock', form.stock.toString());
    if (form.image) {
      formData.append('photo', form.image);
    }


    await api.post(`/menus/${editingId}?_method=PUT`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    fetchMenus();
    setForm({});
    setEditingId(null);
    setShowForm(false);
  } catch (error) {
    console.error('Failed to update menu:', error);
  }
};


 const handleDelete = async (id: number) => {
  try {
    await api.delete(`/menus/${id}`);
    fetchMenus();
  } catch (error) {
    console.error('Failed to delete menu:', error);
  }
};

const handleAddCategory = async () => {
  const newCategory = prompt('Masukkan nama kategori baru:');
  if (!newCategory || categories.some(cat => cat.category_name === newCategory)) return;

  try {
    const res = await api.post('/categories', { category_name: newCategory });
    setCategories([...categories, res.data]);
  } catch (error) {
    console.error('Gagal tambah kategori:', error);
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
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full border border-[#FFC26F]/50 px-4 py-3 rounded-lg"
        />

        <div className="flex gap-2">
          <div className="relative flex-1">
              <div className="border border-[#FFC26F]/50 px-4 py-3 rounded-lg bg-white cursor-pointer" onClick={() => setShowCategoryList(!showCategoryList)}>
                {form.category || 'Pilih kategori'}
              </div>

              {showCategoryList && (
                <ul className="absolute z-10 w-full bg-white border border-[#FFC26F]/50 mt-2 rounded-lg max-h-60 overflow-y-auto shadow">
                  {categories.map((cat) => (
                    <li
                      key={cat.id}
                      className="flex justify-between items-center px-4 py-2 hover:bg-[#FFF1DC] cursor-pointer"
                    >
                      <span onClick={() => {
                        setForm({ ...form, category: cat.category_name });
                        setShowCategoryList(false);
                      }}>
                        {cat.category_name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(cat.id);
                        }}
                        className="text-xs text-red-500 hover:underline ml-2"
                      >
                        Hapus
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
                {menu.image_url && (
                  <img
                    src={menu.image_url}
                    alt={menu.name}
                    className="w-24 h-24 object-cover rounded-lg mb-2"
                  />
                )}

              </div>
              <div className="flex flex-col gap-2">
              <button
                onClick={() => handleEdit(menu)}
                className="w-9 h-9 flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <Pencil className="w-4 h-4" />
              </button>

                <button
                  onClick={() => handleDelete(menu.id)}
                  className="w-9 h-9 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  <Trash className="w-4 h-4" />
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
