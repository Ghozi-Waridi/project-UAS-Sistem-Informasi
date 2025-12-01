import React, { useMemo, useState, useEffect } from "react";
import { getProjects } from "../../services/projectService";
import { getAlternativesByProject } from "../../services/alternativeService";
import { triggerCalculation, getResults } from "../../services/resultService";

function formatCurrency(num) {
  if (!num) return "-";
  return `Rp ${num.toLocaleString("id-ID")}`;
}

export default function Hasil() {
  const [activeTab, setActiveTab] = useState("ringkasan"); // ringkasan | detail | analitik
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [results, setResults] = useState([]);
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  // Fetch Projects on Mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        // Ensure data is an array
        const projectsArray = Array.isArray(data) ? data : [];
        setProjects(projectsArray);
        if (projectsArray.length > 0) {
          setSelectedProjectId(projectsArray[0].project_id);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]); // Set empty array on error
      }
    };
    fetchProjects();
  }, []);

  // Fetch Results and Alternatives when Project Changes
  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Alternatives for details (name, etc)
        const alts = await getAlternativesByProject(selectedProjectId);
        setAlternatives(alts);

        // Fetch Results
        const res = await getResults(selectedProjectId);
        setResults(res || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // If 404, it might mean no results yet, which is fine
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedProjectId]);

  const handleCalculate = async () => {
    if (!selectedProjectId) return;
    setCalculating(true);
    try {
      await triggerCalculation(selectedProjectId);
      // Refresh results
      const res = await getResults(selectedProjectId);
      setResults(res || []);
      alert("Perhitungan selesai!");
    } catch (error) {
      console.error("Calculation failed:", error);
      const errorMsg = error.response?.data?.error || error.message || "Unknown error";
      alert("Gagal melakukan perhitungan: " + errorMsg);
    } finally {
      setCalculating(false);
    }
  };

  // Merge Results with Alternative Data
  const mergedData = useMemo(() => {
    if (!results.length || !alternatives.length) return [];

    // Filter for final results (where ProjectDMID is null, meaning consensus)
    // If you want to show individual DM results, you'd filter differently
    const finalResults = results.filter(r => r.ProjectDMID === null);

    return finalResults.map(r => {
      const alt = alternatives.find(a => (a.alternative_id || a.id) === r.AlternativeID);
      return {
        id: r.ID,
        alternativeId: r.AlternativeID,
        name: alt ? alt.name : `Unknown (${r.AlternativeID})`,
        role: "Candidate", // Placeholder or from alt description
        score: r.FinalScore,
        rank: r.Rank,
        // Parse description for extra details if needed
        details: alt ? (tryParseJSON(alt.description) || {}) : {}
      };
    }).sort((a, b) => a.rank - b.rank);
  }, [results, alternatives]);

  const stats = useMemo(() => {
    const total = mergedData.length;
    const avgScore = total > 0 ? mergedData.reduce((acc, c) => acc + c.score, 0) / total : 0;
    // Simple logic for status based on rank/score (Customizable)
    const accepted = mergedData.filter((c, idx) => idx < 3).length; // Top 3 accepted
    const interview = mergedData.filter((c, idx) => idx >= 3 && idx < 6).length; // Next 3 interview
    const rejected = total - accepted - interview;

    return { total, accepted, interview, rejected, avgScore };
  }, [mergedData]);

  const handleExport = () => {
    const header = "Rank,Nama,Skor\n";
    const rows = mergedData.map(c => `${c.rank},${c.name},${c.score.toFixed(4)}`).join("\n");
    const csv = header + rows;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hasil_seleksi_${selectedProjectId}.csv`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <section className="bg-white rounded-3xl shadow-card px-8 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Hasil Seleksi <span className="inline-block">📊</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 max-w-2xl">
            Hasil akhir proses seleksi berdasarkan konsensus GDSS.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="" disabled>Pilih Proyek</option>
            {projects.map(p => (
              <option key={p.project_id} value={p.project_id}>{p.project_name}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleCalculate}
            disabled={calculating || !selectedProjectId}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition-colors ${calculating ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'}`}
          >
            <span>{calculating ? 'Menghitung...' : '⚡ Hitung Hasil'}</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={mergedData.length === 0}
            className="inline-flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 disabled:opacity-50"
          >
            <span>⬇️</span>
            <span>Export</span>
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
            <p className="text-xs text-gray-500">Top 3 (Diterima)</p>
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
            <p className="text-xs text-gray-500">Rata-rata Skor</p>
            <p className="text-xl font-semibold text-purple-600 mt-1">
              {stats.avgScore.toFixed(2)}
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
              // { key: "analitik", label: "Analitik" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-2 pb-3 ${activeTab === tab.key
                  ? "text-blue-600"
                  : "text-gray-400 hover:text-gray-700"
                  }`}
              >
                {tab.key === "ringkasan" && "▦ "}
                {tab.key === "detail" && "📄 "}
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
          {loading ? (
            <div className="text-center py-10 text-gray-500">Memuat data...</div>
          ) : mergedData.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Belum ada hasil perhitungan. Silakan klik "Hitung Hasil".</div>
          ) : (
            <>
              {activeTab === "ringkasan" && (
                <RingkasanTab data={mergedData} />
              )}
              {activeTab === "detail" && (
                <DetailTab data={mergedData} />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function tryParseJSON(jsonString) {
  try {
    const o = JSON.parse(jsonString);
    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) { }
  return null;
}

/* ==================== TAB KOMPONEN ==================== */

function RingkasanTab({ data }) {
  // Top 3 as accepted
  const accepted = data.slice(0, 3);
  const others = data.slice(3);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">
        Ringkasan Hasil Seleksi (Top 3)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* KANDIDAT DITERIMA */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-700">
            Kandidat Terbaik
          </p>
          <div className="space-y-3">
            {accepted.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">#{c.rank}</span>
                    <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                  </div>
                  <p className="text-xs text-gray-500 ml-8">{c.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-700">
                    {c.score.toFixed(4)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STATUS LAINNYA */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-700">Kandidat Lainnya</p>
          {others.slice(0, 5).map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">#{c.rank}</span>
                  <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-600">
                {c.score.toFixed(4)}
              </p>
            </div>
          ))}
          {others.length > 5 && <p className="text-xs text-gray-400 text-center">...dan {others.length - 5} lainnya</p>}
        </div>
      </div>
    </div>
  );
}

function DetailTab({ data }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Detail Hasil</h3>
      <div className="rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-4 py-2 text-center">Rank</th>
              <th className="px-4 py-2 text-left">Kandidat</th>
              <th className="px-4 py-2 text-left">Posisi</th>
              <th className="px-4 py-2 text-center">Skor Akhir</th>
              <th className="px-4 py-2 text-center">Status (Simulasi)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((c, idx) => (
              <tr key={c.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-2 text-center font-bold text-gray-700">
                  #{c.rank}
                </td>
                <td className="px-4 py-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {c.name}
                  </p>
                </td>
                <td className="px-4 py-2 text-xs text-gray-600">{c.role}</td>
                <td className="px-4 py-2 text-center text-sm font-semibold text-blue-600">
                  {c.score.toFixed(4)}
                </td>
                <td className="px-4 py-2 text-center">
                  {idx < 3 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-600 text-[11px] font-semibold px-3 py-0.5">
                      ✅ Disarankan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 text-gray-500 text-[11px] font-semibold px-3 py-0.5">
                      -
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
