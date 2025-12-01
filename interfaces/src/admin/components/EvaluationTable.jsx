import React, { useMemo, useState } from "react";



const EVALUATION_CRITERIA = [
  {
    key: "technical",
    label: "Keahlian Teknis",
    description: "Kemampuan programming, framework, dan tools",
    weight: 30,
  },
  {
    key: "problemSolving",
    label: "Problem Solving",
    description: "Kemampuan analisis dan pemecahan masalah",
    weight: 25,
  },
  {
    key: "communication",
    label: "Komunikasi",
    description: "Kemampuan berkomunikasi dan presentasi",
    weight: 20,
  },
  {
    key: "teamwork",
    label: "Kerja Tim",
    description: "Kemampuan berkolaborasi dalam tim",
    weight: 15,
  },
  {
    key: "experience",
    label: "Pengalaman",
    description: "Relevansi dan kualitas pengalaman kerja",
    weight: 10,
  },
];

export default function EvaluationTable({ candidates = [] }) {
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [scores, setScores] = useState({
    technical: 0,
    problemSolving: 0,
    communication: 0,
    teamwork: 0,
    experience: 0,
    notes: "",
  });

  const totalScore = useMemo(() => {
    let total = 0;
    let totalWeight = 0;
    EVALUATION_CRITERIA.forEach((c) => {
      const value = scores[c.key] || 0;
      total += value * c.weight;
      totalWeight += c.weight;
    });
    if (!totalWeight) return 0;
    return total / totalWeight;
  }, [scores]);

  const openEvaluation = (row) => {
    setSelectedRow(row);
    setScores({
      technical: 0,
      problemSolving: 0,
      communication: 0,
      teamwork: 0,
      experience: 0,
      notes: "",
    });
    setIsEvaluationOpen(true);
  };

  const setScore = (key, value) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  // Map candidates to rows
  const displayRows = candidates.map(c => {
    let details = {};
    try {
      const parsed = JSON.parse(c.description || "{}");
      if (typeof parsed === 'string') {
        details = JSON.parse(parsed);
      } else {
        details = parsed;
      }
    } catch (e) {
      details = { note: c.description };
    }

    return {
      id: c.alternative_id || c.id,
      kandidat: c.name,
      posisi: details.experience ? `${details.experience} - ${details.education || ''}` : (details.note || "-"),
      evaluator: "-", // Placeholder
      status: "Menunggu", // Placeholder
      statusColor: "bg-gray-100 text-gray-600",
      skor: "-", // Placeholder
    };
  });

  return (
    <>
      {/* Card daftar evaluasi */}
      <div className="bg-white rounded-3xl shadow-card px-6 py-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-800">Daftar Kandidat</h3>
            <p className="text-[11px] text-gray-400 mt-1">
              Klik baris untuk melihat detail
            </p>
          </div>
          <button className="text-xs text-blue-600 font-semibold">
            Lihat Semua
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b">
                <th className="py-2 text-left">Kandidat</th>
                <th className="py-2 text-left">Deskripsi</th>
                <th className="py-2 text-left">Evaluator</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-right">Skor</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.length > 0 ? (
                displayRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => openEvaluation(row)}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold">
                          {row.kandidat
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm">
                            {row.kandidat}
                          </div>
                          <div className="text-xs text-gray-400">#{row.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{row.posisi}</td>
                    <td className="py-3 text-sm text-gray-600">
                      {row.evaluator}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${row.statusColor}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-gray-800">
                      {row.skor}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    Belum ada kandidat di project ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Evaluasi Kandidat (scrollable) */}
      {isEvaluationOpen && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
              <div>
                <button
                  onClick={() => setIsEvaluationOpen(false)}
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-1"
                >
                  ← Kembali
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                  Evaluasi Kandidat
                </h2>
                <p className="text-xs text-gray-500">
                  Berikan penilaian untuk kandidat Software Engineer
                </p>
              </div>
              <button
                onClick={() => setIsEvaluationOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Body scrollable */}
            <div className="px-6 pb-5 pt-3 space-y-5 overflow-y-auto">
              {/* Info kandidat */}
              <div className="bg-blue-50 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                    {selectedRow.kandidat
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedRow.kandidat}
                    </p>
                    <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                      <p>
                        <span className="font-medium">Posisi:</span>{" "}
                        {selectedRow.posisi}
                      </p>
                      <p>
                        <span className="font-medium">Evaluator:</span>{" "}
                        {selectedRow.evaluator}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kriteria Penilaian */}
              <section className="bg-white rounded-2xl border border-gray-100 px-5 py-4 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Kriteria Penilaian
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Berikan skor 1–10 untuk setiap kriteria evaluasi
                  </p>
                </div>

                <div className="space-y-4">
                  {EVALUATION_CRITERIA.map((crit) => {
                    const current = scores[crit.key] || 0;
                    return (
                      <div
                        key={crit.key}
                        className="rounded-2xl border border-gray-100 px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {crit.label}
                            </p>
                            <p className="text-xs text-gray-500">
                              {crit.description}
                            </p>
                          </div>
                          <div className="text-right text-xs text-blue-600 font-semibold">
                            <p>Bobot: {crit.weight}%</p>
                            <p className="text-xl font-bold">
                              {current || 0}/10
                            </p>
                          </div>
                        </div>

                        {/* Skala 1–10 */}
                        <div className="mt-3 flex flex-col gap-1.5">
                          <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 10 }).map((_, i) => {
                              const val = i + 1;
                              const active = val === current;
                              return (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => setScore(crit.key, val)}
                                  className={`w-8 h-8 rounded-full border text-xs font-medium flex items-center justify-center transition
                                    ${active
                                      ? "border-blue-500 bg-blue-500 text-white shadow"
                                      : "border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                                    }`}
                                >
                                  {val}
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-400">
                            <span>Sangat Kurang</span>
                            <span>Sangat Baik</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Catatan Evaluasi */}
              <section className="bg-white rounded-2xl border border-gray-100 px-5 py-4 space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Catatan Evaluasi
                </h3>
                <p className="text-xs text-gray-500">
                  Tambahkan catatan atau komentar mengenai kandidat...
                </p>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={scores.notes}
                    onChange={(e) =>
                      setScores((prev) => ({
                        ...prev,
                        notes: e.target.value.slice(0, 500),
                      }))
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                    placeholder="Contoh: Kandidat memiliki kemampuan teknis yang baik namun perlu meningkatkan kemampuan komunikasi."
                  />
                  <p className="absolute bottom-2 right-3 text-[11px] text-gray-400">
                    {scores.notes.length}/500 karakter
                  </p>
                </div>
              </section>

              {/* Total Skor */}
              <section className="bg-blue-50 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Total Skor
                  </p>
                  <p className="text-xs text-gray-500">
                    Skor akhir berdasarkan bobot kriteria
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {totalScore.toFixed(1)}/10
                  </p>
                  <p className="text-[11px] text-gray-500">Skor Akhir</p>
                </div>
              </section>

              {/* Tombol Aksi */}
              <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEvaluationOpen(false)}
                  className="px-4 py-2 rounded-2xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50"
                >
                  ✕ Batal
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-2xl border border-gray-200 bg-gray-100 text-sm text-gray-700 hover:bg-gray-200"
                >
                  💾 Simpan Draft
                </button>
                <button
                  type="button"
                  className="px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-sm font-semibold text-white shadow-md hover:shadow-lg"
                >
                  ✓ Submit Evaluasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
