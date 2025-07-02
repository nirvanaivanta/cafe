'use client';

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

type RawPesanan = {
  created_at: string;
  details: {
    menu: {
      menu_name: string; 
    };
    quantity: number;
    subtotal: number;
  }[];
};


type SaleItem = {
  menu: string;
  quantity: number;
  total: number;
  date: string;
};

export default function RekapPage() {
  const today = new Date().toISOString().split('T')[0];
  const [filterDate, setFilterDate] = useState(today);
  const [data, setData] = useState<SaleItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pesanan`);
        const json: RawPesanan[] = await res.json();

        // Ubah menjadi bentuk SaleItem[]
        const items: SaleItem[] = [];
        json.forEach((pesanan) => {
          const date = new Date(pesanan.created_at).toISOString().split('T')[0];
          pesanan.details.forEach((detail) => {
            items.push({
              menu: detail.menu.menu_name,
              quantity: detail.quantity,
              total: detail.subtotal,
              date,
            });
          });
        });

        setData(items);
      } catch (error) {
        console.error('Gagal mengambil data rekap:', error);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter((item) => item.date === filterDate);

  // Gabungkan data per menu
  const combinedData: Record<string, SaleItem> = {};
  filteredData.forEach((item) => {
    if (!combinedData[item.menu]) {
      combinedData[item.menu] = { ...item };
    } else {
      combinedData[item.menu].quantity += item.quantity;
      combinedData[item.menu].total += item.total;
    }
  });

  const finalData = Object.values(combinedData);
  const totalPendapatan = finalData.reduce((sum, item) => sum + item.total, 0);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(finalData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap');
    const blob = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([blob]), `rekap-${filterDate}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#F9E0BB] px-6 py-14 text-[#884A39] font-sans">
      <h1 className="text-5xl font-extrabold text-center mb-12 font-serif drop-shadow-md tracking-wider">
        Rekap Penjualan
      </h1>

      {/* Filter */}
      <div className="bg-white/80 border rounded-2xl shadow-md p-6 max-w-4xl mx-auto mb-10 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <label className="text-sm font-semibold block mb-1">Filter Tanggal</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 rounded border focus:ring-2 focus:ring-[#FFC26F] w-64"
          />
        </div>
        <button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-xl transition shadow"
        >
          Export Excel
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white/80 border shadow-md rounded-2xl overflow-hidden w-full">
        <table className="w-full text-sm">
          <thead className="bg-[#884A39]/80 text-white font-bold uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Menu</th>
              <th className="px-6 py-3 text-center">Jumlah</th>
              <th className="px-6 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {finalData.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500 italic">
                  Tidak ada penjualan pada tanggal ini.
                </td>
              </tr>
            ) : (
              <>
                {finalData.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-6 py-4">{item.menu}</td>
                    <td className="px-6 py-4 text-center">{item.quantity}</td>
                    <td className="px-6 py-4 text-right">Rp{item.total.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-[#FDEEDC] font-semibold border-t">
                  <td className="px-6 py-4" colSpan={2}>
                    Total Pendapatan
                  </td>
                  <td className="px-6 py-4 text-right">
                    Rp{totalPendapatan.toLocaleString()}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
