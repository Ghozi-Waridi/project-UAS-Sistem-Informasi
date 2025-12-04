import React from 'react';

const activities = [
  {
    type: 'evaluasi',
    title: 'Evaluasi Baru',
    desc: 'Decision Maker 1 menyelesaikan evaluasi Ahmad Rizki',
    time: '5 menit lalu',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    type: 'kandidat',
    title: 'Kandidat Baru',
    desc: 'Sari Dewi ditambahkan sebagai kandidat Software Engineer',
    time: '15 menit lalu',
    color: 'bg-green-100 text-green-600',
  },
  {
    type: 'konsensus',
    title: 'Konsensus Tercapai',
    desc: 'Keputusan final untuk Budi Santoso: DITERIMA',
    time: '1 jam lalu',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    type: 'evaluasi',
    title: 'Evaluasi Selesai',
    desc: 'Decision Maker 3 menyelesaikan evaluasi Maya Indira',
    time: '2 jam lalu',
    color: 'bg-purple-100 text-purple-600',
  },
];

export default function ActivityList() {
  return (
    <div className="bg-white rounded-2xl shadow-xl px-6 py-5 flex flex-col gap-4 h-full border border-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
          <span className="bg-purple-600 text-white p-2 rounded-lg">📋</span>
          Aktivitas Terbaru
        </h3>
        <button className="text-xs text-blue-600 font-bold hover:underline transition">
          Lihat Semua
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-80">
        {activities.map((a, idx) => (
          <div key={idx} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer border border-transparent hover:border-gray-200">
            <div
              className={`mt-1 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${a.color} shadow-sm`}
            >
              ⦿
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center gap-2">
                <p className="text-sm font-bold text-gray-800">
                  {a.title}
                </p>
                <span className="text-xs text-gray-500 font-medium">{a.time}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="text-xs text-blue-600 font-bold self-center mt-1 hover:underline transition">
        Muat Lebih Banyak
      </button>
    </div>
  );
}
