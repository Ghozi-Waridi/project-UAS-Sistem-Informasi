import React from "react";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    label: "Kelola Kandidat",
    desc: "Tambah & kelola data kandidat",
    color: "from-blue-500 to-indigo-500",
    to: "/kandidat",
  },
  {
    label: "Monitor Evaluasi",
    desc: "Pantau progress penilaian",
    color: "from-green-500 to-emerald-500",
    // tidak pindah route, tapi scroll ke section evaluasi
    scrollTo: "evaluation-section",
  },
  {
    label: "Konsensus Keputusan",
    desc: "Review hasil evaluasi",
    color: "from-fuchsia-500 to-pink-500",
    to: "/decision-maker",
  },
  {
    label: "Laporan Hasil",
    desc: "Lihat laporan seleksi",
    color: "from-orange-500 to-amber-500",
    to: "/hasil",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  const handleClick = (action) => {
    if (action.to) {
      navigate(action.to);
    }
    if (action.scrollTo) {
      const el = document.getElementById(action.scrollTo);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl px-6 py-5 flex flex-col gap-4 border border-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
          <span className="bg-blue-600 text-white p-2 rounded-lg">⚡</span>
          Aksi Cepat
        </h3>
        <button className="text-gray-400 text-xl leading-none hover:text-gray-600 transition">⋯</button>
      </div>

      <div className="flex flex-col gap-3">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={() => handleClick(a)}
            className={`w-full text-left rounded-xl px-5 py-4 bg-gradient-to-r ${a.color} text-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex justify-between items-center`}
          >
            <div>
              <div className="font-bold text-sm">{a.label}</div>
              <div className="text-xs opacity-90 mt-1">{a.desc}</div>
            </div>
            <span className="text-xl transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
