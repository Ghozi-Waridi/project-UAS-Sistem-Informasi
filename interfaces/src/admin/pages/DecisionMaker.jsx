import React, { useMemo, useState } from "react";

const initialConsensus = [
  {
    id: 1,
    name: "Maya Indira Sari",
    position: "Senior Technical Lead",
    status: "recommended", // "recommended" | "review" | "not-recommended"
    finalScore: 9.0,
    decisionMakers: [
      { name: "Decision Maker 1", role: "Senior Technical Lead", score: 9.0 },
      { name: "Decision Maker 2", role: "Engineering Manager", score: 8.8 },
      { name: "Decision Maker 3", role: "Technical Architect", score: 9.2 },
    ],
    decision: null, // "accept" | "reject" | "interview"
  },
  {
    id: 2,
    name: "Sari Dewi Lestari",
    position: "Software Engineer",
    status: "recommended",
    finalScore: 8.5,
    decisionMakers: [
      { name: "Decision Maker 1", role: "Senior Technical Lead", score: 8.5 },
      { name: "Decision Maker 2", role: "Engineering Manager", score: 8.7 },
      { name: "Decision Maker 3", role: "Technical Architect", score: 8.3 },
    ],
    decision: null,
  },
  {
    id: 3,
    name: "Ahmad Rizki Pratama",
    position: "Frontend Developer",
    status: "review",
    finalScore: 8.0,
    decisionMakers: [
      { name: "Decision Maker 1", role: "Senior Technical Lead", score: 8.2 },
      { name: "Decision Maker 2", role: "Engineering Manager", score: 7.8 },
      { name: "Decision Maker 3", role: "Technical Architect", score: 8.0 },
    ],
    decision: null,
  },
  {
    id: 4,
    name: "Budi Santoso",
    position: "Backend Developer",
    status: "not-recommended",
    finalScore: 7.2,
    decisionMakers: [
      { name: "Decision Maker 1", role: "Senior Technical Lead", score: 7.2 },
      { name: "Decision Maker 2", role: "Engineering Manager", score: 7.5 },
      { name: "Decision Maker 3", role: "Technical Architect", score: 7.0 },
    ],
    decision: null,
  },
];

function getStatusMeta(status) {
  switch (status) {
    case "recommended":
      return {
        label: "Direkomendasikan",
        badgeClass: "bg-green-100 text-green-700",
        scoreClass: "text-green-600",
      };
    case "review":
      return {
        label: "Perlu Review",
        badgeClass: "bg-yellow-100 text-yellow-700",
        scoreClass: "text-yellow-500",
      };
    case "not-recommended":
      return {
        label: "Tidak Direkomendasikan",
        badgeClass: "bg-red-100 text-red-700",
        scoreClass: "text-red-600",
      };
    default:
      return {
        label: "-",
        badgeClass: "bg-gray-100 text-gray-600",
        scoreClass: "text-gray-700",
      };
  }
}

