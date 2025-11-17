import React, { useMemo, useState } from "react";

const resultData = [
  {
    id: 1,
    name: "Maya Indira Sari",
    role: "Senior Software Engineer",
    result: "accepted", // accepted | interview | rejected
    startDate: "2024-02-01",
    salary: 18000000,
    score: 9.0,
  },
  {
    id: 2,
    name: "Sari Dewi Lestari",
    role: "Software Engineer",
    result: "accepted",
    startDate: "2024-02-15",
    salary: 15000000,
    score: 8.5,
  },
  {
    id: 3,
    name: "Ahmad Rizki Pratama",
    role: "Junior Software Engineer",
    result: "interview",
    startDate: null,
    salary: null,
    score: 8.0,
  },
  {
    id: 4,
    name: "Budi Santoso",
    role: "Software Engineer",
    result: "rejected",
    startDate: null,
    salary: null,
    score: 7.2,
  },
];

function formatCurrency(num) {
  if (!num) return "-";
  return `Rp ${num.toLocaleString("id-ID")}`;
}

export default function Hasil() {
  const [activeTab, setActiveTab] = useState("ringkasan"); // ringkasan | detail | analitik

  const stats = useMemo(() => {
    const total = resultData.length;
    const accepted = resultData.filter((c) => c.result === "accepted").length;
    const interview = resultData.filter((c) => c.result === "interview").length;
    const rejected = resultData.filter((c) => c.result === "rejected").length;
    const avgScore =
      resultData.reduce((acc, c) => acc + c.score, 0) / total || 0;
    return { total, accepted, interview, rejected, avgScore };
  }, []);

  const handleExport = () => {
    // simulasi export ke CSV
    const header = "Nama,Posisi,Hasil,Skor,Tanggal Mulai,Gaji\n";
    const rows = resultData
      .map(
        (c) =>
          `${c.name},${c.role},${c.result},${c.score},${
            c.startDate || "-"
          },${c.salary || "-"}`
      )
      .join("\n");
    const csv = header + rows;
    console.log("=== EXPORT LAPORAN SELEKSI (CSV SIMULASI) ===\n" + csv);
    alert(
      "Export laporan seleksi (simulasi).\nLihat data CSV di console browser."
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleInterviewClick = (candidate) => {
    alert(
      `Interview lanjutan untuk:\n${candidate.name} - ${candidate.role}\n\nSimulasi: di sini bisa diarahkan ke modul penjadwalan interview.`
    );
  };

  const handleRejectedInfo = (candidate) => {
    alert(
      `Kandidat ditolak:\n${candidate.name} - ${candidate.role}\n\nSimulasi: di sini bisa menampilkan alasan penolakan atau riwayat evaluasi.`
    );
  };

  const accepted = resultData.filter((c) => c.result === "accepted");
  const interview = resultData.filter((c) => c.result === "interview");
  const rejected = resultData.filter((c) => c.result === "rejected");

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <section className="bg-white rounded-3xl shadow-card px-8 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Hasil Seleksi <span className="inline-block">📊</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 max-w-2xl">
            Hasil akhir proses seleksi Software Engineer berdasarkan konsensus
            GDSS.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
          >
            <span>⬇️</span>
            <span>Export Laporan</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50 px-4 py-2 text-sm font-semibold text-green-600 hover:bg-green-100"
          >
            <span>🖨️</span>
            <span>Print</span>
          </button>
        </div>
      </section>

      {/* STAT RINGKAS */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-2xl bg-white shadow-card px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total Kandidat</p>
            <p className="text-xl font-semibold text-gray-900 mt-1">
              {stats.total}
            </p>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <span className="text-indigo-500 text-lg">👤</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-card px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Diterima</p>
            <p className="text-xl font-semibold text-green-600 mt-1">
              {stats.accepted}
            </p>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-green-50 flex items-center justify-center">
            <span className="text-green-500 text-lg">✅</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-card px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Interview</p>
            <p className="text-xl font-semibold text-blue-600 mt-1">
              {stats.interview}
            </p>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center">
            <span className="text-blue-500 text-lg">🧑‍💼</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-card px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Ditolak</p>
            <p className="text-xl font-semibold text-red-600 mt-1">
              {stats.rejected}
            </p>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-red-50 flex items-center justify-center">
            <span className="text-red-500 text-lg">❌</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-card px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Rata-rata Skor</p>
            <p className="text-xl font-semibold text-purple-600 mt-1">
              {stats.avgScore.toFixed(1)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-purple-50 flex items-center justify-center">
            <span className="text-purple-500 text-lg">⭐</span>
          </div>
        </div>
      </section>

      {/* TAB + ISI */}
      <section className="bg-white rounded-3xl shadow-card">
        {/* Tabs */}
        <div className="border-b border-gray-100 px-6 pt-4">
          <div className="flex gap-4 text-xs font-medium">
            {[
              { key: "ringkasan", label: "Ringkasan" },
              { key: "detail", label: "Detail Hasil" },
              { key: "analitik", label: "Analitik" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-2 pb-3 ${
                  activeTab === tab.key
                    ? "text-blue-600"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {tab.key === "ringkasan" && "▦ "}
                {tab.key === "detail" && "📄 "}
                {tab.key === "analitik" && "📈 "}
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full bg-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {activeTab === "ringkasan" && (
            <RingkasanTab
              accepted={accepted}
              interview={interview}
              rejected={rejected}
              onInterview={handleInterviewClick}
              onRejected={handleRejectedInfo}
            />
          )}
          {activeTab === "detail" && (
            <DetailTab
              data={resultData}
              onInterview={handleInterviewClick}
              onRejected={handleRejectedInfo}
            />
          )}
          {activeTab === "analitik" && (
            <AnalitikTab stats={stats} data={resultData} />
          )}
        </div>
      </section>
    </div>
  );
}

/* ==================== TAB KOMPONEN ==================== */

function RingkasanTab({ accepted, interview, rejected, onInterview, onRejected }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">
        Ringkasan Hasil Seleksi
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* KANDIDAT DITERIMA */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-700">
            Kandidat Diterima
          </p>
          <div className="space-y-3">
            {accepted.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {c.name}
                  </p>
                  <p className="text-xs text-gray-500">{c.role}</p>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    Mulai: {c.startDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-700">
                    {c.score.toFixed(1)}/10
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {formatCurrency(c.salary)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STATUS LAINNYA */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-700">Status Lainnya</p>

          {interview.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {c.name}
                </p>
                <p className="text-xs text-gray-500">{c.role}</p>
                <button
                  type="button"
                  onClick={() => onInterview(c)}
                  className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-600 text-[11px] font-semibold px-3 py-0.5"
                >
                  <span>👤</span>
                  <span>Interview Lanjutan</span>
                </button>
              </div>
              <p className="text-sm font-semibold text-yellow-600">
                {c.score.toFixed(1)}/10
              </p>
            </div>
          ))}

          {rejected.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {c.name}
                </p>
                <p className="text-xs text-gray-500">{c.role}</p>
                <button
                  type="button"
                  onClick={() => onRejected(c)}
                  className="mt-1 inline-flex items-center gap-1 rounded-full bg-red-100 text-red-600 text-[11px] font-semibold px-3 py-0.5"
                >
                  <span>✖</span>
                  <span>Ditolak</span>
                </button>
              </div>
              <p className="text-sm font-semibold text-red-600">
                {c.score.toFixed(1)}/10
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailTab({ data, onInterview, onRejected }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Detail Hasil</h3>
      <div className="rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-4 py-2 text-left">Kandidat</th>
              <th className="px-4 py-2 text-left">Posisi</th>
              <th className="px-4 py-2 text-left">Hasil</th>
              <th className="px-4 py-2 text-center">Skor</th>
              <th className="px-4 py-2 text-left">Mulai</th>
              <th className="px-4 py-2 text-right">Gaji</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {c.name}
                  </p>
                </td>
                <td className="px-4 py-2 text-xs text-gray-600">{c.role}</td>
                <td className="px-4 py-2">
                  {c.result === "accepted" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-600 text-[11px] font-semibold px-3 py-0.5">
                      ✅ Diterima
                    </span>
                  )}
                  {c.result === "interview" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-semibold px-3 py-0.5">
                      👤 Interview
                    </span>
                  )}
                  {c.result === "rejected" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-600 text-[11px] font-semibold px-3 py-0.5">
                      ✖ Ditolak
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-center text-sm font-semibold text-gray-800">
                  {c.score.toFixed(1)}/10
                </td>
                <td className="px-4 py-2 text-xs text-gray-600">
                  {c.startDate || "-"}
                </td>
                <td className="px-4 py-2 text-right text-xs text-gray-700">
                  {formatCurrency(c.salary)}
                </td>
                <td className="px-4 py-2 text-center">
                  {c.result === "interview" && (
                    <button
                      type="button"
                      onClick={() => onInterview(c)}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Jadwalkan Interview
                    </button>
                  )}
                  {c.result === "rejected" && (
                    <button
                      type="button"
                      onClick={() => onRejected(c)}
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Lihat Alasan
                    </button>
                  )}
                  {c.result === "accepted" && (
                    <span className="text-[11px] text-gray-400">
                      Kontrak dibuat
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalitikTab({ stats, data }) {
  const maxScore = 10;
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Analitik</h3>
      <p className="text-xs text-gray-500">
        Gambaran umum performa kandidat berdasarkan skor akhir.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Distribusi hasil */}
        <div className="rounded-2xl border border-gray-100 px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-gray-700">
            Distribusi Keputusan
          </p>
          <div className="space-y-1 text-xs">
            <p>
              ✅ Diterima:{" "}
              <span className="font-semibold text-green-600">
                {stats.accepted}
              </span>
            </p>
            <p>
              👤 Interview:{" "}
              <span className="font-semibold text-blue-600">
                {stats.interview}
              </span>
            </p>
            <p>
              ❌ Ditolak:{" "}
              <span className="font-semibold text-red-600">
                {stats.rejected}
              </span>
            </p>
          </div>
        </div>

        {/* Rata-rata skor */}
        <div className="rounded-2xl border border-gray-100 px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-gray-700">
            Rata-rata Skor
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                style={{
                  width: `${(stats.avgScore / maxScore) * 100}%`,
                }}
              />
            </div>
            <p className="text-sm font-semibold text-blue-600">
              {stats.avgScore.toFixed(1)}/10
            </p>
          </div>
        </div>
      </div>

      {/* List singkat */}
      <div className="rounded-2xl border border-gray-100 px-4 py-3 space-y-2">
        <p className="text-xs font-semibold text-gray-700">
          Peringkat Kandidat berdasarkan Skor
        </p>
        <div className="space-y-1 text-xs">
          {data
            .slice()
            .sort((a, b) => b.score - a.score)
            .map((c, idx) => (
              <div
                key={c.id}
                className="flex items-center justify-between text-gray-700"
              >
                <span>
                  #{idx + 1} {c.name}{" "}
                  <span className="text-gray-400">({c.role})</span>
                </span>
                <span className="font-semibold">{c.score.toFixed(1)}/10</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
