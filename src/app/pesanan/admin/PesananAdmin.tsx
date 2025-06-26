'use client';

import { useRef, useState } from 'react';

type Menu = {
  id: number;
  name: string;
  price: number;
};

export default function PesananPage() {
  const dummyMenus: Menu[] = [
    { id: 1, name: 'Cappuccino', price: 20000 },
    { id: 2, name: 'Es Teh Manis', price: 8000 },
    { id: 3, name: 'Roti Bakar', price: 15000 },
    { id: 4, name: 'Americano', price: 18000 },
    { id: 5, name: 'Donat Coklat', price: 12000 },
  ];

  const [selectedItems, setSelectedItems] = useState<
    { id: number; quantity: number }[]
  >([]);

  const [bayar, setBayar] = useState<number>(0);
  const strukRef = useRef<HTMLDivElement>(null);

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
    const menu = dummyMenus.find((m) => m.id === item.id);
    return total + (menu?.price || 0) * item.quantity;
  }, 0);

  const kembalian = bayar - totalHarga;

  const handleCetakStruk = () => {
    alert('Cetak struk berhasil! (simulasi)');
  };

  return (
    <div className="min-h-screen bg-[#F9E0BB] px-6 py-14 sm:px-20 text-[#884A39]">
      <h1 className="text-4xl font-bold text-center mb-10 font-serif">Pesanan</h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Pilih Menu */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Pilih Menu</h2>
          <div className="space-y-3">
            {dummyMenus.map((menu) => {
              const selected = selectedItems.find((item) => item.id === menu.id);
              return (
                <div
                  key={menu.id}
                  className={`flex items-center justify-between bg-white/80 backdrop-blur-md border border-[#FFC26F]/40 rounded-xl px-6 py-4 shadow-sm transition ${
                    selected ? 'ring-2 ring-[#FFC26F]' : ''
                  }`}
                >
                  <div>
                    <p className="font-semibold">{menu.name}</p>
                    <p className="text-sm text-[#C38154]">Rp{menu.price.toLocaleString()}</p>
                  </div>
                  {selected ? (
                    <input
                      type="number"
                      min={1}
                      value={selected.quantity}
                      onChange={(e) =>
                        updateQuantity(menu.id, Number(e.target.value))
                      }
                      className="w-20 px-3 py-1 rounded border text-right"
                    />
                  ) : (
                    <button
                      onClick={() => toggleItem(menu.id)}
                      className="bg-[#884A39] text-white px-4 py-2 rounded hover:bg-[#A45F44] transition"
                    >
                      Pilih
                    </button>
                  )}
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
                        const menu = dummyMenus.find((m) => m.id === item.id);
                        return (
                        <li key={item.id} className="flex justify-between">
                            <span>
                            {menu?.name} × {item.quantity}
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
                        onClick={() => {
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

      <p>Tanggal: {new Date().toLocaleString()}</p>

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
            const menu = dummyMenus.find((m) => m.id === item.id);
            return (
              <tr key={item.id}>
                <td>{menu?.name}</td>
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