export default function DecisionMaker() {
  const [data, setData] = useState(initialConsensus);

  const stats = useMemo(() => {
    const total = data.length;
    const recommended = data.filter((d) => d.status === "recommended").length;
    const review = data.filter((d) => d.status === "review").length;
    const notRecommended = data.filter(
      (d) => d.status === "not-recommended"
    ).length;
    return { total, recommended, review, notRecommended };
  }, [data]);

  const handleDecision = (id, decision) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, decision } : item
      )
    );
  };

  const handleSaveDraft = () => {
    console.log("Draft konsensus disimpan:", data);
    alert("Draft konsensus disimpan (simulasi).");
  };

  const handleFinalize = () => {
    const accepted = data.filter((d) => d.decision === "accept").length;
    const rejected = data.filter((d) => d.decision === "reject").length;
    const interviews = data.filter((d) => d.decision === "interview").length;

    alert(
      `Finalisasi Konsensus (simulasi):\n` +
        `Diterima: ${accepted}\n` +
        `Ditolak: ${rejected}\n` +
        `Interview Lanjutan: ${interviews}\n\n` +
        `Notifikasi ke kandidat dianggap sudah dikirim.`
    );
  };

  const handleViewDetail = (item) => {
    alert(
      `Detail Kandidat: ${item.name}\n` +
        `Posisi: ${item.position}\n` +
        `Skor Akhir: ${item.finalScore}/10\n` +
        `Status: ${getStatusMeta(item.status).label}`
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER + RINGKASAN */}
      <section className="bg-white rounded-3xl shadow-card px-8 py-7 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Konsensus Keputusan <span className="inline-block">👋</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1 max-w-2xl">
              Review hasil evaluasi dari semua Decision Maker dan buat keputusan
              final untuk setiap kandidat.
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Evaluator Selesai</p>
            <p className="text-lg font-semibold text-blue-600">
              3<span className="text-gray-400">/3</span>
            </p>
          </div>
        </div>

        {/* STAT KOTAK */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
            <div>
              <p className="text-xs text-gray-500">Total Kandidat</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-blue-100 flex items-center justify-center">
              <span className="text-blue-500 text-lg">👤</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-green-50 px-4 py-3">
            <div>
              <p className="text-xs text-gray-500">Direkomendasikan</p>
              <p className="text-xl font-semibold text-green-600 mt-1">
                {stats.recommended}
              </p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-green-100 flex items-center justify-center">
              <span className="text-green-500 text-lg">👍</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-yellow-50 px-4 py-3">
            <div>
              <p className="text-xs text-gray-500">Perlu Review</p>
              <p className="text-xl font-semibold text-yellow-600 mt-1">
                {stats.review}
              </p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-500 text-lg">❓</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3">
            <div>
              <p className="text-xs text-gray-500">Tidak Direkomendasikan</p>
              <p className="text-xl font-semibold text-red-600 mt-1">
                {stats.notRecommended}
              </p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-red-100 flex items-center justify-center">
              <span className="text-red-500 text-lg">💬</span>
            </div>
          </div>
        </div>
      </section>

      {/* LIST KANDIDAT KONSENSUS */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-800">
          Hasil Konsensus Evaluasi
        </h2>

        {data.map((item) => {
          const meta = getStatusMeta(item.status);
          const initials = item.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          const decisionLabel =
            item.decision === "accept"
              ? "Diterima"
              : item.decision === "reject"
              ? "Ditolak"
              : item.decision === "interview"
              ? "Interview Lanjutan"
              : null;

          const decisionColor =
            item.decision === "accept"
              ? "text-green-600"
              : item.decision === "reject"
              ? "text-red-600"
              : item.decision === "interview"
              ? "text-blue-600"
              : "text-gray-400";

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-card px-6 py-5 space-y-4"
            >
              {/* HEADER KANDIDAT */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {initials}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${meta.badgeClass}`}
                      >
                        {item.status === "recommended" && "👍"}
                        {item.status === "review" && "⏳"}
                        {item.status === "not-recommended" && "👎"}
                        <span>{meta.label}</span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.position}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleViewDetail(item)}
                    className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100"
                  >
                    Lihat Detail
                  </button>
                  <p
                    className={`text-lg md:text-2xl font-bold ${meta.scoreClass}`}
                  >
                    {item.finalScore.toFixed(1)}/10
                  </p>
                </div>
              </div>

              {/* SKOR PER DECISION MAKER */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {item.decisionMakers.map((dm, idx) => (
                  <div
                    key={dm.name}
                    className="rounded-2xl bg-gray-50 px-4 py-3 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {dm.name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {dm.role}
                        </p>
                      </div>
                      <p className="text-base font-bold text-green-600">
                        {dm.score.toFixed(1)}/10
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-gray-500">
                Keputusan berdasarkan konsensus dari 3 Decision Maker.
              </p>

              {/* TOMBOL AKSI PER KANDIDAT */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {decisionLabel ? (
                    <span className={decisionColor}>
                      Keputusan Anda: <strong>{decisionLabel}</strong>
                    </span>
                  ) : (
                    <span>Belum ada keputusan untuk kandidat ini.</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecision(item.id, "accept")}
                    className={`px-4 py-1.5 rounded-2xl text-sm font-semibold flex items-center gap-1
                      ${
                        item.decision === "accept"
                          ? "bg-green-600 text-white"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                  >
                    <span>✓</span>
                    <span>Terima</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision(item.id, "reject")}
                    className={`px-4 py-1.5 rounded-2xl text-sm font-semibold flex items-center gap-1
                      ${
                        item.decision === "reject"
                          ? "bg-red-600 text-white"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                  >
                    <span>✕</span>
                    <span>Tolak</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision(item.id, "interview")}
                    className={`px-4 py-1.5 rounded-2xl text-sm font-semibold flex items-center gap-1
                      ${
                        item.decision === "interview"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                  >
                    <span>👤</span>
                    <span>Interview Lanjutan</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* FINALISASI */}
      <section className="bg-white rounded-3xl shadow-card px-6 py-5 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Finalisasi Keputusan
          </h3>
          <p className="text-xs text-gray-500">
            Selesaikan proses konsensus dan kirim notifikasi kepada kandidat.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <span>💾</span>
            <span>Simpan Draft</span>
          </button>
          <button
            type="button"
            onClick={handleFinalize}
            className="px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-sm font-semibold text-white shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>📨</span>
            <span>Finalisasi &amp; Kirim Notifikasi</span>
          </button>
        </div>
      </section>
    </div>
  );
}
