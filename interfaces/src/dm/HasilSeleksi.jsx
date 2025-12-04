import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../admin/components/Sidebar";
import {
    BsBarChartFill,
    BsFileEarmarkArrowUp,
    BsPrinter,
    BsPerson,
    BsCheckCircle,
    BsPersonBadge,
    BsXCircle,
    BsStar,
    BsGrid,
    BsListUl,
    BsGraphUp,
    BsCheckCircleFill,
} from "react-icons/bs";
import { getAssignedProjects } from "../services/projectService";
import { getResults } from "../services/resultService";
import { getAlternativesByProject } from "../services/alternativeService";

function StatCard({ icon, value, title, bgColor, iconColor }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex items-center space-x-4">
            <div className={`${bgColor} ${iconColor} p-4 rounded-xl shadow-md transform hover:scale-110 transition-all duration-300`}>
                {icon}
            </div>
            <div>
                <p className="text-3xl font-bold text-gray-800 animate-pulse">{value}</p>
                <p className="text-gray-600 font-medium text-sm">{title}</p>
            </div>
        </div>
    );
}

function HasilSeleksi() {
    const [activeTab, setActiveTab] = useState("ringkasan");
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [results, setResults] = useState([]);
    const [alternatives, setAlternatives] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch Assigned Projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getAssignedProjects();
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

    // Fetch Results
    useEffect(() => {
        if (!selectedProjectId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const alts = await getAlternativesByProject(selectedProjectId);
                setAlternatives(alts);

                const res = await getResults(selectedProjectId);
                setResults(res || []);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedProjectId]);

    // Merge Data
    const mergedData = useMemo(() => {
        if (!results.length || !alternatives.length) return [];

        // Filter for final results (consensus) - ProjectDMID is null
        const finalResults = results.filter(r => r.project_dm_id === null || r.ProjectDMID === null);

        // If no consensus results, show all results (single DM case)
        const resultsToShow = finalResults.length > 0 ? finalResults : results;

        return resultsToShow.map(r => {
            // Handle both camelCase and snake_case from backend
            const alternativeId = r.alternative_id || r.AlternativeID;
            const alt = alternatives.find(a => {
                const altId = a.alternative_id || a.AlternativeID || a.id;
                return altId === alternativeId;
            });
            
            return {
                id: r.result_id || r.ResultID || r.id || r.ID,
                alternativeId: alternativeId,
                name: alt ? alt.name : `Kandidat #${alternativeId}`,
                role: "Candidate",
                score: parseFloat(r.final_score || r.FinalScore || 0),
                rank: parseInt(r.rank || r.Rank || 0),
            };
        })
            .filter(r => r.score > 0 && r.rank > 0) // Only valid results
            .sort((a, b) => a.rank - b.rank);
    }, [results, alternatives]);

    const stats = useMemo(() => {
        const total = mergedData.length;
        const avgScore = total > 0 ? mergedData.reduce((acc, c) => acc + (c.score || 0), 0) / total : 0;
        const accepted = mergedData.filter((c, idx) => idx < 3).length;
        const interview = mergedData.filter((c, idx) => idx >= 3 && idx < 6).length;
        const rejected = total - accepted - interview;

        return { total, accepted, interview, rejected, avgScore };
    }, [mergedData]);

    const getSkorColor = (skor) => {
        const score = parseFloat(skor || 0);
        if (score >= 9.0) return "text-green-600";
        if (score >= 8.0) return "text-gray-800";
        return "text-red-600";
    };

    return (
        <>
            <Sidebar />
            <div className="ml-72 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-8">
                <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-6 mb-8 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="flex items-center space-x-3">
                                <h1 className="text-3xl font-bold">
                                    Hasil Seleksi
                                </h1>
                                <BsBarChartFill className="text-3xl animate-bounce" />
                            </div>
                            <p className="text-blue-100 mt-2 text-sm">
                                Hasil akhir proses seleksi berdasarkan konsensus GDSS
                            </p>
                        </div>
                        <div className="flex space-x-3 items-center">
                            <select
                                className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
                                value={selectedProjectId}
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                            >
                                <option value="" disabled className="text-gray-800">Pilih Proyek</option>
                                {projects.map(p => (
                                    <option key={p.project_id} value={p.project_id} className="text-gray-800">{p.project_name}</option>
                                ))}
                            </select>
                            <button className="flex items-center px-5 py-2.5 bg-white text-blue-600 rounded-xl text-sm hover:bg-blue-50 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                <BsFileEarmarkArrowUp className="mr-2" /> Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                    <StatCard
                        icon={<BsPerson className="text-2xl" />}
                        value={stats.total}
                        title="Total Kandidat"
                        bgColor="bg-gradient-to-br from-blue-100 to-blue-200"
                        iconColor="text-blue-600"
                    />
                    <StatCard
                        icon={<BsCheckCircle className="text-2xl" />}
                        value={stats.accepted}
                        title="Top 3"
                        bgColor="bg-gradient-to-br from-green-100 to-green-200"
                        iconColor="text-green-600"
                    />
                    <StatCard
                        icon={<BsPersonBadge className="text-2xl" />}
                        value={stats.interview}
                        title="Next 3"
                        bgColor="bg-gradient-to-br from-blue-100 to-indigo-200"
                        iconColor="text-blue-600"
                    />
                    <StatCard
                        icon={<BsXCircle className="text-2xl" />}
                        value={stats.rejected}
                        title="Lainnya"
                        bgColor="bg-gradient-to-br from-red-100 to-red-200"
                        iconColor="text-red-600"
                    />
                    <StatCard
                        icon={<BsStar className="text-2xl" />}
                        value={stats.avgScore.toFixed(2)}
                        title="Rata-rata Skor"
                        bgColor="bg-gradient-to-br from-purple-100 to-purple-200"
                        iconColor="text-purple-600"
                    />
                </div>

                {/* Konten Tab */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
                    {/* Navigasi Tab */}
                    <div className="flex border-b-2 border-gray-200 px-6">
                        <button
                            onClick={() => setActiveTab("ringkasan")}
                            className={`flex items-center px-4 py-4 text-base font-bold transition-all duration-300 ${activeTab === "ringkasan"
                                ? "border-b-4 border-blue-600 text-blue-700 -mb-0.5"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <BsGrid className="mr-2 text-lg" />
                            Ringkasan
                        </button>
                        <button
                            onClick={() => setActiveTab("detail")}
                            className={`flex items-center ml-4 px-4 py-4 text-base font-bold transition-all duration-300 ${activeTab === "detail"
                                ? "border-b-4 border-blue-600 text-blue-700 -mb-0.5"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <BsListUl className="mr-2 text-lg" />
                            Detail Hasil
                        </button>
                    </div>

                    {/* Konten yang Ditampilkan */}
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-10 text-gray-500">⏳ Memuat data...</div>
                        ) : mergedData.length === 0 ? (
                            <div className="text-center py-10">
                                <div className="inline-block p-4 rounded-full bg-blue-50 mb-3">
                                    <BsBarChartFill className="text-4xl text-blue-500" />
                                </div>
                                <p className="text-gray-700 font-semibold mb-2">Belum ada hasil perhitungan</p>
                                <p className="text-sm text-gray-500">Hasil akan muncul setelah admin menjalankan perhitungan konsensus</p>
                            </div>
                        ) : (
                            <>
                                {activeTab === "ringkasan" && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            Ringkasan Hasil Seleksi
                                        </h2>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                                            {/* Kolom Kandidat Terbaik */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                                    Kandidat Terbaik (Top 3)
                                                </h3>
                                                <div className="space-y-4">
                                                    {mergedData.slice(0, 3).map((k) => (
                                                        <div
                                                            key={k.id}
                                                            className="bg-green-50 border border-green-200 rounded-lg p-4"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">#{k.rank}</span>
                                                                        <h4 className="font-semibold text-lg text-gray-800">{k.name}</h4>
                                                                    </div>
                                                                    <p className="text-sm text-gray-600 ml-8">{k.role}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-bold text-lg text-green-700">
                                                                        {(k.score || 0).toFixed(4)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Kolom Lainnya */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                                    Kandidat Lainnya
                                                </h3>
                                                <div className="space-y-4">
                                                    {mergedData.slice(3, 8).map((k) => (
                                                        <div
                                                            key={k.id}
                                                            className="border rounded-lg p-4 bg-gray-50 border-gray-200"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">#{k.rank}</span>
                                                                        <h4 className="font-semibold text-lg text-gray-800">{k.name}</h4>
                                                                    </div>
                                                                </div>
                                                                <p className="font-bold text-lg text-gray-600">
                                                                    {(k.score || 0).toFixed(4)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "detail" && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            Detail Hasil Evaluasi
                                        </h2>
                                        <div className="overflow-x-auto mt-4">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                            Rank
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                            Kandidat
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                            Posisi
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                            Skor Akhir
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {mergedData.map((k, idx) => (
                                                        <tr key={k.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-gray-700">
                                                                #{k.rank}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    {k.name}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                                {k.role}
                                                            </td>
                                                            <td
                                                                className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getSkorColor(k.score)}`}
                                                            >
                                                                {(k.score || 0).toFixed(4)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {idx < 3 ? (
                                                                    <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                        <BsCheckCircleFill className="mr-1.5" />
                                                                        Disarankan
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
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
                                )}
                            </>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </>
    );
}

export default HasilSeleksi;