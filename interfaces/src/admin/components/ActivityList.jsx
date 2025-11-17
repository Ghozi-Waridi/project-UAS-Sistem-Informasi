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
    <div className="bg-white rounded-3xl shadow-card px-6 py-5 flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Aktivitas Terbaru</h3>
        <button className="text-xs text-blue-600 font-semibold">
          Lihat Semua
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-80">
        {activities.map((a, idx) => (
          <div key={idx} className="flex gap-3">
            <div
              className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${a.color}`}
            >
              ⦿
            </div>
            <div>
              <div className="flex justify-between items-center gap-2">
                <p className="text-sm font-semibold text-gray-800">
                  {a.title}
                </p>
                <span className="text-[11px] text-gray-400">{a.time}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="text-xs text-blue-600 font-semibold self-center mt-1">
        Muat Lebih Banyak
      </button>
    </div>
  );
}
