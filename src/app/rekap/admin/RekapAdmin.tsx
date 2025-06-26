'use client';

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

type SaleItem = {
  id: number;
  menu: string;
  quantity: number;
  total: number;
  date: string; // format YYYY-MM-DD
};

export default function RekapPage() {
  const today = new Date().toISOString().split('T')[0];
  const [filterDate, setFilterDate] = useState(today);
  const [data, setData] = useState<SaleItem[]>([]);

  useEffect(() => {
    const dummySales: SaleItem[] = [
      { id: 1, menu: 'Cappuccino', quantity: 2, total: 40000, date: today },
      { id: 2, menu: 'Roti Bakar', quantity: 1, total: 15000, date: today },
      { id: 3, menu: 'Es Teh Manis', quantity: 3, total: 24000, date: today },
      { id: 4, menu: 'Donat', quantity: 2, total: 24000, date: '2024-06-25' },
    ];
    setData(dummySales);
  }, []);

  const filteredData = data.filter((item) => item.date === filterDate);
  const totalPendapatan = filteredData.reduce((sum, item) => sum + item.total, 0);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
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

      {/* Filter Section */}
      <div className="bg-white/80 backdrop-blur-md border border-[#FFC26F]/40 rounded-2xl shadow-md p-6 max-w-4xl mx-auto mb-10 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="w-full sm:w-auto">
          <label className="text-sm font-semibold block mb-1">Filter Tanggal</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 rounded border border-[#FFC26F]/60 focus:ring-2 focus:ring-[#FFC26F] w-full sm:w-64"
          />
        </div>
        <button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-xl transition shadow"
        >
          Export Excel
        </button>
      </div>

      {/* Tabel Penjualan */}
      <div className="bg-white/80 backdrop-blur-md border border-[#FFC26F]/30 shadow-md rounded-2xl overflow-hidden w-full">
        <table className="w-full table-auto text-sm">
          <thead className="bg-[#884A39]/80 text-white text-sm font-bold uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3 text-left">Menu</th>
              <th className="px-6 py-3 text-center">Jumlah</th>
              <th className="px-6 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500 italic">
                  Tidak ada penjualan pada tanggal ini.
                </td>
              </tr>
            ) : (
              <>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-t border-[#FFC26F]/30">
                    <td className="px-6 py-4">{item.menu}</td>
                    <td className="px-6 py-4 text-center">{item.quantity}</td>
                    <td className="px-6 py-4 text-right">Rp{item.total.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-[#FDEEDC] font-semibold text-[#884A39] border-t border-[#FFC26F]/30">
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
