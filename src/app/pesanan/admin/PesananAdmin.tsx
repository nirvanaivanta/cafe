'use client';

import { useEffect, useRef, useState } from 'react';

type Menu = {
  id: number;
  menu_name: string;
  price: number;
  stock: number;
};

export default function PesananPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ id: number; quantity: number }[]>([]);
  const [bayar, setBayar] = useState<number>(0);
  const [tanggal, setTanggal] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);


  const strukRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const now = new Date();
    setTanggal(now.toLocaleString());
  }, []);


  // Ambil menu dari backend
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus`)
      .then(res => res.json())
      .then(data => setMenus(data));
  }, []);

  const toggleItem = (id: number) => {
    const existing = selectedItems.find((item) => item.id === id);
    if (existing) {
      setSelectedItems(selectedItems.filter((item) => item.id !== id));
    } else {
      setSelectedItems([...selectedItems, { id, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Number(quantity) } : item
      )
    );
  };

  const totalHarga = selectedItems.reduce((total, item) => {
    const menu = menus.find((m) => m.id === item.id);
    return total + (menu?.price || 0) * item.quantity;
  }, 0);

  const kembalian = bayar - totalHarga;


  return (
    <div className="min-h-screen bg-[#F9E0BB] px-6 py-14 sm:px-20 text-[#884A39]">

        <h1 className="text-5xl uppercase font-extrabold text-center mb-12 tracking-wide drop-shadow-md">
            PESANAN
        </h1>
        {showSuccess && (
          <div className="bg-[#C38154] text-white text-center py-3 rounded-lg mb-6 transition duration-300 shadow-md">
            ✅ Pesanan berhasil ditambahkan!
          </div>
        )}

      <div className="grid md:grid-cols-2 gap-12">
          {/* Pilih Menu */}
        <div>
        <h2 className="text-2xl font-bold text-[#884A39] mb-6 tracking-wide border-b border-[#FFC26F]/50 pb-2">
          Pilih Menu
        </h2>

        <div className="space-y-4">
          {menus.map((menu) => {
            const selected = selectedItems.find((item) => item.id === menu.id);
            return (
              <div
                key={menu.id}
                className={`relative flex items-center justify-between bg-gradient-to-r from-white/70 to-[#FFF4E3]/70 backdrop-blur-sm border border-[#FFC26F]/30 rounded-2xl px-6 py-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-md ${
                  selected ? 'ring-2 ring-[#FFC26F]' : ''
                }`}
              >
                {/* Accent bar kiri */}
                <div className="absolute left-0 top-0 h-full w-1 bg-[#FFC26F] rounded-l-2xl" />

                <div className="flex-1">
                  <p className="text-lg font-semibold text-[#884A39]">{menu.menu_name}</p>
                  <p className="text-sm text-[#C38154] mt-0.5">Rp{menu.price.toLocaleString()}</p>
                  <p className="text-sm text-[#C38154]">
                    Stok: <span className="font-bold text-[#884A39]">{menu.stock}</span>
                  </p>
                </div>

                <div className="ml-4">
                  {selected ? (
                    <input
                      type="number"
                      min={1}
                      value={selected.quantity}
                      onChange={(e) => updateQuantity(menu.id, Number(e.target.value))}
                      className="w-20 text-right px-3 py-2 border rounded-lg text-[#884A39] font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFC26F]/60"
                    />
                  ) : (
                    <button
                      onClick={() => toggleItem(menu.id)}
                      className="px-5 py-2 bg-[#884A39] hover:bg-[#A45F44] text-white rounded-xl text-sm font-semibold transition"
                    >
                      Pilih
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>


        {/* Rincian Pesanan */}
        <div>
            <h2 className="text-xl font-semibold mb-4">Rincian Pesanan</h2>
            <div className="bg-white/80 backdrop-blur-md border border-[#FFC26F]/40 rounded-xl p-6 shadow-sm space-y-6">
                {selectedItems.length === 0 ? (
                <p className="text-center text-gray-500">Belum ada menu dipilih.</p>
                ) : (
                <>
                    <ul className="space-y-2">
                    {selectedItems.map((item) => {
                        const menu = menus.find((m) => m.id === item.id);
                        return (
                        <li key={item.id} className="flex justify-between">
                            <span>
                            {menu?.menu_name} × {item.quantity}
                            </span>
                            <span>
                            Rp{(menu!.price * item.quantity).toLocaleString()}
                            </span>
                        </li>
                        );
                    })}
                    </ul>

                    <hr className="border-t border-[#FFC26F]" />

                    <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>Rp{totalHarga.toLocaleString()}</span>
                    </div>

                    {/* Input Uang Pelanggan */}
                    <div>
                    <label className="block text-sm font-medium mb-1">
                        Uang Pelanggan (Bayar)
                    </label>
                    <input
                        type="number"
                        value={bayar}
                        onChange={(e) => setBayar(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-[#FFC26F]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC26F] bg-white"
                        placeholder="Masukkan nominal pembayaran"
                    />
                    </div>

                    {/* Kembalian */}
                    {bayar > 0 && (
                    <div className="bg-[#FDEEDC] text-[#884A39] rounded-lg px-4 py-3 mt-2">
                        {bayar < totalHarga ? (
                        <p className="text-sm font-medium">Uang kurang Rp{(totalHarga - bayar).toLocaleString()}</p>
                        ) : (
                        <p className="text-sm font-medium">
                            Kembalian: Rp{(kembalian).toLocaleString()}
                        </p>
                        )}
                    </div>
                    )}

                  <button
                    onClick={async () => {
                      if (selectedItems.length === 0 || bayar < totalHarga) return;

                      // Kirim data pesanan ke backend
                      try {
                        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pesanan`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            items: selectedItems,
                            total: totalHarga,
                            bayar,
                            kembalian,
                          }),
                        });
                          setShowSuccess(true);
                          setTimeout(() => setShowSuccess(false), 3000); 
                      } catch (error) {
                        console.error("Gagal menyimpan pesanan:", error);
                        alert("Terjadi kesalahan saat menyimpan pesanan.");
                        return;
                      }

                      // Lanjut print struk
                      if (strukRef.current) {
                        const printContents = strukRef.current.innerHTML;
                        const printWindow = window.open('', '', 'width=600,height=800');
                        if (printWindow) {
                          printWindow.document.write(`
                            <html>
                              <head>
                                <title>Struk Pembayaran</title>
                                <style>
                                  body { font-family: sans-serif; padding: 20px; }
                                  h2 { margin-top: 0; }
                                  table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                                  td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }
                                  .total { font-weight: bold; }
                                  .right { text-align: right; }
                                </style>
                              </head>
                              <body>
                                ${printContents}
                              </body>
                            </html>
                          `);
                          printWindow.document.close();
                          printWindow.focus();
                          setTimeout(() => {
                            printWindow.print();
                            printWindow.close();
                          }, 300);
                        }
                      }

                      // Reset form setelah cetak (opsional)
                      setSelectedItems([]);
                      setBayar(0);
                    }}
                    disabled={selectedItems.length === 0 || bayar < totalHarga}
                    className="w-full mt-4 bg-[#884A39] text-white py-3 rounded-full hover:bg-[#A45F44] transition disabled:opacity-50"
                  >
                    Cetak Struk
                  </button>
                </>
                )}
        </div>
        </div>
      </div>

       <div ref={strukRef} style={{ display: 'none' }}>
  <div id="struk-print-style">
    <style>
      {`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }

          #struk-container {
            width: 8cm;
            padding: 1rem;
            font-family: monospace;
            font-size: 12px;
            color: black;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          td, th {
            padding: 2px 0;
            text-align: left;
          }

          th.right, td.right {
            text-align: right;
          }

          .total-line {
            border-top: 1px dashed black;
            margin: 5px 0;
          }

          .center {
            text-align: center;
          }
        }
      `}
    </style>

    <div id="struk-container">
      <div className="center">
        <h3 style={{ margin: 0 }}>MOROOKOPI</h3>
        <p style={{ marginBottom: '0.5rem' }}>Jl. Ngopi No. 42</p>
      </div>

    <p>Tanggal: {tanggal}</p>

      <table>
        <thead>
          <tr>
            <th>Menu</th>
            <th>Qty</th>
            <th className="right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.map((item) => {
            const menu = menus.find((m) => m.id === item.id);
            return (
              <tr key={item.id}>
                <td>{menu?.menu_name}</td>
                <td>{item.quantity}</td>
                <td className="right">Rp{(menu!.price * item.quantity).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="total-line" />

      <table>
        <tbody>
          <tr>
            <td colSpan={2}>Total</td>
            <td className="right">Rp{totalHarga.toLocaleString()}</td>
          </tr>
          <tr>
            <td colSpan={2}>Bayar</td>
            <td className="right">Rp{bayar.toLocaleString()}</td>
          </tr>
          <tr>
            <td colSpan={2}>Kembalian</td>
            <td className="right">Rp{(kembalian).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div className="center" style={{ marginTop: '1rem' }}>
        <p>-- Terima Kasih --</p>
        <p>🙏 MOROOKOPI ☕</p>
      </div>
    </div>
  </div>
       </div>
    </div>
  );
}
